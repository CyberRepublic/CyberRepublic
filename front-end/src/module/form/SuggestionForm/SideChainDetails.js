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
    const { details } = this.state
    this.setState(
      {
        details: { ...details, [field]: e.target.value }
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
                <Input
                  onChange={(e) => this.handleChange(e, item)}
                  value={details[item]}
                />
                {!details[item] && (
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
            {!otherInfo && (
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
