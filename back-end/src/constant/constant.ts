import * as _ from 'lodash'

const create = (constant_list: string[]): any => {
  const map = {}
  _.each(constant_list, (key) => {
    map[key] = key
  })

  return map
}

export const CANDIDATE_STATE = {
  PENDING: 'Pending', // 候选人刚注册，注册交易还没有6次确认
  ACTIVE: 'Active', // 正常状态，可被投票
  CANCELED: 'Canceled', // 候选人已注销
  RETURNED: 'Returned' // 候选人已注销且已经取回了质押金
}

export const SUGGESTION_TYPE = {
  NEW_MOTION: '1',
  MOTION_AGAINST: '2',
  ANYTHING_ELSE: '3',
  CHANGE_PROPOSAL: 'CHANGE_PROPOSAL',
  CHANGE_SECRETARY: 'CHANGE_SECRETARY',
  TERMINATE_PROPOSAL: 'TERMINATE_PROPOSAL',
  RESERVE_CUSTOMIZED_ID: 'RESERVE_CUSTOMIZED_ID',
  RECEIVE_CUSTOMIZED_ID: 'RECEIVE_CUSTOMIZED_ID',
  CHANGE_CUSTOMIZED_ID_FEE: 'CHANGE_CUSTOMIZED_ID_FEE',
  REGISTER_SIDE_CHAIN: 'REGISTER_SIDE_CHAIN'
}

export const CVOTE_TYPE = {
  NEW_MOTION: '1',
  MOTION_AGAINST: '2',
  ANYTHING_ELSE: '3',
  STANDARD_TRACK: '4',
  PROCESS: '5',
  INFORMATIONAL: '6',
  CHANGE_PROPOSAL: 'CHANGE_PROPOSAL',
  CHANGE_SECRETARY: 'CHANGE_SECRETARY',
  TERMINATE_PROPOSAL: 'TERMINATE_PROPOSAL',
  RESERVE_CUSTOMIZED_ID: 'RESERVE_CUSTOMIZED_ID',
  RECEIVE_CUSTOMIZED_ID: 'RECEIVE_CUSTOMIZED_ID',
  CHANGE_CUSTOMIZED_ID_FEE: 'CHANGE_CUSTOMIZED_ID_FEE',
  REGISTER_SIDE_CHAIN: 'REGISTER_SIDE_CHAIN'
}

export const CVOTE_TYPE_API = {
  CHANGE_PROPOSAL: 'changeproposalowner',
  CHANGE_SECRETARY: 'secretarygeneral',
  TERMINATE_PROPOSAL: 'closeproposal',
  1: 'normal',
  2: 'motion_against',
  3: 'anything_else',
  RESERVE_CUSTOMIZED_ID: 'reservecustomizedid',
  RECEIVE_CUSTOMIZED_ID: 'receivecustomizedid',
  CHANGE_CUSTOMIZED_ID_FEE: 'changecustomizedidfee',
  REGISTER_SIDE_CHAIN: 'registersidechain'
}

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  COUNCIL: 'COUNCIL',
  SECRETARY: 'SECRETARY',
  CUSTOM: 'CUSTOM',
  MEMBER: 'MEMBER',
  LEADER: 'LEADER'
}

export const USER_LANGUAGE = {
  en: 'en',
  zh: 'zh'
}

export const TASK_TYPE = {
  TASK: 'TASK',
  SUB_TASK: 'SUB_TASK',
  PROJECT: 'PROJECT',
  EVENT: 'EVENT'
}

export const TASK_CATEGORY = {
  GENERAL: 'GENERAL',
  SOCIAL: 'SOCIAL',
  DEVELOPER: 'DEVELOPER',
  LEADER: 'LEADER',
  CR100: 'CR100'
}

export const TASK_STATUS = {
  PROPOSAL: 'PROPOSAL',
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ASSIGNED: 'ASSIGNED',

  // in between ASSIGNED and SUBMITTED, individual task candidates
  // can mark their completion which is recorded in the array candidateCompleted
  // this is only for reference, the task is not fully completed until the owner

  // owner acknowledges task is done - by enough parties (note it does not have to be all)
  SUBMITTED: 'SUBMITTED',

  SUCCESS: 'SUCCESS', // when admin accepts it as complete
  DISTRIBUTED: 'DISTRIBUTED', // when admin distributes ELA rewards
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED'
}

export const TASK_CANDIDATE_TYPE = {
  USER: 'USER',
  TEAM: 'TEAM'
}

export const TASK_CANDIDATE_STATUS = {
  // NOT_REQUIRED: 'NOT_REQUIRED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
}

export const COMMUNITY_TYPE = {
  COUNTRY: 'COUNTRY',
  STATE: 'STATE',
  CITY: 'CITY',
  REGION: 'REGION',
  SCHOOL: 'SCHOOL'
}

export const TRANS_STATUS = {
  PENDING: 'PENDING',
  CANCELED: 'CANCELED',
  FAILED: 'FAILED',
  SUCCESSFUL: 'SUCCESSFUL'
}

// log
export const LOG_TYPE = {
  APPLY_TEAM: 'apply_team'
}

export const SUBMISSION_TYPE = {
  BUG: 'BUG',
  SECURITY_ISSUE: 'SECURITY_ISSUE',
  SUGGESTION: 'SUGGESTION',
  ADD_COMMUNITY: 'ADD_COMMUNITY',
  OTHER: 'OTHER',
  FORM_EXT: 'FORM_EXT',
  EMPOWER_35: 'EMPOWER_35'
}

export const SUBMISSION_CAMPAIGN = {
  COMMUNITY_ORGANIZER: 'COMMUNITY_ORGANIZER',
  ANNI_2008: 'ANNI_2008',
  ANNI_VIDEO_2008: 'ANNI_VIDEO_2008',
  EMPOWER_35: 'EMPOWER_35'
}

export const SKILLSET_TYPE = create([
  'CPP',
  'JAVASCRIPT',
  'GO',
  'PYTHON',
  'JAVA',
  'SWIFT'
])
export const TEAM_TASK_DOMAIN = create([
  'MEDIA',
  'IOT',
  'AUTHENTICITY',
  'CURRENCY',
  'GAMING',
  'FINANCE',
  'SOVEREIGNTY',
  'SOCIAL',
  'EXCHANGE'
])

export const TEAM_SUBCATEGORY = create(['ESSENTIAL', 'ADVANCED', 'SERVICES'])
export const TEAM_ROLE = create(['MEMBER', 'LEADER'])
export const TEAM_USER_STATUS = create(['NORMAL', 'PENDING', 'REJECT'])
export const TEAM_TYPE = create(['TEAM', 'CRCLE'])
export const TASK_CANDIDATE_CATEGORY = {
  RSVP: 'RSVP'
}

export const TERM_COUNCIL_STATUS = create(['HISTORY', 'CURRENT', 'VOTING'])

export const COUNCIL_STATUS = {
  ELECTED: 'Elected',
  IMPEACHED: 'Impeached',
  RETURNED: 'Returned',
  TERMINATED: 'Terminated',
  INACTIVE: 'Inactive',
  EXPIRED: 'Expired'
}

export const SECRETARIAT_STATUS = create(['CURRENT', 'NON_CURRENT'])

// ACTIVE === PASSED, currently 'published' flag is used for 'DRAFT'
export const CVOTE_STATUS = create([
  'DRAFT',
  'PROPOSED',
  'NOTIFICATION',
  'ACTIVE',
  'REJECT',
  'FINAL',
  'DEFERRED',
  'INCOMPLETED',
  'VETOED',
  'TERMINATED',
  'ABORTED'
])
export const CVOTE_TRACKING_STATUS = create([
  'DRAFT',
  'REVIEWING',
  'PUBLISHED',
  'REJECT'
])
export const CVOTE_SUMMARY_STATUS = create([
  'DRAFT',
  'REVIEWING',
  'PUBLISHED',
  'REJECT'
])

export const CVOTE_CHAIN_RESULT = {
  APPROVE: 'approve',
  REJECT: 'reject',
  ABSTAIN: 'abstain'
}
export const CVOTE_RESULT = {
  SUPPORT: 'support',
  REJECT: 'reject',
  ABSTENTION: 'abstention',
  UNDECIDED: 'undecided'
}
export const ELIP_VOTE_RESULT = {
  SUPPORT: 'support',
  REJECT: 'reject',
  ABSTENTION: 'abstention',
  UNDECIDED: 'undecided'
}
export const CVOTE_CHAIN_STATUS = {
  CHAINED: 'chained',
  UNCHAIN: 'unchain',
  CHAINING: 'chaining',
  FAILED: 'failed'
}
// expiration period: 7 days
export const CVOTE_EXPIRATION = 1000 * 60 * 60 * 24 * 14
export const CVOTE_COUNCIL_EXPIRATION = 1000 * 60 * 60 * 24 * 7
export const ELIP_EXPIRATION = 1000 * 60 * 60 * 24 * 7

export const CONTENT_TYPE = create(['MARKDOWN', 'HTML'])

export const ONE_DAY = 1000 * 60 * 60 * 24
export const THREE_DAY = 1000 * 60 * 60 * 24 * 3

export const USER_SKILLSET = {
  DESIGN: create([
    'LOGO_DESIGN',
    'FLYERS',
    'PACKAGING',
    'ILLUSTRATION',
    'INFOGRAPHIC',
    'PRODUCT_DESIGN',
    'MERCHANDISE',
    'PHOTOSHOP'
  ]),
  MARKETING: create([
    'SOCIAL_MEDIA_MARKETING',
    'SEO',
    'CONTENT_MARKETING',
    'VIDEO_MARKETING',
    'EMAIL_MARKETING',
    'MARKETING_STRATEGY',
    'WEB_ANALYTICS',
    'ECOMMERCE',
    'MOBILE_ADVERTISING'
  ]),
  WRITING: create([
    'TRANSLATION',
    'PRODUCT_DESCRIPTIONS',
    'WEBSITE_CONTENT',
    'TECHNICAL_WRITING',
    'PROOFREADING',
    'CREATIVE_WRITING',
    'ARTICLES_WRITING',
    'SALES_COPY',
    'PRESS_RELEASES',
    'LEGAL_WRITING'
  ]),
  VIDEO: create([
    'INTROS',
    'LOGO_ANIMATION',
    'PROMO_VIDEOS',
    'VIDEO_ADS',
    'VIDEO_EDITING',
    'VIDEO_MODELING',
    'PRODUCT_PHOTO'
  ]),
  MUSIC: create(['VOICE_OVER', 'MIXING', 'MUSIC_PRODUCTION']),
  DEVELOPER: {
    ...SKILLSET_TYPE,
    ...create(['SOFTWARE_TESTING'])
  },
  BUSINESS: create([
    'VIRTUAL_ASSISTANT',
    'DATA_ENTRY',
    'MARKET_RESEARCH',
    'BUSINESS_PLANS',
    'LEGAL_CONSULTING',
    'FINANCIAL_CONSULTING',
    'PRESENTATION'
  ])
}

// mongo do not support ASC and DESC options
export const SORT_ORDER = {
  ASC: 1,
  DESC: -1
}

export const USER_PROFESSION = create([
  'ENGINEERING',
  'COMPUTER_SCIENCE',
  'PRODUCT_MANAGEMENT',
  'ART_DESIGN',
  'SALES',
  'MARKETING',
  'BUSINESS_FINANCE',
  'ENTREPRENEUR',
  'STUDENT',
  'HEALTH_MEDICINE',
  'LITERATURE_WRITING',
  'TRANSLATION',
  'LAW',
  'ECONOMICS',
  'MANAGEMENT'
])

export const SUGGESTION_STATUS = create([
  'ACTIVE',
  'ABUSED',
  'ARCHIVED',
  'PROPOSED',
  'CANCELLED'
])

export const SUGGESTION_NEW_STATUS = create(['UNSIGNED', 'SIGNED', 'PROPOSED'])

export const SUGGESTION_ABUSED_STATUS = create(['REPORTED', 'HANDLED'])

export const SUGGESTION_TAG_TYPE = create([
  'UNDER_CONSIDERATION',
  'INFO_NEEDED',
  'ADDED_TO_PROPOSAL'
])

// DB sensitive data we do not want to explosure
export const DB_EXCLUDED_FIELDS = {
  USER: {
    SENSITIVE: '-password -salt -email -resetToken'
  }
}

export const DB_SELECTED_FIELDS = {
  USER: {
    NAME: 'profile.firstName profile.lastName username',
    NAME_EMAIL: 'profile.firstName profile.lastName username email',
    // prettier-ignore
    NAME_AVATAR: 'profile.avatar profile.firstName profile.lastName username did.didName',
    // prettier-ignore
    NAME_EMAIL_DID: 'profile.avatar profile.firstName profile.lastName username email did'
  },
  SUGGESTION: {
    ID: 'displayId'
  },
  CVOTE: {
    ID: 'vid',
    ID_STATUS: 'vid status',
    ID_STATUS_HASH_TXID: 'vid status proposalHash txHash'
  }
}

// elip
export const ELIP_STATUS = create([
  'PERSONAL_DRAFT',
  'WAIT_FOR_REVIEW',
  'REJECTED',
  'DRAFT',
  'CANCELLED',
  'FINAL_REVIEW',
  'SUBMITTED_AS_PROPOSAL'
])

export const ELIP_REVIEW_STATUS = create(['APPROVED', 'REJECTED'])

export const ELIP_TYPE = create(['STANDARD_TRACK', 'PROCESS', 'INFORMATIONAL'])

export const MILESTONE_STATUS = create([
  'WAITING_FOR_REQUEST',
  'REJECTED',
  'WAITING_FOR_APPROVAL',
  'WAITING_FOR_WITHDRAWAL',
  'WITHDRAWN'
])
export const CHAIN_BUDGET_STATUS = {
  WITHDRAWABLE: 'Withdrawable',
  UNFINISHED: 'Unfinished',
  WITHDRAWN: 'Withdrawn'
}

export const REVIEW_OPINION = create(['REJECTED', 'APPROVED'])

export const PROPOSAL_TRACKING_TYPE = {
  PROGRESS: 'progress',
  REJECTED: 'rejected',
  TERMINATED: 'terminated',
  CHANGEOWNER: 'changeowner',
  FINALIZED: 'finalized'
}

export const SUGGESTION_BUDGET_TYPE = create([
  'ADVANCE',
  'COMPLETION',
  'CONDITIONED'
])

export const CHAIN_BUDGET_TYPE = {
  [SUGGESTION_BUDGET_TYPE.ADVANCE]: 'Imprest',
  [SUGGESTION_BUDGET_TYPE.CONDITIONED]: 'NormalPayment',
  [SUGGESTION_BUDGET_TYPE.COMPLETION]: 'FinalPayment'
}

export const TRANSACTION_TYPE = {
  SUGGESTION_TO_PROPOSAL: 37,
  COUNCIL_VOTE: 38,
  SECRETARY_REVIEW: 39
}

export const API_VOTE_TYPE = {
  PROPOSAL: 'proposalvote',
  SUGGESTION: 'suggestionvote'
}

export const DID_PREFIX = 'did:elastos:'
export const ELA_BURN_ADDRESS = 'ELANULLXXXXXXXXXXXXXXXXXXXXXYvs3rr'
export const DEFAULT_BUDGET = [{ type: 'finalpayment', stage: 1, amount: '0' }]

export const oldAccessJwtPrefix = 'elastos://credaccess/'
export const accessJwtPrefix = 'https://did.elastos.net/credaccess/'

export const oldProposalJwtPrefix = 'elastos://crproposal/'
export const proposalJwtPrefix = 'https://did.elastos.net/crproposal/'
