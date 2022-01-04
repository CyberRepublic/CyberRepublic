import Base from './Base'
import * as _ from 'lodash'
import * as jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { constant } from '../constant'
import {
  mail,
  logger,
  user as userUtil,
  getPemPublicKey,
  permissions,
  getProposalReqToken
} from '../utility'
import { getProposerMessageHash } from '../utility/message-hash'
import { getOpinionHash } from '../utility/opinion-hash'
import { unzipFile } from '../utility/unzip-file'
import * as moment from 'moment'
const Big = require('big.js')
const {
  WAITING_FOR_REQUEST,
  WAITING_FOR_APPROVAL,
  WAITING_FOR_WITHDRAWAL,
  WITHDRAWN
} = constant.MILESTONE_STATUS
const { ACTIVE, FINAL, TERMINATED } = constant.CVOTE_STATUS
const { PROGRESS, FINALIZED } = constant.PROPOSAL_TRACKING_TYPE
const { APPROVED, REJECTED } = constant.REVIEW_OPINION

export default class extends Base {
  private model: any
  protected init() {
    this.model = this.getDBModel('CVote')
  }

  private paymentStage(budget: any, mKey: string) {
    const initiation = _.find(budget, ['type', 'ADVANCE'])
    const stage = parseInt(mKey)
    return initiation ? stage : stage + 1
  }

  // for full-text to chain
  private async getMessageHash(
    message: string,
    proposalId: string,
    proposalHash: string,
    stage: number
  ) {
    const rs = await getProposerMessageHash(message)
    if (rs && rs.error) {
      return { error: rs.error }
    }
    if (rs && rs.content && rs.messageHash) {
      const zipFileModel = this.getDBModel('Proposer_Message_Zip_File')
      await zipFileModel.save({
        proposalId,
        messageHash: rs.messageHash,
        content: rs.content,
        proposalHash,
        stage
      })
      return { messageHash: rs.messageHash }
    }
  }

  public async applyPayment(param: any) {
    try {
      const did = _.get(this.currentUser, 'did.id')
      if (!did) {
        return { success: false, message: 'Your DID not bound.' }
      }
      const { id, milestoneKey, message } = param
      if (!message) {
        return { success: false }
      }
      const proposal = await this.model.findById(id)
      // check if current user is the proposal's owner
      if (!proposal.proposer.equals(this.currentUser._id)) {
        return { success: false }
      }
      if (proposal.status !== ACTIVE) {
        return { success: false }
      }

      // check if milestoneKey is valid
      const budget = proposal.budget.filter(
        (item: any) => item.milestoneKey === milestoneKey
      )[0]
      if (_.isEmpty(budget)) {
        return { success: false }
      }
      if (![WAITING_FOR_REQUEST, REJECTED].includes(budget.status)) {
        return { success: false, message: 'Milestone status is invalid.' }
      }

      const currDate = Date.now()
      const initiation = _.find(proposal.budget, ['type', 'ADVANCE'])
      const stage = initiation
        ? parseInt(milestoneKey)
        : parseInt(milestoneKey) + 1
      const messageHashObj = await this.getMessageHash(
        message,
        proposal._id,
        proposal.proposalHash,
        stage
      )
      if (messageHashObj && messageHashObj.error) {
        return { success: false, message: messageHashObj.error }
      }
      // update withdrawal history
      const history = {
        message,
        milestoneKey,
        messageHash: messageHashObj.messageHash,
        createdAt: currDate
      }

      await this.model.update(
        { _id: id },
        { $push: { withdrawalHistory: history } }
      )

      const trackingStatus = budget.type === 'COMPLETION' ? FINALIZED : PROGRESS

      const now = Math.floor(currDate / 1000)
      // generate jwt url
      const jwtClaims = {
        iat: now,
        exp: now + 60 * 60 * 24,
        command: 'updatemilestone',
        iss: process.env.APP_DID,
        callbackurl: `${process.env.API_URL}/api/proposals/milestones/signature-callback`,
        data: {
          userdid: _.get(this.currentUser, 'did.id'),
          proposalhash: proposal.proposalHash,
          messagehash: messageHashObj.messageHash,
          stage: this.paymentStage(proposal.budget, milestoneKey),
          ownerpubkey: proposal.ownerPublicKey,
          newownerpubkey: '',
          proposaltrackingtype: trackingStatus
        }
      }
      const jwtToken = jwt.sign(
        JSON.stringify(jwtClaims),
        process.env.APP_PRIVATE_KEY,
        { algorithm: 'ES256' }
      )
      const url = constant.proposalJwtPrefix + jwtToken
      return {
        success: true,
        url,
        messageHash: messageHashObj.messageHash
      }
    } catch (error) {
      logger.error(error)
      return
    }
  }

  public async ownerSignatureCallback(param: any) {
    try {
      const jwtToken = param.jwt
      const claims: any = jwt.decode(jwtToken)
      if (!_.get(claims, 'req')) {
        return {
          code: 400,
          success: false,
          message: 'Problems parsing jwt token.'
        }
      }
      const reqToken = getProposalReqToken(claims.req)
      const payload: any = jwt.decode(reqToken)
      const userDID = _.get(payload, 'data.userdid')
      if (!userDID) {
        return {
          code: 400,
          success: false,
          message: 'No userdid in the payload.'
        }
      }
      const proposalHash = _.get(payload, 'data.proposalhash')
      const messageHash = _.get(payload, 'data.messagehash')
      if (!proposalHash || !messageHash) {
        return {
          code: 400,
          success: false,
          message: 'Problems parsing jwt token of CR website.'
        }
      }

      const proposal = await this.model
        .getDBInstance()
        .findOne({ proposalHash })
        .populate('proposer', 'did')
      if (!proposal) {
        return {
          code: 400,
          success: false,
          message: 'There is no this proposal.'
        }
      }
      const ownerDID = _.get(proposal, 'proposer.did.id')
      const isOwner = userDID === claims.iss && ownerDID === claims.iss
      if (!isOwner) {
        this.model.update(
          {
            proposalHash,
            'withdrawalHistory.messageHash': messageHash
          },
          {
            'withdrawalHistory.$.error': `The ELA wallet not bound with your CR account.`
          }
        )
        return {
          code: 400,
          success: false,
          message: 'The ELA wallet not bound with your CR account.'
        }
      }
      const ownerPublicKey = _.get(proposal, 'ownerPublicKey')
      if (!ownerPublicKey) {
        return {
          code: 400,
          success: false,
          message: `Can not get your did's public key.`
        }
      }
      const pemPublicKey = getPemPublicKey(ownerPublicKey)
      // verify response data from ela wallet
      return jwt.verify(
        jwtToken,
        pemPublicKey,
        async (err: any, decoded: any) => {
          if (err) {
            return {
              code: 401,
              success: false,
              message: 'Verify signatrue failed.'
            }
          } else {
            try {
              const history = proposal.withdrawalHistory.filter(
                (item: any) => item.messageHash === messageHash
              )[0]
              if (_.isEmpty(history)) {
                return {
                  code: 400,
                  success: false,
                  message: 'There is no this payment application.'
                }
              }

              const zipFileModel = this.getDBModel('Proposer_Message_Zip_File')

              await Promise.all([
                this.model.update(
                  {
                    proposalHash,
                    'withdrawalHistory.messageHash': messageHash
                  },
                  {
                    $set: { 'withdrawalHistory.$.signature': decoded.data },
                    $unset: { 'withdrawalHistory.$.error': true }
                  }
                ),
                this.model.update(
                  {
                    proposalHash,
                    'budget.milestoneKey': history.milestoneKey
                  },
                  { 'budget.$.status': WAITING_FOR_APPROVAL }
                ),
                zipFileModel.update(
                  { proposalHash, messageHash },
                  { $set: { ownerSignature: decoded.data, ownerPublicKey } }
                )
              ])

              this.notifySecretaries(
                this.updateMailTemplate(proposal.vid, proposal._id)
              )
              return { code: 200, success: true, message: 'Ok' }
            } catch (err) {
              logger.error(err)
              return {
                code: 500,
                success: false,
                message: 'Something went wrong'
              }
            }
          }
        }
      )
    } catch (err) {
      logger.error(err)
      return {
        code: 500,
        success: false,
        message: 'Something went wrong'
      }
    }
  }

  public async checkSignature(param: any) {
    const { id, messageHash } = param
    const proposal: any = await this.getProposal(id)
    if (proposal) {
      const history = proposal.withdrawalHistory.filter(
        (item: any) => item.messageHash === messageHash
      )
      if (_.isEmpty(history)) {
        return { success: false }
      }
      if (_.get(history[0], 'signature')) {
        return { success: true, detail: proposal }
      }
      if (_.get(history[0], 'error')) {
        return { success: false, message: history[0].error }
      }
    } else {
      return { success: false }
    }
  }

  // for full-text to chain
  private async getOpinionHash(
    reason: string,
    proposalId: string,
    proposalHash: string
  ) {
    const rs = await getOpinionHash(reason)
    if (rs && rs.error) {
      return { error: rs.error }
    }
    if (rs && rs.content && rs.opinionHash) {
      const zipFileModel = this.getDBModel('Secretary_Opinion_Zip_File')
      await zipFileModel.save({
        proposalId,
        opinionHash: rs.opinionHash,
        content: rs.content,
        proposalHash
      })
      return { opinionHash: rs.opinionHash }
    }
  }

  public async review(param: any) {
    try {
      const did = _.get(this.currentUser, 'did.id')
      if (!did) {
        return { success: false, message: 'Your DID not bound.' }
      }
      const role = _.get(this.currentUser, 'role')
      if (!permissions.isSecretary(role)) {
        return { success: false, message: 'No access right.' }
      }

      const { id, milestoneKey, reason, opinion, applicationId } = param
      if (!reason || !opinion || ![APPROVED, REJECTED].includes(opinion)) {
        return { success: false, message: 'Some param is invalid.' }
      }
      const proposal = await this.model.findById(id)
      if (!proposal) {
        return { success: false, message: 'No this proposal.' }
      }
      if (proposal.status !== ACTIVE) {
        return {
          success: false,
          message: 'This proposal status is not active.'
        }
      }

      // check if milestoneKey is valid
      const budget = proposal.budget.filter(
        (item: any) => item.milestoneKey === milestoneKey
      )[0]
      if (_.isEmpty(budget)) {
        return { success: false, message: 'Payment stage is invalid.' }
      }
      if (budget.status !== WAITING_FOR_APPROVAL) {
        return {
          success: false,
          message: `This milestone is not ready for review, please refresh the page and try again.`
        }
      }

      const history = proposal.withdrawalHistory.filter((item: any) =>
        item._id.equals(applicationId)
      )[0]
      if (!history) {
        return { success: false, message: 'no this payment application record' }
      }

      const currTime = Date.now()
      const now = Math.floor(currTime / 1000)
      const opinionHashObj = await this.getOpinionHash(
        reason,
        proposal._id,
        proposal.proposalHash
      )

      if (opinionHashObj && opinionHashObj.error) {
        return { success: false, message: opinionHashObj.error }
      }

      await this.model.update(
        {
          _id: id,
          'withdrawalHistory._id': applicationId
        },
        {
          $set: {
            'withdrawalHistory.$.review': {
              reason,
              reasonHash: opinionHashObj.opinionHash,
              opinion,
              createdAt: currTime
            }
          }
        }
      )
      let trackingStatus: string
      if (opinion === APPROVED) {
        trackingStatus = budget.type === 'COMPLETION' ? FINALIZED : PROGRESS
      } else {
        trackingStatus = constant.PROPOSAL_TRACKING_TYPE.REJECTED
      }

      // generate jwt url
      const jwtClaims = {
        iat: now,
        exp: now + 60 * 60 * 24,
        command: 'reviewmilestone',
        iss: process.env.APP_DID,
        data: {
          userdid: did,
          proposalhash: proposal.proposalHash,
          messagehash: history.messageHash,
          stage: this.paymentStage(proposal.budget, milestoneKey),
          ownerpubkey: proposal.ownerPublicKey,
          newownerpubkey: '',
          ownersignature: history.signature,
          newownersignature: '',
          proposaltrackingtype: trackingStatus,
          secretaryopinionhash: opinionHashObj.opinionHash
        }
      }
      const jwtToken = jwt.sign(
        JSON.stringify(jwtClaims),
        process.env.APP_PRIVATE_KEY,
        { algorithm: 'ES256' }
      )
      const url = constant.proposalJwtPrefix + jwtToken
      return {
        success: true,
        url,
        messageHash: opinionHashObj.opinionHash
      }
    } catch (error) {
      logger.error(error)
      return
    }
  }

  private updateMailTemplate(vid: string, _id: Types.ObjectId) {
    const subject = `【Payment Review】One payment request is waiting for your review`
    const body = `
      <p>One payment request in proposal #${vid} is waiting for your review:</p>
      <p>Click this link to view more details:</p>
      <p><a href="${process.env.SERVER_URL}/proposals/${_id}">${process.env.SERVER_URL}/proposals/${_id}</a></p>
      <br />
      <p>Cyber Republic Team</p>
      <p>Thanks</p>
    `
    return { subject, body }
  }

  private async notifySecretaries(content: { subject: string; body: string }) {
    const db_user = this.getDBModel('User')
    const currentUserId = _.get(this.currentUser, '_id')
    const secretaries = await db_user.find({
      role: constant.USER_ROLE.SECRETARY
    })
    const toUsers = _.filter(
      secretaries,
      (user) => !user._id.equals(currentUserId)
    )
    const toMails = _.map(toUsers, 'email')

    const recVariables = _.zipObject(
      toMails,
      _.map(toUsers, (user) => {
        return {
          _id: user._id,
          username: userUtil.formatUsername(user)
        }
      })
    )

    const mailObj = {
      to: toMails,
      subject: content.subject,
      body: content.body,
      recVariables
    }

    mail.send(mailObj)
  }

  private async getProposal(id: string) {
    const rs = await this.model
      .getDBInstance()
      .findOne({ _id: id }, '-voteHistory')
      .populate(
        'voteResult.votedBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_AVATAR
      )
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .populate('createdBy', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .populate('reference', constant.DB_SELECTED_FIELDS.SUGGESTION.ID)
      .populate('referenceElip', 'vid')
    if (!rs) {
      return { success: true, empty: true }
    }
    if (rs.budgetAmount) {
      const doc = JSON.parse(JSON.stringify(rs))
      // deal with 7e-08
      doc.budgetAmount = Big(doc.budgetAmount).toFixed()
      return doc
    }
    return rs
  }

  public async withdraw(param: any) {
    try {
      const did = _.get(this.currentUser, 'did.id')
      if (!did) {
        return { success: false, message: 'Your DID not bound.' }
      }
      const { id, milestoneKey } = param
      const proposal = await this.model.findById(id)
      if (!proposal) {
        return { success: false, message: 'No this proposal.' }
      }
      // check if current user is the proposal's owner
      if (!proposal.proposer.equals(this.currentUser._id)) {
        return { success: false, message: 'You are not the proposal owner.' }
      }
      if (![ACTIVE, FINAL, TERMINATED].includes(proposal.status)) {
        return { success: false, message: 'The proposal is not active.' }
      }
      const last: any = _.last(proposal.budget)
      if (
        proposal.status === FINAL &&
        last.type === 'COMPLETION' &&
        last.status === WITHDRAWN
      ) {
        return { success: false, message: 'The proposal is final.' }
      }

      // check if milestoneKey is valid
      const budget = proposal.budget.filter(
        (item: any) => item.milestoneKey === milestoneKey
      )
      if (_.isEmpty(budget)) {
        return { success: false, message: 'This milestone does not exist.' }
      }
      if (budget[0].status !== WAITING_FOR_WITHDRAWAL) {
        return {
          success: false,
          message: 'This milestone is not withdrawable.'
        }
      }

      let sum: string
      try {
        sum = proposal.budget
          .reduce((sum: any, item: any) => {
            if (item.status === WAITING_FOR_WITHDRAWAL && item.amount) {
              return sum.plus(Big(item.amount))
            }
            return sum
          }, Big(0))
          .toString()
      } catch (err) {
        return { success: false, message: 'Can not get total payment amount.' }
      }
      const currDate = Date.now()
      const now = Math.floor(currDate / 1000)
      // generate jwt url
      const jwtClaims = {
        iat: now,
        exp: now + 60 * 60 * 24,
        command: 'withdraw',
        iss: process.env.APP_DID,
        callbackurl: '',
        data: {
          userdid: _.get(this.currentUser, 'did.id'),
          proposalhash: proposal.proposalHash,
          amount: Big(`${sum}e+8`).toString(),
          recipient: proposal.elaAddress,
          ownerpublickey: proposal.ownerPublicKey
        }
      }
      const jwtToken = jwt.sign(
        JSON.stringify(jwtClaims),
        process.env.APP_PRIVATE_KEY,
        { algorithm: 'ES256' }
      )
      const url = constant.proposalJwtPrefix + jwtToken
      return { success: true, url }
    } catch (error) {
      logger.error(error)
      return
    }
  }

  public async syncSecretaryOpinionFromChain() {
    const db_ela = this.getDBModel('Ela_Transaction')
    const db_cvote = this.getDBModel('CVote')
    const db_zip_file = this.getDBModel('Secretary_Opinion_Zip_File')

    let transactions = await db_ela
      .getDBInstance()
      .find({ type: constant.TRANSACTION_TYPE.SECRETARY_REVIEW })
    if (_.isEmpty(transactions)) {
      return
    }
    const reviewList = []
    _.map(transactions, (o: any) => {
      const data = {
        txid: o.txid,
        ...JSON.parse(o.payload)
      }
      reviewList.push(data)
    })

    const query = []
    const byKeyElaList = _.keyBy(reviewList, 'proposalhash')
    _.forEach(byKeyElaList, (v: any, k: any) => {
      query.push(k)
    })
    console.log(`syncSecretaryOpinionFromChain query...`, query)
    const proposalList = await db_cvote.getDBInstance().find({
      proposalHash: { $in: query }
    })
    if (_.isEmpty(proposalList)) {
      return
    }
    console.log(
      `syncSecretaryOpinionFromChain proposalList....`,
      proposalList.length
    )
    let histories = []
    _.forEach(proposalList, (o: any) => {
      _.forEach(o.withdrawalHistory, (v: any) => {
        if (v.signature && (!v.review || (v.review && !v.review.txid))) {
          histories.push({
            messageHash: v.messageHash,
            proposalHash: o.proposalHash,
            proposalId: o._id
          })
        }
      })
    })
    console.log(`histories...`, histories.length)

    _.forEach(reviewList, async (o: any) => {
      console.log(
        `syncSecretaryOpinionFromChain proposalHash...`,
        o.proposalhash
      )
      if (!o.secretarygeneralopiniondata) return
      const history = _.find(histories, {
        proposalHash: o.proposalhash,
        messageHash: o.messagehash
      })
      console.log(`syncSecretaryOpinionFromChain history...`, history)
      if (history) {
        const opinionResult = await unzipFile(o.secretarygeneralopiniondata)
        console.log(
          `syncSecretaryOpinionFromChain opinionResult...`,
          opinionResult
        )
        let opinion = o.proposaltrackingtype
        if (opinion === 'Rejected') {
          opinion = constant.REVIEW_OPINION.REJECTED
        } else {
          opinion = constant.REVIEW_OPINION.APPROVED
        }
        await db_cvote.update(
          {
            proposalHash: o.proposalhash,
            'withdrawalHistory.messageHash': o.messagehash
          },
          {
            $set: {
              'withdrawalHistory.$.review': {
                reason: opinionResult.opinion,
                reasonHash: o.secretarygeneralopinionhash,
                opinion,
                createdAt: moment(opinionResult.date),
                txid: o.txid
              }
            }
          }
        )
        console.log(
          `syncSecretaryOpinionFromChain begin to save opinion data...`
        )
        const doc = await db_zip_file
          .getDBInstance()
          .findOne({ opinionHash: o.secretarygeneralopinionhash })
        if (!doc) {
          await db_zip_file.save({
            proposalId: history.proposalId,
            opinionHash: o.secretarygeneralopinionhash,
            content: Buffer.from(o.secretarygeneralopiniondata, 'hex'),
            proposalHash: o.proposalhash
          })
        }

        await db_ela.remove({ txid: o.txid })
        console.log(`syncSecretaryOpinionFromChain done`)
      }
    })
  }
}
