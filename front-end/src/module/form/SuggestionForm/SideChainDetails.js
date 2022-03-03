import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Input, InputNumber } from 'antd'
import I18N from '@/I18N'

const { TextArea } = Input

class SideChainDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      details: props.initialValue ? props.initialValue : {}
    }
  }

  changeValue() {
    const { onChange, callback } = this.props
    const { details } = this.state
    onChange(details)
    callback('sideChainDetails')
  }

  handleChange = (e, field) => {
    const error = `${field}Err`
    const { details } = this.state
    this.setState(
      {
        details: { ...details, [field]: e.target.value },
        [error]: !e.target.value
      },
      () => {
        this.changeValue()
      }
    )
  }

  handleMagicNumber = (value) => {
    const { details } = this.state
    this.setState(
      {
        details: { ...details, magic: value },
        magicErr: !value
      },
      () => {
        this.changeValue()
      }
    )
  }
  handleEffectiveHeight = (value) => {
    const { details } = this.state
    this.setState(
      {
        details: { ...details, effectiveHeight: value },
        effectiveHeightErr: !value
      },
      () => {
        this.changeValue()
      }
    )
  }
  handleExchangeRate = (value) => {
    const { details } = this.state
    this.setState(
      {
        details: { ...details, exchangeRate: value },
        exchangeRateErr: !value
      },
      () => {
        this.changeValue()
      }
    )
  }

  render() {
    const { details } = this.state
    const { otherInfo } = details
    return (
      <Wrapper>
        {[
          'name',
          'resourcePath',
          'magic',
          'genesisHash',
          'effectiveHeight',
          'exchangeRate'
        ].map((item) => {
          return (
            <Section key={item}>
              <Label>
                {I18N.get(`suggestion.form.type.sideChain.${item}`)}*
              </Label>
              <div style={{ width: '100%' }}>
                {item === 'magic' && (
                  <InputNumber
                    onChange={this.handleMagicNumber}
                    defaultValue={details[item]}
                    style={{ width: '100%' }}
                    min={1}
                  />
                )}
                {item === 'effectiveHeight' && (
                  <InputNumber
                    onChange={this.handleEffectiveHeight}
                    defaultValue={details[item]}
                    style={{ width: '100%' }}
                    min={1}
                  />
                )}
                {item === 'exchangeRate' && (
                  <InputNumber
                    onChange={this.handleExchangeRate}
                    defaultValue={details[item]}
                    style={{ width: '100%' }}
                    min={1}
                  />
                )}
                {['name', 'resourcePath', 'genesisHash'].includes(item) && (
                  <Input
                    onChange={(e) => this.handleChange(e, item)}
                    value={details[item]}
                  />
                )}
                {this.state[`${item}Err`] && (
                  <Error>{I18N.get('suggestion.form.error.required')}</Error>
                )}
              </div>
            </Section>
          )
        })}
        <Section>
          <Label>{I18N.get('suggestion.form.type.sideChain.otherInfo')}</Label>
          <div style={{ width: '100%' }}>
            <TextArea
              onChange={(e) => this.handleChange(e, 'otherInfo')}
              value={otherInfo}
            />
          </div>
        </Section>
      </Wrapper>
    )
  }
}

SideChainDetails.propTypes = {
  initialValue: PropTypes.object
}

export default SideChainDetails

const Wrapper = styled.div`
  margin-bottom: 24px;
  max-width: 500px;
`
const Section = styled.div`
  margin-bottom: 8px;
`
const Label = styled.div`
  font-size: 13px;
  line-height: 24px;
  color: #686868;
`
const Error = styled.div`
  color: red;
  font-size: 12px;
  line-height: 1;
`
