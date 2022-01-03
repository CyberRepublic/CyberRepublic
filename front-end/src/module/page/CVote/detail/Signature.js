import React, { Component } from 'react'
import styled from 'styled-components'
import { Form, Button, Input, message, Modal, Spin } from 'antd'
import QRCode from 'qrcode.react'
import I18N from '@/I18N'
import SwitchSvgIcon from '@/module/common/SwitchSvgIcon'

const { TextArea } = Input
const FormItem = Form.Item

class Signature extends Component {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      messageHash: '',
      message: ''
    }
    this.mtimer = null
  }

  handleSubmit = (e) => {
    e.stopPropagation() // prevent event bubbling
    e.preventDefault()
    const { isSecretary, opinion } = this.props
    isSecretary && opinion ? this.reviewApplication() : this.applyPayment()
  }

  applyPayment = () => {
    const { form, applyPayment, proposalId, stage } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        const rs = await applyPayment(proposalId, stage, {
          message: values.message.trim()
        })
        if (rs.success && rs.url) {
          this.setState({
            url: rs.url,
            messageHash: rs.messageHash
          })
          this.mtimer = setTimeout(this.pollingSignature, 3000)
        }
      }
    })
  }

  reviewApplication = () => {
    const {
      form,
      reviewApplication,
      proposalId,
      stage,
      opinion,
      application
    } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        const data = {
          reason: values.message.trim(),
          opinion,
          applicationId: application._id
        }
        const rs = await reviewApplication(proposalId, stage, data)
        if (rs.success && rs.url) {
          this.setState({ url: rs.url })
        }
        if (!rs.success && rs.message) {
          this.setState({ message: rs.message })
        }
      }
    })
  }

  pollingSignature = async () => {
    if (!this._isMounted) {
      return
    }
    const { proposalId, getPaymentSignature } = this.props
    const { messageHash } = this.state
    const rs = await getPaymentSignature({ proposalId, messageHash })
    if (rs && rs.success) {
      clearTimeout(this.mtimer)
      this.mtimer = null
      this.hideModal()
      return
    }
    if (rs && rs.success === false) {
      clearTimeout(this.mtimer)
      this.mtimer = null
      this.hideModal()
      if (rs.message) {
        message.error(rs.message)
      } else {
        message.error(I18N.get('milestone.exception'))
      }
      return
    }
    if (this._isMounted === true) {
      clearTimeout(this.mtimer)
      this.mtimer = setTimeout(this.pollingSignature, 3000)
    }
  }

  componentDidMount() {
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
    clearTimeout(this.mtimer)
    this.mtimer = null
  }

  signatureQrCode = () => {
    const { url } = this.state
    return (
      <Content>
        {url ? <QRCode value={url} size={300} /> : <Spin />}
        <Tip>{I18N.get('milestone.sign')}</Tip>
      </Content>
    )
  }

  renderTextare = () => {
    const { getFieldDecorator } = this.props.form
    const { isSecretary, application, isCompletion, opinion } = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        {isSecretary && opinion && <Msg>{application.message}</Msg>}
        <Label>
          <span>*</span>
          {isCompletion
            ? I18N.get('milestone.summary')
            : I18N.get('milestone.reason')}
        </Label>
        <FormItem>
          {getFieldDecorator('message', {
            rules: [
              {
                required: true,
                message: I18N.get('milestone.required')
              }
            ]
          })(<TextArea rows={16} style={{ resize: 'none' }} />)}
        </FormItem>
        <Actions>
          <Button className="cr-btn cr-btn-primary" htmlType="submit">
            {I18N.get('milestone.next')}
          </Button>
        </Actions>
      </Form>
    )
  }

  hideModal = () => {
    this.setState({ url: '', message: '' })
    this.props.hideModal()
  }

  modalContent = () => {
    const { message, url } = this.state
    if (message) {
      return <div>{message}</div>
    }
    if (url) {
      return this.signatureQrCode()
    }
    return this.renderTextare()
  }

  render() {
    const { stage, isSecretary, toggle, opinion } = this.props
    const flag = opinion && opinion.toLowerCase() === 'rejected'
    return (
      <StyledModal
        maskClosable={false}
        visible={toggle}
        onCancel={this.hideModal}
        footer={null}
      >
        <Wrapper>
          {isSecretary && opinion ? (
            <Title>
              {flag
                ? I18N.get('milestone.reject')
                : I18N.get('milestone.approve')}{' '}
              {I18N.get('milestone.payment')} #{parseInt(stage) + 1}
            </Title>
          ) : (
            <Title>
              {I18N.get('milestone.request')} {I18N.get('milestone.payment')} #
              {parseInt(stage) + 1}
            </Title>
          )}

          {this.modalContent()}
        </Wrapper>
      </StyledModal>
    )
  }
}

export default Form.create()(Signature)

const Wrapper = styled.div`
  margin: 0 auto;
`
const Label = styled.div`
  font-size: 17px;
  color: #000;
  display: block;
  margin-bottom: 8px;
  > span {
    color: #ff0000;
  }
`
const Title = styled.div`
  font-size: 24px;
  line-height: 32px;
  color: #333333;
  text-align: center;
  margin-bottom: 40px;
`
const Actions = styled.div`
  display: flex;
  justify-content: center;
  > button {
    margin: 0 8px;
  }
`
const Content = styled.div`
  padding: 16px;
  text-align: center;
`
const Tip = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  margin-top: 16px;
  line-height: 17px;
`
const Msg = styled.div`
  background-color: #ececec;
  border: 1px sold #cccccc;
  padding: 8px;
  margin-bottom: 24px;
`
const StyledModal = styled(Modal)`
  .ant-modal-body {
    background: #fff !important;
  }
`
