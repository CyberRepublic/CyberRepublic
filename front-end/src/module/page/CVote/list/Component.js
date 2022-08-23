import React from 'react'
import _ from 'lodash'
import moment from 'moment/moment'
import {
  Table,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Spin
} from 'antd'
import rangePickerLocale from 'antd/es/date-picker/locale/zh_CN'
import { CSVLink } from 'react-csv'
import BaseComponent from '@/model/BaseComponent'
import Meta from '@/module/common/Meta'
import I18N from '@/I18N'
import { logger } from '@/util'
import { CVOTE_RESULT, CVOTE_STATUS, CVOTE_CHAIN_STATUS } from '@/constant'
import VoteStats from '../stats/Component'
import userUtil from '@/util/user'
import { ReactComponent as UpIcon } from '@/assets/images/icon-up.svg'
import { ReactComponent as DownIcon } from '@/assets/images/icon-down.svg'
import { PROPOSAL_TYPE } from '@/constant'
// style
import {
  Container,
  List,
  Item,
  ItemUndecided,
  StyledSearch,
  FilterLabel,
  FilterPanel,
  FilterContent,
  FilterItem,
  FilterItemLabel,
  FilterClearBtn,
  CheckboxText,
  CurrentHeight,
  CurrentHeightDesc,
  CurrentHeightNum,
  CurrentHeightImg,
  CurrentHeightTitle,
  CurrentHeightUnderline,
  LegendWrapper,
  StatusWrapper
} from './style'

const { RangePicker } = DatePicker

const FILTERS = {
  ALL: 'all',
  UNVOTED: CVOTE_RESULT.UNDECIDED
}

const BUDGET_REQUESTED_OPTIONS = {
  1: { value: '0 - 100 (ELA)', budgetLow: 0, budgetHigh: 100 },
  2: { value: '100 - 1000 (ELA)', budgetLow: 100, budgetHigh: 1000 },
  3: { value: '> 1000 (ELA)', budgetLow: 1000 }
}

export default class extends BaseComponent {
  constructor(p) {
    super(p)

    const { isVisitableFilter } = this.props
    const {
      voteResult,
      search,
      status,
      budgetRequested,
      hasTrackingMsg,
      isUnvotedByYou,
      creationDate,
      author,
      type,
      endsDate
    } = this.props.filters
    this.state = {
      list: [],
      alllist: [],
      total: 1,
      loading: true,
      page: 1,
      isVisitableFilter,
      voteResult,
      search,
      status,
      budgetRequested,
      hasTrackingMsg,
      isUnvotedByYou,
      creationDate,
      author,
      type,
      endsDate,
      showOldData: false,
      fetching: false,
      isChangeNext: true,
      initNum: 0
    }

    this.authorSearch = _.debounce(this.authorSearch.bind(this), 800)
    this.debouncedRefetch = _.debounce(this.refetch.bind(this), 300)
  }

  async componentDidMount() {
    const initPage = localStorage.getItem('proposal-page')
    this.setState({ isChangeNext: false })
    if (!initPage) {
      localStorage.setItem('proposal-page', 1)
    }
    this.loadPage(localStorage.getItem('proposal-page') || 1, 10)
    this.refetch()
  }

  componentDidUpdate() {
    const { isChangeNext, initNum } = this.state
    if (isChangeNext || initNum == 0) {
      if (initNum == 0) {
        this.setState({ initNum: initNum + 1 })
      }
      window.scrollTo(0, 0)
    }
    if (this.props.location.sate === 'return') {
      window.scrollTo(0, localStorage.getItem('proposal-scrollY') || 0)
    } else {
      window.scrollTo(0, 0)
    }
  }

  handleFilter = () => {
    const { isVisitableFilter } = this.state
    this.setState({ isVisitableFilter: !isVisitableFilter })
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value })
  }

  handleStatusChange = (status) => {
    this.setState({ status })
  }

  handleBudgetRequestedChange = (budgetRequested) => {
    this.setState({ budgetRequested })
  }

  handleHasTrackingMsgChange = (e) => {
    this.setState({ hasTrackingMsg: e.target.checked })
  }

  handleIsUnvotedByYouChange = (e) => {
    this.setState({ isUnvotedByYou: e.target.checked })
  }

  handleCreationDateChange = (creationDate) => {
    this.setState({ creationDate })
  }

  handleAuthorChange = (e) => {
    this.setState({ author: e })
  }

  handleTypeChange = (type) => {
    this.setState({ type })
  }

  handleEndsDateChange = (endsDate) => {
    this.setState({ endsDate })
  }

  handleClearFilter = () => {
    const defaultFiltes = this.props.getDefaultFilters()
    this.setState({ ...defaultFiltes })
    this.props.clearFilters()
  }

  handleApplyFilter = () => {
    const {
      voteResult,
      search,
      status,
      budgetRequested,
      hasTrackingMsg,
      isUnvotedByYou,
      creationDate,
      author,
      type,
      endsDate
    } = this.state
    this.props.updateFilters({
      voteResult,
      search,
      status,
      budgetRequested,
      hasTrackingMsg,
      isUnvotedByYou,
      creationDate,
      author,
      type,
      endsDate
    })
    this.refetch()
  }

  ord_render() {
    const { isSecretary } = this.props
    const { isVisitableFilter } = this.state

    const columns = [
      {
        title: I18N.get('council.voting.number'),
        dataIndex: 'vid',
        render: (vid, item, index) => (
          <a
            className="tableLink"
            onClick={this.toDetailPage.bind(this, item._id)}
          >
            {`#${vid}`}
          </a>
        )
      },
      {
        title: I18N.get('council.voting.title'),
        dataIndex: 'title',
        width: '30%',
        render: (title, item) => (
          <a
            onClick={this.toDetailPage.bind(this, item._id)}
            className="tableLink"
          >
            {title}
          </a>
        )
      },
      {
        title: I18N.get('council.voting.type'),
        dataIndex: 'type',
        render: (type, item) => I18N.get(`proposal.type.${type}`)
      },
      {
        title: I18N.get('council.voting.author'),
        dataIndex: 'proposer.profile.firstName',
        render: (proposer, item) => userUtil.formatUsername(item.proposer)
      },
      {
        title: I18N.get('council.voting.voteByCouncil'),
        render: (id, item) => this.voteDataByUser(item)
      },
      {
        title: I18N.get('council.voting.proposedAt'),
        dataIndex: 'proposedAt',
        render: (proposedAt, doc) =>
          this.renderProposed(doc.published, proposedAt || doc.createdAt)
      },
      {
        title: I18N.get('council.voting.status'),
        render: (id, item) => {
          const status = this.renderStatus(
            item.status,
            item.rejectAmount,
            item.rejectThroughAmount
          )
          return (
            <span style={{ color: '#0f2631', fontWeight: 444 }}>{status}</span>
          )
        }
      },
      {
        title: I18N.get('council.voting.votingEndsIn'),
        dataIndex: 'proposedAt',
        key: 'endsIn',
        render: (proposedAt, item) => this.renderEndsIn(item)
      }
    ]

    const statusIndicator = (
      <StatusWrapper>
        <div style={{ paddingRight: 8 }}>
          {I18N.get('council.voting.type.legend')}:
        </div>
        <List>
          <Item status={CVOTE_RESULT.SUPPORT} />
          <span>{I18N.get('council.voting.type.support')}</span>
          <Item status={CVOTE_RESULT.REJECT} />
          <span>{I18N.get('council.voting.type.reject')}</span>
          <Item status={CVOTE_RESULT.ABSTENTION} />
          <span>{I18N.get('council.voting.type.abstention')}</span>
          <ItemUndecided status={CVOTE_RESULT.UNDECIDED} />
          <span>{I18N.get('council.voting.type.undecided')}</span>
        </List>
      </StatusWrapper>
    )

    const title = (
      <Col lg={8} md={8} sm={12} xs={24}>
        <h2
          style={{ textAlign: 'left', paddingBottom: 0 }}
          className="komu-a cr-title-with-icon"
        >
          {I18N.get('council.voting.proposalList')}
        </h2>
      </Col>
    )
    const searchInput = (
      <Col lg={8} md={8} sm={12} xs={24}>
        <StyledSearch
          value={this.state.search}
          onChange={this.handleSearchChange}
          onSearch={this.searchChangedHandler}
          placeholder={I18N.get('developer.search.search.placeholder')}
        />
      </Col>
    )

    const filterBtns = (
      <FilterLabel>
        <Row
          type="flex"
          gutter={10}
          align="middle"
          justify="start"
          onClick={this.handleFilter}
        >
          <Col>{I18N.get('elip.fields.filter')}</Col>
          <Col>{isVisitableFilter ? <UpIcon /> : <DownIcon />}</Col>
        </Row>
      </FilterLabel>
    )
    const filterPanel = this.renderFilterPanel(PROPOSAL_TYPE)
    const { list, total, loading, page } = this.state
    const currentHeight = this.renderCurrentHeight()

    return (
      <div>
        <Meta title="Cyber Republic - Elastos" />
        <Container>
          {currentHeight}
          <Row style={{ marginTop: 20 }}>{title}</Row>
          <Row
            type="flex"
            align="middle"
            justify="start"
            gutter={40}
            style={{ marginTop: 20, marginBottom: 20 }}
          >
            {searchInput}
            {filterBtns}
          </Row>
          {isVisitableFilter && filterPanel}
          <LegendWrapper>
            {isSecretary && (
              <CSVLink data={this.state.alllist}>
                {I18N.get('elip.button.exportAsCSV')}
              </CSVLink>
            )}
            {statusIndicator}
          </LegendWrapper>
          <Table
            columns={columns}
            loading={loading}
            dataSource={list}
            rowKey={(record) => record._id}
            pagination={
              {
                current: page,
                pageSize: 10,
                total,
                onChange: this.onPageChange
              } // list && list.length,
            }
          />
        </Container>
      </div>
    )
  }

  renderCurrentHeight = () => {
    const { currentHeight } = this.state
    let currentHeightDiv = null
    if (currentHeight) {
      currentHeightDiv = (
        <CurrentHeight>
          <div>
            <CurrentHeightDesc>
              <CurrentHeightImg src={'/assets/images/Elastos_Logo.png'} />
              <CurrentHeightTitle>
                {I18N.get('proposal.fields.currentHeight')}:
              </CurrentHeightTitle>
            </CurrentHeightDesc>
            <CurrentHeightNum>
              {currentHeight ? currentHeight.toLocaleString() : 0}
              <CurrentHeightUnderline />
            </CurrentHeightNum>
          </div>
        </CurrentHeight>
      )
    }
    return currentHeightDiv
  }

  onPageChange = (page, pageSize) => {
    localStorage.setItem('proposal-page', page)
    this.setState({
      isChangeNext: true
    })
    this.loadPage(page, pageSize)
  }

  getQuery = () => {
    const {
      status,
      budgetRequested,
      hasTrackingMsg,
      isUnvotedByYou,
      creationDate,
      author,
      type,
      endsDate,
      voteResult,
      search,
      showOldData
    } = this.state
    const query = {}
    const formatStr = 'YYYY-MM-DD'
    if (search) {
      query.search = search
    }
    if (!_.isEmpty(status)) {
      query.status = status
    }
    if (showOldData) {
      query.old = true
    }
    if (!_.isEmpty(budgetRequested) && budgetRequested > 0) {
      const budget = BUDGET_REQUESTED_OPTIONS[budgetRequested]
      query.budgetLow = budget.budgetLow
      if (budget.budgetHigh) {
        query.budgetHigh = budget.budgetHigh
      }
    }
    if (hasTrackingMsg) {
      query.hasTracking = hasTrackingMsg
    }
    if (isUnvotedByYou) {
      query.voteResult = FILTERS.UNVOTED
    } else {
      query.voteResult = voteResult
    }
    if (!_.isEmpty(creationDate)) {
      query.startDate = moment(creationDate[0]).format(formatStr)
      query.endDate = moment(creationDate[1]).format(formatStr)
    }
    if (!_.isEmpty(author)) {
      query.author = author
    }
    if (!_.isEmpty(type)) {
      query.type = type
    }
    if (!_.isEmpty(endsDate)) {
      query.endsInStartDate = moment(endsDate[0]).format(formatStr)
      query.endsInEndDate = moment(endsDate[1]).format(formatStr)
    }
    return query
  }

  refetch = async () => {
    this.ord_loading(true)
    const { listData, canManage, getCurrentheight, getAllAuthor } = this.props
    const param = this.getQuery()
    const page = localStorage.getItem('proposal-page') || 1
    try {
      const { list: allListData, total: allListTotal } = await listData(
        param,
        canManage
      )
      const dataCSV = []
      dataCSV.push([
        I18N.get('council.voting.number'),
        I18N.get('council.voting.title'),
        I18N.get('council.voting.type'),
        I18N.get('council.voting.author'),
        I18N.get('council.voting.voteByCouncil'),
        I18N.get('council.voting.proposedAt'),
        I18N.get('council.voting.status'),
        I18N.get('council.voting.votingEndsIn')
      ])
      _.map(allListData, (v) => {
        dataCSV.push([
          v.vid,
          v.title,
          I18N.get(`proposal.type.${v.type}`),
          v.proposedBy,
          this.voteDataByUserForCSV(v),
          _.replace(
            this.renderProposed(
              v.published,
              v.proposedAt || v.createdAt,
              true
            ) || '',
            ',',
            ' '
          ),
          this.renderStatus(v.status, v.rejectAmount, v.rejectThroughAmount),
          this.renderEndsIn(v, true)
        ])
      })
      param.page = page
      param.results = 10
      const { list, total } = await listData(param, canManage)
      const rs = await getCurrentheight()
      const authorArr = await getAllAuthor()
      this.setState({
        list,
        alllist: dataCSV,
        total,
        page: (page && parseInt(page)) || 1,
        currentHeight: rs,
        authorArr
      })
    } catch (error) {
      logger.error(error)
    }

    this.ord_loading(false)
  }

  loadPage = async (page, pageSize) => {
    this.ord_loading(true)
    const { listData, canManage } = this.props
    const query = {
      ...this.getQuery(),
      page,
      results: pageSize
    }
    try {
      const { list, total } = await listData(query, canManage)
      // const page = sessionStorage.getItem('proposalPage')
      this.setState({ list, total, page: (page && parseInt(page)) || 1 })
      sessionStorage.setItem('proposalPage', page)
    } catch (error) {
      logger.error(error)
    }
    this.ord_loading(false)
  }

  searchChangedHandler = (search) => {
    sessionStorage.removeItem('proposalPage')
    this.props.updateFilters({ search })
    this.setState({ search }, this.debouncedRefetch)
  }

  toDetailPage(id) {
    this.setState({
      isChangeNext: false
    })
    localStorage.setItem('proposal-scrollY', window.scrollY)
    // this.props.history.push(`/proposals/${id}`)
    const w = window.open('about:blank')
    w.location.href = `/proposals/${id}`
  }

  toEditPage(id) {
    this.props.history.push(`/proposals/${id}/edit`)
  }

  renderEndsIn = (item, isCSV = false) => {
    return this.renderBaseEndsIn(item, isCSV)
  }

  renderBaseEndsIn = (item, isCSV = false) => {
    if (item.status === CVOTE_STATUS.PROPOSED) {
      return this.renderVoteEndsIn(
        item.proposedEndsHeight,
        item.proposedEnds,
        isCSV
      )
    }
    if (item.status === CVOTE_STATUS.NOTIFICATION) {
      return this.renderVoteEndsIn(
        item.notificationEndsHeight,
        item.notificationEnds,
        isCSV
      )
    }
    return '--'
  }

  renderVoteEndsIn = (endsHeight, endsIn, isCSV = false) => {
    let endsInFloat = moment
      .duration(
        moment()
          .add(endsIn, 'minutes')
          .diff(moment())
      )
      .as('minutes')
    let surplusTime =
      Math.ceil(endsInFloat / 60 / 24) +
      ' ' +
      I18N.get('council.voting.votingEndsIn.days')
    if (endsInFloat <= 0) {
      surplusTime = '1 ' + I18N.get('council.voting.votingEndsIn.minutes')
    }
    if (endsInFloat > 0 && endsInFloat <= 60) {
      surplusTime =
        Math.ceil(endsInFloat) +
        ' ' +
        I18N.get('council.voting.votingEndsIn.minutes')
    }
    if (endsInFloat > 60 && endsInFloat <= 60 * 24) {
      const hours = moment
        .duration(
          moment()
            .add(endsIn, 'minutes')
            .diff(moment())
        )
        .get('h')
      const minute = moment
        .duration(
          moment()
            .add(endsIn, 'minutes')
            .diff(moment())
        )
        .get('m')
      surplusTime =
        hours +
        ' ' +
        I18N.get('council.voting.votingEndsIn.hours') +
        ' ' +
        minute +
        ' ' +
        I18N.get('council.voting.votingEndsIn.minutes')
    }
    if (endsInFloat > 60 * 24 && endsInFloat <= 60 * 24 * 2) {
      const days = moment
        .duration(
          moment()
            .add(endsIn, 'minutes')
            .diff(moment())
        )
        .get('d')
      const hours = moment
        .duration(
          moment()
            .add(endsIn, 'minutes')
            .diff(moment())
        )
        .get('h')
      surplusTime =
        days +
        ' ' +
        I18N.get('council.voting.votingEndsIn.days') +
        ' ' +
        hours +
        ' ' +
        I18N.get('council.voting.votingEndsIn.hours')
    }
    if (isCSV) {
      return `${endsHeight}( ≈ ${surplusTime})`
    }
    return (
      <span style={{ whiteSpace: 'pre-wrap' }}>
        {`${endsHeight}\n( ≈ ${surplusTime})`}
      </span>
    )
  }

  renderStatus = (status, rejectAmount, rejectThroughAmount) => {
    const percentage = (rejectAmount / (rejectThroughAmount / 0.1)) * 100
    let percentageStr = ''
    if (status == 'VETOED') {
      percentageStr =
        this.props.lang == 'en'
          ? `(${parseInt(percentage)}%)`
          : `（${parseInt(percentage)}%）`
    }
    return I18N.get(`cvoteStatus.${status}`) + percentageStr || ''
  }

  renderProposed = (published, createdAt, csv = false) => {
    const lang = localStorage.getItem('lang') || 'en'
    const format = lang === 'en' ? 'MMM D, YYYY' : 'YYYY-MM-DD'
    const formatTime = 'hh:mm:ss'
    const proposed = published && moment(createdAt).format(format)
    const detailTime = published && moment(createdAt).format(formatTime)
    if (csv) {
      return proposed + detailTime
    }
    return (
      <span style={{ whiteSpace: 'pre-wrap' }}>
        {proposed + '\n' + detailTime}
      </span>
    )
  }

  voteDataByUser = (data) => {
    return this.baseVoteDataByUser(data)
  }

  voteDataByUserForCSV = (data) => {
    return this.baseVoteDataByUser(data, true)
  }

  baseVoteDataByUser = (data, isCSV = false) => {
    const { vote_map: voteMap, voteResult, status, voteHistory } = data
    let voteArr
    if (status === CVOTE_STATUS.DRAFT) return null

    if (!_.isEmpty(voteResult)) {
      voteArr = _.map(voteResult, (item) => {
        if (item.status === CVOTE_CHAIN_STATUS.CHAINED) {
          return CVOTE_RESULT[item.value.toUpperCase()]
        }
        const index = _.findLastIndex(voteHistory, ['votedBy', item.votedBy])
        const rs = voteHistory[index]
        if (rs && rs.status === CVOTE_CHAIN_STATUS.CHAINED) {
          return CVOTE_RESULT[rs.value.toUpperCase()]
        }
        return CVOTE_RESULT.UNDECIDED
      })
    } else if (!_.isEmpty(voteMap)) {
      // deal with old data
      voteArr = _.map(
        voteMap,
        (value) => CVOTE_RESULT[value.toUpperCase()] || CVOTE_RESULT.UNDECIDED
      )
    } else {
      return ''
    }
    voteArr = _.sortBy(voteArr)
    const supportNum = _.countBy(voteArr)[CVOTE_RESULT.SUPPORT] || 0
    const percentage = (supportNum * 100) / voteArr.length
    const proposalAgreed = percentage > 50
    const percentageStr =
      percentage.toString() && `${percentage.toFixed(1).toString()}%`
    return isCSV ? (
      percentageStr
    ) : (
      <VoteStats
        percentage={percentageStr}
        values={voteArr}
        yes={proposalAgreed}
      />
    )
  }

  authorSearch = async (data) => {
    this.setState({ authorList: [], fetching: true })
    const authorList = await this.props.getAllAuthor({
      data,
      old: this.state.showOldData
    })
    this.setState({ authorList, fetching: false })
  }

  renderFilterPanel = (PROPOSAL_TYPE) => {
    const {
      status,
      budgetRequested,
      hasTrackingMsg,
      isUnvotedByYou,
      creationDate,
      author,
      type,
      endsDate
    } = this.state
    const { isCouncil } = this.props
    const lang = localStorage.getItem('lang') || 'en'
    const rangePickerOptions = {}
    if (lang === 'zh') {
      rangePickerOptions.locale = rangePickerLocale
    }
    const colSpan = isCouncil ? 8 : 12
    const { Option } = Select
    const options = _.map(this.state.authorList, (o) => {
      const isEmpty = _.isEmpty(o.firstName)
      return (
        <Option key={o._id}>
          {!isEmpty ? o.firstName + ' ' + o.lastName : o.username}
        </Option>
      )
    })
    return (
      <FilterPanel isCouncil={isCouncil}>
        <Row type="flex" gutter={10} className="filter">
          <Col span={colSpan} className="filter-panel" lg={8} md={8} xs={24}>
            <FilterContent>
              <FilterItem>
                <FilterItemLabel isCouncil={isCouncil}>
                  {I18N.get('proposal.fields.status')}
                </FilterItemLabel>
                <Select
                  className="filter-input"
                  value={status}
                  onChange={this.handleStatusChange}
                >
                  {_.map(
                    CVOTE_STATUS,
                    (value) =>
                      value !== 'DRAFT' && (
                        <Select.Option key={value} value={value}>
                          {I18N.get(`cvoteStatus.${value}`)}
                        </Select.Option>
                      )
                  )}
                </Select>
              </FilterItem>
              <FilterItem>
                <FilterItemLabel isCouncil={isCouncil}>
                  {I18N.get('proposal.fields.budgetRequested')}
                </FilterItemLabel>
                <Select
                  className="filter-input"
                  value={budgetRequested}
                  onChange={this.handleBudgetRequestedChange}
                >
                  {_.map(BUDGET_REQUESTED_OPTIONS, (item, key) => (
                    <Select.Option key={key} value={key}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              </FilterItem>
              <FilterItem className="filter-checkbox">
                <Checkbox
                  checked={hasTrackingMsg}
                  onChange={this.handleHasTrackingMsgChange}
                />
                <CheckboxText>
                  {I18N.get('proposal.fields.hasTrackingMsg')}
                </CheckboxText>
              </FilterItem>
            </FilterContent>
          </Col>
          {isCouncil && (
            <Col span={colSpan} className="filter-panel" lg={8} md={8} xs={24}>
              <FilterContent>
                <FilterItem>
                  <Checkbox
                    checked={isUnvotedByYou}
                    onChange={this.handleIsUnvotedByYouChange}
                  />
                  <CheckboxText>
                    {I18N.get('proposal.fields.isUnvotedByYou')}
                  </CheckboxText>
                </FilterItem>
              </FilterContent>
            </Col>
          )}
          <Col span={colSpan} className="filter-panel" lg={8} md={8} xs={24}>
            <FilterContent>
              <FilterItem>
                <FilterItemLabel isCouncil={isCouncil}>
                  {I18N.get('proposal.fields.creationDate')}
                </FilterItemLabel>
                <RangePicker
                  className="filter-input"
                  onChange={this.handleCreationDateChange}
                  value={creationDate}
                  {...rangePickerOptions}
                />
              </FilterItem>
              <FilterItem>
                <FilterItemLabel isCouncil={isCouncil}>
                  {I18N.get('proposal.fields.author')}
                </FilterItemLabel>
                <div className="filter-input">
                  <Select
                    showSearch
                    value={author}
                    style={{ width: '100%' }}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.authorSearch}
                    onChange={this.handleAuthorChange}
                    notFoundContent={
                      this.state.fetching ? <Spin size="small" /> : null
                    }
                  >
                    {options}
                  </Select>
                </div>
              </FilterItem>
              <FilterItem>
                <FilterItemLabel isCouncil={isCouncil}>
                  {I18N.get('proposal.fields.type')}
                </FilterItemLabel>
                <Select
                  className="filter-input"
                  value={type}
                  onChange={this.handleTypeChange}
                >
                  {_.map(PROPOSAL_TYPE, (value, key) => {
                    return (
                      <Select.Option key={key} value={value}>
                        {I18N.get(`proposal.type.${value}`)}
                      </Select.Option>
                    )
                  })}
                </Select>
              </FilterItem>
              <FilterItem>
                <FilterItemLabel isCouncil={isCouncil}>
                  {I18N.get('proposal.fields.endsDate')}
                </FilterItemLabel>
                <RangePicker
                  className="filter-input"
                  onChange={this.handleEndsDateChange}
                  value={endsDate}
                  {...rangePickerOptions}
                />
              </FilterItem>
            </FilterContent>
          </Col>
        </Row>
        <Row type="flex" gutter={30} justify="center" className="filter-btn">
          <Col>
            <FilterClearBtn onClick={this.handleClearFilter}>
              {I18N.get('elip.button.clearFilter')}
            </FilterClearBtn>
          </Col>
          <Col>
            <Button
              className="cr-btn cr-btn-primary"
              onClick={this.handleApplyFilter}
            >
              {I18N.get('elip.button.applyFilter')}
            </Button>
          </Col>
        </Row>
      </FilterPanel>
    )
  }
}
