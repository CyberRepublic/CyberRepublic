import React from 'react'
import BasePage from '@/model/BasePage'
import styled from 'styled-components'
import { spring, presets, Motion } from 'react-motion'
import { BackTop } from 'antd'

import Meta from '@/module/common/Meta'
import Header from '@/module/layout/Header/Container'
import MobileMenu from '@/module/page/mobile/side_menu/Container'

import FundingProcess from './FundingProcess'
import AddSuggestionDoc from './AddSuggestionDoc'
import Footer from '@/module/layout/Footer/Container'
// import JoinCommunity from './JoinCommunity'
import Hero from './Hero'

export default class extends BasePage {
  constructor(props) {
    super(props)

    this.state = {
      showMobile: false
    }

    analytics.page(location.pathname)
  }

  toggleMobileMenu() {
    this.setState({
      showMobile: !this.state.showMobile
    })
  }

  ord_renderPage() {
    const s = this.ord_animate()
    const mp = {
      defaultStyle: {
        left: 100
      },
      style: {
        left: spring(20, presets.noWobble)
      }
    }

    return (
      <div>
        {this.ord_renderMeta() && <Meta />}
        {this.state.showMobile && (
          <Motion {...mp}>
            {(tar) => {
              return (
                <MobileMenu
                  animateStyle={s.style_fn(tar)}
                  toggleMobileMenu={this.toggleMobileMenu.bind(this)}
                />
              )
            }}
          </Motion>
        )}
        <Header toggleMobileMenu={this.toggleMobileMenu.bind(this)} />
        <Hero />
        <div className="c_Content">{this.ord_renderContent()}</div>
        <BackTop />
      </div>
    )
  }

  ord_animate() {
    // the width of the menu is 80vw
    return {
      style_fn: (val) => {
        return {
          left: `${val.left}vw`
        }
      }
    }
  }

  ord_renderMeta(f = true) {
    const { match } = this.props
    const flag = match && match.path === '/suggestion/:id'
    return flag ? false : f
  }

  ord_loading(f = false) {
    this.setState({ loading: f })
  }

  ord_renderContent() {
    return (
      <div>
        <Main>
          <FundingProcess />
          <AddSuggestionDoc />
          {/* <JoinCommunity /> */}
        </Main>
        <Footer />
      </div>
    )
  }
}

const Main = styled.div`
  font-family: 'Inter', sans-serif;
  max-width: 1050px;
  margin: 0 auto;
  @media (max-width: 1200px) {
    margin: 0 48px;
  }
  @media (max-width: 768px) {
    margin: 0 26px;
  }
`
