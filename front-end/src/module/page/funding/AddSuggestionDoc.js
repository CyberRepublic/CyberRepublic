import React from 'react'
import styled from 'styled-components'
import I18N from '@/I18N'
import VideoPlayer from './VideoPlayer'

const AddSuggestionDoc = () => (
  <Wrapper>
    <Title>{I18N.get('funding.partTwo.title')}</Title>
    <p>{I18N.get('funding.partTwo.p1')}</p>
    <p>{I18N.get('funding.partTwo.p2')}</p>
    <p className="paragraph">{I18N.get('funding.partTwo.p3')}</p>
    <Step>
      <Marker>1</Marker>
      <div>{I18N.get('funding.partTwo.step1')}</div>
    </Step>
    <Step>
      <Marker>2</Marker>
      <div>{I18N.get('funding.partTwo.step2')}</div>
    </Step>
    <Step>
      <Marker>3</Marker>
      <div>{I18N.get('funding.partTwo.step3')}</div>
    </Step>
    <Step className="step4">
      <Marker>4</Marker>
      <div>{I18N.get('funding.partTwo.step4')}</div>
    </Step>
    <section>
      <b>{I18N.get('funding.partTwo.type')}</b>
      {I18N.get('funding.partTwo.typeDesc')}
    </section>
    <section>
      <b>{I18N.get('funding.partTwo.abstract')}</b>
      {I18N.get('funding.partTwo.abstractDesc')}
    </section>
    <section>
      <b>{I18N.get('funding.partTwo.motivation')}</b>
      {I18N.get('funding.partTwo.motivationDesc')}
    </section>
    <section>
      <b>{I18N.get('funding.partTwo.goal')}</b>
      {I18N.get('funding.partTwo.goalDesc')}
    </section>
    <section>
      <b>{I18N.get('funding.partTwo.budgetPlan')}</b>
      {I18N.get('funding.partTwo.budgetPlanDesc')}
    </section>
    <section>
      <b>{I18N.get('funding.partTwo.implementation')}</b>
      {I18N.get('funding.partTwo.implementationDesc')}
    </section>
    <section>
      <b>{I18N.get('funding.partTwo.relevance')}</b>
      {I18N.get('funding.partTwo.relevanceDesc')}
    </section>
    <Conclusion>{I18N.get('funding.partTwo.p4')}</Conclusion>
    <Step>
      <Marker>5</Marker>
      <div>{I18N.get('funding.partTwo.step5')}</div>
    </Step>
    <p>{I18N.get('funding.partTwo.p5')}</p>
    <VideoPlayer
      src={`https://org-cyberrepublic-www.s3.ap-southeast-1.amazonaws.com/sugg_to_proposal_v1.mp4`}
    />
    <p>{I18N.get('funding.partTwo.p6')}</p>
  </Wrapper>
)

export default AddSuggestionDoc

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif !important;
  font-style: normal;
  color: #5c5f7e;
  font-size: 14px;
  line-height: 1.75em;
  p {
    margin-bottom: 16px;
  }
  p.paragraph {
    margin-bottom: 0;
  }
  section {
    margin-bottom: 16px;
    opacity: 0.9;
    margin-left: 32px;
  }
  .step4 {
    margin-bottom: 16px;
  }
`
const Title = styled.div`
  margin-top: 2.2em;
  margin-bottom: 1.5em;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.5em;
  color: #5c5f7e;
`
const Step = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.75em;
  margin-bottom: 16px;
`
const Marker = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  border-radius: 50%;
  text-align: center;
  color: #ffffff;
  background: #1ff5c9;
  background: linear-gradient(to bottom, #1ff5c9, #1e8771);
`
const Conclusion = styled.div`
  margin-bottom: 16px;
`
