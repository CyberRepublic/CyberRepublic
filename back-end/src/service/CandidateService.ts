import Base from './Base'
import { ela } from '../utility'
import * as _ from 'lodash'

export default class extends Base {
  private model: any
  protected init() {
    this.model = this.getDBModel('Candidate')
  }

  public async backupCandidateList() {
    const crRelatedStageStatus = await ela.getCrrelatedStage()
    if (_.isEmpty(crRelatedStageStatus)) return
    // prettier-ignore
    const {
      invoting,
      votingstartheight,
      votingendheight,
      currentsession,
    } = crRelatedStageStatus
    if (!invoting) return

    const candidatesList = await ela.currentCandidates()
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
    const doc = await this.model.findOne({ votingstartheight })
    if (!doc) {
      const fields = {
        term: currentsession + 1,
        votingstartheight,
        votingendheight,
        members: candidates,
        totalVotes: _.toNumber(candidatesList.totalvotes),
        totalCounts: candidatesList.totalcounts
      }
      await this.model.save(fields)
    } else {
      await this.model.update(
        { votingstartheight },
        {
          members: candidates,
          totalVotes: _.toNumber(candidatesList.totalvotes),
          totalCounts: candidatesList.totalcounts
        }
      )
    }
  }
}
