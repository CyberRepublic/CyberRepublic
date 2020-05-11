import React, { Component } from 'react'
import styled from 'styled-components'
import { Popover, Spin, message, Popconfirm } from 'antd'
import QRCode from 'qrcode.react'
import { StyledButton } from './style'

class SignSuggestionButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      visible: false
    }
    this.timerDid = null
  }

  elaQrCode = () => {
    const { url } = this.state
    return (
      <Content>
        {url ? <QRCode value={url} size={145} /> : <Spin />}
        <Tip>Scan the QR code above to sign your suggestion.</Tip>
      </Content>
    )
  }

  pollingSignature = () => {
    this.timerDid = setInterval(async () => {
      const rs = await this.props.getSignature()
      if (rs && rs.success) {
        clearInterval(this.timerDid)
        this.timerDid = null
        this.setState({ url: '', visible: false })
      }
      if (rs && rs.success === false) {
        clearInterval(this.timerDid)
        this.timerDid = null
        if (rs.message) {
          message.error(rs.message)
        } else {
          message.error('Something went wrong')
        }
        this.setState({ visible: false })
      }
    }, 3000)
  }

  handleSign = async () => {
    if (this.timerDid) {
      return
    }
    this.pollingSignature()
  }

  componentDidMount = async () => {
    const rs = await this.props.getSignatureUrl()
    if (rs && rs.success) {
      this.setState({ url: rs.url })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerDid)
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  render() {
    return (
      <Popover
        content={this.elaQrCode()}
        trigger="click"
        placement="top"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <Popconfirm
          title={'You can not edit your suggestion once it is signed.'}
          onConfirm={() => {}}
          okText={I18N.get('.yes')}
          cancelText={I18N.get('.no')}
        >
          <StyledButton
            className="cr-btn cr-btn-default"
            onClick={this.handleSign}
          >
            Sign Suggestion
          </StyledButton>
        </Popconfirm>
      </Popover>
    )
  }
}

export default SignSuggestionButton

const Content = styled.div`
  padding: 16px;
  text-align: center;
`
const Tip = styled.div`
  font-size: 14px;
  color: #000;
  margin-top: 16px;
`