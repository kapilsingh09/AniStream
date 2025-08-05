import React from 'react'

import VideoPlayer from './VideoPlayer'
import RecomendedAnime from '../components/RecomendedAnime'
const Player = () => {
  return (
    <div className="mt-14 bg-transparent backdrop-blur-2xl">
      {/* Navigation Bar */}
      <nav className="flex items-center gap-2 ml-4 text-white text-sm font-medium py-3">
        <span className="hover:underline cursor-pointer text-purple-300">Home</span>
        <span className="mx-1 text-gray-400">/</span>
        <span className="hover:underline cursor-pointer text-purple-300">TV</span>
        <span className="mx-1 text-gray-400">/</span>
        <span className="text-white font-semibold">
          {/* Replace with dynamic anime name if available */}
          {}
        </span>
      </nav>

      <section className="flex flex-col">
     
        <div className="w-full pl-6">
          <VideoPlayer />
        </div>
      </section>

      <RecomendedAnime />
    </div>
)}

export default Player
