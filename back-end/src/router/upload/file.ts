import Base from '../Base'
import UploadService from '../../service/UploadService'

export default class UploadFile extends Base {
  // protected needLogin = true;
  async action() {
    const uploadService = this.buildService(UploadService)
    if (!this.req['files'] || !this.req['files'].file) {
      throw 'invalid upload file'
    }
    const url = await uploadService.saveFile(this.req['files'].file)
    console.log('uploaded image url...', url)
    return this.result(1, { url })
  }
}
