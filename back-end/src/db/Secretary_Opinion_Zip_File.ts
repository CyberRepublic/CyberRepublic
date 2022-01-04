import Base from './Base'
import { SecretaryOpinionZipFile } from './schema/SecretaryOpinionZipFile'

export default class extends Base {
  protected getSchema() {
    return SecretaryOpinionZipFile
  }
  protected getName() {
    return 'secretary_opinion_zip_file'
  }
}
