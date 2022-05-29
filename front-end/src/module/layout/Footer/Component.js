import React from 'react'
import BaseComponent from '@/model/BaseComponent'
import I18N from '@/I18N'
import { ELASTOS_LINKS } from '@/constant'
import styled from 'styled-components'

export default class extends BaseComponent {
  ord_render() {
    return (
      <Content>
        <a href="/vision">{I18N.get('vision.00')}</a>
        <a href={ELASTOS_LINKS.GITHUB} target="_blank">
          {I18N.get('landing.footer.github')}
        </a>
        <a href="/terms">{I18N.get('landing.footer.termsAndConditions')}</a>
      </Content>
    )
  }
}

const Content = styled.div`
  margin-top: 84px;
  background: #050717;
  height: 64px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    padding-right: 32px;
  }
  a:last-child {
    padding-right: 0;
  }
`
