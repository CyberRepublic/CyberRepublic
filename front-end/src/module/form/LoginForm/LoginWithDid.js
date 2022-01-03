import React, { Component } from 'react'
import styled from 'styled-components'
import { Popover, Spin, message, Modal, Button } from 'antd'
import I18N from '@/I18N'
import QRCode from 'qrcode.react'
import ScanSvgIcon from '@/module/common/ScanSvgIcon'

class LoginWithDid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      visible: false,
      modalVisible: false,
      did: ''
    }
    this.timerDid = null
  }

  elaQrCode = () => {
    const { url } = this.state
    return (
      <Content>{url ? <QRCode value={url} size={180} /> : <Spin />}</Content>
    )
  }

  polling = async () => {
    if (!this._isMounted) {
      return
    }
    const { url } = this.state
    const rs = await this.props.checkElaAuth(url)
    if (rs && rs.success === true) {
      clearTimeout(this.timerDid)
      this.timerDid = null
      if (rs.did) {
        this.setState({
          visible: false,
          modalVisible: true,
          did: rs.did
        })
      }
      return
    }
    if (rs && rs.success === false) {
      clearTimeout(this.timerDid)
      this.timerDid = null
      if (rs.message) {
        message.error(rs.message)
      }
      this.setState({ visible: false })
      return
    }
    if (this._isMounted) {
      clearTimeout(this.timerDid)
      this.timerDid = setTimeout(this.polling, 3000)
    }
  }

  handleClick = () => {
    if (!this.timerDid) {
      this.timerDid = setTimeout(this.polling, 3000)
    }
  }

  componentDidMount = async () => {
    this._isMounted = true
    const rs = await this.props.loginElaUrl()
    if (rs && rs.success) {
      this.setState({ url: rs.url })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    clearTimeout(this.timerDid)
    this.timerDid = null
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible })
  }

  handleModalClick = () => {
    const { did } = this.state
    if (did) {
      this.props.changeTab('register', did)
      this.setState({ modalVisible: false })
    }
  }

  hideModal = () => {
    this.setState({ modalVisible: false })
  }

  modalContent = () => {
    return (
      <StyledContent>
        <Notice>{I18N.get('login.modal.content')}</Notice>
        <AntButton
          className="cr-btn cr-btn-primary"
          onClick={this.handleModalClick}
        >
          {I18N.get('login.modal.register')}
        </AntButton>
      </StyledContent>
    )
  }

  render() {
    const { visible, modalVisible } = this.state
    return (
      <Wrapper>
        <Popover
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
          content={this.elaQrCode()}
          trigger="click"
          placement="top"
        >
          <ScanEntry>
            <ScanSvgIcon />
            <StyledButton onClick={this.handleClick}>
              {I18N.get('login.withDid')}
            </StyledButton>
          </ScanEntry>
        </Popover>
        <Modal
          maskClosable={false}
          visible={modalVisible}
          onCancel={this.hideModal}
          footer={null}
          width={500}
        >
          {this.modalContent()}
        </Modal>
      </Wrapper>
    )
  }
}

export default LoginWithDid

const Wrapper = styled.div`
  margin-top: 32px;
  text-align: center;
`
const StyledButton = styled.span`
  font-size: 18px;
  color: #65bda3;
  padding-left: 10px;
  display: inline-block;
  margin-top: -4px;
`
const Content = styled.div`
  padding: 16px;
  text-align: center;
  border-radius: 16px;
  background-color: #ffffff;
`
const Notice = styled.div`
  font-size: 16px;
  color: #000;
  margin-bottom: 24px;
  text-align: left;
`
const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 360px;
  align-items: center;
`
const AntButton = styled(Button)`
  width: 100px;
`
const ScanEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
