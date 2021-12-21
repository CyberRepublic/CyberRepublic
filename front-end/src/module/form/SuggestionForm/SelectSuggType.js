import React, { Component } from 'react'
import { Radio, Input, Checkbox, Select } from 'antd'
import styled from 'styled-components'
import I18N from '@/I18N'
import { SUGGESTION_TYPE } from '@/constant'
import _ from 'lodash'
const { Option } = Select
const {
  NEW_MOTION,
  CHANGE_PROPOSAL,
  CHANGE_SECRETARY,
  TERMINATE_PROPOSAL,
  RESERVE_CUSTOMIZED_ID
} = SUGGESTION_TYPE

class SelectSuggType extends Component {
  constructor(props) {
    super(props)
    const value = props.initialValue
    this.state = {
      type: (value && value.type) || '1',
      newSecretaryDID: (value && value.newSecretaryDID) || '',
      proposalNum: value && value.proposalNum,
      newOwnerDID: (value && value.newOwnerDID) || '',
      termination: value && value.termination,
      changeOwner: value && value.newOwnerDID ? true : false,
      changeAddress: value && value.newAddress ? true : false,
      newAddress: value && value.newAddress,
      proposals: [],
      isChange: false,
      changeType: (value && value.type) || '1',
      controVar: this.props.controVar
    }
  }

  componentDidMount = async () => {
    const docs = await this.props.getActiveProposals()
    const proposals = docs.map((el) => ({
      value: el.vid,
      text: `#${el.vid} ${el.title}`
    }))
    this.setState({ proposals })
  }

  componentDidUpdate() {
    const { initialValue: value, controVar: preVar } = this.props
    const {
      type,
      newSecretaryDID,
      termination,
      proposalNum,
      newAddress,
      newOwnerDID,
      controVar
    } = this.state
    if (preVar !== controVar) {
      if (value.type === CHANGE_SECRETARY) {
        const data = {
          type,
          newSecretaryDID: newSecretaryDID == '' ? undefined : newSecretaryDID
        }
        if (!_.isEqual(value, data)) {
          this.dupOperating(value, preVar)
        }
      }

      if (value.type === TERMINATE_PROPOSAL) {
        const data = { type, termination }
        if (!_.isEqual(value, data)) {
          this.dupOperating(value, preVar)
        }
      }

      if (value.type === CHANGE_PROPOSAL) {
        const data = {
          type,
          proposalNum,
          newAddress,
          newOwnerDID: newOwnerDID == '' ? undefined : newOwnerDID
        }
        if (!_.isEqual(value, data)) {
          this.dupOperating(value, preVar)
        }
      }

      if (value.type === NEW_MOTION) {
        const data = {
          type
        }
        if (!_.isEqual(value, data)) {
          this.dupOperating(value, preVar)
        }
      }
    }
  }

  dupOperating(value, preVar) {
    this.setState(
      {
        ...value,
        controVar: preVar
      },
      () => {
        this.props.changeType(value.type)
        if (value.type === CHANGE_PROPOSAL) {
          this.changeProposal(value)
        }
      }
    )
  }

  changeProposal(value) {
    if (value) {
      if (value.newAddress) {
        this.handleCheckboxChange(
          { target: { checked: true } },
          'changeAddress'
        )
      }
      if (value.newOwnerDID) {
        this.handleCheckboxChange({ target: { checked: true } }, 'changeOwner')
      }
    }
  }

  changeValue() {
    const { onChange, callback } = this.props
    const {
      type,
      newOwnerDID,
      newSecretaryDID,
      proposalNum,
      termination,
      changeAddress,
      changeOwner,
      newAddress,
      proposalNumErr,
      terminationErr,
      newOwnerDIDErr,
      newAddressErr,
      newSecretaryDIDErr
    } = this.state
    let data = { type }
    switch (type) {
      case CHANGE_PROPOSAL:
        if (proposalNumErr) {
          data.hasErr = true
        }
        data.proposalNum = proposalNum
        data.changeOwner = changeOwner
        data.changeAddress = changeAddress
        if (changeOwner && !changeAddress) {
          if (newOwnerDIDErr) {
            data.hasErr = true
          }
          data.newOwnerDID = newOwnerDID
        }
        if (changeAddress && !changeOwner) {
          if (newAddressErr) {
            data.hasErr = true
          }
          data.newAddress = newAddress
        }
        if (changeAddress && changeOwner) {
          if (newOwnerDIDErr || newAddressErr) {
            data.hasErr = true
          }
          data.newOwnerDID = newOwnerDID
          data.newAddress = newAddress
        }
      case CHANGE_SECRETARY:
        data.newSecretaryDID = newSecretaryDID
        if (newSecretaryDIDErr) {
          data.hasErr = true
        }
        break
      case TERMINATE_PROPOSAL:
        data.termination = termination
        if (terminationErr) {
          data.hasErr = true
        }
        break
      default:
        break
    }
    onChange(data)
    callback('type')
  }

  validateAddress = (value) => {
    const reg = /^[E8][a-zA-Z0-9]{33}$/
    return reg.test(value)
  }

  handleAddress = (e) => {
    const value = e.target.value
    this.setState(
      { newAddress: value, newAddressErr: !this.validateAddress(value) },
      () => {
        this.changeValue()
      }
    )
  }

  handleChange = (e, field) => {
    const error = `${field}Err`
    if (field === 'type') {
      this.props.changeType(e.target.value)
      this.setState({ isChange: false })
    }
    this.setState({ [field]: e.target.value, [error]: !e.target.value }, () => {
      this.changeValue()
    })
  }

  handleNumChange = (value) => {
    this.setState({ proposalNum: value, proposalNumErr: !value }, () => {
      this.changeValue()
    })
  }

  handleTerminationChange = (value) => {
    this.setState({ termination: value, terminationErr: !value }, () => {
      this.changeValue()
    })
  }

  handleCheckboxChange = (e, field) => {
    this.setState({ [field]: e.target.checked }, () => {
      this.changeValue()
    })
  }

  render() {
    const {
      type,
      newOwnerDID,
      newSecretaryDID,
      proposalNum,
      termination,
      changeOwner,
      changeAddress,
      newAddress,
      proposalNumErr,
      newOwnerDIDErr,
      newAddressErr,
      terminationErr,
      newSecretaryDIDErr
    } = this.state
    return (
      <Wrapper>
        <Radio.Group
          onChange={(e) => this.handleChange(e, 'type')}
          value={type}
        >
          <div className="radio-item">
            <div key={NEW_MOTION}>
              <Radio value={NEW_MOTION}>
                {I18N.get(`suggestion.form.type.${NEW_MOTION}`)}
              </Radio>
              <Desc>{I18N.get(`suggestion.form.type.desc.${NEW_MOTION}`)}</Desc>
            </div>
            <div key={CHANGE_PROPOSAL}>
              <Radio value={CHANGE_PROPOSAL}>
                {I18N.get(`suggestion.form.type.${CHANGE_PROPOSAL}`)}
              </Radio>
              <Desc>
                {I18N.get(`suggestion.form.type.desc.${CHANGE_PROPOSAL}`)}
              </Desc>
              {type === CHANGE_PROPOSAL && (
                <Section>
                  <div className="number">
                    <Label>
                      {I18N.get('suggestion.form.type.proposalNum')}
                    </Label>
                    <Select
                      onChange={this.handleNumChange}
                      defaultValue={proposalNum}
                      className={proposalNumErr ? null : 'no-error'}
                    >
                      {this.state.proposals.map((el) => (
                        <Option value={el.value} key={el.value}>
                          {el.text}
                        </Option>
                      ))}
                    </Select>
                    {proposalNumErr && (
                      <Error>
                        {I18N.get('suggestion.form.error.proposalNum')}
                      </Error>
                    )}
                  </div>
                  <Checkbox
                    checked={changeOwner}
                    onChange={(e) =>
                      this.handleCheckboxChange(e, 'changeOwner')
                    }
                  >
                    {I18N.get('suggestion.form.type.changeProposalOwner')}
                  </Checkbox>
                  <Checkbox
                    checked={changeAddress}
                    onChange={(e) =>
                      this.handleCheckboxChange(e, 'changeAddress')
                    }
                  >
                    {I18N.get('suggestion.form.type.changeProposalAddress')}
                  </Checkbox>
                  {changeOwner && (
                    <div
                      className={`sub ${newOwnerDIDErr ? null : 'no-error'}`}
                    >
                      <Label>
                        {I18N.get('suggestion.form.type.proposalNewOwner')}
                      </Label>
                      <Input
                        onChange={(e) => this.handleChange(e, 'newOwnerDID')}
                        value={newOwnerDID}
                        placeholder="ibHXCt4ixWjZfbS8oNhjAfBzA8LKyyyyyy"
                      />
                      {newOwnerDIDErr && (
                        <Error>
                          {I18N.get('suggestion.form.error.newOwner')}
                        </Error>
                      )}
                    </div>
                  )}
                  {changeAddress && (
                    <div className={`sub ${newAddressErr ? null : 'no-error'}`}>
                      <Label>
                        {I18N.get('suggestion.form.type.proposalNewAddress')}
                      </Label>
                      <Input onChange={this.handleAddress} value={newAddress} />
                      {newAddressErr && (
                        <Error>
                          {I18N.get('suggestion.form.error.elaAddress')}
                        </Error>
                      )}
                      <Desc style={{ paddingLeft: 0, marginTop: 8 }}>
                        {I18N.get('suggestion.budget.addressTip')}
                      </Desc>
                    </div>
                  )}
                </Section>
              )}
            </div>
            <div key={TERMINATE_PROPOSAL}>
              <Radio value={TERMINATE_PROPOSAL}>
                {I18N.get(`suggestion.form.type.${TERMINATE_PROPOSAL}`)}
              </Radio>
              <Desc>
                {I18N.get(`suggestion.form.type.desc.${TERMINATE_PROPOSAL}`)}
              </Desc>
              {type === TERMINATE_PROPOSAL && (
                <Section>
                  <Label>{I18N.get('suggestion.form.type.proposalNum')}</Label>
                  <Select
                    onChange={this.handleTerminationChange}
                    defaultValue={termination}
                  >
                    {this.state.proposals.map((el) => (
                      <Option value={el.value} key={el.value}>
                        {el.text}
                      </Option>
                    ))}
                  </Select>
                  {terminationErr && (
                    <Error>
                      {I18N.get('suggestion.form.error.proposalNum')}
                    </Error>
                  )}
                </Section>
              )}
            </div>
            <div key={CHANGE_SECRETARY}>
              <Radio value={CHANGE_SECRETARY}>
                {I18N.get(`suggestion.form.type.${CHANGE_SECRETARY}`)}
              </Radio>
              <Desc>
                {I18N.get(`suggestion.form.type.desc.${CHANGE_SECRETARY}`)}
              </Desc>
              {type === CHANGE_SECRETARY && (
                <Section>
                  <Label>{I18N.get('suggestion.form.type.newSecretary')}</Label>
                  <Input
                    onChange={(e) => this.handleChange(e, 'newSecretaryDID')}
                    value={newSecretaryDID}
                    placeholder="ibHXCt4ixWjZfbS8oNhjAfBzA8LKxxxxxx"
                  />
                  {newSecretaryDIDErr && (
                    <Error>{I18N.get('suggestion.form.error.secretary')}</Error>
                  )}
                </Section>
              )}
            </div>
          </div>
          <div className="radio-item">
            <div key={RESERVE_CUSTOMIZED_ID}>
              <Radio value={RESERVE_CUSTOMIZED_ID}>
                {I18N.get(`suggestion.form.type.${RESERVE_CUSTOMIZED_ID}`)}
              </Radio>
              <Desc>
                {I18N.get(`suggestion.form.type.desc.${RESERVE_CUSTOMIZED_ID}`)}
              </Desc>
            </div>
          </div>
        </Radio.Group>
      </Wrapper>
    )
  }
}

export default SelectSuggType

const Wrapper = styled.div`
  .ant-radio-group {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: 768px) {
      flex-direction: column;
    }
    flex-wrap: wrap;
    .radio-item {
      width: 45%;
      @media (max-width: 768px) {
        width: unset;
      }
      & > div {
        margin-top: 16px;
      }
    }
  }
  .ant-radio-wrapper,
  .ant-checkbox-wrapper {
    color: #686868;
  }
  .ant-checkbox-wrapper + .ant-checkbox-wrapper {
    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
`

const Label = styled.div`
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 6px;
  color: #686868;
`
const Section = styled.div`
  margin-top: 24px;
  max-width: 520px;
  .number {
    margin-bottom: 16px;
    .no-error .ant-select-selection {
      border-color: #d9d9d9;
      &:active {
        border-color: #d9d9d9;
      }
      &:focus {
        box-shadow: unset;
      }
    }
    .no-error .ant-select-arrow {
      color: #d9d9d9;
    }
  }
  .sub {
    margin-top: 16px;
  }
  .sub.no-error .ant-input {
    border-color: #d9d9d9;
    &:not([disabled]):hover {
      border-color: #d9d9d9;
    }
    &:focus {
      box-shadow: unset;
    }
  }
`
const Error = styled.div`
  color: red;
  font-size: 14px;
  line-height: 1;
`
const Desc = styled.div`
  font-weight: 300;
  font-size: 12px;
  line-height: 17px;
  color: #919191;
  padding-left: 24px;
`
