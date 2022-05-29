import React from 'react'
import styled from 'styled-components'
import VideoPlayer from './VideoPlayer'

const FundingProcess = () => (
  <Wrapper>
    <Intro>
      To apply for funds, you first have to go through the DAO Suggestion and
      Proposal process where a 12-seat Council will vote on your plan with input
      from the Elastos community.
    </Intro>
    <VideoPlayer
      src={`//org-cyberrepublic-www.s3.ap-southeast-1.amazonaws.com/create_suggestion.mp4`}
    />
    <Title>The Suggestion and Proposal Process</Title>
    <List>
      <li>Create a Suggestion on cyberrepublic.org</li>
      <li>Council member makes the suggestion a Proposal</li>
      <li>Council votes. 8 of 12 votes are required for Proposal to pass</li>
      <li>Funding starts</li>
    </List>
    <Contact>
      If you have a question about the process, email
      <Email>secretariat@cyberrepublic.org</Email>
    </Contact>
    <Img src="//org-cyberrepublic-www.s3.ap-southeast-1.amazonaws.com/funding_process.jpg" />
  </Wrapper>
)

export default FundingProcess

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;
  line-height: 1.75em;
  color: #5c5f7e;
  font-weight: 400;
  font-size: 22px;
  margin-top: 6em;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`
const Intro = styled.div`
  margin-bottom: 80px;
`
const Title = styled.div`
  margin-top: 2.2em;
  margin-bottom: 1.5em;
  font-weight: 700;
  font-size: 50px;
  line-height: 1.5em;
  @media (max-width: 768px) {
    font-size: 40px;
  }
`
const List = styled.ol`
  padding-left: 33.81px;
  @media (max-width: 768px) {
    font-size: 18px;
    padding-left: 21.69px;
  }
`
const Contact = styled.div`
  margin-top: 100px;
`
const Email = styled.div`
  color: #23aa8c;
`
const Img = styled.img`
  display: block;
  margin: 74px auto;
  width: 100%;
  max-width: 936px;
`
