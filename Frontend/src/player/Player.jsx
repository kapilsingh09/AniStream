import React from 'react'
import VideoPlayer from './VideoPlayer'

const Player = () => {
  return (
    <div>
        <VideoPlayer src="http://localhost:3000/api/anime/the-fragrant-flower-blooms-with-dignity/episodes/1" />
    </div>
  )
}

export default Player
