import React from 'react'
import styled from 'styled-components'
import I18N from '@/I18N'
import VideoPlayer from './VideoPlayer'

const FundingProcess = () => (
  <Wrapper>
    <Intro>{I18N.get('funding.apply')}</Intro>
    <VideoPlayer
      src={`https://org-cyberrepublic-www.s3.ap-southeast-1.amazonaws.com/create_suggestion.mp4`}
    />
    <Title>{I18N.get('funding.partOne.title')}</Title>
    <List>
      <li>{I18N.get('funding.partOne.step0')}</li>
      <li>{I18N.get('funding.partOne.step1')}</li>
      <li>{I18N.get('funding.partOne.step2')}</li>
      <li>{I18N.get('funding.partOne.step3')}</li>
      <li>{I18N.get('funding.partOne.step4')}</li>
    </List>
    <Contact>
      {I18N.get('funding.partOne.contact')}
      <Email> secretariat@cyberrepublic.org</Email>
    </Contact>
    <Img src="https://org-cyberrepublic-www.s3.ap-southeast-1.amazonaws.com/funding_process.jpg" />
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
const Email = styled.span`
  color: #23aa8c;
`
const Img = styled.img`
  display: block;
  margin: 74px auto;
  width: 100%;
  max-width: 936px;
`
