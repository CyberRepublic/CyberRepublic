import React, { Component } from 'react'
import styled from 'styled-components'
import I18N from '@/I18N'
import QRCode from 'qrcode.react'
import { Popover } from 'antd'
import OpposeSvgIcon from '@/module/common/OpposeSvgIcon'

class CommunityVoteQrCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      visible: false
    }
  }

  componentDidMount = async () => {
    const rs = await this.props.getMemberVoteUrl(this.props._id)
    if (rs && rs.success) {
      this.setState({ url: rs.url })
    }
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  render() {
    const { visible } = this.state
    const content = (
      <Content>
        <QRCode value={this.state.url} size={180} />
        <Tip>{I18N.get('profile.member.vote.qrcodeTip')}</Tip>
        <Tip>{I18N.get('profile.member.vote.community')}</Tip>
      </Content>
    )
    return (
      <Popover
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        content={content}
        trigger="click"
        placement="bottom"
      >
        <ScanEntry>
          <OpposeSvgIcon />
          <StyledButton>{I18N.get('profile.member.vote')}</StyledButton>
        </ScanEntry>
      </Popover>
    )
  }
}

export default CommunityVoteQrCode

const Content = styled.div`
  padding: 28px 24px;
  text-align: center;
  border-radius: 16px;
  background-color: #ffffff;
`
const Tip = styled.div`
  font-size: 12px;
  color: #333333;
  margin-top: 16px;
  opacity: 0.8;
  &:last-child {
    margin-top: 4px;
  }
`
const ScanEntry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 100px;
`
const StyledButton = styled.span`
  font-size: 10px;
  color: #be1313;
`
