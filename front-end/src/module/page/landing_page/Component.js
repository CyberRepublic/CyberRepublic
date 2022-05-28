import React from 'react'
import styled from 'styled-components'
import StandardPage from '../StandardPage'
import FundingProcess from './FundingProcess'
import Footer from '@/module/layout/Footer/Container'

export default class extends StandardPage {
  ord_renderContent() {
    return (
      <div className="c_Home">
        <Main>
          <FundingProcess />
        </Main>
        <Footer />
      </div>
    )
  }
}

const Main = styled.div`
  /* max-width: 1200px; */
  margin: 0 auto;
  text-align: center;
`
