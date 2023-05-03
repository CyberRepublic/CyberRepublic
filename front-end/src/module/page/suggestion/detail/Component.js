import React from 'react'
import _ from 'lodash'
import {
  Row,
  Col,
  Spin,
  Modal,
  Input,
  Button,
  Anchor,
  Popconfirm,
  message
} from 'antd'
import { Link } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import Comments from '../common/comments/Container'
import Footer from '@/module/layout/Footer/Container'
import BackLink from '@/module/shared/BackLink/Component'
import Translation from '@/module/common/Translation/Container'
import SuggestionForm from '@/module/form/SuggestionForm/Container'
import I18N from '@/I18N'
import { LG_WIDTH } from '@/config/constant'
import { CVOTE_STATUS, SUGGESTION_TAG_TYPE } from '@/constant'
import {
  convertMarkdownToHtml,
  removeImageFromMarkdown,
  getPlanHtml,
  getBudgetHtml,
  getRelevanceHtml
} from '@/util/markdown-it'
import { logger } from '@/util'
import URI from 'urijs'
import userUtil from '@/util/user'
import { ReactComponent as CommentIcon } from '@/assets/images/icon-info.svg'
import StandardPage from '../../StandardPage'
import ActionsContainer from '../common/actions/Container'
import MetaContainer from '../common/meta/Container'
import Meta from '@/module/common/Meta'
import SocialShareButtons from '@/module/common/SocialShareButtons'
import MarkdownPreview from '@/module/common/MarkdownPreview'
import PaymentList from '@/module/form/SuggestionForm/PaymentList'
import TeamInfoList from '@/module/form/SuggestionForm/TeamInfoList'
import Milestones from '@/module/form/SuggestionForm/Milestones'
import MilestonesReadonly from '@/module/form/SuggestionForm/MilestonesReadonly'
import SignSuggestionButton from './SignSuggetionButton'
import CMSignSuggestionButton from './CMSignSuggestionButton'
import NewRoleSignSuggBtn from './NewRoleSignSuggBtn'
import {
  Container,
  Title,
  DescLabel,
  Label,
  LabelPointer,
  BtnGroup,
  StyledButton,
  CouncilComments,
  IconWrap,
  StyledAnchor,
  Subtitle,
  CreateProposalText,
  Paragraph,
  StyledRow,
  Item
} from './style'

import './style.scss'
import SignSuggestionModal from './SignSuggestionModal'
import Preamble from './Preamble'
import { SUGGESTION_TYPE, SUGGESTION_STATUS } from '@/constant'
const {
  CHANGE_PROPOSAL,
  CHANGE_SECRETARY,
  TERMINATE_PROPOSAL,
  RESERVE_CUSTOMIZED_ID,
  RECEIVE_CUSTOMIZED_ID,
  CHANGE_CUSTOMIZED_ID_FEE,
  REGISTER_SIDE_CHAIN
} = SUGGESTION_TYPE
const { TextArea } = Input

export default class extends StandardPage {
  constructor(props) {
    super(props)

    // we use the props from the redux store if its retained
    this.state = {
      isDropdownActionOpen: false,
      showMobile: false,
      showForm: false,
      needsInfoVisible: false,
      proposeLoading: false,
      invoting: false
    }
  }

  async componentDidMount() {
    super.componentDidMount()
    const rs = await Promise.all([
      this.refetch(true),
      this.props.getDraft(_.get(this.props, 'match.params.id')),
      this.props.getCrRelatedStage()
    ])
    if (rs && rs[2]) {
      this.setState({ invoting: rs[2].invoting })
    }
  }

  componentWillUnmount() {
    this.props.resetDetail()
  }

  renderAnchors() {
    const type = _.get(this.props, 'detail.type')
    const fields = [
      'preamble',
      'abstract',
      'motivation',
      'goal',
      'plan',
      'relevance',
      'budget'
    ]
    const newFields = ['preamble', 'abstract', 'motivation']
    const isNewType = _.includes(
      [CHANGE_PROPOSAL, CHANGE_SECRETARY, TERMINATE_PROPOSAL],
      type
    )
    let sections = fields
    if (isNewType) {
      sections = newFields
    }
    if (type === RESERVE_CUSTOMIZED_ID) {
      sections = ['preamble', 'abstract', 'motivation', 'didNameList']
    }
    if (type === RECEIVE_CUSTOMIZED_ID) {
      sections = [
        'preamble',
        'abstract',
        'motivation',
        'customizedIDBindToDID',
        'receivedCustomizedIDList'
      ]
    }
    if (type === CHANGE_CUSTOMIZED_ID_FEE) {
      sections = [
        'preamble',
        'abstract',
        'motivation',
        'customizedIDFee',
        'effectiveHeightOfEID'
      ]
    }
    if (type === REGISTER_SIDE_CHAIN) {
      sections = ['preamble', 'abstract', 'motivation', 'sideChainDetails']
    }
    return (
      <StyledAnchor offsetTop={420}>
        {sections.map((section) => {
          return (
            <Anchor.Link
              key={section}
              href={`#${section}`}
              title={I18N.get(`suggestion.fields.${section}`)}
            />
          )
        })}
      </StyledAnchor>
    )
  }

  ord_renderContent() {
    const { detail, loading, currentUserId } = this.props
    if (loading || (!loading && _.isEmpty(detail))) {
      return (
        <div className="center">
          <Spin size="large" />
        </div>
      )
    }
    if (detail && detail.success && detail.empty) {
      return (
        <div className="ebp-page">
          <h1>{I18N.get('error.notfound')}</h1>
        </div>
      )
    }
    const detailNode = this.renderDetail(detail)
    const translationBtn = this.renderTranslationBtn()
    const actionsNode = this.renderActionsNode()
    const ownerActionsNode = this.renderOwnerActionsNode()
    const newOwnerActionNode = this.renderNewOwnerActionNode()
    const newSecretaryActionNode = this.renderNewSecretaryActionNode()
    const councilActionsNode = this.renderCouncilActionsNode()
    const editForm = this.renderEditForm()
    const commentNode = this.renderCommentNode()
    const socialShareButtonsNode = this.renderSocialShareButtonsNode()

    const uri = URI(this.props.location.search || '')
    const signature = _.get(detail, 'signature.data')
    const isOwner = currentUserId === _.get(detail, 'createdBy._id')

    return (
      <div>
        <Meta
          desc={detail.shortDesc}
          title={`${detail.title} - Suggestion Detail - Cyber Republic`}
          url={this.props.location.pathname}
        />

        <Container className="c_SuggestionDetail">
          <MediaQuery maxWidth={LG_WIDTH}>
            <div>
              <BackLink
                link={{
                  pathname: '/suggestion',
                  query: detail.old ? detail.old : false,
                  state: 'return'
                }}
                style={{ position: 'relative', left: 0, marginBottom: 15 }}
              />
              {this.renderAnchors()}
            </div>
            <div>
              {detailNode}
              {translationBtn}
              {socialShareButtonsNode}
              {actionsNode}
              {ownerActionsNode}
              {newOwnerActionNode}
              {newSecretaryActionNode}
              {councilActionsNode}
            </div>
            <div id="comments" name="comments" style={{ marginTop: 60 }}>
              {commentNode}
            </div>
          </MediaQuery>
          <MediaQuery minWidth={LG_WIDTH + 1}>
            <BackLink
              link={{
                pathname: '/suggestion',
                query: detail.old ? detail.old : false,
                state: 'return'
              }}
              style={{ position: 'fixed', left: '27px', top: '189px' }}
            />
            {this.renderAnchors()}
            <Row gutter={24}>
              <Col span={24}>
                {detailNode}
                {translationBtn}
                {socialShareButtonsNode}
                {actionsNode}
                {ownerActionsNode}
                {newOwnerActionNode}
                {newSecretaryActionNode}
                {councilActionsNode}
                <div style={{ marginTop: 60 }}>{commentNode}</div>
              </Col>
            </Row>
          </MediaQuery>
          {editForm}
          {uri.hasQuery('new') && !signature && isOwner && (
            <SignSuggestionModal
              id={detail._id}
              getSignatureUrl={this.props.getSignatureUrl}
              getSignature={this.props.getSignature}
            />
          )}
        </Container>
        <Footer />
      </div>
    )
  }

  renderDetail(detail) {
    if (!detail) return
    const fields = [
      'abstract',
      'motivation',
      'goal',
      'plan',
      'relevance',
      'budget'
    ]
    const type = _.get(detail, 'type')
    const newFields = ['abstract', 'motivation']
    const isNewType = _.includes(
      [CHANGE_PROPOSAL, CHANGE_SECRETARY, TERMINATE_PROPOSAL],
      type
    )
    let sections = fields
    if (isNewType) {
      sections = newFields
    }
    if (type === RESERVE_CUSTOMIZED_ID) {
      sections = ['abstract', 'motivation', 'didNameList']
    }
    if (type === RECEIVE_CUSTOMIZED_ID) {
      sections = [
        'preamble',
        'abstract',
        'motivation',
        'customizedIDBindToDID',
        'receivedCustomizedIDList'
      ]
    }
    if (type === CHANGE_CUSTOMIZED_ID_FEE) {
      sections = [
        'preamble',
        'abstract',
        'motivation',
        'customizedIDFee',
        'effectiveHeightOfEID'
      ]
    }
    if (type === REGISTER_SIDE_CHAIN) {
      sections = ['preamble', 'abstract', 'motivation', 'sideChainDetails']
    }
    const metaNode = this.renderMetaNode()
    const titleNode = this.renderTitleNode()
    const labelNode = this.renderLabelNode()
    const tagsNode = this.renderTagsNode()

    return (
      <div>
        {metaNode}
        {titleNode}
        <div style={{ margin: '14px 0' }}>{labelNode}</div>
        <div>{tagsNode}</div>
        <DescLabel id="preamble">
          {I18N.get('suggestion.fields.preamble')}
        </DescLabel>
        <Preamble detail={detail} user={this.props.user} />
        {sections.map((section) => {
          if (
            section === 'plan' &&
            detail.plan &&
            typeof detail.plan !== 'string'
          ) {
            return (
              <div key="plan">
                <DescLabel id="plan">
                  {I18N.get('suggestion.fields.plan')}
                </DescLabel>
                <Subtitle>{I18N.get('suggestion.plan.milestones')}</Subtitle>
                {typeof this.state.version !== 'number' ? (
                  <Milestones
                    initialValue={detail.plan.milestone}
                    editable={false}
                  />
                ) : (
                  <MilestonesReadonly
                    initialValue={detail.plan.milestone}
                    editable={false}
                  />
                )}
                <Subtitle>{I18N.get('suggestion.plan.teamInfo')}</Subtitle>
                <TeamInfoList list={detail.plan.teamInfo} editable={false} />
                <Subtitle>{I18N.get('suggestion.plan.introduction')}</Subtitle>
                <MarkdownPreview content={detail.planIntro} />
              </div>
            )
          }

          if (
            section === 'budget' &&
            detail.budget &&
            typeof detail.budget !== 'string'
          ) {
            if (_.isEmpty(detail.budget)) return null
            return (
              <div key="budget">
                <DescLabel id="budget">
                  {I18N.get('suggestion.fields.budget')}
                </DescLabel>
                <Subtitle>
                  {`${I18N.get('suggestion.budget.total')} (ELA)`}
                </Subtitle>
                <Paragraph>{detail.budgetAmount}</Paragraph>
                <Subtitle>{I18N.get('suggestion.budget.address')}</Subtitle>
                <Paragraph>{detail.elaAddress}</Paragraph>
                <Subtitle>{I18N.get('suggestion.budget.schedule')}</Subtitle>
                <PaymentList
                  list={detail.budget}
                  milestone={detail.plan.milestone}
                  editable={false}
                />
                <Subtitle>
                  {I18N.get('suggestion.budget.introduction')}
                </Subtitle>
                <MarkdownPreview content={detail.budgetIntro} />
              </div>
            )
          }

          if (
            section === 'relevance' &&
            detail.relevance &&
            typeof detail.relevance !== 'string'
          ) {
            return (
              <div key="relevance">
                <DescLabel id="relevance">
                  {I18N.get(`suggestion.fields.relevance`)}
                </DescLabel>
                {detail.relevance.map((item, index) => {
                  return (
                    item && (
                      <StyledRow key={index}>
                        <p>
                          {I18N.get('from.SuggestionForm.proposal') + `:`}
                          <a href={`/proposals/${item.proposal}`}>
                            {item.title}
                          </a>
                        </p>
                        <p>{I18N.get('from.SuggestionForm.detail') + `:`}</p>
                        <MarkdownPreview content={item.relevanceDetail} />
                      </StyledRow>
                    )
                  )
                })}
              </div>
            )
          }

          if (section === 'sideChainDetails' && detail.sideChainDetails) {
            return (
              <div key={section}>
                <DescLabel id={section}>
                  {I18N.get(`suggestion.fields.${section}`)}
                </DescLabel>
                {[
                  'name',
                  'resourcePath',
                  'magic',
                  'genesisHash',
                  'effectiveHeight',
                  'exchangeRate',
                  'otherInfo'
                ].map((item) => {
                  return (
                    <div key={item}>
                      <Subtitle>
                        {I18N.get(`suggestion.form.type.sideChain.${item}`)}
                      </Subtitle>
                      <Paragraph>{detail.sideChainDetails[item]}</Paragraph>
                    </div>
                  )
                })}
              </div>
            )
          }

          return (
            <div key={section}>
              <DescLabel id={section}>
                {I18N.get(`suggestion.fields.${section}`)}
              </DescLabel>
              <MarkdownPreview
                content={
                  section === 'receivedCustomizedIDList'
                    ? detail[section].join(' ')
                    : detail[section]
                }
              />
            </div>
          )
        })}
      </div>
    )
  }

  renderSocialShareButtonsNode() {
    const { detail } = this.props
    return (
      <SocialShareButtons
        shareQuote={`${detail.title} - Suggestion Detail - Cyber Republic`}
      />
    )
  }

  handleShowVersionHistory = () => {
    const id = _.get(this.props, 'match.params.id')
    this.props.history.push(`/suggestion/history/${id}`)
  }

  renderTitleButton = () => {
    const { detail, currentUserId, isAdmin } = this.props
    const isOwner = currentUserId === _.get(detail, 'createdBy._id') || isAdmin
    return (
      isOwner && (
        <Button
          onClick={this.handleShowVersionHistory}
          className="btn-create-suggestion"
          htmlType="button"
          style={{ position: 'relative', top: -5, marginRight: 10 }}
        >
          {I18N.get('suggestion.form.button.showVersion')}
        </Button>
      )
    )
  }

  renderMetaNode() {
    const { detail, user } = this.props
    return (
      <MetaContainer
        data={detail}
        user={user}
        content={this.renderTitleButton()}
      />
    )
  }

  renderTitleNode() {
    const { detail } = this.props
    return <Title>{detail.title}</Title>
  }

  renderLabelNode() {
    const { isReference } = this.props
    if (!isReference) {
      return null
    }
    let result = _.get(this.props.detail, 'reference')
    let reference = _.last(result)
    const { _id, vid, status } = reference
    // when proposal is draft, do not show the label
    if (status === CVOTE_STATUS.DRAFT) return null
    const linkText = `${I18N.get('council.voting.proposal')} #${vid}`
    return (
      <Label style={{ border: 'none' }}>
        {`${I18N.get('suggestion.referred')} `}
        <Link to={`/proposals/${_id}`}>{linkText}</Link>
        {` (${I18N.get(`cvoteStatus.${status}`)})`}
      </Label>
    )
  }

  renderTagsNode() {
    const tags = _.get(this.props.detail, 'tags')
    if (_.isEmpty(tags)) return null
    const res = _.map(tags, (tag) => {
      const { type, _id, desc } = tag
      if (type === SUGGESTION_TAG_TYPE.INFO_NEEDED) {
        return (
          <div key={_id} style={{ display: 'inline' }}>
            <LabelPointer
              type={type}
              data-desc={desc && desc.replace(/(['"])/g, '\\$1')}
              onClick={() => this.setState({ needsInfoVisible: true })}
            >
              {I18N.get(`suggestion.tag.type.${type}`)}
              {'  '}
              <IconWrap>
                <CommentIcon className="more-info-icon" />
              </IconWrap>
            </LabelPointer>
            <Modal
              title={I18N.get(`suggestion.tag.type.${type}`)}
              visible={this.state.needsInfoVisible}
              onCancel={this.closeNeedsInfoModal.bind(this)}
              footer={[
                <Button
                  key="close"
                  onClick={this.closeNeedsInfoModal.bind(this)}
                >
                  Close
                </Button>
              ]}
            >
              <div style={{ fontWeight: 200, paddingBottom: '18px' }}>
                {I18N.get('suggestion.modal.pleaseUpdate')}
              </div>
              {I18N.get('suggestion.modal.commentsFromCouncil')}
              <br />
              <CouncilComments>{desc}</CouncilComments>
            </Modal>
          </div>
        )
      }

      if (type === SUGGESTION_TAG_TYPE.UNDER_CONSIDERATION) {
        return (
          <LabelPointer type={type}>
            {I18N.get(`suggestion.tag.type.${type}`)}
          </LabelPointer>
        )
      }
    })
    return res
  }

  closeNeedsInfoModal() {
    this.setState({
      needsInfoVisible: false
    })
  }

  renderTranslationBtn() {
    const { detail } = this.props
    const sections = [
      'abstract',
      'motivation',
      'goal',
      'plan',
      'relevance',
      'budget'
    ]
    const result = sections
      .map((section) => {
        if (
          section === 'plan' &&
          detail.plan &&
          typeof detail.plan !== 'string'
        ) {
          return `
            <h2 translate="no">${I18N.get('suggestion.fields.plan')}</h2>
            <p>${getPlanHtml(detail.plan.teamInfo)}</p>
            <h2 translate="no">${I18N.get(`suggestion.plan.introduction`)}</h2>
            <p>${convertMarkdownToHtml(
              removeImageFromMarkdown(detail.planIntro)
            )}</p>
          `
        }
        if (
          section === 'budget' &&
          detail.budget &&
          typeof detail.budget !== 'string'
        ) {
          return `
            <h2 translate="no">${I18N.get('suggestion.fields.budget')}</h2>
            <p translate="no">${I18N.get('suggestion.budget.total')}</p>
            <p>${detail.budgetAmount}</p>
            <p translate="no">${I18N.get('suggestion.budget.address')}</p>
            <p>${detail.elaAddress}</p>
            <p>${getBudgetHtml(detail.budget)}</p>
            <h2 translate="no">${I18N.get(
              `suggestion.budget.introduction`
            )}</h2>
            <p>${convertMarkdownToHtml(
              removeImageFromMarkdown(detail.budgetIntro)
            )}</p>
          `
        }
        if (
          section === 'relevance' &&
          detail.relevance &&
          typeof detail.relevance !== 'string'
        ) {
          return `
          <h2 translate="no">${I18N.get('suggestion.fields.relevance')}</h2>
          <p>${getRelevanceHtml(detail.relevance)}</p>
          `
        }

        return `
          <h2 translate="no">${I18N.get(`suggestion.fields.${section}`)}</h2>
          <p>${convertMarkdownToHtml(
            removeImageFromMarkdown(detail[section])
          )}</p>
          `
      })
      .join('')
    const text = `
      <h3>${detail.title}</h3>
      <br />
      <br />
      ${result}
    `
    return (
      <div style={{ marginTop: 20 }}>
        <Translation text={text} />
      </div>
    )
  }

  renderActionsNode() {
    const { detail } = this.props
    return <ActionsContainer data={detail} />
  }

  onCreated = () => {
    this.refetch()
    this.props.history.push('/proposals')
  }

  cancelSuggestion = async () => {
    const id = _.get(this.props, 'detail._id')
    await this.props.cancel(id)
  }

  renderOwnerActionsNode() {
    const {
      detail,
      currentUserId,
      isAdmin,
      draft,
      getSignatureUrl,
      getSignature
    } = this.props
    const oldData = _.get(detail, 'old')
    const signature = _.get(detail, 'signature.data')
    const isOwner = currentUserId === _.get(detail, 'createdBy._id')
    const isEditable = (isOwner || isAdmin) && !signature
    const editText =
      draft && draft.empty
        ? I18N.get('suggestion.btnText.edit')
        : I18N.get('suggestion.btnText.editDraft')
    const editButton = isEditable && (
      <div style={{ paddingRight: 16, display: 'inline-block' }}>
        <StyledButton
          type="ebp"
          className="cr-btn cr-btn-default"
          onClick={this.showEditForm}
        >
          {editText}
        </StyledButton>
      </div>
    )
    const proposalHash = _.get(detail, 'proposalHash')
    const isCancelled = _.get(detail, 'status') === SUGGESTION_STATUS.CANCELLED
    const isCancelable = !isCancelled && isOwner && signature && !proposalHash
    const cancelButton = isCancelable && (
      <div style={{ display: 'inline-block' }}>
        <StyledButton
          type="ebp"
          className="cr-btn cr-btn-default"
          onClick={this.cancelSuggestion}
        >
          {I18N.get('suggestion.btn.cancel')}
        </StyledButton>
      </div>
    )
    const isSignable = !signature && isOwner
    return (
      !oldData && (
        <div>
          {/* {cancelButton} */}
          {editButton}
          {isSignable && (
            <SignSuggestionButton
              getSignatureUrl={getSignatureUrl}
              getSignature={getSignature}
              id={detail._id}
            />
          )}
        </div>
      )
    )
  }

  renderNewOwnerActionNode() {
    const { detail, user, getOwnerSignatureUrl, getSignature } = this.props
    const newOwnerSig = _.get(detail, 'newOwnerSignature')
    if (newOwnerSig) {
      return
    }
    const currUser = _.get(user, 'did.compressedPublicKey')
    if (!currUser) {
      return
    }
    const type = _.get(detail, 'type')
    if (type !== SUGGESTION_TYPE.CHANGE_PROPOSAL) {
      return
    }
    const signature = _.get(detail, 'signature.data')
    const newOwner = _.get(detail, 'newOwnerPublicKey')
    const isNewOwner = newOwner && currUser === newOwner
    const isCancelled = _.get(detail, 'status') === SUGGESTION_STATUS.CANCELLED
    const isSignable = !isCancelled && signature && isNewOwner

    return (
      isSignable && (
        <NewRoleSignSuggBtn
          getSignatureUrl={getOwnerSignatureUrl}
          getSignature={getSignature}
          id={detail._id}
          type={SUGGESTION_TYPE.CHANGE_PROPOSAL}
        />
      )
    )
  }

  renderNewSecretaryActionNode() {
    const { detail, user, getSecretarySignatureUrl, getSignature } = this.props
    const newSecSig = _.get(detail, 'newSecretarySignature')
    if (newSecSig) {
      return
    }
    const currDID = _.get(user, 'did.id')
    if (!currDID) {
      return
    }
    const type = _.get(detail, 'type')
    if (type !== SUGGESTION_TYPE.CHANGE_SECRETARY) {
      return
    }
    const signature = _.get(detail, 'signature.data')
    const did = _.get(detail, 'newSecretaryDID')
    const isCancelled = _.get(detail, 'status') === SUGGESTION_STATUS.CANCELLED
    const isNewSecretary = did && currDID === 'did:elastos:' + did
    const isSignable = !isCancelled && signature && isNewSecretary

    return (
      isSignable && (
        <NewRoleSignSuggBtn
          getSignatureUrl={getSecretarySignatureUrl}
          getSignature={getSignature}
          id={detail._id}
          type={SUGGESTION_TYPE.CHANGE_SECRETARY}
        />
      )
    )
  }

  renderCouncilActionsNode() {
    // prettier-ignore
    const {
      isCouncil,
      isAdmin,
      isReference,
      detail,
      getCMSignatureUrl
    } = this.props
    const oldData = _.get(detail, 'old')
    if (oldData) return null

    const signature = _.get(detail, 'signature.data')
    const makeIntoProposalPanel = this.renderMakeIntoProposalPanel()
    const isCancelled = _.get(detail, 'status') === SUGGESTION_STATUS.CANCELLED
    const considerBtn = !isCancelled &&
      (isCouncil || isAdmin) &&
      signature &&
      !isReference && (
        <Col xs={24} sm={8}>
          <Popconfirm
            title={I18N.get('suggestion.modal.consideration')}
            onConfirm={() => this.consider()}
            okText={I18N.get('.yes')}
            cancelText={I18N.get('.no')}
          >
            <StyledButton type="ebp" className="cr-btn cr-btn-default">
              {I18N.get('suggestion.btnText.markConsider')}
            </StyledButton>
          </Popconfirm>
        </Col>
      )

    const type = _.get(detail, 'type')
    let isSignable = signature
    if (type === SUGGESTION_TYPE.CHANGE_PROPOSAL) {
      isSignable = signature && _.get(detail, 'newOwnerSignature')
    }
    if (type === SUGGESTION_TYPE.CHANGE_SECRETARY) {
      isSignable = signature && _.get(detail, 'newSecretarySignature')
    }
    const makeIntoProposalBtn = !isCancelled &&
      isSignable &&
      isCouncil &&
      !isReference && (
        <Col xs={24} sm={8}>
          <CMSignSuggestionButton
            getCMSignatureUrl={getCMSignatureUrl}
            id={detail._id}
            user={this.props.user}
          />
        </Col>
      )

    const { invoting } = this.state
    const invotingPanel = invoting && isCouncil && !isReference && (
      <Row style={{ marginBottom: 30 }} type="flex" justify="center">
        <Col span={24}>
          <CreateProposalText>
            {I18N.get('suggestion.label.invoting')}
          </CreateProposalText>
        </Col>
      </Row>
    )

    const res = (
      <BtnGroup>
        {makeIntoProposalPanel}
        {invotingPanel}
        {!invoting && (
          <Row type="flex" justify="start">
            {considerBtn}
            {makeIntoProposalBtn}
          </Row>
        )}
      </BtnGroup>
    )
    return !oldData && res
  }

  renderMakeIntoProposalPanel() {
    const { isReference, detail } = this.props
    if (!isReference) return null
    let result = _.get(this.props.detail, 'reference')
    let reference = _.last(result)
    const { _id, vid, proposer } = reference
    return (
      <Row style={{ marginBottom: 30 }}>
        <Row type="flex" justify="center" style={{ marginBottom: 15 }}>
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <StyledButton
              className="cr-btn cr-btn-primary cr-btn-ghost"
              disabled={true}
            >
              {I18N.get('suggestion.btn.makeIntoProposal')}
            </StyledButton>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col span={24}>
            <CreateProposalText>
              {proposer ? proposer : userUtil.formatUsername(detail.proposer)}{' '}
              {I18N.get('suggestion.label.hasMadeIntoProposal')}
              <Link to={`/proposals/${_id}`}>
                {` ${I18N.get('council.voting.proposal')} #${vid}`}
              </Link>
            </CreateProposalText>
          </Col>
        </Row>
      </Row>
    )
  }

  renderCommentNode() {
    const { detail } = this.props
    const oldData = _.get(detail, 'old')
    return (
      <Comments
        id="comments"
        type="suggestion"
        suggestion={detail}
        canPost={!oldData}
        model={detail._id}
        returnUrl={`/suggestion/${detail._id}`}
      />
    )
  }

  consider = async () => {
    const { _id } = this.props.detail
    try {
      await this.props.addTag({
        id: _id,
        type: SUGGESTION_TAG_TYPE.UNDER_CONSIDERATION
      })
      this.refetch()
      message.success(I18N.get('suggestion.msg.consideration'))
    } catch (error) {
      logger.error(error)
    }
  }

  needMoreInfo = async () => {
    const { comment } = this.state
    const { _id } = this.props.detail
    try {
      await this.props.addTag({
        id: _id,
        type: SUGGESTION_TAG_TYPE.INFO_NEEDED,
        desc: comment
      })
      this.refetch()
    } catch (error) {
      logger.error(error)
    }
  }

  showAddTagModal = () => {
    Modal.confirm({
      title: I18N.get('suggestion.modal.addTagComment'),
      content: <TextArea onChange={this.onCommentChanged} />,
      okText: I18N.get('suggestion.modal.confirm'),
      cancelText: I18N.get('suggestion.modal.cancel'),
      onOk: () => this.needMoreInfo()
    })
  }

  onCommentChanged = (e) => {
    this.setState({ comment: e.target.value })
  }

  onFormSubmit = async (param) => {
    try {
      await this.props.update(param)
      this.showEditForm()
      this.refetch()
    } catch (error) {
      logger.error(error)
    }
  }

  renderEditForm = () => {
    const { detail } = this.props

    const props = {
      onFormCancel: this.showEditForm,
      onFormSubmit: this.onFormSubmit,
      header: I18N.get('suggestion.header.edit'),
      data: detail
    }

    return (
      <Modal
        className="project-detail-nobar"
        maskClosable={false}
        visible={this.state.showForm}
        onOk={this.showEditForm}
        onCancel={this.showEditForm}
        footer={null}
        width="70%"
      >
        {this.state.showForm && <SuggestionForm {...props} />}
      </Modal>
    )
  }

  showEditForm = () => {
    const id = _.get(this.props, 'match.params.id')
    this.props.history.push(`/suggestion/${id}/edit`)
  }

  showDropdownActions = () => {
    const { isDropdownActionOpen } = this.state
    this.setState({
      isDropdownActionOpen: !isDropdownActionOpen
    })
  }

  refetch = async (incViewsNum) => {
    const id = _.get(this.props, 'match.params.id')
    await this.props.resetDetail()
    this.props.getDetail({ id, incViewsNum: !!incViewsNum })
  }

  linkSuggestionDetail(suggestionId) {
    this.props.history.push(`/suggestion/${suggestionId}`)
  }

  needDueDiligence = async () => {
    const { _id } = this.props.detail
    await this.props.needDueDiligence(_id)
    message.success(I18N.get('suggestion.msg.notify'))
  }

  needAdvisory = async () => {
    const { _id } = this.props.detail
    await this.props.needAdvisory(_id)
    message.success(I18N.get('suggestion.msg.notify'))
  }
}
