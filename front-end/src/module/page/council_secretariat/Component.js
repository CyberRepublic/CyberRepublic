import React from 'react'
import { Col, Row, Avatar, Tabs, Popover } from 'antd'
import styled from 'styled-components'
import Footer from '@/module/layout/Footer/Container'
import I18N from '@/I18N'
import StandardPage from '../StandardPage'
import BGImg from './BGImg'
import { text, border } from '@/constants/color'
import { breakPoint } from '@/constants/breakPoint'
import './style.scss'

const { TabPane } = Tabs

export default class extends StandardPage {
  constructor(props) {
    super(props)
    this.state = {
      // save the page you are on
      tab: this.props.council.tab || '1',
      councils: [],
      secretariat: {}
    }
  }

  linkToRule() {
    this.props.history.push('/whitepaper')
  }

  async componentDidMount() {
    const data = await this.props.getCouncilsAndSecretariat()
    this.setState({ councils: data.councils, secretariat: data.secretariat })
  }

  ord_renderContent() {
    return (
      <div className="p_cs">
        <div className="ebp-header-divider" />
        <div className="p_admin_index ebp-wrap">
          <div className="d_box">
            <div className="p_content">{this.buildContent()}</div>
          </div>
          <div className="council-rule">
            <h3 className="title">{I18N.get('cs.rule.tile')}</h3>
            <span className="view-rule">
              {I18N.get('cs.rule.show.click')}{' '}
              <span className="click-here" onClick={this.linkToRule.bind(this)}>
                {I18N.get('cs.rule.show.here')}
              </span>{' '}
              {I18N.get('cs.rule.show.view')}
            </span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  buildIncumbent() {
    const { councils } = this.state

    return (
      <div className="incumbent">
        <div className="title">{I18N.get('cs.incumbent')}</div>
        <Row className="members">
          {councils &&
            councils.map((item) => {
              let email = item.email
                ? item.email
                : item.user && item.user.email
                  ? item.user.email
                  : ''

              const profile = item.user && item.user.profile
              let avatar = item.avatar
                ? item.avatar
                : profile && profile.avatar
                  ? profile.avatar
                  : ''

              const firstname =
                profile && profile.firstName ? profile.firstName : ''
              const lastname =
                profile && profile.lastName ? profile.lastName : ''
              let did = item.user && item.user.did
              let name = item.didName
                ? item.didName
                : did && did.didName
                  ? did.didName
                  : firstname + ' ' + lastname
              return (
                <Col lg={8} md={8} sm={24} className="member" key={item.index}>
                  <div className="small-rect">
                    <Avatar
                      src={avatar}
                      shape="square"
                      size={220}
                      icon="user"
                    />
                  </div>

                  <div className="big-rect">
                    <div className="content">
                      <h3 className="name">{name}</h3>
                      <Did>
                        <Popover content={item.did} placement="topLeft">
                          <Label>{I18N.get('cs.did')}:</Label> {item.did}
                        </Popover>
                      </Did>
                      <Email>
                        <Popover content={email} placement="topLeft">
                          <Label>{I18N.get('cs.contact')}:</Label> {email}
                        </Popover>
                      </Email>
                    </div>
                  </div>
                </Col>
              )
            })}
        </Row>
      </div>
    )
  }

  buildSecretariat() {
    const { secretariat } = this.state

    const profile = secretariat.user && secretariat.user.profile

    let avatar = secretariat.avatar
      ? secretariat.avatar
      : profile && profile.avatar
        ? profile.avatar
        : ''

    const email = secretariat.email
      ? secretariat.email
      : secretariat.user && secretariat.user.email
        ? secretariat.user.email
        : ''

    const firstname = profile && profile.firstName ? profile.firstName : ''
    const lastname = profile && profile.lastName ? profile.lastName : ''

    const name = secretariat.didName
      ? secretariat.didName
      : firstname + ' ' + lastname

    return (
      <div className="secretariat">
        <div className="title">{I18N.get('cs.secretariat.general')}</div>
        <Row className="members">
          <Col lg={8} md={8} sm={24} className="member">
            <div className="small-rect">
              <Avatar src={avatar} shape="square" size={220} icon="user" />
            </div>

            <div className="big-rect">
              <div className="content">
                <h3 className="name">{name}</h3>
                <Did>
                  <Popover content={secretariat.did} placement="topLeft">
                    <Label>{I18N.get('cs.did')}:</Label> {secretariat.did}
                  </Popover>
                </Did>
                <Email>
                  <Popover content={email} placement="topLeft">
                    <Label>{I18N.get('cs.contact')}:</Label> {email}
                  </Popover>
                </Email>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  buildContent() {
    const { tab } = this.props.council
    const tabBarStyle = { borderBottom: 'none', color: text.middleGray }
    return (
      <div className="cs-background">
        <BGImg />
        <div className="container">
          <div className="rect-container">
            <div className="rect" />
            <StyledTabs
              defaultActiveKey="COUNCIL"
              activeKey={tab}
              onChange={this.tabChange}
              tabBarStyle={tabBarStyle}
            >
              <TabPane
                tab={<TabTitle>{I18N.get('cs.council')}</TabTitle>}
                key="COUNCIL"
              >
                {this.buildIncumbent()}
              </TabPane>
              <TabPane
                tab={<TabTitle>{I18N.get('cs.secretariat.title')}</TabTitle>}
                key="SECRETARIAT"
                forceRender={true}
              >
                {this.buildSecretariat()}
              </TabPane>
            </StyledTabs>
          </div>
        </div>
      </div>
    )
  }

  tabChange = (activeKey) => {
    return this.props.changeTab(activeKey)
  }
}

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav .ant-tabs-tab {
    border-bottom: none;
    color: ${text.middleGray};
    padding: 0;
    :not(:last-child):after {
      content: '';
      background-color: ${border.middleGray};
      display: block;
      position: absolute;
      width: 1px;
      height: 40px;
      top: 22px;
      left: calc(100% + 16px);
      @media only screen and (max-width: ${breakPoint.mobile}) {
        height: 32px;
        top: 15px;
      }
    }
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    color: ${text.green};
  }
  .ant-tabs-ink-bar {
    display: none !important;
  }
  .ant-tabs-tab-prev-icon-target,
  .ant-tabs-tab-next-icon-target {
    color: ${text.green};
    svg {
      width: 2em;
      height: 2em;
    }
  }
`
const TabTitle = styled.div`
  font-family: 'komu-a', sans-serif;
  font-size: 64px;
  @media only screen and (max-width: ${breakPoint.mobile}) {
    font-size: 48px;
  }
`
const Did = styled.div`
  position: absolute;
  bottom: 44px;
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
  line-height: 20px;
`
const Email = styled.div`
  position: absolute;
  bottom: 17px;
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
  line-height: 20px;
`
const Label = styled.span`
  font-weight: 500;
`
