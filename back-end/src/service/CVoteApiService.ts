import Base from './Base'
import * as _ from 'lodash'
import { constant } from '../constant'
import {
  timestamp,
  ela,
  mail,
  logger,
  utilCrypto,
  getPemPublicKey,
  user as userUtil
} from '../utility'
import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
const { WAITING_FOR_REQUEST, WAITING_FOR_APPROVAL, REJECTED } =
  constant.MILESTONE_STATUS
import { Types } from 'mongoose'
import { unzipFile } from '../utility/unzip-file'

const Big = require('big.js')
const {
  CVOTE_TYPE,
  MILESTONE_STATUS,
  CVOTE_RESULT,
  REVIEW_OPINION,
  SUGGESTION_BUDGET_TYPE,
  CHAIN_BUDGET_TYPE,
  CHAIN_BUDGET_STATUS,
  CVOTE_CHAIN_STATUS,
  CVOTE_CHAIN_RESULT
} = constant
/**
 * API v2 for ELA Wallet and Essentials
 */

const { DID_PREFIX, API_VOTE_TYPE } = constant

const CHAIN_STATUS_TO_PROPOSAL_STATUS = {
  all: [
    constant.CVOTE_STATUS.PROPOSED,
    constant.CVOTE_STATUS.NOTIFICATION,
    constant.CVOTE_STATUS.ACTIVE,
    constant.CVOTE_STATUS.FINAL,
    constant.CVOTE_STATUS.REJECT,
    constant.CVOTE_STATUS.TERMINATED,
    constant.CVOTE_STATUS.VETOED,
    constant.CVOTE_STATUS.ABORTED
  ],
  registered: constant.CVOTE_STATUS.PROPOSED,
  cragreed: constant.CVOTE_STATUS.NOTIFICATION,
  crcanceled: constant.CVOTE_STATUS.REJECT,
  voteragreed: constant.CVOTE_STATUS.ACTIVE,
  votercanceled: constant.CVOTE_STATUS.VETOED,
  finished: constant.CVOTE_STATUS.FINAL,
  terminated: constant.CVOTE_STATUS.TERMINATED,
  aborted: constant.CVOTE_STATUS.ABORTED
}

const PROPOSAL_STATUS_TO_CHAIN_STATUS = {
  [constant.CVOTE_STATUS.PROPOSED]: 'registered',
  [constant.CVOTE_STATUS.NOTIFICATION]: 'cragreed',
  [constant.CVOTE_STATUS.ACTIVE]: 'voteragreed',
  [constant.CVOTE_STATUS.FINAL]: 'finished',
  [constant.CVOTE_STATUS.REJECT]: 'crcanceled',
  [constant.CVOTE_STATUS.VETOED]: 'votercanceled',
  [constant.CVOTE_STATUS.TERMINATED]: 'terminated',
  [constant.CVOTE_STATUS.ABORTED]: 'aborted'
}

export default class extends Base {
  private model: any
  private zipFileModel: any
  protected init() {
    this.model = this.getDBModel('CVote')
    this.zipFileModel = this.getDBModel('Council_Member_Opinion_Zip_File')
  }

  // API-1
  public async allOrSearch(param): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const query: any = {}

    if (
      !param.status ||
      !_.keys(CHAIN_STATUS_TO_PROPOSAL_STATUS).includes(param.status)
    ) {
      return {
        code: 400,
        success: false,
        message: 'Invalid request parameters - status',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }

    // status
    query.status = CHAIN_STATUS_TO_PROPOSAL_STATUS[param.status]

    // search
    if (param.search) {
      const search = _.trim(param.search)
      const db_user = this.getDBModel('User')
      const users = await db_user
        .getDBInstance()
        .find({
          $or: [{ 'did.didName': { $regex: _.trim(search), $options: 'i' } }]
        })
        .select('_id')
      const userIds = _.map(users, '_id')
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { proposer: { $in: userIds } }
      ]
      if (_.isNumber(search)) {
        query.$or.push({ vid: _.toNumber(search) })
      }
    }

    query.old = { $ne: true }

    const fields = [
      'vid',
      'title',
      'status',
      'type',
      'createdAt',
      'proposer',
      'proposedEndsHeight',
      'notificationEndsHeight',
      'proposalHash',
      'rejectAmount',
      'rejectThroughAmount',
      'voteResult'
    ]

    const cursor = db_cvote
      .getDBInstance()
      .find(query, fields.join(' '))
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .sort({ vid: -1 })

    if (
      param.page &&
      param.results &&
      parseInt(param.page) > 0 &&
      parseInt(param.results) > 0
    ) {
      const results = parseInt(param.results, 10)
      const page = parseInt(param.page, 10)

      cursor.skip(results * (page - 1)).limit(results)
    }

    const rs = await Promise.all([
      cursor,
      db_cvote.getDBInstance().find(query).count(),
      ela.height()
    ])
    const db_cvote_history = this.getDBModel('CVote_Vote_History')

    const list = _.map(rs[0], async function (o) {
      let temp = _.omit(o._doc, [
        '_id',
        'proposer',
        'type',
        'rejectAmount',
        'proposedEndsHeight',
        'notificationEndsHeight',
        'rejectThroughAmount',
        'voteResult'
      ])
      temp.proposer = _.get(o, 'proposer.did.didName')
      temp.status = PROPOSAL_STATUS_TO_CHAIN_STATUS[temp.status]
      if ([constant.CVOTE_STATUS.PROPOSED].includes(o.status)) {
        temp.voteEndIn = _.toNumber(
          (o.proposedEndsHeight - rs[2]) * 2 * 60
        ).toFixed()
      }
      if (
        [constant.CVOTE_STATUS.NOTIFICATION].includes(o.status) &&
        o.rejectAmount >= 0 &&
        o.rejectThroughAmount > 0
      ) {
        temp.voteEndIn = _.toNumber(
          (o.notificationEndsHeight - rs[2]) * 2 * 60
        ).toFixed()
        temp.rejectAmount = `${o.rejectAmount}`
        temp.rejectThroughAmount = `${parseFloat(
          _.toNumber(o.rejectThroughAmount).toFixed(8)
        )}`
        temp.rejectRatio = _.toNumber(
          (
            _.toNumber(o.rejectAmount) / _.toNumber(o.rejectThroughAmount)
          ).toFixed(4)
        )
      }
      temp.type = constant.CVOTE_TYPE_API[o.type]
      temp.createdAt = timestamp.second(temp.createdAt)

      const group = {}
      for (const value of _.sortBy(_.values(CVOTE_RESULT))) {
        group[value] = []
      }

      const voteHistory = await db_cvote_history
        .getDBInstance()
        .find({ proposalBy: o._id })

      _.reduce(
        o.voteResult,
        (prev, cur) => {
          const votedBy = _.get(cur, 'votedBy')
          if (cur.status !== CVOTE_CHAIN_STATUS.CHAINED) {
            const index = _.findLastIndex(voteHistory, ['votedBy', votedBy])
            const rs = voteHistory[index]
            if (rs && rs.status === CVOTE_CHAIN_STATUS.CHAINED) {
              prev[rs.value].push(rs.value)
            }
          } else {
            prev[cur.value].push(cur.value)
          }
          return prev
        },
        group
      )

      temp.crVotes = {
        [CVOTE_CHAIN_RESULT.APPROVE]: group[CVOTE_RESULT.SUPPORT].length,
        [CVOTE_CHAIN_RESULT.REJECT]: group[CVOTE_RESULT.REJECT].length,
        [CVOTE_CHAIN_RESULT.ABSTAIN]: group[CVOTE_RESULT.ABSTENTION].length
      }

      return _.mapKeys(temp, function (value, key) {
        if (key == 'vid') {
          return 'id'
        } else {
          return key
        }
      })
    })

    const listResult = await Promise.all(list)
    const total = rs[1]
    return { proposals: listResult, total }
  }

  private getSecretaryReview(withdrawal) {
    const comment = {}
    if (_.get(withdrawal, 'review.txid')) {
      let opinion = _.get(withdrawal, 'review.opinion')
      if (opinion === REVIEW_OPINION.APPROVED) {
        opinion = 'approve'
      } else {
        opinion = 'reject'
      }
      comment['content'] = _.get(withdrawal, 'review.reason')
      comment['opinion'] = opinion
      comment['timestamp'] = moment(
        _.get(withdrawal, 'review.createdAt')
      ).unix()
    }
    return comment
  }

  public async getTracking(id) {
    const db_cvote = this.getDBModel('CVote')
    const proposal = await db_cvote
      .getDBInstance()
      .findOne({ _id: id })
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)

    if (!proposal) {
      return
    }

    try {
      const { withdrawalHistory } = proposal
      if (withdrawalHistory.length === 0) return
      const withdrawalListByStage = _.groupBy(withdrawalHistory, 'milestoneKey')
      const keys = _.keys(withdrawalListByStage).sort().reverse()
      return _.map(keys, (k: any) => {
        const withdrawals = _.sortBy(withdrawalListByStage[`${k}`], 'createdAt')
        const history = []
        for (let i = withdrawals.length - 1; i >= 0; i--) {
          const withdrawal = withdrawals[i]
          const review = this.getSecretaryReview(withdrawal)
          if (withdrawal.signature) {
            history.push({
              apply: {
                content: withdrawal.message,
                messageHash: withdrawal.messageHash,
                timestamp: moment(withdrawal.createdAt).unix()
              },
              review
            })
          }
        }
        return { stage: parseInt(k), history }
      })
    } catch (err) {
      logger.error(err)
    }
  }

  private convertBudget(budget) {
    const initiation = _.find(budget, ['type', 'ADVANCE'])
    const budgets = budget.map((item) => {
      const stage = parseInt(item.milestoneKey, 10)
      let status = CHAIN_BUDGET_STATUS.UNFINISHED
      // Advance budget status is withdrawable even though the proposal is not passed
      if (item.type === SUGGESTION_BUDGET_TYPE.ADVANCE) {
        status = CHAIN_BUDGET_STATUS.WITHDRAWABLE
      }
      if (item.status === MILESTONE_STATUS.WITHDRAWN) {
        status = CHAIN_BUDGET_STATUS.WITHDRAWN
      }
      if (item.status === MILESTONE_STATUS.WAITING_FOR_WITHDRAWAL) {
        status = CHAIN_BUDGET_STATUS.WITHDRAWABLE
      }
      return {
        type: CHAIN_BUDGET_TYPE[item.type],
        stage: initiation ? stage : stage + 1,
        amount: Big(`${item.amount}e+8`).toFixed(0),
        paymentCriteria: item.criteria,
        status
      }
    })
    return budgets
  }

  // API-2
  public async getProposalById(params: any): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const db_cvote_history = this.getDBModel('CVote_Vote_History')
    const { id } = params

    const isNumber = /^\d*$/.test(id)
    let query: any
    if (isNumber) {
      query = { vid: parseInt(id), old: { $exists: false } }
    } else {
      query = { proposalHash: id, old: { $exists: false } }
    }

    const proposal = await db_cvote
      .getDBInstance()
      .findOne(query)
      .populate(
        'voteResult.votedBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID
      )
      .populate('proposer', 'did username')

    if (!proposal) {
      return {
        code: 400,
        success: false,
        message: 'Invalid request parameters',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }

    const {
      abstract,
      budget,
      budgetIntro,
      proposer,
      createdAt,
      elaAddress,
      goal,
      motivation,
      plan,
      planIntro,
      proposalHash,
      title,
      type
    } = proposal

    const data: { [key: string]: any } = {
      id: proposal.vid,
      createdAt: timestamp.second(createdAt),
      title,
      abstract,
      motivation,
      goal,
      originalURL: `${process.env.SERVER_URL}/proposals/${proposal._id}`,
      proposalHash,
      status: PROPOSAL_STATUS_TO_CHAIN_STATUS[proposal.status],
      type: constant.CVOTE_TYPE_API[type]
    }

    const proposerDidName = _.get(proposer, 'did.didName')
    if (proposerDidName) {
      data.proposer = proposerDidName
    } else {
      data.proposer = _.get(proposer, 'username')
    }

    data.did = _.get(proposer, 'did.id')

    if (elaAddress) {
      data.recipient = elaAddress
    }

    if (type === CVOTE_TYPE.CHANGE_SECRETARY) {
      data.newSecretaryDID = proposal.newSecretaryDID
    }

    if (type === CVOTE_TYPE.CHANGE_PROPOSAL) {
      const rs = await db_cvote
        .getDBInstance()
        .findOne({ vid: parseInt(proposal.targetProposalNum) }, 'title')
        .populate('proposer', 'did.id')
      if (rs) {
        data.targetProposalTitle = rs.title
      }
      data.targetProposalHash = proposal.targetProposalHash
      data.targetProposalID = proposal.targetProposalNum
      if (proposal.newOwnerDID) {
        data.newOwnerDID = proposal.newOwnerDID
      } else if (rs) {
        data.newOwnerDID = rs.proposer.did.id.slice(DID_PREFIX.length)
      }
      data.newRecipient = proposal.newAddress
    }

    if (type === CVOTE_TYPE.TERMINATE_PROPOSAL) {
      const rs = await db_cvote
        .getDBInstance()
        .findOne({ vid: parseInt(proposal.closeProposalNum) })
      if (rs) {
        data.targetProposalTitle = rs.title
      }
      data.closeProposalID = proposal.closeProposalNum
      data.targetProposalHash = proposal.targetProposalHash
    }

    if (type === CVOTE_TYPE.RESERVE_CUSTOMIZED_ID) {
      data.reservedCustomizedIDList = proposal.didNameList.trim().split(/\s+/)
    }

    if (type === CVOTE_TYPE.RECEIVE_CUSTOMIZED_ID) {
      data.receivedCustomizedIDList = proposal.receivedCustomizedIDList
      data.receiverDID = proposal.customizedIDBindToDID
    }

    if (type === CVOTE_TYPE.CHANGE_CUSTOMIZED_ID_FEE) {
      data.rateOfCustomizedIDFee = parseInt(proposal.customizedIDFee)
      data.EIDEffectiveHeight = parseInt(proposal.effectiveHeightOfEID)
    }

    if (type === CVOTE_TYPE.REGISTER_SIDE_CHAIN && proposal.sideChainDetails) {
      const {
        name,
        magic,
        genesisHash,
        effectiveHeight,
        exchangeRate,
        resourcePath,
        otherInfo
      } = proposal.sideChainDetails
      data.sideChainName = name
      data.magicNumber = parseInt(magic)
      data.genesisHash = genesisHash
      data.effectiveHeight = parseInt(effectiveHeight)
      data.exchangeRate = parseInt(exchangeRate)
      data.resourcePath = resourcePath
      if (otherInfo) {
        data.otherInfo = otherInfo
      }
    }

    if (budgetIntro) {
      data.budgetStatement = budgetIntro
    }

    if (planIntro) {
      data.planStatement = planIntro
    }

    const hasBudget = !!budget && _.isArray(budget) && !_.isEmpty(budget)
    if (hasBudget) {
      data.budgets = this.convertBudget(budget)
    }

    if (plan && plan.milestone && plan.milestone.length > 0) {
      let isAdvanceBudget = true
      if (hasBudget && data.budgets && parseInt(data.budgets[0].stage) === 1) {
        isAdvanceBudget = false
      }
      const milestones = []
      for (let i = 0; i < plan.milestone.length; i++) {
        const index = isAdvanceBudget ? i : i + 1
        const info = {
          timestamp: timestamp.second(plan.milestone[i].date),
          goal: plan.milestone[i].version,
          stage: index
        }
        const trackingRecords = await this.getTracking(proposal._id)
        if (trackingRecords) {
          const tracking = trackingRecords.find((el) => el.stage === i)
          if (tracking) {
            info['tracking'] = tracking.history
          }
        }
        milestones.push(info)
      }
      data.milestone = milestones
    }

    if (plan && plan.teamInfo && plan.teamInfo.length > 0) {
      data.implementationTeam = plan.teamInfo
    }

    const cvoteHistory = await db_cvote_history
      .getDBInstance()
      .find({ proposalBy: proposal._id })
      .populate('votedBy', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)

    const voteResultWithNull = _.map(proposal._doc.voteResult, (o: any) => {
      let result
      if (o.status === constant.CVOTE_CHAIN_STATUS.CHAINED) {
        result = o._doc
      } else {
        const historyList = _.filter(
          cvoteHistory,
          (e: any) =>
            e.status === constant.CVOTE_CHAIN_STATUS.CHAINED &&
            o.votedBy._id.toString() == e.votedBy._id.toString()
        )
        if (!_.isEmpty(historyList)) {
          const history = _.sortBy(historyList, 'createdAt')
          result = history[history.length - 1]._doc
        }
      }
      if (!_.isEmpty(result)) {
        let value = result.value // default vaule is 'reject'
        if (result.value === CVOTE_RESULT.SUPPORT) {
          value = 'approve'
        }
        if (result.value === CVOTE_RESULT.ABSTENTION) {
          value = 'abstain'
        }
        return {
          result: value,
          opinion: result.reason,
          avatar: _.get(result, 'votedBy.did.avatar'),
          name: _.get(result, 'votedBy.did.didName')
        }
      }
    })
    const voteResult = _.filter(voteResultWithNull, (o: any) => !_.isEmpty(o))

    const notificationResult = {}
    // duration
    const currentHeight = await ela.height()
    if (proposal.status === constant.CVOTE_STATUS.PROPOSED) {
      const duration = (proposal.proposedEndsHeight - currentHeight) * 2 * 60
      notificationResult['duration'] = duration >= 0 ? duration : 0
    }

    if (proposal.status === constant.CVOTE_STATUS.NOTIFICATION) {
      const duration =
        (proposal.notificationEndsHeight - currentHeight) * 2 * 60
      notificationResult['duration'] = duration >= 0 ? duration : 0
    }

    if (
      [
        constant.CVOTE_STATUS.NOTIFICATION,
        constant.CVOTE_STATUS.VETOED
      ].includes(proposal.status) &&
      proposal.rejectAmount >= 0 &&
      proposal.rejectThroughAmount > 0
    ) {
      notificationResult['rejectAmount'] = `${proposal.rejectAmount}`
      notificationResult['rejectThroughAmount'] = `${parseFloat(
        _.toNumber(proposal.rejectThroughAmount).toFixed(8)
      )}`
      notificationResult['rejectRatio'] = _.toNumber(
        (
          _.toNumber(proposal.rejectAmount) /
          _.toNumber(proposal.rejectThroughAmount)
        ).toFixed(4)
      )
    }

    return { ...data, ...notificationResult, crVotes: voteResult }
  }

  // API-10
  public async updateMilestone(param: any) {
    try {
      const jwtToken = param.jwt
      console.log(`jwtToken...`, jwtToken)
      const claims: any = jwt.decode(jwtToken)
      console.log(`claims...`, claims)
      const {
        iss,
        command,
        signature,
        exp,
        proposalHash,
        messageData,
        messageHash,
        stage
      } = claims
      if (
        command !== 'updatemilestone' ||
        !proposalHash ||
        !iss ||
        !signature ||
        !messageData ||
        !messageHash ||
        !stage
      ) {
        return {
          code: 400,
          success: false,
          message: 'Invalid request params'
        }
      }
      const now = Math.trunc(Date.now() / 1000)
      if (now > exp) {
        return {
          code: 400,
          success: false,
          message: 'The signature is expired'
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

      const ownerPublicKey = _.get(proposal, 'ownerPublicKey')
      if (!ownerPublicKey) {
        return {
          code: 400,
          success: false,
          message: `Can not get your did's public key.`
        }
      }
      const pemPublicKey = getPemPublicKey(ownerPublicKey)
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
              const item = proposal.withdrawalHistory.find(
                (item: any) => item.messageHash === messageHash
              )
              if (item) {
                return {
                  code: 400,
                  success: false,
                  message: 'This payment application had been saved.'
                }
              }

              const messageResult = await unzipFile(messageData, 'message')
              if (!messageResult) {
                return {
                  code: 400,
                  success: false,
                  message: `Cann't decompress messageData.`
                }
              }

              const initiation = _.find(proposal.budget, ['type', 'ADVANCE'])
              const milestoneKey = initiation ? stage : stage - 1
              // check if milestoneKey is valid
              const budget = proposal.budget.find(
                (item: any) => item.milestoneKey === milestoneKey.toString()
              )
              if (!budget) {
                return {
                  code: 400,
                  success: false,
                  message: 'This is no this milestone.'
                }
              }
              if (![WAITING_FOR_REQUEST, REJECTED].includes(budget.status)) {
                return {
                  code: 400,
                  success: false,
                  message: 'Milestone status is invalid.'
                }
              }

              // update withdrawal history
              const history = {
                message: messageResult.opinion,
                milestoneKey: milestoneKey.toString(),
                messageHash,
                createdAt: moment(messageResult.date),
                signature
              }
              const zipFileModel = this.getDBModel('Proposer_Message_Zip_File')
              try {
                await Promise.all([
                  this.model.update(
                    { proposalHash },
                    { $push: { withdrawalHistory: history } }
                  ),
                  this.model.update(
                    {
                      proposalHash,
                      'budget.milestoneKey': history.milestoneKey
                    },
                    { 'budget.$.status': WAITING_FOR_APPROVAL }
                  ),
                  zipFileModel.save({
                    proposalId: proposal._id,
                    messageHash,
                    content: Buffer.from(messageData, 'hex'),
                    proposalHash,
                    stage,
                    ownerSignature: signature,
                    ownerPublicKey
                  })
                ])
              } catch (err) {
                console.log(`update milestone when save data to db err...`, err)
              }

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
      console.log(`update milestone api err...`, err)
      return {
        code: 500,
        success: false,
        message: 'Something went wrong'
      }
    }
  }

  // API-11
  public async getOpinionData(params: any): Promise<Object> {
    const { opinionHash } = params
    if (!opinionHash) {
      return {
        code: 400,
        success: false,
        message: 'Invalid request parameter'
      }
    }
    let rs = await this.zipFileModel.getDBInstance().findOne({ opinionHash })
    if (!rs) {
      const secretaryZipFileModel = this.getDBModel(
        'Secretary_Opinion_Zip_File'
      )
      rs = await secretaryZipFileModel.getDBInstance().findOne({ opinionHash })
      if (!rs) {
        return {
          code: 400,
          success: false,
          message: 'Invalid opinion hash'
        }
      }
    }
    return {
      proposalHash: rs.proposalHash,
      content: rs.content.toString('hex')
    }
  }

  // API-12
  public async getMessageData(params: any): Promise<Object> {
    const { messageHash } = params
    if (!messageHash) {
      return {
        code: 400,
        success: false,
        message: 'Invalid request parameter'
      }
    }
    const zipFileModel = this.getDBModel('Proposer_Message_Zip_File')
    const rs = await zipFileModel.getDBInstance().findOne({ messageHash })
    if (!rs) {
      return {
        code: 400,
        success: false,
        message: 'Invalid message hash'
      }
    }
    return {
      proposalHash: rs.proposalHash,
      content: rs.content.toString('hex'),
      stage: rs.stage,
      ownerSignature: rs.ownerSignature,
      ownerPublicKey: rs.ownerPublicKey
    }
  }

  public async walletVote(param: any) {
    const db_user = this.getDBModel('User')
    const db_cvote = this.getDBModel('CVote')
    const db_council = this.getDBModel('Council')

    const rs: any = jwt.verify(
      param.params,
      process.env.WALLET_VOTE_PUBLIC_KEY,
      {
        algorithms: ['ES256']
      }
    )
    if (rs.exp < (new Date().getTime() / 1000).toFixed()) {
      throw 'Request expired'
    }

    if (rs.command !== API_VOTE_TYPE.PROPOSAL) {
      throw 'Invalid command'
    }
    const { status, reason, reasonHash, proposalHash, did } = rs.data
    const voteDid = DID_PREFIX + did
    const user = await db_user.getDBInstance().findOne({ 'did.id': voteDid })
    if (!user) {
      throw 'This user doesn‘t exist'
    }
    if (user.role !== constant.USER_ROLE.COUNCIL) {
      throw 'This user not a coumcil'
    }
    const currentCouncil = await db_council.getDBInstance().findOne({
      status: constant.TERM_COUNCIL_STATUS.CURRENT
    })
    if (!_.find(currentCouncil.councilMembers, { did })) {
      throw 'This user not a coumcil'
    }
    const proposal = await db_cvote
      .getDBInstance()
      .findOne({ proposalHash: proposalHash })
    if (!proposal) {
      throw 'Invalid proposal hash'
    }
    const votedRs: any = _.find(proposal.voteResult, { votedBy: user._id })
    if (!votedRs) {
      throw 'This vote undefined'
    }
    if (
      votedRs.status == constant.CVOTE_CHAIN_STATUS.UNCHAIN &&
      votedRs.value != 'undecided'
    ) {
      throw 'The voting status has not been updated'
    }
    const data = {
      _id: proposal._id,
      value: status,
      reason,
      reasonHash,
      votedByWallet: user._id
    }
    this.vote(data)
  }

  public async vote(param): Promise<Document> {
    const db_cvote = this.getDBModel('CVote')
    const db_cvote_history = this.getDBModel('CVote_Vote_History')

    const { _id, value, reason, reasonHash, votedByWallet } = param
    const cur = await db_cvote.findOne({ _id })
    const votedBy = _.isEmpty(votedByWallet)
      ? _.get(this.currentUser, '_id')
      : votedByWallet
    if (!cur) {
      throw 'invalid proposal id'
    }
    const currentVoteResult = _.find(cur._doc.voteResult, ['votedBy', votedBy])
    const reasonCreateDate = new Date()
    await db_cvote.update(
      {
        _id,
        'voteResult.votedBy': votedBy
      },
      {
        $set: {
          'voteResult.$.value': value,
          'voteResult.$.reason': reason || '',
          'voteResult.$.status': constant.CVOTE_CHAIN_STATUS.UNCHAIN,
          'voteResult.$.reasonHash':
            reasonHash ||
            utilCrypto.sha256D(reason + timestamp.second(reasonCreateDate)),
          'voteResult.$.reasonCreatedAt': reasonCreateDate
        },
        $inc: {
          __v: 1
        }
      }
    )

    if (
      !_.find(currentVoteResult, ['value', constant.CVOTE_RESULT.UNDECIDED])
    ) {
      await db_cvote_history.save({
        ..._.omit(currentVoteResult, ['_id']),
        proposalBy: _id
      })
    }

    return await this.getById(_id)
  }

  public async getById(id): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const db_cvote_history = this.getDBModel('CVote_Vote_History')
    // access proposal by reference number
    const isNumber = /^\d*$/.test(id)
    let query: any
    if (isNumber) {
      query = { vid: parseInt(id), old: { $exists: false } }
    } else {
      query = { _id: id }
    }
    const rs = await db_cvote
      .getDBInstance()
      .findOne(query)
      .populate(
        'voteResult.votedBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID
      )
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .populate('createdBy', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .populate('reference', constant.DB_SELECTED_FIELDS.SUGGESTION.ID)
      .populate('referenceElip', 'vid')

    if (!rs) {
      return { success: true, empty: true }
    }

    const voteHistory = await db_cvote_history
      .getDBInstance()
      .find({ proposalBy: rs._doc._id })
      .populate('votedBy', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)

    _.forEach(rs._doc.voteResult, (o: any) => {
      if (
        o.status === constant.CVOTE_CHAIN_STATUS.CHAINED &&
        !_.find(voteHistory, { txid: o.txid })
      ) {
        voteHistory.push({
          ...o._doc,
          isCurrentVote: true
        })
      }
    })

    const res = { ...rs._doc }
    res.voteHistory = _.sortBy(voteHistory, function (item) {
      return -item.reasonCreatedAt
    })
    if (!_.isEmpty(res.relevance)) {
      let relevanceStr = ''
      _.forEach(res.relevance[0] && res.relevance[0]._doc, (v, k) => {
        if (k === '0') {
          _.forEach(res.relevance[0]._doc, (v) => {
            relevanceStr += v
          })
        }
        return
      })
      if (!_.isEmpty(relevanceStr)) {
        res.relevance = relevanceStr
      }
    }
    if (res.budgetAmount) {
      const doc = JSON.parse(JSON.stringify(res))
      // deal with 7e-08
      doc.budgetAmount = Big(doc.budgetAmount).toFixed()
      return doc
    }
    return res
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
}
