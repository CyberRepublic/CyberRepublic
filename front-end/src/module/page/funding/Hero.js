import React from 'react'
import styled from 'styled-components'
import I18N from '@/I18N'

const Main = styled.div`
  display: flex;
  background-color: black;
  align-items: center;
  justify-content: center;
  padding: 0 8em;
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`
const Left = styled.div`
  flex: 1;
  padding: 3em;
  @media (max-width: 768px) {
    padding: 3em 0;
  }
`
const HeroTitle = styled.h1`
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 40px;
  line-height: 1.2em;
  @media (max-width: 768px) {
    font-size: 28px;
  }
  color: #ffffff;
  text-shadow: 0px 0px 35px rgba(255, 255, 255, 0.44);
`

const FundLink = styled.a`
  display: inline-block;
  margin-top: 20px;
  color: #1ff5c9;
  font-size: 20px;
  line-height: 1.5em;
  font-weight: 400;
  text-decoration-line: underline;
  text-underline-offset: 8px;
  text-decoration-thickness: 2px;
`

const HeroText = styled.div`
  margin-top: 3em;
  padding-right: 5em;
  font-size: 16px;
  line-height: 1.75em;
  font-weight: 400;
  @media (max-width: 768px) {
    padding-right: 0;
  }
  color: #b8bbd6;
`

const Right = styled.div`
  flex: 1;
  color: white;
  display: flex;
  @media (max-width: 768px) {
    display: none;
  }
  align-items: center;
  justify-content: center;
`

const HeroBg = styled.img`
  width: 100%;
`

const Hero = () => (
  <Main>
    <Left>
      <HeroTitle>{I18N.get('funding.hero.welcome')}</HeroTitle>
      <FundLink href="/suggestion">{I18N.get('funding.hero.link')}</FundLink>
      <HeroText>{I18N.get('funding.hero.description')}</HeroText>
    </Left>
    <Right>
      <HeroBg src="/assets/images/heroBg.svg" alt="bg" />
    </Right>
  </Main>
)

export default Hero
