import React from 'react'
import Videojs from './video'
import styled from 'styled-components'

const VideoPlayer = (props) => {
  const videoJsOptions = {
    autoplay: false,
    playbackRates: [0.5, 1, 1.25, 1.5, 2],
    controls: true,
    sources: [
      {
        src: props.src,
        type: 'video/mp4'
      }
    ]
  }
  return (
    <Wrapper>
      <Videojs {...videoJsOptions} />
    </Wrapper>
  )
}

export default VideoPlayer

const Wrapper = styled.div`
  margin: 42px auto;
`
