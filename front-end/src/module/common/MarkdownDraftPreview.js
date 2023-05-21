import React from 'react'
import { Modal } from 'antd'
import { convertMarkdownToHtml } from '@/util/markdown-it'
import BaseComponent from '@/model/BaseComponent'
import { MarkdownPreviewStyle } from './MarkdownPreviewStyle'

class MarkdownDraftPreview extends BaseComponent {
  hideModal = () => {
    this.props.showModal()
  }
  ord_render() {
    return (
      <Modal
        maskClosable={false}
        visible={this.props.show}
        onCancel={this.hideModal}
        width={670}
        footer={null}
        wrapClassName="md-preview-modal-wrap"
      >
        <MarkdownPreviewStyle
          dangerouslySetInnerHTML={{
            __html: convertMarkdownToHtml(this.props.content)
          }}
          innerStyle={this.props.style}
        />
      </Modal>
    )
  }
}

export default MarkdownDraftPreview
