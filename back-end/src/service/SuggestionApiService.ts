import Base from './Base'
import * as _ from 'lodash'
import * as jwt from 'jsonwebtoken'
import { constant } from '../constant'
import { timestamp, mail, user as userUtil, getPemPublicKey } from '../utility'
const Big = require('big.js')

const {
  ELA_BURN_ADDRESS,
  DEFAULT_BUDGET,
  SUGGESTION_TYPE,
  CHAIN_BUDGET_TYPE,
  DID_PREFIX
} = constant

/**
 * API v1 and v2 for ELA Wallet and Essentials
 */

export default class extends Base {
  private model: any
  private zipFileModel: any
  private proposalModel: any
  protected init() {
    this.model = this.getDBModel('Suggestion')
    this.zipFileModel = this.getDBModel('Suggestion_Zip_File')
    this.proposalModel = this.getDBModel('CVote')
  }

  // API-0
  public async list(param: any, version = 'v1'): Promise<Object> {
    const { status } = param
    if (
      status &&
      ![
        constant.SUGGESTION_NEW_STATUS.UNSIGNED,
        constant.SUGGESTION_NEW_STATUS.SIGNED,
        constant.SUGGESTION_NEW_STATUS.PROPOSED
      ].includes(status.toUpperCase())
    ) {
      return {
        code: 400,
        success: false,
        message: 'Invalid request parameters - status',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }
    const query: any = {}
    query.old = { $exists: false }
    query.status = constant.SUGGESTION_STATUS.ACTIVE

    if (
      status &&
      status.toUpperCase() === constant.SUGGESTION_NEW_STATUS.UNSIGNED
    ) {
      query['signature.data'] = { $exists: false }
    }
    if (
      status &&
      status.toUpperCase() === constant.SUGGESTION_NEW_STATUS.SIGNED
    ) {
      query['signature.data'] = { $exists: true }
      query.proposalHash = { $exists: false }
    }
    if (
      status &&
      status.toUpperCase() === constant.SUGGESTION_NEW_STATUS.PROPOSED
    ) {
      query.proposalHash = { $exists: true }
    }

    // search
    if (param.search) {
      const search = _.trim(param.search)
      query.$or = [{ title: { $regex: search, $options: 'i' } }]
      if (parseInt(search, 10)) {
        query.$or.push({ displayId: parseInt(search, 10) })
      }
    }

    const fields = [
      'displayId',
      'title',
      'type',
      'createdAt',
      'createdBy',
      'proposalHash',
      'signature'
    ]

    const cursor = this.model
      .getDBInstance()
      .find(query, fields.join(' '))
      .populate('createdBy', 'did username')
      .sort({ displayId: -1 })

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
      this.model.getDBInstance().find(query).count()
    ])

    const list = _.map(rs[0], function (o) {
      let temp = _.omit(o._doc, ['createdBy', 'type', 'signature'])
      const createdAt = _.get(o, 'createdAt')
      temp.createdAt = timestamp.second(createdAt)
      if (version === 'v2') {
        const proposerDidName = _.get(o, 'createdBy.did.didName')
        if (proposerDidName) {
          temp.proposer = proposerDidName
        } else {
          temp.proposer = _.get(o, 'createdBy.username')
        }
      } else {
        temp.proposedBy = _.get(o, 'createdBy.did.id')
      }
      temp.type = constant.CVOTE_TYPE_API[o.type]
      if (!status) {
        const isSigned = _.get(o, 'signature.data')
        const isProposed = _.get(o, 'proposalHash')
        if (!isSigned) {
          temp.status = constant.SUGGESTION_NEW_STATUS.UNSIGNED.toLowerCase()
        }
        if (isSigned) {
          temp.status = constant.SUGGESTION_NEW_STATUS.SIGNED.toLowerCase()
        }
        if (isProposed) {
          temp.status = constant.SUGGESTION_NEW_STATUS.PROPOSED.toLowerCase()
        }
      }
      if (
        status &&
        Object.values(constant.SUGGESTION_NEW_STATUS).includes(
          status.toUpperCase()
        )
      ) {
        temp.status = status.toLowerCase()
      }
      return _.mapKeys(temp, function (value, key) {
        if (key == 'displayId') {
          return 'id'
        } else if (key === '_id') {
          return 'sid'
        } else {
          return key
        }
      })
    })

    const total = rs[1]
    return {
      suggestions: list,
      total
    }
  }

  // API-8
  public async getDraftData(params: any): Promise<Object> {
    const { draftHash } = params
    if (!draftHash) {
      return {
        code: 400,
        success: false,
        message: 'Invalid request parameter',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }
    const rs = await this.zipFileModel.getDBInstance().findOne({ draftHash })
    if (!rs) {
      return {
        code: 400,
        success: false,
        message: 'Invalid this draft hash',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }
    return {
      sid: rs.suggestionId,
      content: rs.content.toString('hex')
    }
  }

  private convertBudget(budget) {
    const initiation = _.find(budget, ['type', 'ADVANCE'])
    const budgets = budget.map((item) => {
      const stage = parseInt(item.milestoneKey, 10)
      return {
        type: CHAIN_BUDGET_TYPE[item.type],
        stage: initiation ? stage : stage + 1,
        amount: Big(`${item.amount}e+8`).toFixed(0),
        paymentCriteria: item.criteria
      }
    })
    return budgets
  }

  // API-3
  public async getSuggestion(sid: string): Promise<any> {
    const db_cvote = this.getDBModel('CVote')

    const suggestion = await this.model
      .getDBInstance()
      .findOne({ _id: sid }, '-comments -commentsNum')
      .populate('createdBy', 'did username')

    if (!suggestion) {
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
      createdBy,
      createdAt,
      displayId,
      draftHash,
      elaAddress,
      goal,
      motivation,
      plan,
      planIntro,
      title,
      type
    } = suggestion

    const data: { [key: string]: any } = {
      id: displayId,
      title,
      abstract,
      motivation,
      goal
    }

    const isSigned = _.get(suggestion, 'signature.data')
    const isProposed = _.get(suggestion, 'proposalHash')
    if (!isSigned) {
      data.status = constant.SUGGESTION_NEW_STATUS.UNSIGNED.toLowerCase()
    }
    if (isSigned) {
      data.status = constant.SUGGESTION_NEW_STATUS.SIGNED.toLowerCase()
    }
    if (isProposed) {
      data.status = constant.SUGGESTION_NEW_STATUS.PROPOSED.toLowerCase()
    }

    data.did = _.get(createdBy, 'did.id')

    const proposerDidName = _.get(createdBy, 'did.didName')
    if (proposerDidName) {
      data.proposer = proposerDidName
    } else {
      data.proposer = _.get(createdBy, 'username')
    }

    if (suggestion.ownerPublicKey) {
      data.ownerPublicKey = suggestion.ownerPublicKey
    }

    data.originalURL = `${process.env.SERVER_URL}/suggestion/${sid}`
    data.createdAt = timestamp.second(createdAt)
    data.type = constant.CVOTE_TYPE_API[type]

    if (type === SUGGESTION_TYPE.CHANGE_SECRETARY) {
      data.newSecretaryDID = suggestion.newSecretaryDID
      data.newSecretaryPublicKey = suggestion.newSecretaryPublicKey
    }

    if (type === SUGGESTION_TYPE.CHANGE_PROPOSAL) {
      if (suggestion.newOwnerDID) {
        data.newOwnerDID = suggestion.newOwnerDID
      }
      data.newOwnerPublicKey = suggestion.newOwnerPublicKey
      data.newRecipient = suggestion.newRecipient
      const proposal = await db_cvote
        .getDBInstance()
        .findOne({ vid: suggestion.targetProposalNum })
      data.targetProposalTitle = proposal.title
      data.targetProposalHash = suggestion.targetProposalHash
      data.targetProposalNum = suggestion.targetProposalNum.toString()
    }

    if (type === SUGGESTION_TYPE.TERMINATE_PROPOSAL) {
      const proposal = await db_cvote
        .getDBInstance()
        .findOne({ vid: suggestion.closeProposalNum })
      data.targetProposalNum = suggestion.closeProposalNum.toString()
      data.targetProposalTitle = proposal.title
      data.targetProposalHash = suggestion.targetProposalHash
    }

    if (type === SUGGESTION_TYPE.RESERVE_CUSTOMIZED_ID) {
      const list = suggestion.didNameList
        ? suggestion.didNameList.trim().split(/\s+/)
        : []
      data.reservedCustomizedIDList = list
    }

    if (type === SUGGESTION_TYPE.RECEIVE_CUSTOMIZED_ID) {
      data.receivedCustomizedIDList = suggestion.receivedCustomizedIDList
      data.receiverDID = suggestion.customizedIDBindToDID
    }

    if (type === SUGGESTION_TYPE.CHANGE_CUSTOMIZED_ID_FEE) {
      data.rateOfCustomizedIDFee = parseInt(suggestion.customizedIDFee)
      data.EIDEffectiveHeight = parseInt(suggestion.effectiveHeightOfEID)
    }

    if (
      type === SUGGESTION_TYPE.REGISTER_SIDE_CHAIN &&
      suggestion.sideChainDetails
    ) {
      const {
        name,
        magic,
        genesisHash,
        effectiveHeight,
        exchangeRate,
        resourcePath,
        otherInfo
      } = suggestion.sideChainDetails
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

    if (draftHash) {
      data.draftHash = draftHash
    }

    if (elaAddress) {
      data.recipient = elaAddress
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
    } else {
      if (type === SUGGESTION_TYPE.NEW_MOTION) {
        data.budgets = DEFAULT_BUDGET
        data.recipient = ELA_BURN_ADDRESS
      }
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
        milestones.push(info)
      }
      data.milestone = milestones
    }

    if (plan && plan.teamInfo && plan.teamInfo.length > 0) {
      data.implementationTeam = plan.teamInfo
    }

    if (_.get(suggestion, 'signature.data')) {
      data.signature = _.get(suggestion, 'signature.data')
    }

    if (_.get(suggestion, 'newOwnerSignature.data')) {
      data.newOwnerSignature = _.get(suggestion, 'newOwnerSignature.data')
    }

    if (_.get(suggestion, 'newSecretarySignature.data')) {
      data.newSecretarySignature = _.get(
        suggestion,
        'newSecretarySignature.data'
      )
    }

    return data
  }

  async newOwnerSignature(data) {
    const { suggestion, iss, jwtToken, sid } = data
    const signatureInfo = _.get(suggestion, 'newOwnerSignature.data')
    if (signatureInfo) {
      return {
        code: 400,
        success: false,
        message: 'This suggestion had been signed.'
      }
    }
    let newOwnerDID = _.get(suggestion, 'newOwnerDID')
    if (!newOwnerDID) {
      const proposal = await this.proposalModel
        .getDBInstance()
        .findOne({ vid: suggestion.targetProposalNum }, 'proposer')
        .populate('proposer', 'did.id')
      newOwnerDID = proposal.proposer.did.id
    } else {
      newOwnerDID = DID_PREFIX + newOwnerDID
    }
    if (iss === newOwnerDID) {
      const compressedKey = _.get(suggestion, 'newOwnerPublicKey')
      const pemPublicKey = compressedKey && getPemPublicKey(compressedKey)
      if (!pemPublicKey) {
        return {
          code: 400,
          success: false,
          message: `Can not get your DID's public key.`
        }
      }

      return jwt.verify(
        jwtToken,
        pemPublicKey,
        async (err: any, decoded: any) => {
          if (err) {
            console.log(`verify the proposal new owner's signature err`, err)
            return {
              code: 401,
              success: false,
              message: 'Verify signature failed.'
            }
          } else {
            try {
              await this.model.update(
                { _id: sid },
                {
                  newOwnerSignature: { data: decoded.signature }
                }
              )
              return { code: 200, success: true, message: 'Ok' }
            } catch (err) {
              console.log(`receive new owner signature err...`, err)
              return {
                code: 500,
                success: false,
                message: 'Something went wrong'
              }
            }
          }
        }
      )
    } else {
      return {
        code: 400,
        success: false,
        message: 'No this new owner DID'
      }
    }
  }

  async newSecretarySignature(data) {
    const { suggestion, iss, jwtToken, sid } = data
    const secretaryDID = _.get(suggestion, 'newSecretaryDID')
    if (iss === DID_PREFIX + secretaryDID) {
      const signatureInfo = _.get(suggestion, 'newSecretarySignature.data')
      if (signatureInfo) {
        return {
          code: 400,
          success: false,
          message: 'This suggestion had been signed.'
        }
      }
      const compressedKey = _.get(suggestion, 'newSecretaryPublicKey')
      const pemPublicKey = compressedKey && getPemPublicKey(compressedKey)
      if (!pemPublicKey) {
        return {
          code: 400,
          success: false,
          message: `Can not get your DID's public key.`
        }
      }
      return jwt.verify(
        jwtToken,
        pemPublicKey,
        async (err: any, decoded: any) => {
          if (err) {
            console.log(`verify the new secretary's signature err`, err)
            return {
              code: 401,
              success: false,
              message: 'Verify signatrue failed.'
            }
          } else {
            try {
              await this.model.update(
                { _id: sid },
                { newSecretarySignature: { data: decoded.signature } }
              )
              return { code: 200, success: true, message: 'Ok' }
            } catch (err) {
              console.log(`receive new secretary signature err...`, err)
              return {
                code: 500,
                success: false,
                message: 'DB can not save the signature.'
              }
            }
          }
        }
      )
    }
  }

  // API-9
  public async signature(param: any) {
    try {
      const jwtToken = param.jwt
      const claims: any = jwt.decode(jwtToken)
      const { iss, sid, command, signature, exp } = claims
      if (command !== 'createsuggestion' || !sid || !iss || !signature) {
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

      const suggestion = await this.model
        .getDBInstance()
        .findById({ _id: sid })
        .populate('createdBy', 'did')

      if (!suggestion) {
        return {
          code: 400,
          success: false,
          message: 'There is no this suggestion.'
        }
      }

      const ownerDID = _.get(suggestion, 'createdBy.did.id')
      if (iss === ownerDID) {
        const ownerSignature = _.get(suggestion, 'signature.data')

        if (ownerSignature) {
          // deal with the owner's DID is same with new owner's
          if (suggestion.type === SUGGESTION_TYPE.CHANGE_PROPOSAL) {
            return await this.newOwnerSignature({
              suggestion,
              iss,
              sid,
              jwtToken
            })
          }
          // deal with the owner's DID is same with new secretary's
          if (suggestion.type === SUGGESTION_TYPE.CHANGE_SECRETARY) {
            return await this.newSecretarySignature({
              suggestion,
              iss,
              sid,
              jwtToken
            })
          }
          return {
            code: 400,
            success: false,
            message: 'This suggestion had been signed.'
          }
        }
        const compressedKey = _.get(suggestion, 'ownerPublicKey')
        const pemPublicKey = compressedKey && getPemPublicKey(compressedKey)
        if (!pemPublicKey) {
          return {
            code: 400,
            success: false,
            message: `Can not get your DID's public key.`
          }
        }
        return jwt.verify(
          jwtToken,
          pemPublicKey,
          async (err: any, decoded: any) => {
            if (err) {
              console.log(`verify the suggestion owner's signature err`, err)
              return {
                code: 401,
                success: false,
                message: 'Verify signature failed.'
              }
            } else {
              try {
                await this.model.update(
                  { _id: sid },
                  { signature: { data: decoded.signature } }
                )
                // notify new owner to sign
                if (suggestion.type === SUGGESTION_TYPE.CHANGE_PROPOSAL) {
                  this.notifyPeopleToSign(
                    suggestion,
                    suggestion.newOwnerPublicKey
                  )
                }
                // notify new secretary general to sign
                if (suggestion.type === SUGGESTION_TYPE.CHANGE_SECRETARY) {
                  this.notifyPeopleToSign(
                    suggestion,
                    suggestion.newSecretaryPublicKey
                  )
                }
                return { code: 200, success: true, message: 'Ok' }
              } catch (err) {
                console.log(`receive owner signature err...`, err)
                return {
                  code: 500,
                  success: false,
                  message: 'DB can not save your signature.'
                }
              }
            }
          }
        )
      }
      if (suggestion.type === SUGGESTION_TYPE.CHANGE_PROPOSAL) {
        return await this.newOwnerSignature({
          suggestion,
          iss,
          sid,
          jwtToken
        })
      }

      if (suggestion.type === SUGGESTION_TYPE.CHANGE_SECRETARY) {
        return await this.newSecretarySignature({
          suggestion,
          iss,
          sid,
          jwtToken
        })
      }

      return {
        code: 400,
        success: false,
        message: `Unable to handle this request`
      }
    } catch (err) {
      console.log(`signature api err...`, err)
      return {
        code: 500,
        success: false,
        message: 'Something went wrong'
      }
    }
  }

  private async notifyPeopleToSign(suggestion, receiverPublicKey) {
    const subject = `【Signature required】Suggestion <${suggestion.displayId}> is ready for you to sign`
    const body = `
      <p>Suggestion <${suggestion.displayId}> <${suggestion.title}> is ready for you to sign</p>
      <p>Click here to sign now:</p>
      <p><a href="${process.env.SERVER_URL}/suggestion/${suggestion._id}">${process.env.SERVER_URL}/suggestion/${suggestion._id}</a></p>
      <br />
      <p>Thanks</p>
      <p>Cyber Republic</p>
    `
    const receiver = await this.getDBModel('User').findOne({
      'did.compressedPublicKey': receiverPublicKey
    })
    mail.send({
      to: receiver.email,
      toName: userUtil.formatUsername(receiver),
      subject,
      body
    })
  }
}
