import React from 'react'
import PropTypes from 'prop-types'
import I18N from '@/I18N'
import { Controlled as CodeMirror } from 'react-codemirror2'
import BaseComponent from '@/model/BaseComponent'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import MarkdownDraftPreview from '@/module/common/MarkdownDraftPreview'
import styled from 'styled-components'
// import UploadBase64Image from '@/module/common/UploadBase64Image'
import UploadImageToS3 from '@/module/common/UploadImageToS3'
import ToggleMarkdownPreview from '@/module/common/ToggleMarkdownPreview'

class Component extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.content ? this.props.content : '',
      propsContent: this.props.content ? this.props.content : '',
      show: false,
      changeNum: this.props.controVar
    }
    this.editor = null
  }

  componentDidUpdate() {
    const { controVar, content } = this.props
    const { changeNum } = this.state
    if (changeNum !== controVar) {
      this.setState({ value: content, changeNum: controVar })
    }
  }

  insertImage = (base64) => {
    const doc = this.editor.getDoc()
    const cursor = doc.getCursor()
    doc.replaceRange(`\n![image](${base64})\n`, cursor)
  }

  togglePreview = () => {
    this.setState({ show: !this.state.show })
  }

  onChange = (editor, data, value) => {
    const { onChange, callback, activeKey } = this.props
    if (onChange) onChange(value)
    if (callback) callback(activeKey)
  }

  init = (editor) => {
    const { activeKey } = this.props
    this.props.init && this.props.init(activeKey, editor)
  }

  ord_render() {
    const { show, value } = this.state
    const { name, upload } = this.props
    return (
      <Wrapper>
        <Toolbar>
          {upload === false ? null : (
            <UploadImageToS3 insertImage={this.insertImage} name={name} />
          )}
          <ToggleMarkdownPreview togglePreview={this.togglePreview} />
        </Toolbar>
        {show === false ? (
          <CodeMirror
            value={value}
            options={{
              mode: 'gfm',
              theme: 'base16-light',
              lineWrapping: true,
              autofocus: true
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({ value })
            }}
            editorDidMount={(editor) => {
              this.editor = editor
              this.init(editor)
            }}
            onChange={this.onChange}
          />
        ) : (
          <MarkdownDraftPreview
            content={value}
            show={show}
            showModal={this.togglePreview}
          />
        )}
        <Note>{I18N.get('image.upload.size.error')}</Note>
      </Wrapper>
    )
  }
}

Component.propTypes = {
  name: PropTypes.string.isRequired,
  autofocus: PropTypes.bool,
  upload: PropTypes.bool
}

export default Component

const Wrapper = styled.div`
  .cm-s-base16-light.CodeMirror {
    background: #fff;
  }
  .CodeMirror {
    min-height: 200px;
    height: unset;
    border: 1px solid #d9d9d9;
  }
  .CodeMirror-wrap pre.CodeMirror-line,
  .CodeMirror-wrap pre.CodeMirror-line-like {
    line-height: 1.5;
  }
  .CodeMirror-scroll {
    padding: 16px 11px 30px 11px;
    overflow: auto !important;
    min-height: 200px;
    margin-right: 0;
  }
  /* hide long long base64 string */
  .cm-s-base16-light .cm-image.cm-link ~ span.cm-string {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    display: inline-block;
    vertical-align: bottom;
  }
`
const Toolbar = styled.div`
  display: flex;
  margin-bottom: -24px;
  justify-content: flex-end;
`
const Note = styled.div`
  color: #cccccc;
`
