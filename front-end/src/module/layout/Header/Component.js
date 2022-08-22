import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import { Layout, Menu, Icon, Modal, Dropdown, Button } from 'antd'
import _ from 'lodash'
import I18N from '@/I18N'
import MediaQuery from 'react-responsive'
import { MAX_WIDTH_MOBILE, MIN_WIDTH_PC } from '@/config/constant'
import { USER_ROLE } from '@/constant'
import UserEditForm from '@/module/form/UserEditForm/Container'

import ChinaFlag from './ChinaFlag'
import UsFlag from './UsFlag'
import './style.scss'

const { Header } = Layout

const { analytics, location } = window

const Hamburger = () => (
  <svg
    width="14"
    height="11"
    viewBox="0 0 14 11"
    fill="#ffffff"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 0H14V1H0V0ZM0 5H14V6H0V5ZM14 10H0V11H14V10Z"
    />
  </svg>
)

export default class extends BaseComponent {
  constructor() {
    super()

    this.state = {
      affixed: false,
      popover: false,
      completing: false,
      showDidModal: false,
      invoting: false
    }
  }

  async componentDidMount() {
    const rs = await this.props.getCrRelatedStage()
    rs && this.setState({ invoting: rs.invoting })
  }

  renderCompleteProfileModal() {
    return (
      <Modal
        className="project-detail-nobar"
        visible={this.state.completing}
        onOk={this.onCompleteProfileModalOk.bind(this)}
        onCancel={this.onCompleteProfileModalCancel.bind(this)}
        footer={null}
        width="70%"
      >
        {this.state.completing && (
          <UserEditForm
            user={this.props.user}
            switchEditMode={this.onCompleteProfileModalCancel.bind(this)}
            completing={true}
          />
        )}
      </Modal>
    )
  }

  onCompleteProfileModalOk() {
    this.setState({
      completing: false
    })
  }

  onCompleteProfileModalCancel() {
    this.setState({
      completing: false
    })
  }

  renderDidModal = () => {
    const { history } = this.props
    return (
      <Modal
        className="project-detail-nobar"
        maskClosable={false}
        visible={this.state.showDidModal}
        onCancel={this.hideDidModal}
        footer={null}
        width={500}
      >
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ marginBottom: 24, fontSize: 16, color: '#000' }}>
            {I18N.get('suggestion.msg.associateDidFirst')}
          </div>
          <Button
            className="cr-btn cr-btn-primary"
            onClick={() => {
              history.push('/profile/info')
              this.setState({ showDidModal: false })
            }}
          >
            {I18N.get('suggestion.btn.associateDid')}
          </Button>
        </div>
      </Modal>
    )
  }

  hideDidModal = () => {
    this.setState({ showDidModal: false })
  }

  buildAcctDropdown() {
    const isLogin = this.props.isLogin
    const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(
      this.props.role
    )

    return (
      <Menu onClick={this.clickItem.bind(this)}>
        {isLogin ? (
          <Menu.Item key="profile/info">{I18N.get('0200')}</Menu.Item>
        ) : (
          <Menu.Item key="login">{I18N.get('0201')}</Menu.Item>
        )}
        {!isLogin && <Menu.Item key="register">{I18N.get('0202')}</Menu.Item>}
        {isLogin && <Menu.Item key="logout">{I18N.get('0204')}</Menu.Item>}
      </Menu>
    )
  }

  buildLanguageDropdown() {
    const menu = (
      <Menu onClick={this.clickItem.bind(this)} className="language-menu">
        <Menu.Item key="en">
          <div className="language">
            <UsFlag width={30} height={30} />
            <span className="language-us">English</span>
          </div>
        </Menu.Item>
        <Menu.Item key="zh">
          <div className="language">
            <ChinaFlag width={24} height={24} />
            <span className="language-cn">简体中文</span>
          </div>
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} placement="bottomCenter">
        <a className="ant-dropdown-link">
          {this.props.lang === 'en' ? (
            <UsFlag width={30} height={30} />
          ) : (
            <ChinaFlag width={24} height={24} />
          )}
        </a>
      </Dropdown>
    )
  }

  buildHelpDropdown() {
    const hasAdminAccess = [USER_ROLE.ADMIN, USER_ROLE.COUNCIL].includes(
      this.props.role
    )

    return (
      <Menu onClick={this.clickItem.bind(this)} className="help-menu">
        {this.props.isLogin && (
          <Menu.Item key="logout" style={{ color: 'red' }}>
            {I18N.get('0204')}
          </Menu.Item>
        )}
      </Menu>
    )
  }

  buildCouncilDropdown() {
    return (
      <Menu onClick={this.clickItem.bind(this)} className="help-menu">
        <Menu.Item key="council">
          {I18N.get('navigation.council.submenu.incumbent')}
        </Menu.Item>
        {this.state.invoting && (
          <Menu.Item key="candidates">
            {I18N.get('navigation.council.submenu.candidate')}
          </Menu.Item>
        )}
      </Menu>
    )
  }

  getSelectedKeys() {
    let keys = _.map(
      [
        'cr100',
        'crcles',
        'ambassadors',
        'profile',
        'admin',
        'developer',
        'social',
        'community',
        'council',
        'candidates',
        'whitepaper',
        'funding',
        'suggestion',
        'proposals'
        // 'blog'
      ],
      (key) => ((this.props.pathname || '').indexOf(`/${key}`) === 0 ? key : '')
    )

    if (_.includes(keys, 'admin')) {
      keys = _.union(_.without(keys, ['admin']), ['profile'])
    }
    return _.map(keys, function(o) {
      if (o === 'council' || o === 'candidates') {
        return 'councils'
      } else {
        return o
      }
    })
  }

  ord_render() {
    const helpDropdown = this.buildHelpDropdown()
    const isLogin = this.props.isLogin
    return (
      <div className="page_layout_header">
        <Header className="c_Header" style={{ backgroundColor: '#000000' }}>
          <Menu
            onClick={this.clickItem.bind(this)}
            className="c_Header_Menu pull-left"
            selectedKeys={this.getSelectedKeys()}
            mode="horizontal"
          >
            <Menu.Item className="c_MenuItem logo" key="landing">
              <img
                src="/assets/images/new_logo.svg"
                alt="Cyber Republic"
                className="new_logo"
              />
            </Menu.Item>
          </Menu>

          <Menu className="c_Header_Menu c_Side_Menu pull-right">
            {isLogin && (
              <Menu.Item className="c_MenuItem help no-margin" key="help">
                <MediaQuery minWidth={MIN_WIDTH_PC}>
                  <Dropdown
                    overlay={helpDropdown}
                    style={{ marginTop: '24px' }}
                  >
                    <a className="ant-dropdown-link">
                      <Hamburger />
                    </a>
                  </Dropdown>
                </MediaQuery>
              </Menu.Item>
            )}
            <Menu.Item
              className="c_MenuItem mobile"
              key="mobileMenu"
              onClick={this.props.toggleMobileMenu}
            >
              <Icon type="menu-fold" style={{ fontSize: '24px' }} />
            </Menu.Item>
            <Menu.Item
              className="mobile-language-dropdown"
              style={{ marginTop: 13 }}
            >
              <MediaQuery maxWidth={MAX_WIDTH_MOBILE}>
                <div className="pull-right language-dropdown mobile">
                  {this.buildLanguageDropdown()}
                </div>
              </MediaQuery>
            </Menu.Item>
          </Menu>

          <MediaQuery minWidth={MIN_WIDTH_PC}>
            <div className="pull-right language-dropdown">
              {this.buildLanguageDropdown()}
            </div>
          </MediaQuery>

          <Menu
            onClick={this.clickItem.bind(this)}
            className="c_Header_Menu pull-right"
            selectedKeys={this.getSelectedKeys()}
            mode="horizontal"
          >
            {this.props.isLogin ? (
              <Menu.Item className="c_MenuItem link" key="profile">
                {I18N.get('navigation.profile')}
              </Menu.Item>
            ) : (
              <Menu.Item className="c_MenuItem link" key="login">
                {I18N.get('0201')}
              </Menu.Item>
            )}
          </Menu>

          <div className="clearfix" />
          {this.renderProfileToast()}
          {this.renderCompleteProfileModal()}
          {this.renderDidModal()}
        </Header>
        <Menu
          onClick={this.clickItem.bind(this)}
          className="page_links"
          selectedKeys={this.getSelectedKeys()}
          mode="horizontal"
        >
          <Menu.Item className="c_MenuItem link" key="councils">
            <Dropdown
              overlay={this.buildCouncilDropdown()}
              placement="bottomCenter"
            >
              <a className="ant-dropdown-link">
                {I18N.get('navigation.council.title')}
              </a>
            </Dropdown>
          </Menu.Item>

          <Menu.Item className="c_MenuItem link" key="whitepaper">
            {I18N.get('navigation.whitepaper')}
          </Menu.Item>

          <Menu.Item className="c_MenuItem link" key="funding">
            {I18N.get('navigation.funding')}
          </Menu.Item>

          <Menu.Item className="c_MenuItem link" key="suggestion">
            {I18N.get('navigation.suggestion')}
          </Menu.Item>

          <Menu.Item className="c_MenuItem link" key="proposals">
            {I18N.get('navigation.proposal')}
          </Menu.Item>

          <Menu.Item className="c_MenuItem link" key="blog">
            {I18N.get('navigation.resources.submenu.blog')}
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  completeProfile = () => {
    this.setState({
      completing: true
    })
  }

  dismissToast = () => {
    this.setState({
      dismissed: true
    })

    localStorage.setItem('complete-profile-dismissed', true)
  }

  isPermanentlyDismissed() {
    return localStorage.getItem('complete-profile-dismissed')
  }

  renderProfileToast() {
    const isShow =
      !this.state.dismissed &&
      !this.isPermanentlyDismissed() &&
      this.props.isLogin &&
      _.isEmpty(this.props.user.did)
    return (
      isShow && (
        <div className="top-toast">
          <a onClick={() => this.props.history.push('/profile/info')}>
            {I18N.get('profile.complete')}
            <Icon type="right" style={{ marginLeft: 8 }} />
          </a>
          <a
            className="pull-right toast-close-container"
            onClick={this.dismissToast}
          >
            <Icon type="close" />
          </a>
        </div>
      )
    )
  }

  hasIncompleteProfile() {
    const requiredProps = [
      'profile.firstName',
      'profile.lastName',
      'profile.timezone',
      'profile.country',
      'profile.bio',
      'profile.skillset',
      'profile.profession'
    ]

    return !_.every(
      requiredProps,
      (prop) =>
        _.has(this.props.user, prop) && !_.isEmpty(_.get(this.props.user, prop))
    )
  }

  clickItem = (e) => {
    const { key } = e
    if (
      _.includes(
        [
          'landing',
          'home',
          'developer',
          'developer/learn',
          'cr100',
          'crcles',
          'ambassadors',
          'social',
          'leader',
          'community',
          'proposals',
          'directory',
          'account',
          'tasks',
          'login',
          'register',
          'signup',
          'profile/info',
          'how-to-earn',
          'help',
          'about',
          'faq',
          'contact',
          'slack',
          'suggestion',
          'council',
          'candidates',
          'constitution/1',
          'whitepaper',
          'funding'
        ],
        key
      )
    ) {
      if (key === 'landing') {
        this.props.history.push('/')
      } else if (key === 'login') {
        window.location = '/login'
      } else {
        this.props.history.push(`/${e.key}`)
      }

      // below this are exceptions from the list above
    } else if (key === 'notice') {
      // hack for now
      localStorage.setItem('popup-update', 'force')
      window.location.reload()
    } else if (key === 'logout') {
      analytics.track('HEADER_CLICKED', {
        action: 'logout',
        url: location.href
      })

      Modal.confirm({
        title: I18N.get('logout.title'),
        content: '',
        okText: I18N.get('.yes'),
        okType: 'danger',
        cancelText: I18N.get('.no'),
        onOk: () => {
          analytics.track('LOGOUT', {
            url: location.href
          })
          this.props.logout()
        },
        onCancel() {}
      })
    } else if (key === 'profile') {
      this.props.history.push('/profile/info')
    } else if (key === 'blog') {
      analytics.track('BLOG_CLICKED', {
        url: location.href
      })

      let linkToBlog = 'https://blog.cyberrepublic.org'
      // window.open(linkToBlog, '_blank')
      window.open(linkToBlog, '_self')
    } else if (_.includes(['en', 'zh'], key)) {
      analytics.track('LANGUAGE_CHANGED', {
        language: e.key,
        url: location.href
      })

      this.props.changeLanguage(e.key)
    }
  }
}
