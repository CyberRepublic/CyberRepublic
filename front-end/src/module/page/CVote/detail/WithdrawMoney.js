import React, { Component } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { Modal } from 'antd'
import I18N from '@/I18N'

class WithdrawMoney extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      message: ''
    }
  }

  hideModal = () => {
    this.props.hideModal()
  }

  componentDidMount = async () => {
    const { proposalId, withdraw, stage } = this.props
    const rs = await withdraw(proposalId, stage)
    if (rs && !rs.success) {
      this.setState({ message: rs.message })
    }
    if (rs && rs.success) {
      this.setState({ url: rs.url, message: '' })
    }
  }

  render() {
    const { url, message } = this.state
    return (
      <StyledModal
        maskClosable={false}
        visible={this.props.withdrawal}
        onCancel={this.hideModal}
        footer={null}
      >
        {url ? (
          <Content>
            <QRCode value={url} size={300} />
            <Tip>{I18N.get('milestone.scanToWithdraw')}</Tip>
          </Content>
        ) : (
          <Content>{message}</Content>
        )}
      </StyledModal>
    )
  }
}

export default WithdrawMoney

const Content = styled.div`
  padding: 24px 24px 14px;
  text-align: center;
`
const Tip = styled.div`
  font-size: 12px;
  color: #333333;
  margin-top: 16px;
  font-weight: 400;
  line-height: 17px;
`
const StyledModal = styled(Modal)`
  .ant-modal-body {
    background: #fff !important;
  }
`
