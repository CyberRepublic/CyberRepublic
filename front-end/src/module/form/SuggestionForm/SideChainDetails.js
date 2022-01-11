import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Input } from 'antd'
import I18N from '@/I18N'

const { TextArea } = Input

class SideChainDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      details: props.initialValue ? props.initialValue : {},
      nameErr: '',
      magicErr: '',
      genesisHashErr: '',
      effectiveHeightErr: '',
      exchangeRateErr: '',
      otherInfoErr: ''
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

  render() {
    const {
      details,
      nameErr,
      magicErr,
      genesisHashErr,
      effectiveHeightErr,
      exchangeRateErr,
      otherInfoErr
    } = this.state
    const {
      name,
      magic,
      genesisHash,
      exchangeRate,
      effectiveHeight,
      otherInfo
    } = details
    return (
      <Wrapper>
        <Section>
          <Label>{I18N.get('suggestion.form.type.sideChain.name')}</Label>
          <div style={{ width: '100%' }}>
            <Input
              onChange={(e) => this.handleChange(e, 'name')}
              value={name}
            />
            {nameErr && (
              <Error>{I18N.get('suggestion.form.error.required')}</Error>
            )}
          </div>
        </Section>

        <Section>
          <Label>{I18N.get('suggestion.form.type.sideChain.magic')}</Label>
          <div style={{ width: '100%' }}>
            <Input
              onChange={(e) => this.handleChange(e, 'magic')}
              value={magic}
            />
            {magicErr && (
              <Error>{I18N.get('suggestion.form.error.required')}</Error>
            )}
          </div>
        </Section>
        <Section>
          <Label>
            {I18N.get('suggestion.form.type.sideChain.genesisHash')}
          </Label>
          <div style={{ width: '100%' }}>
            <Input
              onChange={(e) => this.handleChange(e, 'genesisHash')}
              value={genesisHash}
            />
            {genesisHashErr && (
              <Error>{I18N.get('suggestion.form.error.required')}</Error>
            )}
          </div>
        </Section>
        <Section>
          <Label>
            {I18N.get('suggestion.form.type.sideChain.exchangeRate')}
          </Label>
          <div style={{ width: '100%' }}>
            <Input
              onChange={(e) => this.handleChange(e, 'exchangeRate')}
              value={exchangeRate}
            />
            {exchangeRateErr && (
              <Error>{I18N.get('suggestion.form.error.required')}</Error>
            )}
          </div>
        </Section>
        <Section>
          <Label>
            {I18N.get('suggestion.form.type.sideChain.effectiveHeight')}
          </Label>
          <div style={{ width: '100%' }}>
            <Input
              onChange={(e) => this.handleChange(e, 'effectiveHeight')}
              value={effectiveHeight}
            />
            {effectiveHeightErr && (
              <Error>{I18N.get('suggestion.form.error.required')}</Error>
            )}
          </div>
        </Section>
        <Section>
          <Label>{I18N.get('suggestion.form.type.sideChain.otherInfo')}</Label>
          <div style={{ width: '100%' }}>
            <TextArea
              onChange={(e) => this.handleChange(e, 'otherInfo')}
              value={otherInfo}
            />
            {otherInfoErr && (
              <Error>{I18N.get('suggestion.form.error.required')}</Error>
            )}
          </div>
        </Section>
      </Wrapper>
    )
  }
}

SideChainDetails.propTypes = {
  onChange: PropTypes.func,
  initialValue: PropTypes.array
}

export default SideChainDetails

const Wrapper = styled.div`
  margin-bottom: 24px;
  max-width: 500px;
`
const Section = styled.div``
const Label = styled.div``
