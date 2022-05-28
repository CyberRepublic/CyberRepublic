import React from 'react'
import Videojs from './video'
import 'video.js/dist/video-js.css'

const videoJsOptions = {
  autoplay: false,
  playbackRates: [0.5, 1, 1.25, 1.5, 2],
  width: 720,
  height: 300,
  controls: true,
  sources: [
    {
      src: '//vjs.zencdn.net/v/oceans.mp4',
      type: 'video/mp4'
    }
  ]
}

const FundingProcess = () => (
  <div>
    <Videojs {...videoJsOptions} />
  </div>
)

export default FundingProcess
