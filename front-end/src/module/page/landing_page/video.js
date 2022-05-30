// taken from https://github.com/videojs/video.js/blob/master/docs/guides/react.md
import React from 'react'
import videojs from 'video.js'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .video-js {
    width: 100%;
    max-width: 936px;
    height: auto;
  }
  .video-js .vjs-tech {
    width: 100%;
    height: auto;
    position: relative;
  }
  .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    margin-left: -1.5em;
    margin-top: -0.81666em;
    background: linear-gradient(to left, #1ff5c9, #1e8771);
  }
`

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      // console.log('onPlayerReady', this)
    })

    if (this.videoNode) {
      this.videoNode.setAttribute('webkit-playsinline', true)
      this.videoNode.setAttribute('playsinline', true)
    }
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div data-vjs-player>
        <Container>
          <video ref={(node) => (this.videoNode = node)} className="video-js" />
        </Container>
      </div>
    )
  }
}
