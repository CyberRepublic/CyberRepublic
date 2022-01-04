import React, { Component } from 'react'
import styled from 'styled-components'
import { Popover, Spin } from 'antd'
import QRCode from 'qrcode.react'
import I18N from '@/I18N'
import { StyledButton } from './style'

class NewRoleSignSuggBtn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',

      visible: false,
      message: ''
    }
    this.timer = null
  }

  elaQrCode = () => {
    const { url, message } = this.state
    if (message) {
      return <Content>{message}</Content>
    }
    return (
      <Content>
        {url ? <QRCode value={url} size={240} /> : <Spin />}
        <Tip>{I18N.get('suggestion.msg.signQRCode')}</Tip>
      </Content>
    )
  }

  pollingSignature = async () => {
    if (!this._isMounted) {
      return
    }
    const { id, getSignature, type } = this.props
    const rs = await getSignature(id, type)
    if (rs) {
      clearTimeout(this.timer)
      this.timer = null
      this.setState({ visible: false })
      return
    }
    if (this._isMounted === true) {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.pollingSignature, 3000)
    }
  }

  handleSign = async () => {
    if (this.state.url) {
      return
    }
    const { id, getSignatureUrl } = this.props
    const rs = await getSignatureUrl(id)
    if (rs && rs.success) {
      this.setState({ url: rs.url, message: '' })
      this.timer = setTimeout(this.pollingSignature, 3000)
    }
    if (rs && !rs.success) {
      this.setState({ message: rs.message, url: '' })
    }
  }

  componentDidMount = async () => {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
    clearTimeout(this.timer)
    this.timer = null
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
        <StyledButton
          className="cr-btn cr-btn-default"
          onClick={this.handleSign}
        >
          {I18N.get('suggestion.btn.signSuggetion')}
        </StyledButton>
      </Popover>
    )
  }
}

export default NewRoleSignSuggBtn

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
