import { Schema } from 'mongoose'

export const ProposerMessageZipFile = {
  proposalId: {
    type: Schema.Types.ObjectId,
    ref: 'cvote',
    required: true
  },
  proposalHash: String,
  messageHash: String,
  content: Buffer,
  stage: Number,
  ownerSignature: String,
  ownerPublicKey: String
}
