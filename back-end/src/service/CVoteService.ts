import Base from './Base'
import { Document } from 'mongoose'
import * as _ from 'lodash'
import { constant } from '../constant'
import {
  permissions,
  getProposalData,
  ela,
  getInformationByDid,
  getDidName,
  mail,
  user as userUtil,
  timestamp,
  logger
} from '../utility'
import { unzipFile } from '../utility/unzip-file'
import * as moment from 'moment'
import * as jwt from 'jsonwebtoken'
import { getOpinionHash } from '../utility/opinion-hash'

const Big = require('big.js')
let tm = undefined

const BASE_FIELDS = [
  'title',
  'abstract',
  'goal',
  'motivation',
  'relevance',
  'budget',
  'budgetAmount',
  'elaAddress',
  'plan',
  'payment'
]

export const WALLET_STATUS_TO_CVOTE_STATUS = {
  ALL: [
    constant.CVOTE_STATUS.PROPOSED,
    constant.CVOTE_STATUS.NOTIFICATION,
    constant.CVOTE_STATUS.ACTIVE,
    constant.CVOTE_STATUS.FINAL,
    constant.CVOTE_STATUS.REJECT,
    constant.CVOTE_STATUS.DEFERRED,
    constant.CVOTE_STATUS.VETOED
  ],
  VOTING: [constant.CVOTE_STATUS.PROPOSED],
  NOTIFICATION: [constant.CVOTE_STATUS.NOTIFICATION],
  ACTIVE: [constant.CVOTE_STATUS.ACTIVE],
  FINAL: [constant.CVOTE_STATUS.FINAL],
  REJECTED: [
    constant.CVOTE_STATUS.REJECT,
    constant.CVOTE_STATUS.DEFERRED,
    constant.CVOTE_STATUS.VETOED
  ]
}

export const CVOTE_STATUS_TO_WALLET_STATUS = {
  [constant.CVOTE_STATUS.PROPOSED]: 'VOTING',
  [constant.CVOTE_STATUS.NOTIFICATION]: 'NOTIFICATION',
  [constant.CVOTE_STATUS.ACTIVE]: 'ACTIVE',
  [constant.CVOTE_STATUS.FINAL]: 'FINAL',
  [constant.CVOTE_STATUS.REJECT]: 'REJECTED',
  [constant.CVOTE_STATUS.DEFERRED]: 'REJECTED',
  [constant.CVOTE_STATUS.VETOED]: 'VETOED'
}

const CHAIN_STATUS_TO_PROPOSAL_STATUS = {
  Registered: constant.CVOTE_STATUS.PROPOSED,
  CRAgreed: constant.CVOTE_STATUS.NOTIFICATION,
  CRCanceled: constant.CVOTE_STATUS.REJECT,
  VoterAgreed: constant.CVOTE_STATUS.ACTIVE,
  VoterCanceled: constant.CVOTE_STATUS.VETOED,
  Finished: constant.CVOTE_STATUS.FINAL,
  Terminated: constant.CVOTE_STATUS.TERMINATED,
  Aborted: {
    [constant.CVOTE_STATUS.PROPOSED]: constant.CVOTE_STATUS.REJECT,
    [constant.CVOTE_STATUS.NOTIFICATION]: constant.CVOTE_STATUS.VETOED
  }
}

const EMAIL_PROPOSAL_STATUS = {
  [constant.CVOTE_STATUS.NOTIFICATION]: 'Passed',
  [constant.CVOTE_STATUS.ACTIVE]: 'Passed',
  [constant.CVOTE_STATUS.FINAL]: 'Passed',
  [constant.CVOTE_STATUS.REJECT]: 'Rejected',
  [constant.CVOTE_STATUS.VETOED]: 'Rejected'
}

const EMAIL_TITLE_PROPOSAL_STATUS = {
  [constant.CVOTE_STATUS.NOTIFICATION]: constant.CVOTE_STATUS.NOTIFICATION,
  [constant.CVOTE_STATUS.ACTIVE]: 'PASSED',
  [constant.CVOTE_STATUS.REJECT]: 'REJECTED',
  [constant.CVOTE_STATUS.VETOED]: 'VETOED',
  [constant.CVOTE_STATUS.FINAL]: 'FINAL'
}

const { DID_PREFIX, API_VOTE_TYPE } = constant
const STAGE_BLOCKS = process.env.NODE_ENV == 'staging' ? 40 : 7 * 720

export default class extends Base {
  // create a DRAFT propoal with minimal info
  public async createDraft(param: any): Promise<Document> {
    const db_suggestion = this.getDBModel('Suggestion')
    const db_cvote = this.getDBModel('CVote')
    const { title, proposedBy, proposer, suggestionId, payment } = param

    const vid = await this.getNewVid()
    const userRole = _.get(this.currentUser, 'role')
    if (!this.canCreateProposal()) {
      throw 'cvoteservice.create - no permission'
    }

    const doc: any = {
      title,
      vid,
      payment,
      status: constant.CVOTE_STATUS.DRAFT,
      published: false,
      contentType: constant.CONTENT_TYPE.MARKDOWN,
      proposedBy,
      proposer: proposer ? proposer : this.currentUser._id,
      createdBy: this.currentUser._id
    }
    const suggestion =
      suggestionId && (await db_suggestion.findById(suggestionId))
    if (!_.isEmpty(suggestion)) {
      doc.reference = suggestionId
    }

    Object.assign(doc, _.pick(suggestion, BASE_FIELDS))

    try {
      return await db_cvote.save(doc)
    } catch (error) {
      logger.error(error)
      return
    }
  }

  public async getActiveProposals() {
    const db_cvote = this.getDBModel('CVote')
    const docs = await db_cvote.find(
      {
        status: constant.CVOTE_STATUS.ACTIVE,
        old: { $exists: false }
      },
      'vid title'
    )
    return docs
  }

  public async makeSuggIntoProposal(param: any) {
    const db_cvote = this.getDBModel('CVote')
    const db_suggestion = this.getDBModel('Suggestion')
    const db_user = this.getDBModel('User')
    const { suggestion, proposalHash, chainDid } = param
    const vid = await this.getNewVid()
    const [owner, creator] = await Promise.all([
      db_user.findById(suggestion.createdBy),
      db_user.findOne({ 'did.id': `did:elastos:${chainDid}` })
    ])
    const result = await getProposalData(proposalHash)
    const registerHeight = result && result.data.registerheight
    const txHash = result && result.data.txhash
    const { proposedTime, proposedEnds, notificationEnds } =
      await ela.calHeightTime(registerHeight)
    let proposedEndsHeight = registerHeight + STAGE_BLOCKS
    let notificationEndsHeight = registerHeight + STAGE_BLOCKS * 2
    const doc: any = {
      vid,
      type: suggestion.type,
      status: constant.CVOTE_STATUS.PROPOSED,
      published: true,
      contentType: constant.CONTENT_TYPE.MARKDOWN,
      proposedBy: userUtil.formatUsername(owner),
      proposer: suggestion.createdBy,
      createdBy: creator._id,
      reference: suggestion._id,
      proposalHash,
      draftHash: suggestion.draftHash,
      ownerPublicKey: suggestion.ownerPublicKey,
      planIntro: suggestion.planIntro,
      budgetIntro: suggestion.budgetIntro,
      registerHeight,
      proposedEndsHeight,
      notificationEndsHeight,
      proposedAt: new Date(proposedTime),
      proposedEnds: new Date(proposedEnds),
      notificationEnds: new Date(notificationEnds),
      txHash
    }

    if (suggestion.type === constant.CVOTE_TYPE.TERMINATE_PROPOSAL) {
      doc.closeProposalNum = suggestion.closeProposalNum
    }
    if (suggestion.type === constant.CVOTE_TYPE.CHANGE_SECRETARY) {
      doc.newSecretaryDID = suggestion.newSecretaryDID
    }
    if (suggestion.type === constant.CVOTE_TYPE.CHANGE_PROPOSAL) {
      doc.targetProposalNum = suggestion.targetProposalNum
      if (suggestion.newOwnerDID) {
        doc.newOwnerDID = suggestion.newOwnerDID
      }
      if (suggestion.newAddress) {
        doc.newAddress = suggestion.newAddress
      }
    }

    if (suggestion.type === constant.CVOTE_TYPE.RESERVE_CUSTOMIZED_ID) {
      doc.didNameList = suggestion.didNameList
    }

    if (suggestion.type === constant.CVOTE_TYPE.RECEIVE_CUSTOMIZED_ID) {
      doc.customizedIDBindToDID = suggestion.customizedIDBindToDID
      doc.receivedCustomizedIDList = suggestion.receivedCustomizedIDList
    }

    if (suggestion.type === constant.CVOTE_TYPE.CHANGE_CUSTOMIZED_ID_FEE) {
      doc.customizedIDFee = suggestion.customizedIDFee
      doc.effectiveHeightOfEID = suggestion.effectiveHeightOfEID
    }

    if (suggestion.type === constant.CVOTE_TYPE.REGISTER_SIDE_CHAIN) {
      doc.sideChainDetails = suggestion.sideChainDetails
    }

    Object.assign(doc, _.pick(suggestion, BASE_FIELDS))
    const budget = _.get(suggestion, 'budget')
    const hasBudget = !!budget && _.isArray(budget) && !_.isEmpty(budget)
    if (suggestion.type === constant.CVOTE_TYPE.NEW_MOTION && !hasBudget) {
      doc.budget = constant.DEFAULT_BUDGET.map((item: any) => ({
        amount: '0',
        milestoneKey: '0',
        type: constant.SUGGESTION_BUDGET_TYPE.COMPLETION
      }))
      doc.elaAddress = constant.ELA_BURN_ADDRESS
      doc.budgetAmount = '0'
    }

    const councilMembers = await db_user.find({
      role: constant.USER_ROLE.COUNCIL
    })
    const voteResult = []
    _.each(councilMembers, (user) =>
      voteResult.push({
        votedBy: user._id,
        value: constant.CVOTE_RESULT.UNDECIDED
      })
    )
    doc.voteResult = voteResult
    try {
      const res: any = await db_cvote.save(doc)
      await db_suggestion.update(
        { _id: suggestion._id },
        {
          $addToSet: { reference: res._id },
          proposalHash
        }
      )
      this.notifySubscribers(res)
      this.notifyCouncil(res)
      return { _id: res._id, vid: res.vid }
    } catch (error) {
      console.error(error)
      return
    }
  }

  /**
   *
   * @param param
   * @returns {Promise<"mongoose".Document>}
   */
  public async updateDraft(param: any): Promise<Document> {
    const db_cvote = this.getDBModel('CVote')
    const {
      _id,
      title,
      type,
      abstract,
      goal,
      motivation,
      relevance,
      budget,
      plan,
      payment
    } = param

    if (!this.currentUser || !this.currentUser._id) {
      throw 'cvoteservice.update - invalid current user'
    }

    if (!this.canManageProposal()) {
      throw 'cvoteservice.update - not council'
    }

    const cur = await db_cvote.findOne({ _id })
    if (!cur) {
      throw 'cvoteservice.update - invalid proposal id'
    }

    const doc: any = {
      contentType: constant.CONTENT_TYPE.MARKDOWN
    }

    if (title) doc.title = title
    if (type) doc.type = type
    if (abstract) doc.abstract = abstract
    if (goal) doc.goal = goal
    if (motivation) doc.motivation = motivation
    if (relevance) doc.relevance = relevance
    if (budget) {
      doc.budget = budget
    }
    if (plan) doc.plan = plan
    if (payment) doc.payment = payment

    try {
      await db_cvote.update({ _id }, doc)
      const res = await this.getById(_id)
      return res
    } catch (error) {
      logger.error(error)
      return
    }
  }

  // delete draft proposal by proposal id
  public async deleteDraft(param: any): Promise<any> {
    try {
      const db_cvote = this.getDBModel('CVote')
      const { _id } = param
      const doc = await db_cvote.findOne({ _id })
      if (!doc) {
        throw 'cvoteservice.deleteDraft - invalid proposal id'
      }
      if (doc.status !== constant.CVOTE_STATUS.DRAFT) {
        throw 'cvoteservice.deleteDraft - not draft proposal'
      }
      return await db_cvote.remove({ _id })
    } catch (error) {
      logger.error(error)
    }
  }

  public async create(param): Promise<Document> {
    const db_cvote = this.getDBModel('CVote')
    const db_user = this.getDBModel('User')
    const db_suggestion = this.getDBModel('Suggestion')
    const {
      title,
      published,
      proposedBy,
      proposer,
      suggestionId,
      abstract,
      goal,
      motivation,
      relevance,
      budget,
      plan,
      payment
    } = param

    const vid = await this.getNewVid()
    const status = published
      ? constant.CVOTE_STATUS.PROPOSED
      : constant.CVOTE_STATUS.DRAFT

    const doc: any = {
      title,
      vid,
      status,
      published,
      contentType: constant.CONTENT_TYPE.MARKDOWN,
      proposedBy,
      abstract,
      goal,
      motivation,
      relevance,
      budget,
      plan,
      payment,
      proposer,
      createdBy: this.currentUser._id
    }

    const suggestion =
      suggestionId && (await db_suggestion.findById(suggestionId))
    if (!_.isEmpty(suggestion)) {
      doc.reference = suggestionId
    }

    const councilMembers = await db_user.find({
      role: constant.USER_ROLE.COUNCIL
    })
    const voteResult = []
    if (published) {
      doc.proposedAt = Date.now()
      _.each(councilMembers, (user) =>
        voteResult.push({
          votedBy: user._id,
          value: constant.CVOTE_RESULT.UNDECIDED
        })
      )
      doc.voteResult = voteResult
      doc.voteHistory = voteResult
    }

    try {
      const res = await db_cvote.save(doc)
      // add reference with suggestion
      if (!_.isEmpty(suggestion)) {
        await db_suggestion.update(
          { _id: suggestionId },
          { $addToSet: { reference: res._id } }
        )
        // notify creator and subscribers
        if (published) this.notifySubscribers(res)
      }

      // notify council member to vote
      if (published) this.notifyCouncil(res)

      return res
    } catch (error) {
      logger.error(error)
      return
    }
  }

  private async notifySubscribers(cvote: any) {
    const db_suggestion = this.getDBModel('Suggestion')
    const suggestionId = _.get(cvote, 'reference')
    if (!suggestionId) return
    const suggestion = await db_suggestion
      .getDBInstance()
      .findById(suggestionId)
      .populate('subscribers.user', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL)
      .populate('createdBy', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL)

    const councilMember = await this.getDBModel('User').findById(
      cvote.createdBy
    )

    // get users: creator and subscribers
    const toUsers = _.map(suggestion.subscribers, 'user') || []
    toUsers.push(suggestion.createdBy)
    const toMails = _.map(toUsers, 'email')

    // compose email object
    const subject = `The suggestion is referred in Proposal #${cvote.vid}`
    const body = `
      <p>Council member ${userUtil.formatUsername(
        councilMember
      )} has refer to your suggestion ${suggestion.title} in a proposal #${
      cvote.vid
    }.</p>
      <br />
      <p>Click this link to view more details:</p>
      <p><a href="${process.env.SERVER_URL}/proposals/${cvote._id}">${
      process.env.SERVER_URL
    }/proposals/${cvote._id}</a></p>
      <br /> <br />
      <p>Thanks</p>
      <p>Cyber Republic</p>
    `
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
      // toName: ownerToName,
      subject,
      body,
      recVariables
    }

    // send email
    mail.send(mailObj)
  }

  private async notifyCouncil(cvote: any) {
    const db_user = this.getDBModel('User')
    const currentUserId = _.get(this.currentUser, '_id')
    const councilMembers = await db_user.find({
      role: constant.USER_ROLE.COUNCIL
    })
    const toUsers = _.filter(
      councilMembers,
      (user) => !user._id.equals(currentUserId)
    )
    const toMails = _.map(toUsers, 'email')

    const subject = `New Proposal: ${cvote.title}`
    const body = `
      <p>There is a new proposal added:</p>
      <br />
      <p>${cvote.title}</p>
      <br />
      <p>Click this link to view more details: <a href="${process.env.SERVER_URL}/proposals/${cvote._id}">${process.env.SERVER_URL}/proposals/${cvote._id}</a></p>
      <br /> <br />
      <p>Thanks</p>
      <p>Cyber Republic</p>
    `

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
      // toName: ownerToName,
      subject,
      body,
      recVariables
    }

    mail.send(mailObj)
  }

  public async notifyCouncilToVote(DateTime: any) {
    // find cvote before 1 day expiration without vote yet for each council member
    const db_cvote = this.getDBModel('CVote')
    let startHeight = process.env.NODE_ENV == 'staging' ? 17 : 2160
    let endHeight = process.env.NODE_ENV == 'staging' ? 16 : 2150
    const isOneDay = DateTime == constant.ONE_DAY
    if (isOneDay) {
      startHeight = process.env.NODE_ENV == 'staging' ? 5 : 720
      endHeight = process.env.NODE_ENV == 'staging' ? 4 : 710
    }
    let unvotedCVotes = await db_cvote
      .getDBInstance()
      .find({
        status: constant.CVOTE_STATUS.PROPOSED,
        'voteResult.value': constant.CVOTE_RESULT.UNDECIDED,
        old: {
          $exists: false
        }
      })
      .populate(
        'voteResult.votedBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL
      )
    const currentHeight = await ela.height()
    unvotedCVotes = _.filter(unvotedCVotes, (o: any) => {
      const lastHeight = o.proposedEndsHeight - currentHeight
      if (lastHeight >= endHeight && lastHeight <= startHeight) {
        return o
      }
    })
    if (isOneDay) {
      unvotedCVotes = _.filter(unvotedCVotes, ['notifiedOneDay', false])
    } else {
      unvotedCVotes = _.filter(unvotedCVotes, ['notified', false])
    }
    const cvoteIds = []
    const promptTime = isOneDay ? '24 hours' : '3 days'
    _.each(unvotedCVotes, (cvote) => {
      _.each(cvote.voteResult, (result) => {
        if (result.value === constant.CVOTE_RESULT.UNDECIDED) {
          // send email to council member to notify to vote
          const { title, _id } = cvote
          const subject = `Proposal Vote Reminder: ${title}`
          const body = `
            <p>You have ${promptTime} to vote this proposal:</p>
            <br />
            <p>${title}</p>
            <br />
            <p>Click this link to vote: <a href="${process.env.SERVER_URL}/proposals/${_id}">${process.env.SERVER_URL}/proposals/${_id}</a></p>
            <br /> <br />
            <p>Thanks</p>
            <p>Cyber Republic</p>
          `
          const mailObj = {
            to: result.votedBy.email,
            toName: userUtil.formatUsername(result.votedBy),
            subject,
            body
          }
          mail.send(mailObj)

          // update notified to true
          cvoteIds.push(cvote._id)
        }
      })
    })
    if (isOneDay) {
      await db_cvote.update(
        { _id: { $in: cvoteIds } },
        { $set: { notifiedOneDay: true } }
      )
    } else {
      await db_cvote.update(
        { _id: { $in: cvoteIds } },
        { $set: { notified: true } }
      )
    }
  }

  /**
   * List proposals, only an admin may request and view private records
   *
   * We expect the front-end to always call with {published: true}
   *
   * TODO: what's the rest way of encoding multiple values for a field?
   *
   * Instead of magic params, we should have just different endpoints I think,
   * this method should be as dumb as possible
   *
   * @param query
   * @returns {Promise<"mongoose".Document>}
   */
  public async list(param): Promise<Object> {
    const db_cvote = this.getDBModel('CVote')
    const db_config = this.getDBModel('Config')
    const currentUserId = _.get(this.currentUser, '_id')
    const userRole = _.get(this.currentUser, 'role')
    const query: any = {}
    if (!param.published) {
      if (!this.isLoggedIn() || !this.canManageProposal()) {
        throw 'cvoteservice.list - unpublished proposals only visible to council/secretary'
      } else if (
        param.voteResult === constant.CVOTE_RESULT.UNDECIDED &&
        permissions.isCouncil(userRole)
      ) {
        // get unvoted by current council
        query.voteResult = {
          $elemMatch: {
            value: constant.CVOTE_RESULT.UNDECIDED,
            votedBy: currentUserId
          }
        }
        query.published = true
        query.status = constant.CVOTE_STATUS.PROPOSED
      }
    } else {
      query.published = param.published
    }
    // createBy
    if (param.author && param.author.length) {
      query.proposer = param.author
    }
    // cvoteType
    if (
      param.type &&
      _.indexOf(_.values(constant.CVOTE_TYPE), param.type) >= 0
    ) {
      query.type = param.type
    }
    // startDate <  endDate
    if (
      param.startDate &&
      param.startDate.length &&
      param.endDate &&
      param.endDate.length
    ) {
      let endDate = new Date(param.endDate)
      endDate.setDate(endDate.getDate() + 1)
      query.createdAt = {
        $gte: new Date(param.startDate),
        $lte: endDate
      }
    }
    // Ends in times - 7day = startDate <  endDate
    if (
      param.endsInStartDate &&
      param.endsInStartDate.length &&
      param.endsInEndDate &&
      param.endsInEndDate.length
    ) {
      let endDate = new Date(
        new Date(param.endsInEndDate).getTime() - 7 * 24 * 3600 * 1000
      )
      endDate.setDate(endDate.getDate() + 1)
      query.createdAt = {
        $gte: new Date(
          new Date(param.endsInStartDate).getTime() - 7 * 24 * 3600 * 1000
        ),
        $lte: endDate
      }
      query.status = {
        $in: [
          constant.CVOTE_STATUS.PROPOSED,
          constant.CVOTE_STATUS.ACTIVE,
          constant.CVOTE_STATUS.REJECT,
          constant.CVOTE_STATUS.NOTIFICATION,
          constant.CVOTE_STATUS.FINAL,
          constant.CVOTE_STATUS.DEFERRED,
          constant.CVOTE_STATUS.INCOMPLETED
        ]
      }
    }
    // status
    if (param.status && constant.CVOTE_STATUS[param.status]) {
      query.status = param.status
    }
    // old data
    if (!param.old) {
      query.old = { $exists: false }
    }
    if (param.old) {
      query.old = true
    }
    // budget
    if (param.budgetLow || param.budgetHigh) {
      query.budgetAmount = {}
      if (param.budgetLow && param.budgetLow.length) {
        query.budgetAmount['$gte'] = parseInt(param.budgetLow)
      }
      if (param.budgetHigh && param.budgetHigh.length) {
        query.budgetAmount['$lte'] = parseInt(param.budgetHigh)
      }
    }
    // has tracking
    if (param.hasTracking) {
      const db_cvote_tracking = this.getDBModel('CVote_Tracking')
      const hasTracking = await db_cvote_tracking.find(
        {
          status: constant.CVOTE_TRACKING_STATUS.REVIEWING
        },
        'proposalId'
      )
      let trackingProposals = []
      hasTracking.map(function (it) {
        trackingProposals.push(it.proposalId)
      })
      query._id = {
        $in: trackingProposals
      }
    }

    if (param.$or) query.$or = param.$or
    const fields = [
      'vid',
      'title',
      'type',
      'proposedBy',
      'status',
      'published',
      'proposedAt',
      'createdAt',
      'voteResult',
      'voteHistory',
      'vote_map',
      'registerHeight',
      'proposedEndsHeight',
      'notificationEndsHeight',
      'rejectAmount',
      'rejectThroughAmount'
    ]

    // const list = await db_cvote.list(query, { vid: -1 }, 0, fields.join(' '))

    const cursor = db_cvote
      .getDBInstance()
      .find(query, fields.join(' '))
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .sort({ vid: -1 })

    if (param.results) {
      const results = parseInt(param.results, 10)
      const page = parseInt(param.page, 10)
      cursor.skip(results * (page - 1)).limit(results)
    }

    const { currentHeight } = await db_config.getDBInstance().findOne()
    const rs = await Promise.all([
      cursor,
      db_cvote.getDBInstance().find(query).count()
    ])

    const db_cvote_history = this.getDBModel('CVote_Vote_History')
    const list = _.map(rs[0], async (o: any) => {
      let proposedEnds = (o.proposedEndsHeight - currentHeight) * 2
      let notificationEnds = (o.notificationEndsHeight - currentHeight) * 2
      if (process.env.NODE_ENV === 'staging') {
        proposedEnds = (o.proposedEndsHeight - currentHeight) * 252
        notificationEnds = (o.notificationEndsHeight - currentHeight) * 252
      }
      const voteHistory = await db_cvote_history
        .getDBInstance()
        .find({ proposalBy: o._id })
      const data = {
        ...o._doc,
        proposedEnds,
        notificationEnds
      }
      if (voteHistory && voteHistory.length) {
        data.voteHistory = voteHistory
      }
      return data
    })
    const listResult = await Promise.all(list)
    const total = rs[1]
    return { list: listResult, total }
  }

  /**
   *
   * @param param
   * @returns {Promise<"mongoose".Document>}
   */
  public async update(param): Promise<Document> {
    const db_user = this.getDBModel('User')
    const db_cvote = this.getDBModel('CVote')
    const {
      _id,
      published,
      notes,
      title,
      abstract,
      goal,
      motivation,
      relevance,
      budget,
      plan
    } = param

    if (!this.currentUser || !this.currentUser._id) {
      throw 'cvoteservice.update - invalid current user'
    }

    if (!this.canManageProposal()) {
      throw 'cvoteservice.update - not council'
    }

    const cur = await db_cvote.findOne({ _id })
    if (!cur) {
      throw 'cvoteservice.update - invalid proposal id'
    }

    const doc: any = {
      contentType: constant.CONTENT_TYPE.MARKDOWN
    }
    const willChangeToPublish =
      published === true && cur.status === constant.CVOTE_STATUS.DRAFT

    if (title) doc.title = title
    if (abstract) doc.abstract = abstract
    if (goal) doc.goal = goal
    if (motivation) doc.motivation = motivation
    if (relevance) doc.relevance = relevance
    if (budget) {
      doc.budget = budget
    }
    if (plan) doc.plan = plan

    if (willChangeToPublish) {
      doc.status = constant.CVOTE_STATUS.PROPOSED
      doc.published = published
      doc.proposedAt = Date.now()
      const councilMembers = await db_user.find({
        role: constant.USER_ROLE.COUNCIL
      })
      const voteResult = []
      _.each(councilMembers, (user) =>
        voteResult.push({
          votedBy: user._id,
          value: constant.CVOTE_RESULT.UNDECIDED
        })
      )
      doc.voteResult = voteResult
      doc.voteHistory = voteResult
    }

    // always allow secretary to edit notes
    if (notes) doc.notes = notes
    try {
      await db_cvote.update({ _id }, doc)
      const res = await this.getById(_id)
      if (willChangeToPublish) {
        this.notifyCouncil(res)
        this.notifySubscribers(res)
      }
      return res
    } catch (error) {
      logger.error(error)
      return
    }
  }

  public async finishById(id): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const cur = await db_cvote.findOne({ _id: id })
    if (!cur) {
      throw 'invalid proposal id'
    }
    if (!this.canManageProposal()) {
      throw 'cvoteservice.finishById - not council'
    }
    if (_.includes([constant.CVOTE_STATUS.FINAL], cur.status)) {
      throw 'proposal already completed.'
    }

    const rs = await db_cvote.update(
      { _id: id },
      {
        $set: {
          status: constant.CVOTE_STATUS.FINAL
        }
      }
    )

    return rs
  }

  public async unfinishById(id): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const cur = await db_cvote.findOne({ _id: id })
    if (!cur) {
      throw 'invalid proposal id'
    }
    if (!this.canManageProposal()) {
      throw 'cvoteservice.unfinishById - not council'
    }
    if (
      _.includes(
        [constant.CVOTE_STATUS.FINAL, constant.CVOTE_STATUS.INCOMPLETED],
        cur.status
      )
    ) {
      throw 'proposal already completed.'
    }

    const rs = await db_cvote.update(
      { _id: id },
      {
        $set: {
          status: constant.CVOTE_STATUS.INCOMPLETED
        }
      }
    )

    return rs
  }

  public async updateProposalBudget() {
    const { MILESTONE_STATUS, SUGGESTION_BUDGET_TYPE, CVOTE_STATUS } = constant
    const db_cvote = this.getDBModel('CVote')
    const query = {
      old: { $exists: false },
      $or: [
        { status: CVOTE_STATUS.ACTIVE },
        {
          status: CVOTE_STATUS.FINAL,
          budget: {
            $elemMatch: {
              type: SUGGESTION_BUDGET_TYPE.COMPLETION,
              status: { $ne: MILESTONE_STATUS.WITHDRAWN }
            }
          }
        },
        {
          status: CVOTE_STATUS.TERMINATED,
          budget: {
            $elemMatch: {
              status: MILESTONE_STATUS.WAITING_FOR_WITHDRAWAL
            }
          }
        }
      ]
    }
    const proposals = await db_cvote.find(query)
    if (!proposals.length) {
      return
    }
    console.log('upb---proposal length---', proposals.length)
    const arr = []
    for (const proposal of proposals) {
      arr.push(this.updateMilestoneStatus(proposal))
    }
    await Promise.all(arr)
  }

  private async updateMilestoneStatus(proposal) {
    const {
      WITHDRAWN,
      WAITING_FOR_WITHDRAWAL,
      REJECTED,
      WAITING_FOR_APPROVAL
    } = constant.MILESTONE_STATUS
    const result = await getProposalData(proposal.proposalHash)
    if (!result) {
      return
    }
    let isStatusUpdated = false
    const status = _.get(result, 'status')
    if (status && status.toLowerCase() === 'finished') {
      proposal.status = constant.CVOTE_STATUS.FINAL
      isStatusUpdated = true
    }
    const budgets = _.get(result, 'data.proposal.budgets')
    let isBudgetUpdated = false
    if (budgets) {
      const budget =
        proposal.budget &&
        proposal.budget.map((item, index) => {
          const chainStatus = budgets[index].status.toLowerCase()
          if (
            chainStatus === 'withdrawn' &&
            item.status === WAITING_FOR_WITHDRAWAL
          ) {
            isBudgetUpdated = true
            return { ...item, status: WITHDRAWN }
          }
          if (
            chainStatus === 'rejected' &&
            item.status === WAITING_FOR_APPROVAL
          ) {
            isBudgetUpdated = true
            this.notifyProposalOwner(
              proposal.proposer,
              this.rejectedMailTemplate(proposal.vid)
            )
            return { ...item, status: REJECTED }
          }
          if (
            chainStatus === 'withdrawable' &&
            item.status === WAITING_FOR_APPROVAL
          ) {
            isBudgetUpdated = true
            this.notifyProposalOwner(
              proposal.proposer,
              this.approvalMailTemplate(proposal.vid)
            )
            return { ...item, status: WAITING_FOR_WITHDRAWAL }
          }
          return item
        })
      if (isBudgetUpdated && budget) {
        proposal.budget = budget
      }
    }
    if (isStatusUpdated || isBudgetUpdated) {
      console.log('ums---save proposal.vid---', proposal.vid)
      await proposal.save()
    }
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

  public async getNewVid() {
    const db_cvote = this.getDBModel('CVote')
    // new version, vid string from 1
    const n = await db_cvote.count({ old: { $exists: false } })
    return n + 1
  }

  public isExpired(data: any, extraTime = 0): Boolean {
    const ct = moment(data.proposedAt || data.createdAt).valueOf()
    if (Date.now() - ct - extraTime > constant.CVOTE_EXPIRATION) {
      return true
    }
    return false
  }

  public isCouncilExpired(data: any, extraTime = 0): Boolean {
    const ct = moment(data.proposedAt || data.createdAt).valueOf()
    if (Date.now() - ct - extraTime > constant.CVOTE_COUNCIL_EXPIRATION) {
      return true
    }
    return false
  }

  // proposal publicity
  public async isNotification(data): Promise<any> {
    const voteRejectAmount = data.votersrejectamount
    const registerHeight = data.registerheight
    const proportion = voteRejectAmount / registerHeight
    return proportion < 0.1
  }

  // proposal active/passed
  public isActive(data): Boolean {
    const supportNum =
      _.countBy(data.voteResult, 'value')[constant.CVOTE_RESULT.SUPPORT] || 0
    return supportNum > data.voteResult.length * 0.5
  }

  // proposal rejected
  public isRejected(data): Boolean {
    const rejectNum =
      _.countBy(data.voteResult, 'value')[constant.CVOTE_RESULT.REJECT] || 0
    return rejectNum > data.voteResult.length * 0.5
  }

  // for full-text to chain
  private async getOpinionHash(
    reason: string,
    proposalId: string,
    proposalHash: string,
    votedBy: string
  ) {
    const rs = await getOpinionHash(reason)
    if (rs && rs.error) {
      return { error: rs.error }
    }
    if (rs && rs.content && rs.opinionHash) {
      const zipFileModel = this.getDBModel('Council_Member_Opinion_Zip_File')
      await zipFileModel.save({
        proposalId,
        opinionHash: rs.opinionHash,
        content: rs.content,
        proposalHash,
        votedBy
      })
      return { opinionHash: rs.opinionHash }
    }
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

    const opinionHashObj = await this.getOpinionHash(
      reason,
      cur._id,
      cur.proposalHash,
      votedBy
    )
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
          'voteResult.$.reasonHash': reasonHash || opinionHashObj.opinionHash,
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

  public async updateNote(param): Promise<Document> {
    const db_cvote = this.getDBModel('CVote')
    const { _id, notes } = param

    const cur = await db_cvote.findOne({ _id })
    if (!cur) {
      throw 'invalid proposal id'
    }
    if (!this.canManageProposal()) {
      throw 'cvoteservice.updateNote - not council'
    }
    if (this.currentUser.role !== constant.USER_ROLE.SECRETARY) {
      throw 'only secretary could update notes'
    }

    const rs = await db_cvote.update(
      { _id },
      {
        $set: {
          notes: notes || ''
        }
      }
    )

    return await this.getById(_id)
  }

  public async cronJob() {
    if (tm) {
      return false
    }
    tm = setInterval(async () => {
      console.log('---------------- start cvote cronjob -------------')
      await this.pollProposal()

      // poll proposal status in chain
      // await this.pollProposalStatus()
      // council vote status in registered
      // await this.pollCouncilVoteStatus()
      // member vote status in agreed
      // await this.pollVotersRejectAmount()
    }, 1000 * 60 * 2)
  }

  private canManageProposal() {
    const userRole = _.get(this.currentUser, 'role')
    return permissions.isCouncil(userRole) || permissions.isSecretary(userRole)
  }

  private canCreateProposal() {
    const userRole = _.get(this.currentUser, 'role')
    return (
      !permissions.isCouncil(userRole) && !permissions.isSecretary(userRole)
    )
  }

  public async listcrcandidates(param: { state: string }) {
    const { state } = param
    const crRelatedStageStatus = await ela.getCrrelatedStage()
    if (_.isEmpty(crRelatedStageStatus)) return

    const { invoting } = crRelatedStageStatus
    if (!invoting) return

    const candidatesList = await ela.currentCandidates(state)
    if (
      _.isEmpty(candidatesList) ||
      _.isEmpty(candidatesList.crcandidatesinfo)
    ) {
      return
    }

    const candidates = candidatesList.crcandidatesinfo.map((el) => {
      el.votes = _.toNumber(el.votes)
      return el
    })

    return {
      crcandidatesinfo: candidates,
      totalvotes: _.toNumber(candidatesList.totalvotes),
      totalcounts: candidatesList.totalcounts
    }
  }

  // council vote onchain
  public async onchain(param) {
    try {
      const did = _.get(this.currentUser, 'did.id')
      if (!did) {
        return { success: false, message: 'Your DID not bound.' }
      }
      const db_cvote = this.getDBModel('CVote')
      const userId = _.get(this.currentUser, '_id')
      const { id } = param

      const councilMemberDid = _.get(this.currentUser, 'did.id')
      if (!councilMemberDid) {
        return { success: false, message: 'this is not did' }
      }

      const role = _.get(this.currentUser, 'role')
      if (!permissions.isCouncil(role)) {
        return { success: false, message: 'member is no council' }
      }

      const cur = await db_cvote.findOne({ _id: id })
      if (!cur) {
        return { success: false, message: 'not find proposal' }
      }

      const currentVoteResult: any = _.filter(cur.voteResult, (o: any) =>
        userId.equals(o.votedBy)
      )[0]

      const voteResultOnChain = {
        [constant.CVOTE_RESULT.SUPPORT]: 'approve',
        [constant.CVOTE_RESULT.REJECT]: 'reject',
        [constant.CVOTE_RESULT.ABSTENTION]: 'abstain'
      }

      const now = Math.floor(Date.now() / 1000)

      const jwtClaims = {
        iat: now,
        exp: now + 60 * 60 * 24,
        iss: process.env.APP_DID,
        command: 'reviewproposal',
        data: {
          userdid: did,
          proposalHash: cur.proposalHash,
          voteResult: voteResultOnChain[currentVoteResult.value],
          opinionHash: currentVoteResult.reasonHash,
          did: councilMemberDid
        }
      }

      const jwtToken = jwt.sign(
        JSON.stringify(jwtClaims),
        process.env.APP_PRIVATE_KEY,
        {
          algorithm: 'ES256'
        }
      )
      const oldUrl = constant.oldProposalJwtPrefix + jwtToken
      const url = constant.proposalJwtPrefix + jwtToken
      return { success: true, url, oldUrl }
    } catch (err) {
      logger.error(err)
      return { success: false }
    }
  }

  public async checkSignature(param: any) {
    const { id } = param
    const db_cvote = this.getDBModel('CVote')
    const userId = _.get(this.currentUser, '_id')
    const proposal = await db_cvote
      .getDBInstance()
      .findOne({ _id: id })
      .populate(
        'voteResult.votedBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_AVATAR
      )
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .populate('createdBy', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)
      .populate('reference', constant.DB_SELECTED_FIELDS.SUGGESTION.ID)
      .populate('referenceElip', 'vid')
    if (proposal) {
      const voteResult = _.filter(proposal.voteResult, (o: any) =>
        userId.equals(o.votedBy._id)
      )[0]
      if (voteResult) {
        const signature = _.get(voteResult, 'signature.data')
        if (signature) {
          return { success: true, data: proposal }
        }
        const message = _.get(voteResult, 'signature.message')
        if (message) {
          return { success: false, message }
        }
      }
    } else {
      return { success: false }
    }
  }

  // update proposal information on the chain
  public async pollProposal() {
    const db_cvote = this.getDBModel('CVote')
    const db_config = this.getDBModel('Config')
    let currentHeight = await ela.height()
    const list = await db_cvote
      .getDBInstance()
      .find({
        proposalHash: { $exists: true },
        status: {
          $in: [
            constant.CVOTE_STATUS.PROPOSED,
            constant.CVOTE_STATUS.NOTIFICATION,
            constant.CVOTE_STATUS.ACTIVE
          ]
        }
      })
      .sort({ vid: 1 })

    let tempCurrentHeight = 0
    let compareHeight = 0
    let heightProposed = 0
    let heightNotification = 0
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }
    // prettier-ignore
    const rejectThroughAmount: any = (await ela.currentCirculatingSupply()) * 0.1
    await asyncForEach(list, async (o: any) => {
      const { proposalHash, status } = o._doc
      const rs: any = await getProposalData(proposalHash)
      if (!rs || rs.success === false) {
        return
      }
      switch (status) {
        case constant.CVOTE_STATUS.PROPOSED:
          heightProposed = await this.updateProposalOnProposed({
            rs,
            _id: o._id,
            status
          })
          break
        case constant.CVOTE_STATUS.ACTIVE:
          heightProposed = await this.updateProposalOnProposed({
            rs,
            _id: o._id,
            status
          })
          break
        case constant.CVOTE_STATUS.NOTIFICATION:
          heightNotification = await this.updateProposalOnNotification({
            rs,
            _id: o._id,
            rejectThroughAmount
          })
          break
      }
      compareHeight =
        heightProposed > heightNotification
          ? heightProposed
          : heightNotification
      tempCurrentHeight =
        compareHeight > tempCurrentHeight ? compareHeight : tempCurrentHeight
    })
    const currentConfig = await db_config.getDBInstance().findOne()
    if (
      tempCurrentHeight !== 0 &&
      tempCurrentHeight > currentConfig.currentHeight
    ) {
      currentHeight = tempCurrentHeight
    }
    await db_config
      .getDBInstance()
      .update({ _id: currentConfig._id }, { $set: { currentHeight } })
  }

  public async updateProposalOnProposed(data: any) {
    const { rs, _id, status } = data
    const db_cvote = this.getDBModel('CVote')
    const { status: chainStatus } = rs
    const currentStatus = CHAIN_STATUS_TO_PROPOSAL_STATUS[chainStatus]
    const proposal = await db_cvote.findById(_id)
    if (status !== currentStatus) {
      await db_cvote.update(
        {
          _id
        },
        {
          status: currentStatus
        }
      )
      this.notifyProposer(proposal, currentStatus, 'council')
      return rs.data.registerheight + STAGE_BLOCKS
    }
  }

  public async updateProposalOnNotification(data: any) {
    const { WAITING_FOR_WITHDRAWAL, WAITING_FOR_REQUEST } =
      constant.MILESTONE_STATUS
    const db_cvote = this.getDBModel('CVote')
    const { rs, _id } = data
    let { rejectThroughAmount } = data
    const {
      data: { votersrejectamount: rejectAmount },
      status: chainStatus
    } = rs

    const proposalStatus = CHAIN_STATUS_TO_PROPOSAL_STATUS[chainStatus]
    const proposal = await db_cvote.findById(_id)

    if (proposal.type === constant.CVOTE_TYPE.CHANGE_SECRETARY) {
      console.log(`proposal to change secretary status...`, proposal.status)
      console.log(`proposal to change secretary vid...`, proposal.vid)
      const db_secretariat = this.getDBModel('Secretariat')
      const secretary = await db_secretariat.findOne({
        proposal: _id
      })
      if (secretary) return

      const newSecretaryDID = DID_PREFIX + proposal.newSecretaryDID
      const db_user = this.getDBModel('User')
      const newSecretaryAccount = await db_user.findOne({
        'did.id': newSecretaryDID
      })

      const currentSecretary = await db_secretariat.findOne({
        status: constant.SECRETARIAT_STATUS.CURRENT
      })
      let information: any = {}
      let didName = ''
      const rs = await Promise.all([
        getInformationByDid(newSecretaryDID),
        getDidName(newSecretaryDID)
      ])
      if (rs) {
        information = rs[0]
        didName = rs[1]
      }
      const startDate = new Date()
      const doc: any = _.pickBy(
        {
          ...information,
          user: newSecretaryAccount._id,
          did: proposal.newSecretaryDID,
          didName,
          startDate,
          status: constant.SECRETARIAT_STATUS.CURRENT,
          publicKey: newSecretaryAccount.did.publicKey,
          term: currentSecretary.term + 1,
          proposal: proposal._id
        },
        _.identity
      )
      const oldSecretaryDID = DID_PREFIX + currentSecretary.did

      await Promise.all([
        db_user.update(
          { 'did.id': oldSecretaryDID },
          { role: constant.USER_ROLE.MEMBER }
        ),
        db_user.update(
          { 'did.id': newSecretaryDID },
          { role: constant.USER_ROLE.SECRETARY }
        ),
        db_secretariat.update(
          {
            did: currentSecretary.did,
            status: constant.SECRETARIAT_STATUS.CURRENT
          },
          {
            status: constant.SECRETARIAT_STATUS.NON_CURRENT,
            endDate: startDate
          }
        ),
        db_secretariat.getDBInstance().create(doc)
      ])
    }

    if (proposal.type === constant.CVOTE_TYPE.TERMINATE_PROPOSAL) {
      await db_cvote.update(
        {
          vid: proposal.closeProposalNum,
          old: { $exists: false }
        },
        {
          status: constant.CVOTE_STATUS.TERMINATED,
          terminatedBy: { vid: proposal.vid, id: proposal._id }
        }
      )
    }
    if (proposal.type === constant.CVOTE_TYPE.CHANGE_PROPOSAL) {
      const db_user = this.getDBModel('User')
      const setDoc: any = {}
      if (proposal.newOwnerDID) {
        const newOwner = await db_user.findOne({
          'did.id': DID_PREFIX + proposal.newOwnerDID
        })
        setDoc.proposer = newOwner._id
        setDoc.proposedBy = userUtil.formatUsername(newOwner)
        setDoc.ownerPublicKey = _.get(newOwner, 'did.compressedPublicKey')
      }
      if (proposal.newAddress) {
        setDoc.elaAddress = proposal.newAddress
      }
      await db_cvote.update(
        {
          vid: proposal.targetProposalNum,
          old: { $exists: false }
        },
        {
          $set: setDoc,
          $push: { changedBy: { vid: proposal.vid, id: proposal._id } }
        }
      )
    }
    if (proposalStatus === constant.CVOTE_STATUS.ACTIVE) {
      const budget = !_.isEmpty(proposal.budget)
        ? proposal.budget.map((item: any) => {
            if (item.type === 'ADVANCE') {
              return { ...item, status: WAITING_FOR_WITHDRAWAL }
            } else {
              return { ...item, status: WAITING_FOR_REQUEST }
            }
          })
        : null
      const updateStatus = await db_cvote.update(
        {
          _id
        },
        {
          $set: {
            budget,
            status: proposalStatus,
            rejectAmount,
            rejectThroughAmount
          }
        }
      )
      if (updateStatus && updateStatus.nModified == 1) {
        this.notifyProposer(proposal, proposalStatus, 'community')
        return rs.data.registerheight + STAGE_BLOCKS * 2
      }
    }

    const updateStatus = await db_cvote.update(
      {
        _id
      },
      {
        status: proposalStatus,
        rejectAmount,
        rejectThroughAmount
      }
    )
    if (proposalStatus !== proposal.status && updateStatus.nModified == 1) {
      this.notifyProposer(proposal, proposalStatus, 'community')
      return rs.data.registerheight + STAGE_BLOCKS * 2
    }
  }

  // member vote against
  public async memberVote(param): Promise<any> {
    try {
      const db_cvote = this.getDBModel('CVote')
      const { id } = param

      const cur = await db_cvote.findOne({ _id: id })

      const now = Math.floor(Date.now() / 1000)
      const jwtClaims = {
        iat: now,
        exp: now + 60 * 60 * 24,
        iss: process.env.APP_DID,
        command: 'voteforproposal',
        data: {
          id: cur.vid,
          proposalHash: cur.proposalHash
        }
      }

      const jwtToken = jwt.sign(jwtClaims, process.env.APP_PRIVATE_KEY, {
        algorithm: 'ES256'
      })
      const oldUrl = constant.oldProposalJwtPrefix + jwtToken
      const url = constant.proposalJwtPrefix + jwtToken
      return { success: true, url, oldUrl }
    } catch (err) {
      logger.error(err)
      return { success: false }
    }
  }

  // member vote callback
  public async memberCallback(param): Promise<any> {
    return
  }

  /**
   * API to Wallet
   */
  public async allOrSearch(param): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const db_config = this.getDBModel('Config')
    const query: any = {}

    if (
      !param.status ||
      !_.keys(WALLET_STATUS_TO_CVOTE_STATUS).includes(param.status)
    ) {
      return {
        code: 400,
        message: 'Invalid request parameters - status',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }

    // status
    query.status = WALLET_STATUS_TO_CVOTE_STATUS[param.status]

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
      'rejectThroughAmount'
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
    // filter return data，add proposalHash to CVoteSchema
    const list = _.map(rs[0], function (o) {
      let temp = _.omit(o._doc, [
        '_id',
        'proposer',
        'type',
        'rejectAmount',
        'proposedEndsHeight',
        'notificationEndsHeight',
        'rejectThroughAmount'
      ])
      temp.proposedBy = _.get(o, 'proposer.did.didName')
      temp.status = CVOTE_STATUS_TO_WALLET_STATUS[temp.status]
      if ([constant.CVOTE_STATUS.PROPOSED].includes(o.status)) {
        temp.voteEndsIn = _.toNumber(
          (o.proposedEndsHeight - rs[2]) * 2 * 60
        ).toFixed()
      }
      if (
        [constant.CVOTE_STATUS.NOTIFICATION].includes(o.status) &&
        o.rejectAmount >= 0 &&
        o.rejectThroughAmount > 0
      ) {
        temp.voteEndsIn = _.toNumber(
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
      return _.mapKeys(temp, function (value, key) {
        if (key == 'vid') {
          return 'id'
        } else {
          return key
        }
      })
    })

    const total = rs[1]
    return { list, total }
  }

  public async getProposalById(data: any): Promise<any> {
    const db_cvote = this.getDBModel('CVote')
    const db_cvote_history = this.getDBModel('CVote_Vote_History')
    const { id } = data

    const fields = [
      'vid',
      'title',
      'status',
      'type',
      'abstract',
      'voteResult',
      'createdAt',
      'proposalHash',
      'rejectAmount',
      'rejectThroughAmount',
      'proposedEndsHeight',
      'notificationEndsHeight',
      'targetProposalNum',
      'newOwnerDID',
      'newAddress',
      'newSecretaryDID',
      'closeProposalNum',
      'budget'
    ]
    const isNumber = /^\d*$/.test(id)
    let query: any
    if (isNumber) {
      query = { vid: parseInt(id), old: { $exists: false } }
    } else {
      query = { proposalHash: id, old: { $exists: false } }
    }

    const proposal = await db_cvote
      .getDBInstance()
      .findOne(query, fields.join(' '))
      .populate(
        'voteResult.votedBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID
      )

    if (!proposal) {
      return {
        code: 400,
        message: 'Invalid request parameters',
        // tslint:disable-next-line:no-null-keyword
        data: null
      }
    }

    const address = `${process.env.SERVER_URL}/proposals/${proposal.id}`

    const proposalId = proposal._id
    const targetNum = proposal.targetProposalNum || proposal.closeProposalNum
    let targetProposal: any
    if (targetNum) {
      targetProposal = await db_cvote
        .getDBInstance()
        .findOne({ vid: parseInt(targetNum), old: { $exists: false } })
    }

    const voteResultFields = ['value', 'reason', 'votedBy', 'avatar']
    const cvoteHistory = await db_cvote_history
      .getDBInstance()
      .find({ proposalBy: proposalId })
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
        return _.pick(
          {
            ...result,
            votedBy: _.get(result, 'votedBy.did.didName'),
            avatar: _.get(result, 'votedBy.did.avatar')
          },
          voteResultFields
        )
      }
    })
    const voteResult = _.filter(voteResultWithNull, (o: any) => !_.isEmpty(o))

    const tracking = await this.getTracking(proposalId)

    // const summary = await this.getSummary(proposalId)
    const summary = []

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

    let fund = []
    if (proposal.budget) {
      _.forEach(proposal.budget, (o) => {
        fund.push(_.omit(o, ['reasons', 'status', 'milestoneKey']))
      })
    }

    return _.omit(
      {
        id: proposal.vid,
        title: proposal.title,
        status: CVOTE_STATUS_TO_WALLET_STATUS[proposal.status],
        type: constant.CVOTE_TYPE_API[proposal.type],
        abs: proposal.abstract,
        address,
        targetProposalTitle: targetProposal && targetProposal.title,
        ..._.omit(proposal._doc, [
          'vid',
          'abstract',
          'type',
          'rejectAmount',
          'rejectThroughAmount',
          'status',
          'voteHistory',
          'notificationEndsHeight',
          'proposedEndsHeight',
          'budget'
        ]),
        fund,
        ...notificationResult,
        createdAt: timestamp.second(proposal.createdAt),
        voteResult,
        tracking,
        summary
      },
      ['_id']
    )
  }

  public async getTracking(id) {
    const db_cvote = this.getDBModel('CVote')
    const db_user = this.getDBModel('User')
    const secretary = await db_user.getDBInstance().findOne(
      {
        role: constant.USER_ROLE.SECRETARY,
        'did.id': 'did:elastos:igCSy8ht7yDwV5qqcRzf5SGioMX8H9RXcj'
      },
      constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID
    )
    const propoal = await db_cvote
      .getDBInstance()
      .findOne({ _id: id })
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)

    if (!propoal) {
      return
    }

    try {
      const didName = _.get(secretary, 'did.didName')
      const avatar = _.get(secretary, 'did.avatar')
      const ownerDidName = _.get(propoal, 'proposer.did.didName')
      const ownerAvatar =
        _.get(propoal, 'proposer.did.avatar') ||
        _.get(propoal, 'proposer.profile.avatar')
      const { withdrawalHistory } = propoal
      const withdrawalList = _.filter(
        withdrawalHistory,
        (o: any) => o.milestoneKey !== '0'
      )
      const withdrawalListByStage = _.groupBy(withdrawalList, 'milestoneKey')
      const keys = _.keys(withdrawalListByStage).sort().reverse()
      const result = _.map(keys, (k: any) => {
        const withdrawals = _.sortBy(withdrawalListByStage[`${k}`], 'createdAt')
        const withdrawal = withdrawals[withdrawals.length - 1]

        const comment = {}

        if (_.get(withdrawal, 'review.createdAt')) {
          comment['content'] = _.get(withdrawal, 'review.reason')
          comment['opinion'] = _.get(withdrawal, 'review.opinion')
          comment['avatar'] = avatar
          comment['createdBy'] = didName
          comment['createdAt'] = moment(
            _.get(withdrawal, 'review.createdAt')
          ).unix()
        }

        return {
          stage: parseInt(k),
          didName: ownerDidName,
          avatar: ownerAvatar,
          content: withdrawal.message,
          createdAt: moment(withdrawal.createdAt).unix(),
          comment
        }
      })

      return result
    } catch (err) {
      logger.error(err)
    }
  }

  public async getSummary(id) {
    const db_summary = this.getDBModel('CVote_Summary')
    const proposalId = id
    const querySummary: any = {
      proposalId
    }
    const fieldsSummary = [
      'comment',
      'content',
      'status',
      'createdAt',
      'updatedAt'
    ]
    const cursorSummary = db_summary
      .getDBInstance()
      .find(querySummary, fieldsSummary.join(' '))
      .populate(
        'comment.createdBy',
        constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID
      )
      .sort({ createdAt: -1 })
    // const totalCursorSummary = db_summary.getDBInstance().find(querySummary).count()

    const summary = await cursorSummary
    // const totalSummary = await totalCursorSummary

    const list = _.map(summary, function (o) {
      const comment = o._doc.comment
      const contents = JSON.parse(o.content)
      let content = ''
      _.each(contents.blocks, function (v: any, k: any) {
        content += v.text
        if (k !== contents.blocks.length - 1) {
          content += '\n'
        }
      })
      const commentObj = {
        content: comment.content ? comment.content : null,
        createdBy: _.get(o, 'comment.createdBy.did.didName'),
        avatar: _.get(o, 'comment.createdBy.did.avatar')
      }
      const obj = {
        ...o._doc,
        comment: commentObj,
        content,
        createdAt: timestamp.second(o.createdAt),
        updatedAt: timestamp.second(o.updatedAt)
      }
      return _.pick(obj, fieldsSummary)
    })
    return list
  }

  public async getVotersRejectAmount(id) {
    try {
      const db_cvote = this.getDBModel('CVote')
      const cur = await db_cvote.find({ _id: id })
      if (!cur) {
        throw 'this is not proposal'
      }
      const rs: any = await getProposalData(cur.proposalHash)
      if (!rs) {
        throw 'get one cr proposal crvotes by proposalhash is fail'
      }
      if (rs && rs.status === 'CRAgreed') {
        const { votersrejectamount, registerheight } = rs.data
        await db_cvote.update(
          { _id: id },
          {
            $set: {
              rejectAmount: votersrejectamount,
              rejectThroughAmount: registerheight
            }
          }
        )
      }
      return { success: true, id }
    } catch (err) {
      logger.error(err)
      return
    }
  }

  public async temporaryChangeUpdateStatus() {
    const db_cvote = this.getDBModel('CVote')
    const proposaedList = await db_cvote.find({
      status: constant.CVOTE_STATUS.PROPOSED
    })
    const notificationList = await db_cvote.find({
      status: constant.CVOTE_STATUS.NOTIFICATION
    })
    const idsProposaed = []
    const idsNotification = []

    _.each(proposaedList, (item) => {
      idsProposaed.push(item._id)
      // this.proposalAborted(item.proposalHash)
    })
    _.each(notificationList, (item) => {
      idsNotification.push(item._id)
      // this.proposalAborted(item.proposalHash)
    })
    await db_cvote.update(
      {
        _id: { $in: idsProposaed }
      },
      {
        $set: {
          status: constant.CVOTE_STATUS.REJECT
        }
      },
      {
        multi: true
      }
    )
    await db_cvote.update(
      {
        _id: { $in: idsNotification }
      },
      {
        $set: {
          status: constant.CVOTE_STATUS.VETOED
        }
      },
      {
        multi: true
      }
    )
  }

  // update proposalHash status aborted
  // public async temporaryChangeUpdateStatus() {
  //     const db_cvote = this.getDBModel('CVote')
  //     const list = await db_cvote.find({
  //         $or: [
  //             {status: constant.CVOTE_STATUS.NOTIFICATION},
  //             {status: constant.CVOTE_STATUS.PROPOSED}
  //         ]
  //     })
  //     const idsAborted = []
  //     _.each(list, (item) => {
  //         idsAborted.push(item._id)
  //     })
  //    await db_cvote.update(
  //         {
  //             _id: {$in:idsAborted}
  //         },
  //         {
  //             $set:{
  //                 status: constant.CVOTE_STATUS.ABORTED
  //             }
  //         },
  //         {
  //             multi: true
  //         }
  //     )
  // }

  private rejectedMailTemplate(id: string) {
    const subject = `【Payment rejected】Your payment request is rejected by secretary`
    const body = `
        <p>One payment request in proposal #${id}  has been rejected.</p>
        <p>Click this link to view more details:</p>
        <p><a href="${process.env.SERVER_URL}/proposals/${id}">${process.env.SERVER_URL}/proposals/${id}</a></p>
        <br />
        <p>Cyber Republic Team</p>
        <p>Thanks</p>
        `
    return { subject, body }
  }

  private approvalMailTemplate(id: string) {
    const subject = `【Payment approved】Your payment request is approved by secretary`
    const body = `
        <p>One payment request in proposal ${id} has been approved, the ELA distribution will processed shortly, check your ELA wallet later.</p>
        <p>Click this link to view more details:</p>
        <p><a href="${process.env.SERVER_URL}/proposals/${id}">${process.env.SERVER_URL}/proposals/${id}</a></p>
        <br />
        <p>Cyber Republic Team</p>
        <p>Thanks</p>
        `
    return { subject, body }
  }

  private async notifyProposalOwner(
    proposer: any,
    content: {
      subject: string
      body: string
    }
  ) {
    const mailObj = {
      to: proposer.email,
      toName: userUtil.formatUsername(proposer),
      subject: content.subject,
      body: content.body
    }
    mail.send(mailObj)
  }

  public async updateVoteStatusByChain() {
    const db_ela = this.getDBModel('Ela_Transaction')
    const db_cvote = this.getDBModel('CVote')
    const db_zip_file = this.getDBModel('Council_Member_Opinion_Zip_File')
    const db_cvote_history = this.getDBModel('CVote_Vote_History')

    let elaVoteList = await db_ela
      .getDBInstance()
      .find({ type: constant.TRANSACTION_TYPE.COUNCIL_VOTE })
    if (_.isEmpty(elaVoteList)) {
      return
    }
    const elaVote = []
    _.map(elaVoteList, (o: any) => {
      const data = {
        txid: o.txid,
        ...JSON.parse(o.payload)
      }
      if (o.blockTime) {
        data.blockTime = o.blockTime * 1000
      }
      elaVote.push(data)
    })
    console.log(`updateVoteStatusByChain elaVote...`, elaVote)
    const query = []
    const byKeyElaList = _.keyBy(elaVote, 'proposalhash')
    _.forEach(byKeyElaList, (v: any, k: any) => {
      query.push(k)
    })
    console.log(`updateVoteStatusByChain query...`, query)
    const proposalList = await db_cvote
      .getDBInstance()
      .find({
        status: constant.CVOTE_STATUS.PROPOSED,
        proposalHash: { $in: query }
      })
      .populate('voteResult.votedBy', 'did')
    console.log(
      `updateVoteStatusByChain proposalList number...`,
      proposalList.length
    )
    if (_.isEmpty(proposalList)) {
      return
    }
    const vote = []
    _.forEach(proposalList, (o: any) => {
      _.forEach(o.voteResult, (v: any) => {
        const { value, reason, status, votedBy, _id } = v
        const data: any = {
          _id,
          value,
          reason,
          status,
          votedBy: votedBy._id,
          proposalId: o._id,
          proposalHash: o.proposalHash,
          did: !_.isEmpty(votedBy) ? votedBy.did.id : null
        }
        if (v.reasonHash) {
          data.reasonHash = v.reasonHash
        }
        if (v.reasonCreatedAt) {
          data.reasonCreatedAt = v.reasonCreatedAt
        }
        vote.push(data)
      })
    })

    _.forEach(elaVote, async (o: any) => {
      console.log(`elaVote proposalHash...`, o.proposalhash)
      const did: any = DID_PREFIX + o.did
      const voteList = _.find(vote, {
        proposalHash: o.proposalhash,
        did: did
      })
      console.log(`voteList...`, voteList)
      if (voteList) {
        if (voteList.reasonHash && voteList.reasonHash === o.opinionhash) {
          await db_cvote.update(
            {
              proposalHash: o.proposalhash,
              'voteResult._id': voteList._id
            },
            {
              $set: {
                'voteResult.$.status': constant.CVOTE_CHAIN_STATUS.CHAINED
              }
            }
          )
          await db_ela.remove({ txid: o.txid })
          return
        }

        if (!o.opiniondata) return
        const opinionResult = await unzipFile(o.opiniondata)
        console.log(`${voteList._id} opinionResult....`, opinionResult)
        const opinionData = opinionResult.opinion
        let opinion = o.voteresult
        if (constant.CVOTE_CHAIN_RESULT.APPROVE === o.voteresult) {
          opinion = constant.CVOTE_RESULT.SUPPORT
        }
        if (constant.CVOTE_CHAIN_RESULT.ABSTAIN === o.voteresult) {
          opinion = constant.CVOTE_RESULT.ABSTENTION
        }

        if (
          voteList.reasonHash &&
          voteList.reasonHash !== o.opinionhash &&
          voteList.reasonCreatedAt
        ) {
          console.log(
            `${voteList.reasonHash}voteList.reasonHash...`,
            voteList.reasonCreatedAt
          )

          const isAfter = moment(voteList.reasonCreatedAt).isAfter(
            opinionResult.date
          )
          console.log(`${voteList._id} isAfter...`, isAfter)

          if (isAfter === true) {
            const history = await db_cvote_history
              .getDBInstance()
              .findOne({ reasonHash: o.opinionhash })

            if (!history) {
              await db_cvote_history.save({
                proposalBy: voteList.proposalId,
                votedBy: voteList.votedBy,
                value: opinion,
                reason: opinionData,
                reasonHash: o.opinionhash,
                reasonCreatedAt: moment(opinionResult.date),
                status: constant.CVOTE_CHAIN_STATUS.CHAINED
              })
            }

            const zipDoc = await db_zip_file
              .getDBInstance()
              .findOne({ opinionHash: o.opinionhash })
            if (!zipDoc) {
              await db_zip_file.save({
                proposalId: voteList.proposalId,
                opinionHash: o.opinionhash,
                content: Buffer.from(o.opiniondata, 'hex'),
                proposalHash: o.proposalhash,
                votedBy: voteList.votedBy
              })
            }

            await db_ela.remove({ txid: o.txid })
            return
          }
          if (
            isAfter === false &&
            voteList.status === constant.CVOTE_CHAIN_STATUS.CHAINED
          ) {
            const history = await db_cvote_history
              .getDBInstance()
              .findOne({ reasonHash: voteList.reasonHash })
            if (!history) {
              await db_cvote_history.save({
                proposalBy: voteList.proposalId,
                votedBy: voteList.votedBy,
                value: voteList.value,
                reason: voteList.reason,
                reasonHash: voteList.reasonHash,
                reasonCreatedAt: voteList.reasonCreatedAt,
                status: constant.CVOTE_CHAIN_STATUS.CHAINED
              })
            }
          }
        }

        await db_cvote.update(
          {
            proposalHash: o.proposalhash,
            'voteResult._id': voteList._id
          },
          {
            $set: {
              'voteResult.$.value': opinion,
              'voteResult.$.reason': opinionData,
              'voteResult.$.status': constant.CVOTE_CHAIN_STATUS.CHAINED,
              'voteResult.$.reasonHash': o.opinionhash,
              'voteResult.$.reasonCreatedAt': moment(opinionResult.date)
            }
          }
        )

        const doc = await db_zip_file
          .getDBInstance()
          .findOne({ opinionHash: o.opinionhash })
        if (!doc) {
          await db_zip_file.save({
            proposalId: voteList.proposalId,
            opinionHash: o.opinionhash,
            content: Buffer.from(o.opiniondata, 'hex'),
            proposalHash: o.proposalhash,
            votedBy: voteList.votedBy
          })
        }

        await db_ela.remove({ txid: o.txid })
      }
    })
  }

  public async processOldData() {
    const db_cvote = this.getDBModel('CVote')
    const oldList = await db_cvote.find(
      {
        $or: [
          { proposedEndsHeight: { $exists: true } },
          { registerHeight: { $exists: false } }
        ]
      },
      { old: { $exists: false } }
    )
    _.forEach(oldList, async (o: any) => {
      const result = await getProposalData(o.proposalHash)
      if (result == undefined) return
      const registerHeight = result !== undefined && result.data.registerheight
      let proposedEndsHeight = registerHeight + STAGE_BLOCKS
      let notificationEndsHeight = registerHeight + STAGE_BLOCKS * 2
      await db_cvote.update(
        { _id: o._id },
        {
          $set: {
            registerHeight,
            proposedEndsHeight,
            notificationEndsHeight
          }
        }
      )
    })
  }

  public async getCurrentHeight() {
    const db_config = this.getDBModel('Config')
    // const {
    //   currentHeight: registerHeight
    // } = await db_config.getDBInstance().findOne()
    // return registerHeight
    const rs = await db_config.getDBInstance().findOne()
    return rs && rs.height
  }

  private async notifyProposer(cvote: any, status: any, by: any) {
    const db_user = this.getDBModel('User')
    const user = await db_user.find({
      _id: cvote.proposer
    })
    const toUsers = []
    const toMails = _.map(user, 'email')
    const subject = `【${EMAIL_TITLE_PROPOSAL_STATUS[status]}】Your proposal #${cvote.vid} get ${EMAIL_PROPOSAL_STATUS[status]}`
    const body = `
        <p>Your proposal #${cvote.vid} get ${EMAIL_PROPOSAL_STATUS[status]} by the ${by}.</p>
        <br />
        <p>Click here to view more:</p>
        <p><a href="${process.env.SERVER_URL}/proposals/${cvote._id}">${process.env.SERVER_URL}/proposals/${cvote._id}</a></p>
        <br /><br />
        <p>Thanks</p>
        <p>Cyber Republic</p>
        `
    const recVariables = _.zipObject(
      toMails,
      _.map(user, (o) => {
        return {
          _id: o._id,
          username: userUtil.formatUsername(o)
        }
      })
    )

    const mailObj = {
      to: toMails,
      // toName: ownerToName,
      subject,
      body,
      recVariables
    }
    mail.send(mailObj)
  }

  public async getAllAuthor(param: any) {
    if (_.isEmpty(param.data)) return
    const db_cvote = this.getDBModel('CVote')
    let searchAuthor = ''
    _.forEach(param.data, (o: any) => (searchAuthor += o))
    const authorList = await db_cvote
      .getDBInstance()
      .find(
        {
          old: {
            $exists: param.old
          }
        },
        ['proposer']
      )
      .populate('proposer', constant.DB_SELECTED_FIELDS.USER.NAME_EMAIL_DID)

    const authorArr = []
    _.forEach(authorList, (o: any) => {
      if (
        o.proposer &&
        o.proposer.profile &&
        !_.find(authorArr, { _id: o.proposer._id })
      ) {
        authorArr.push({
          _id: o.proposer._id,
          firstName: o.proposer.profile.firstName,
          lastName: o.proposer.profile.lastName,
          username: o.proposer.username
        })
      }
    })
    const sp = searchAuthor.split(' ')
    const rs = []
    _.forEach(authorArr, (o) => {
      const firstName = o.firstName && o.firstName.toLowerCase()
      const lastName = o.lastName && o.lastName.toLowerCase()
      const username = o.username && o.username.toLowerCase()
      if (firstName && lastName) {
        if (sp.length > 1) {
          if (
            firstName.search(sp[0].toLowerCase()) !== -1 &&
            lastName.search(sp[1].toLowerCase()) !== -1
          ) {
            rs.push(o)
          } else if (lastName.search(sp[1].toLowerCase()) !== -1) {
            rs.push(o)
          }
        } else {
          if (
            firstName.search(sp[0].toLowerCase()) !== -1 ||
            lastName.search(sp[0].toLowerCase()) !== -1
          ) {
            rs.push(o)
          }
          if (username && username.search(sp[0].toLowerCase()) !== -1) {
            rs.push(o)
          }
        }
      }
    })

    _.forEach(authorArr, (o) => {
      const username = o.username && o.username.toLowerCase()
      if (
        username &&
        !_.find(rs, { _id: o._id }) &&
        sp.length > 1 &&
        (username.search(sp[0].toLowerCase()) !== -1 ||
          username.search(sp[1].toLowerCase()) !== -1)
      ) {
        rs.push(o)
      }
      if (
        username &&
        sp.length == 1 &&
        !_.find(rs, { _id: o._id }) &&
        username.search(sp[0].toLowerCase()) !== -1
      ) {
        rs.push(o)
      }
    })

    return _.uniqWith(rs, _.isEqual)
  }

  public async getProposalTitle(param: any) {
    const db_cvote = this.getDBModel('CVote')
    if (_.isEmpty(param)) return
    const proposalList = await db_cvote.getDBInstance().find(
      {
        title: { $regex: param.title, $options: 'i' }
      },
      ['_id', 'title', 'proposalHash']
    )
    return proposalList
  }

  public async getCustomizedIDList() {
    const db_cvote = this.getDBModel('CVote')
    const rs = await Promise.all([
      db_cvote.getDBInstance().findOne(
        {
          type: constant.CVOTE_TYPE.RESERVE_CUSTOMIZED_ID,
          status: constant.CVOTE_STATUS.FINAL
        },
        'didNameList'
      ),
      db_cvote.getDBInstance().find(
        {
          type: constant.CVOTE_TYPE.RECEIVE_CUSTOMIZED_ID,
          status: constant.CVOTE_STATUS.FINAL
        },
        'receivedCustomizedIDList'
      )
    ])
    if (_.isEmpty(rs)) return
    let didNameList = rs[0] && rs[0].didNameList.trim().split(/\s+/)
    if (_.isEmpty(didNameList)) return
    if (!_.isEmpty(rs[1])) {
      let received = ''
      for (let i = 0; i < rs[1].length; i++) {
        const proposal = rs[1][i]
        received += proposal.receivedCustomizedIDList.join(' ') + ' '
      }
      const receivedIDList = received.trim().split(' ')
      console.log(`getCustomizedIDList receivedIDList...`, receivedIDList)
      if (!_.isEmpty(receivedIDList)) {
        didNameList = _.remove(
          didNameList,
          (item: string) => !receivedIDList.includes(item)
        )
      }
    }
    console.log(`getCustomizedIDList didNameList...`, didNameList)
    return { didNameList, success: true }
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
}
