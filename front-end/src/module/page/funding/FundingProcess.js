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
    <div>
      <div>{I18N.get('funding.partOne.step0')}</div>
      <div>{I18N.get('funding.partOne.step1')}</div>
      <div>{I18N.get('funding.partOne.step2')}</div>
      <div>{I18N.get('funding.partOne.step3')}</div>
      <div>{I18N.get('funding.partOne.step4')}</div>
    </div>
    <Contact>
      {I18N.get('funding.partOne.contact')}
      <Email> secretariat@cyberrepublic.org</Email>
    </Contact>
    <Process>
      <Caption>{I18N.get('funding.partOne.diagram.title')}</Caption>
      <Steps>
        <Step>
          <Shapes>
            <Rectangle>
              <Number>1</Number>
            </Rectangle>
            <SmallRectangle />
            <Triangle />
          </Shapes>
          <Desc>{I18N.get('funding.partOne.step0')}</Desc>
        </Step>
        <Step>
          <Shapes>
            <Rectangle>
              <Number>2</Number>
            </Rectangle>
            <SmallRectangle />
            <Triangle />
          </Shapes>
          <Desc>{I18N.get('funding.partOne.step1')}</Desc>
        </Step>
        <Step>
          <Shapes>
            <Rectangle>
              <Number>3</Number>
            </Rectangle>
            <SmallRectangle />
            <Triangle />
          </Shapes>
          <Desc>{I18N.get('funding.partOne.step2')}</Desc>
        </Step>
        <Step>
          <Shapes>
            <Rectangle>
              <Number>4</Number>
            </Rectangle>
            <SmallRectangle />
            <Triangle />
          </Shapes>
          <Desc>{I18N.get('funding.partOne.step3')}</Desc>
        </Step>
        <Step>
          <Shapes>
            <Rectangle>
              <Number>5</Number>
            </Rectangle>
            <SmallRectangle />
            <Triangle />
          </Shapes>
          <Desc>{I18N.get('funding.partOne.step4')}</Desc>
        </Step>
      </Steps>
    </Process>
  </Wrapper>
)

export default FundingProcess

const Wrapper = styled.div`
  font-family: 'Inter', sans-serif;
  line-height: 1.75em;
  color: #5c5f7e;
  font-weight: 400;
  font-size: 14px;
  margin-top: 6em;
`
const Intro = styled.div`
  margin-bottom: 60px;
`
const Title = styled.div`
  margin-top: 2.2em;
  margin-bottom: 1.5em;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.5em;
`
const Contact = styled.div`
  margin-top: 40px;
`
const Email = styled.span`
  color: #23aa8c;
`
const Process = styled.div`
  color: #ffffff;
  text-align: center;
  max-width: 936px;
  margin: 74px auto;
  background: linear-gradient(to right, #79868c, #4d5359);
  padding: 100px 80px 80px;
  @media (max-width: 414px) {
    padding: 80px 40px 30px;
  }
`
const Caption = styled.div`
  font-size: 20px;
  font-weight: 700;
`
const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 60px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`
const Step = styled.div`
  width: 18%;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 30px 0;
  }
`
const Shapes = styled.div`
  display: flex;
  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
`
const Rectangle = styled.div`
  background: #ffffff;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  display: flex;
  align-items: center;
  padding: 0 10px;
`
const SmallRectangle = styled.div`
  background: #ffffff;
  flex-grow: 1;
  @media (max-width: 768px) {
    flex-grow: 0;
  }
`
const Triangle = styled.div`
  width: 0;
  height: 0;
  border-top: 35px solid transparent;
  border-left: 30px solid #ffffff;
  border-bottom: 35px solid transparent;
`
const Number = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #2aee9e;
  color: #000000;
  line-height: 46px;
  font-weight: 700;
  box-shadow: 0px 5px 10px 0px rgb(0 0 0 / 50%);
  @media (max-width: 768px) {
    transform: rotate(-90deg);
  }
`
const Desc = styled.div`
  padding-top: 20px;
  font-size: 14px;
  line-height: 1.75em;
  @media (max-width: 768px) {
    padding-top: 0;
    padding-left: 36px;
    text-align: left;
  }
  @media (max-width: 768px) {
    padding-left: 20px;
  }
`
