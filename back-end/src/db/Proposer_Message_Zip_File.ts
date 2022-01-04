import Base from './Base'
import { ProposerMessageZipFile } from './schema/ProposerMessageZipFile'

export default class extends Base {
  protected getSchema() {
    return ProposerMessageZipFile
  }
  protected getName() {
    return 'proposer_message_zip_file'
  }
}
