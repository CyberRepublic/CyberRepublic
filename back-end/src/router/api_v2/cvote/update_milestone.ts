import Base from '../../Base'
import CVoteApiService from '../../../service/CVoteApiService'

export default class extends Base {
  async action() {
    const param = this.getParam()
    const service = this.buildService(CVoteApiService)

    const rs = await service.updateMilestone(param)
    return this.result(1, rs)
  }
}
