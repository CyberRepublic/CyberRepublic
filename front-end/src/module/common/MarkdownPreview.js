import React from 'react'
import { convertMarkdownToHtml } from '@/util/markdown-it'
import { MarkdownPreviewStyle } from './MarkdownPreviewStyle'

function MarkedPreview({ content, style }) {
  return (
    <MarkdownPreviewStyle
      dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(content) }}
      innerStyle={style}
    />
  )
}

export default MarkedPreview
