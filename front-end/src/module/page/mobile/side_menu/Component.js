import React from 'react'
import BaseComponent from '@/model/BaseComponent'

import { Row, Col, Icon, Menu, Modal } from 'antd'

import './style'
import _ from 'lodash'
import I18N from '@/I18N'

// import { USER_LANGUAGE } from '@/constant'

const { analytics, location } = window

export default class extends BaseComponent {
  handleMenuClick(ev) {
    const key = ev.key

    if (
      _.includes(
        [
          // 'cr100',
          // 'crcles',
          // 'ambassadors',
          'login',
          'register',
          'signup',
          'profile/info',
          // 'profile/teams',
          // 'developer',
          // 'developer/learn',
          // 'community',
          // 'help',
          // 'about',
          // 'faq',
          // 'contact',
          'suggestion',
          'proposals',
          'funding',
          // 'constitution/1',
          'whitepaper',
          'council',
          'candidates'
          // 'what-is-new',
        ],
        key
      )
    ) {
      this.props.history.push(`/${ev.key}`)
    } else if (key === 'logout') {
      Modal.confirm({
        title: I18N.get('logout.title'),
        content: '',
        okText: I18N.get('.yes'),
        okType: 'danger',
        cancelText: I18N.get('.no'),
        onOk: () => {
          this.props.logout()
        },
        onCancel() {}
      })
    } else if (key === 'teams') {
      this.props.history.push(
        '/developer/search?lookingFor=TEAM&sortBy=createdAt&sortOrder=DESC'
      )
    } else if (key === 'blog') {
      // eslint-disable-next-line no-undef
      analytics.track('BLOG_CLICKED', {
        url: location.href
      })

      let linkToBlog = 'https://blog.cyberrepublic.org'

      // if (I18N.getLang() === USER_LANGUAGE.zh) {
      //   linkToBlog += `/${USER_LANGUAGE.zh}`
      // }

      window.location.href = linkToBlog
    } else if (key === 'landing') {
      this.props.history.push('/')
    }
  }

  ord_render() {
    const isLogin = this.props.user.is_login
    // animateStyle is passed in and handled by react-motion
    return (
      <div
        className="c_mobileMenu"
        style={{ ...this.props.animateStyle, zIndex: 1000 }}
      >
        <Row>
          <Col className="right-align">
            <Icon
              className="closeMobileMenu"
              type="menu-unfold"
              onClick={this.props.toggleMobileMenu}
            />
          </Col>
        </Row>
        <Row>
          <Col className="menuContainer">
            <Menu onClick={this.handleMenuClick.bind(this)} mode="inline">
              <Menu.Item key="landing">{I18N.get('0012')}</Menu.Item>

              <Menu.Item key="council">
                {I18N.get('navigation.council.title')}
              </Menu.Item>

              <Menu.Item key="candidates">
                {I18N.get('navigation.council.submenu.candidate')}
              </Menu.Item>

              <Menu.Item key="whitepaper">
                {I18N.get('navigation.whitepaper')}
              </Menu.Item>

              <Menu.Item key="funding">
                {I18N.get('navigation.funding')}
              </Menu.Item>

              <Menu.Item key="suggestion">
                {I18N.get('navigation.suggestion')}
              </Menu.Item>

              <Menu.Item key="proposals">
                {I18N.get('navigation.proposal')}
              </Menu.Item>

              <Menu.Item key="blog">
                {I18N.get('navigation.resources.submenu.blog')}
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
        <Row>
          <Col className="menuContainer">
            <Menu onClick={this.handleMenuClick.bind(this)} mode="inline">
              {isLogin && (
                <Menu.Item key="profile/info">{I18N.get('0104')}</Menu.Item>
              )}
              {!isLogin && (
                <Menu.Item key="login">{I18N.get('0201')}</Menu.Item>
              )}
              {isLogin && (
                <Menu.Item key="logout" style={{ color: 'red' }}>
                  {I18N.get('0204')}
                </Menu.Item>
              )}
            </Menu>
          </Col>
        </Row>
      </div>
    )
  }
}
