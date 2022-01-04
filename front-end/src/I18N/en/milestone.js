import { MILESTONE_STATUS } from '@/constant'
const {
  WAITING_FOR_APPROVAL,
  WAITING_FOR_REQUEST,
  WAITING_FOR_WITHDRAWAL,
  REJECTED,
  WITHDRAWN
} = MILESTONE_STATUS

export default {
  status: 'Status',
  request: 'Request',
  rerequest: 'Re-request',
  reject: 'Reject',
  approve: 'Approve',
  withdraw: 'Withdraw',
  [WAITING_FOR_REQUEST]: 'WAITING FOR REQUEST',
  [WAITING_FOR_APPROVAL]: 'WAITING FOR APPROVAL',
  [WAITING_FOR_WITHDRAWAL]: 'WAITING FOR WITHDRAW',
  [WITHDRAWN]: 'WITHDRAWN',
  [REJECTED]: 'REJECTED',
  sign: 'Scan the QR code with Essentials to sign',
  summary: 'Summary',
  reason: 'Reason',
  exception: 'Something went wrong',
  payment: 'Payment',
  scanToWithdraw: 'Scan QR code with Essentials to withdraw ELA',
  required: 'This field is required.',
  next: 'Next',
  showMore: 'Show More',
  showLess: 'Show Less'
}
