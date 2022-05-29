import React from 'react'
import styled from 'styled-components'
import VideoPlayer from './VideoPlayer'

const AddSuggestionDoc = () => (
  <Wrapper>
    <Title>Adding a funding Suggestion to Cyber Republic</Title>
    <p>
      As the Elastos ecosystem DAO, Cyber Republic (CR) supports Elastos' third
      tier of consensus via a unique proposal model. CR is headed by a 12-party
      council that is elected annually by ELA tokenholders, but everyone in the
      Elastos ecosystem is eligible and encouraged to participate in the
      proposal process.
    </p>
    <p>
      Although community members cannot submit a proposal directly, they may
      submit prospective drafts called suggestions. When a suggestion picks up
      traction in the community, a council member may nominate the suggestion
      and transition it to a proposal. At this stage, the entire CR Council
      votes on the proposal to determine whether to carry out its contents and
      disburse the requested funding allocations.
    </p>
    <p className="paragraph">
      Have an idea? The Elastos community would love to hear your voice!
      Creating and submitting a suggestion is easy. Here's how to get started:
    </p>
    <Step>
      <Marker>1</Marker>
      <div>Go to cyberrepublic.org.</div>
    </Step>
    <Step>
      <Marker>2</Marker>
      <div>Click on "Suggestions" in the top menu bar.</div>
    </Step>
    <Step>
      <Marker>3</Marker>
      <div>
        Click the green "Add Suggestion" button in the upper right hand corner.
      </div>
    </Step>
    <Step className="step4">
      <Marker>4</Marker>
      <div>
        Input all requested information. Use the black "Continue" button to
        scroll through the information panels chronologically, or click on each
        title in the horizontal menu bar to navigate between panels at your
        convenience. Here is the information you will be asked to provide:
      </div>
    </Step>
    <section>
      <b>Type:</b> Whether your suggestion content is new, or if it seeks to
      modify an existing proposal.
    </section>
    <section>
      <b>Abstract:</b> A brief description of your suggestion.
    </section>
    <section>
      <b>Motivation:</b> Why you are submitting your suggestion.
    </section>
    <section>
      <b>Goal:</b> What you want to achieve with your suggestion.
    </section>
    <section>
      <b>Implementation and Budget Plan:</b> Relevant processes, methods, and
      costs required to achieve your goal.
    </section>
    <section>
      <b>Implementation Team:</b> Who you will employ to achieve your goal.
    </section>
    <section>
      <b>Relevance:</b> Any past proposals that relate to your suggestion.
    </section>
    <Conclusion>
      In order to ensure a meritocratic and high-integrity proposal process, all
      budget plans must disburse funds in accordance with tangible, periodic
      development milestones.
    </Conclusion>
    <Step>
      <Marker>5</Marker>
      <div>
        Once you have finalized your suggestion content, click the green "Save &
        Post" button at the bottom.
      </div>
    </Step>
    <p>
      Congratulations - you have just submitted a suggestion to the Cyber
      Republic DAO! To help your suggestion pick up traction, share your
      suggestion link on social media and in Elastos' official channels below:
    </p>
    <VideoPlayer
      src={`https://org-cyberrepublic-www.s3.ap-southeast-1.amazonaws.com/suggestion_to_proposal.mp4`}
    />
    <p>
      Watch Kiran from Tuum Tech explain what happens after you create a
      Suggestion on Cyber Republic as your Suggestion goes through the CRC
      Proposal Process.
    </p>
  </Wrapper>
)

export default AddSuggestionDoc

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif !important;
  font-style: normal;
  color: #5c5f7e;
  font-size: 22px;
  @media (max-width: 768px) {
    font-size: 18px;
  }
  line-height: 1.75em;
  p {
    margin-bottom: 42px;
  }
  p.paragraph {
    margin-bottom: 0;
  }
  section {
    margin-bottom: 24px;
    font-size: 18px;
    opacity: 0.8;
    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
  .step4 {
    margin-bottom: 24px;
  }
  .step1 {
    margin-bottom: 24px;
  }
`
const Title = styled.div`
  margin-top: 2.2em;
  margin-bottom: 1.5em;
  font-weight: 700;
  font-size: 50px;
  line-height: 1.5em;
  color: #050717;
  @media (max-width: 768px) {
    font-size: 40px;
  }
`
const Step = styled.div`
  display: flex;
  line-height: 1.75em;
  margin-bottom: 42px;
  margin-left: -48px;
  @media (max-width: 768px) {
    margin-left: -26px;
  }
`
const Marker = styled.div`
  flex-shrink: 0;
  margin-right: 8px;
  margin-left: 4px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  @media (max-width: 768px) {
    margin-right: 4px;
    margin-left: 4px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    margin-top: 6px;
  }
  border-radius: 50%;
  text-align: center;
  color: #ffffff;
  background: #1ff5c9;
  background: linear-gradient(to bottom, #1ff5c9, #1e8771);
`
const Conclusion = styled.div`
  margin-bottom: 42px;
`
