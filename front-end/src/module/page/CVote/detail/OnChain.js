import React, { Component } from 'react'
import styled from 'styled-components'
import { Popover, Spin } from 'antd'
import I18N from '@/I18N'
import QRCode from 'qrcode.react'
import UpArrowCircleSvgIcon from '@/module/common/UpArrowCircleSvgIcon'
import { breakPoint } from '@/constants/breakPoint'

class OnChainButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      visible: false
    }
  }

  qrCode = () => {
    const { url } = this.state
    return (
      <Content>
        {url ? <QRCode value={url} size={180} /> : <Spin />}
        <Tip>{I18N.get('council.voting.essentials')}</Tip>
      </Content>
    )
  }

  componentDidMount = async () => {
    const { id, getReviewProposalUrl } = this.props
    const rs = await getReviewProposalUrl(id)
    if (rs && rs.success) {
      this.setState({ url: rs.url })
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  render() {
    let domain
    if (process.env.NODE_ENV === 'development') {
      domain = 'blockchain-did-regtest'
    } else {
      domain = 'idchain'
    }
    return (
      <Popover
        content={this.qrCode()}
        trigger="click"
        placement="left"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <VoteButton>
          <UpArrowCircleSvgIcon style={{ fill: '#008D85', marginBottom: 10 }} />
          {I18N.get('council.voting.voteResult.onchain')}
        </VoteButton>
      </Popover>
    )
  }
}

export default OnChainButton

const VoteButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #008d85;
  cursor: pointer;
  width: 120px;
  height: 100%;
  min-height: 120px;
  box-shadow: -4px 0px 6px #e5e5e5;
  flex-shrink: 0;
  @media only screen and (max-width: ${breakPoint.ipad}) {
    margin-top: 16px;
  }
`
const Content = styled.div`
  padding: 24px 24px 14px;
  text-align: center;
  border-radius: 16px;
  background-color: #ffffff;
`
const Tip = styled.div`
  font-size: 12px;
  color: #333333;
  margin-top: 16px;
  font-weight: 400;
  line-height: 17px;
`
