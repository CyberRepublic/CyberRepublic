import Base from './Base'
import { ela } from '../utility'

export default class extends Base {
  private model: any
  protected init() {
    this.model = this.getDBModel('Candidate')
  }

  public async backupCandidateList() {
    const crRelatedStageStatus = await ela.getCrrelatedStage()
    if (!crRelatedStageStatus) return
    // prettier-ignore
    const {
      invoting,
      ondutystartheight,
      votingstartheight,
      votingendheight
    } = crRelatedStageStatus
    if (!invoting) return

    const candidatesList = await ela.currentCandidates()
    if (!candidatesList) return

    const doc = await this.model.findOne({ votingstartheight })
    if (!doc) {
      const historyTerm = await this.model.findOne(
        { votingendheight: ondutystartheight },
        ['term']
      )
      const fields = {
        term: historyTerm.term + 1,
        votingstartheight,
        votingendheight,
        members: candidatesList.crcandidatesinfo
      }
      await this.model.save(fields)
    } else {
      await this.model.update(
        { votingstartheight },
        { members: candidatesList.crcandidatesinfo }
      )
    }
  }
}
