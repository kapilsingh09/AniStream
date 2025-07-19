import React from 'react'
import VideoPlayer from './VideoPlayer'

const Player = () => {
  return (
    <div className='mt-10'>
        <VideoPlayer src="http://localhost:3000/videos/anime-49205-ep1.mp4" />
    </div>
  )
}

export default Player
