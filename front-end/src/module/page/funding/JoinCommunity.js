import React from 'react'
import styled from 'styled-components'
import I18N from '@/I18N'
import Twitter from '@/assets/svg/twitter'
import Discord from '@/assets/svg/discord'
import Reddit from '@/assets/svg/reddit'

const JoinCommunity = () => (
  <Wrapper>
    <Title>{I18N.get('funding.join')}</Title>
    <Icons>
      <Icon href="https://discord.gg/elastos">
        <Discord fill="#ffffff" />
      </Icon>
      <Icon href="https://twitter.com/cyber__republic">
        <Twitter fill="#ffffff" />
      </Icon>
      <Icon href="https://reddit.com/r/Elastos">
        <Reddit fill="#ffffff" />
      </Icon>
    </Icons>
  </Wrapper>
)

export default JoinCommunity

const Wrapper = styled.div`
  margin-top: 2em;
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
  text-align: center;
  color: #050717;
`

const Icons = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3em;
`

const Icon = styled.a`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 53px;
  height: 53px;
  border-radius: 50%;
  background: linear-gradient(to bottom, #1ff5c9, #1e8771);
  margin-right: 5em;
  &:last-child {
    margin-right: 0;
  }
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-right: 2em;
  }
`
