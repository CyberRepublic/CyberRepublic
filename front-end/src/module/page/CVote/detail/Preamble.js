import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment/moment'
import { Row, Col } from 'antd'
import I18N from '@/I18N'
import PopoverProfile from '@/module/common/PopoverProfile'
import styled from 'styled-components'

const Component = ({
  vid,
  title,
  proposer,
  type,
  status,
  createdAt,
  createdBy,
  reference,
  user,
  proposalHash,
  txHash,
  copyFun,
  closeProposalNum,
  newSecretaryDID,
  targetProposalNum,
  newOwnerDID,
  newAddress
}) => {
  // header
  const headerNode = (
    <Header id="preamble">{I18N.get('proposal.fields.preamble')}</Header>
  )

  // type
  const typeNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.type')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{I18N.get(`proposal.type.${type}`)}</ItemText>
      </Col>
    </Item>
  )
  // id
  const idNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>
          {I18N.get('proposal.fields.preambleSub.proposal')}
        </ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{`#${vid}`}</ItemText>
      </Col>
    </Item>
  )
  const closeProposalNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>
          {I18N.get('proposal.fields.preambleSub.closeProposalNum')}
        </ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{`#${closeProposalNum}`}</ItemText>
      </Col>
    </Item>
  )
  const targetProposalNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>
          {I18N.get('proposal.fields.preambleSub.targetProposalNum')}
        </ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{`#${targetProposalNum}`}</ItemText>
      </Col>
    </Item>
  )
  const newSecretaryNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>
          {I18N.get('proposal.fields.preambleSub.secretary')}
        </ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{`did:elastos:${newSecretaryDID}`}</ItemText>
      </Col>
    </Item>
  )
  const newOwnerNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.owner')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{`did:elastos:${newOwnerDID}`}</ItemText>
      </Col>
    </Item>
  )
  const newAddressNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.address')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{`did:elastos:${newAddress}`}</ItemText>
      </Col>
    </Item>
  )
  // title
  const titleNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.title')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{title}</ItemText>
      </Col>
    </Item>
  )
  // proposer
  const proposerNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>
          {I18N.get('proposal.fields.preambleSub.proposer')}
        </ItemTitle>
      </Col>
      <Col span={18}>
        <PopoverProfile owner={proposer} curUser={user} />
      </Col>
    </Item>
  )
  // referee
  const refereeNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.referee')}</ItemTitle>
      </Col>
      <Col span={18}>
        <PopoverProfile owner={createdBy} curUser={user} />
      </Col>
    </Item>
  )
  // status
  const statusNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.status')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{I18N.get(`cvoteStatus.${status}`)}</ItemText>
      </Col>
    </Item>
  )
  // created
  const createdNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.created')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>{moment(createdAt).format('MMM D, YYYY')}</ItemText>
      </Col>
    </Item>
  )
  // proposalHash
  const txHashNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.txHash')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>
          <a
            href={`https://blockchain.elastos.org/tx/${txHash}`}
            style={{ wordBreak: 'break-word' }}
          >
            {txHash}
          </a>
        </ItemText>
      </Col>
    </Item>
  )
  // proposalHash
  const hashNode = (
    <Item>
      <Col span={6}>
        <ItemTitle>{I18N.get('proposal.fields.preambleSub.hash')}</ItemTitle>
      </Col>
      <Col span={18}>
        <ItemText>
          <div style={{ wordBreak: 'break-word' }}>{proposalHash}</div>
          <CopyButton onClick={() => copyFun(proposalHash)}>
            {I18N.get('suggestion.btn.copyHash')}
          </CopyButton>
        </ItemText>
      </Col>
    </Item>
  )
  return (
    <div>
      {headerNode}
      {idNode}
      {titleNode}
      {proposerNode}
      {reference && reference.displayId ? refereeNode : null}
      {typeNode}
      {closeProposalNum ? closeProposalNode : null}
      {targetProposalNum ? targetProposalNode : null}
      {newSecretaryDID ? newSecretaryNode : null}
      {newOwnerDID ? newOwnerNode : null}
      {newAddress ? newAddressNode : null}
      {statusNode}
      {createdNode}
      {txHash ? txHashNode : null}
      {hashNode}
    </div>
  )
}

const propTypes = {
  vid: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  proposer: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired
}

Component.propTypes = propTypes

export default Component

const Header = styled.h4`
  font-size: 20px;
`
const Item = styled(Row)`
  margin-top: 10px;
  font-size: 13px;
  font-style: italic;
`
const ItemTitle = styled.div`
  font-weight: 400;
  :after {
    content: ':';
  }
`
const ItemText = styled.div`
  font-weight: 200;
`
const CopyButton = styled.span`
  display: inline-block;
  font-weight: 200;
  background: #008d85;
  width: 56px;
  height: 20px;
  margin-left: 30px;
  border-radius: 2px;
  font-size: 12px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
  color: #fff;
`
