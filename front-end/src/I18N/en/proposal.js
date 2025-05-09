import {
  CVOTE_TRACKING_STATUS,
  CVOTE_SUMMARY_STATUS,
  CVOTE_WITHDRAWAL_STATUS,
  ABSTRACT_MAX_WORDS,
  PROPOSAL_TYPE
} from '@/constant'

export default {
  fields: {
    title: 'Title',
    preamble: 'Preamble',
    preambleSub: {
      proposal: 'PoI Proposal',
      title: 'Title',
      proposer: 'Proposer',
      referee: 'Referee',
      status: 'Status',
      created: 'Created',
      hash: 'Hash',
      txHash: 'TxID',
      owner: 'New Proposal Owner',
      address: 'New Proposal ELA Address',
      secretary: 'New Secretary General',
      targetProposalNum: 'Proposal Number',
      closeProposalNum: 'Terminate Proposal'
    },
    abstract: 'Abstract',
    goal: 'Goal',
    motivation: 'Motivation',
    didNameList: 'Customized DID List',
    customizedIDBindToDID: 'Bind to DID',
    receivedCustomizedIDList: 'Received Customized DID List',
    sideChainDetails: 'Details',
    customizedIDFee: 'Fee Rate',
    effectiveHeightOfEID: 'Effective Height',
    relevance: 'Relevance',
    budget: 'Budget',
    type: 'Type',
    plan: 'Implementation Plan',
    vote: 'Vote',
    tracking: 'Tracking',
    trackingMessage: 'Tracking Message',
    summary: 'Summary',
    status: 'Proposal Status',
    budgetRequested: 'Budget Requested',
    hasTrackingMsg: 'Has tracking message to be reviewed',
    isUnvotedByYou: 'Unvoted by You',
    creationDate: 'Proposal Date',
    author: 'Author',
    endsDate: 'Ends In',
    currentHeight: 'Current Block Height'
  },
  btn: {
    tracking: {
      reject: 'Reject & Comment',
      approve: 'Approve & Publish'
    },
    summary: {
      reject: 'Reject & Comment',
      approve: 'Approve & Publish'
    },
    viewOldData: 'View old data',
    viewNewData: 'View new data',
    addTrackingMessage: 'Add Tracking Message',
    create: 'Create',
    cancel: 'Cancel'
  },
  text: {
    tracking: {
      reviewDetails: 'Review Details',
      notice: {
        header: '',
        footer: ''
      },
      budget: 'Budget tracking',
      status: 'Status tracking',
      summary: 'Summary'
    },
    summary: {
      reviewDetails: 'Review Details',
      notice: {
        header: '',
        footer: ''
      }
    },
    noData: 'No Data'
  },
  status: {
    tracking: {
      [CVOTE_TRACKING_STATUS.DRAFT]: 'DRAFT',
      [CVOTE_TRACKING_STATUS.REVIEWING]: 'BEING REVIEWED',
      [CVOTE_TRACKING_STATUS.PUBLISHED]: 'APPROVED ✓',
      [CVOTE_TRACKING_STATUS.REJECT]: 'REJECTED !'
    },
    summary: {
      [CVOTE_SUMMARY_STATUS.DRAFT]: 'DRAFT',
      [CVOTE_SUMMARY_STATUS.REVIEWING]: 'BEING REVIEWED',
      [CVOTE_SUMMARY_STATUS.PUBLISHED]: 'APPROVED ✓',
      [CVOTE_SUMMARY_STATUS.REJECT]: 'REJECTED !'
    },
    trackingRaw: {
      undefined: '',
      [CVOTE_TRACKING_STATUS.DRAFT]: 'DRAFT',
      [CVOTE_TRACKING_STATUS.REVIEWING]: 'BEING REVIEWED',
      [CVOTE_TRACKING_STATUS.PUBLISHED]: 'APPROVED',
      [CVOTE_TRACKING_STATUS.REJECT]: 'REJECTED'
    },
    summaryRaw: {
      undefined: '',
      [CVOTE_SUMMARY_STATUS.DRAFT]: 'DRAFT',
      [CVOTE_SUMMARY_STATUS.REVIEWING]: 'BEING REVIEWED',
      [CVOTE_SUMMARY_STATUS.PUBLISHED]: 'APPROVED',
      [CVOTE_SUMMARY_STATUS.REJECT]: 'REJECTED'
    },
    withdrawal: {
      [CVOTE_WITHDRAWAL_STATUS.REVIEWING]: 'BEING REVIEWED',
      [CVOTE_WITHDRAWAL_STATUS.APPROVED]: 'APPROVED ✓',
      [CVOTE_WITHDRAWAL_STATUS.REJECTED]: 'REJECTED !'
    }
  },
  form: {
    tracking: {
      btn: {
        submit: 'Submit for Review'
      },
      add: 'Add Tracking Messages'
    },
    summary: {
      btn: {
        submit: 'Submit for Review'
      },
      add: 'Add Summary'
    },
    note: {
      abstract:
        'Provide a brief description of the proposal content (no more than 200 words).',
      goal:
        'Describe the desired results achieved by implementing the proposal. Goals should be clear and measurable.',
      motivation:
        'Describe why this proposal is proposed. Motivation is critical for proposals that try to improve Elastos or DAO. It should be clearly explained here why the existing mechanism is not enough to solve the problems the proposal wants to solve.',
      motivationHighlight:
        'Proposals with insufficient motivation are highly likely to be rejected.',
      relevance:
        'If the proposal is related to other PoI proposals, the proposal number of each related proposal should be provided here. The relationship between the proposal and each related proposal should be described. If there are conflicts with Elastos technology or other PoI proposals, the proposal must describe these conflicts and explain how to deal with them.',
      budget:
        'If the implementation of the proposal requires financial support from the Elastos Council, describe the overall budget and expenditure plan. This financial plan should be aligned with the implementation plan.',
      type: 'Select a proposal type.',
      plan:
        'Describe what methods and processes will be used to achieve goals, and a brief introduction of the executing person or team should be listed here as well. If proposal has a long implementation timeline, it should set some checkpoints in the implementation process. The interval between two checkpoints should be no more than 3 months. The checkpoints should be clear and measurable as the proposed goals.',
      tracking:
        'This part is updated by the proposer according to the progress of the proposal, including the achievement of goal and budget usage. It is used to present the implementation status of proposal according to the checkpoints in the implementation plan or the goals of the proposal. The Elastos Council Secretariat is responsible to review and verify this part.',
      summary:
        'When proposal is completed, its proposer should submit a summary of the proposal implementation, including the achievement of goals and financial report. The Elastos Council Secretariat is responsible for the review of this part.'
    },
    error: {
      required: 'This field is required',
      tooLong: 'This field is too long',
      [`limit${ABSTRACT_MAX_WORDS}`]: `You can only type ${ABSTRACT_MAX_WORDS} words max.`
    }
  },
  msg: {
    rejected: 'Rejected successfully',
    approved: 'Approved and published successfully',
    draftSaved:
      'Saved as draft successfully, you can check it in proposal list page',
    proposalPublished: 'Proposal published successfully',
    created: 'Created successfully'
  },
  type: {
    [PROPOSAL_TYPE.NEW_MOTION]: 'New Motion',
    // [PROPOSAL_TYPE.MOTION_AGAINST]: 'Motion Against',
    // [PROPOSAL_TYPE.ANYTHING_ELSE]: 'Anything Else',
    // [PROPOSAL_TYPE.STANDARD_TRACK]: 'Standards Tracking ELIP',
    // [PROPOSAL_TYPE.PROCESS]: 'Process ELIP',
    // [PROPOSAL_TYPE.INFORMATIONAL]: 'Information ELIP',
    [PROPOSAL_TYPE.CHANGE_PROPOSAL]: 'Motion to change a proposal',
    [PROPOSAL_TYPE.CHANGE_SECRETARY]:
      'Motion for new Elastos Council Secretary General',
    [PROPOSAL_TYPE.TERMINATE_PROPOSAL]: 'Motion to terminate a proposal',
    [PROPOSAL_TYPE.RESERVE_CUSTOMIZED_ID]: `Motion to reserve Customized DID`,
    [PROPOSAL_TYPE.RECEIVE_CUSTOMIZED_ID]: `Motion to enable Customized DID`,
    [PROPOSAL_TYPE.CHANGE_CUSTOMIZED_ID_FEE]: `Motion to change Customized DID fee`,
    [PROPOSAL_TYPE.REGISTER_SIDE_CHAIN]: `Motion to register new side chain`
  }
}
