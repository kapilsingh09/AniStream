import React from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import RecomendedAnime from '../components/RecomendedAnime';
import UpcomingReleases from '../ExplorePage/UpcomingReleases';
import Spotlight from '../ExplorePage/Spotlight';

const Player = () => {
  const { id } = useParams();

  return (
    <div className="relative mt-16 bg-zinc-900">
      {/* Glass background layer */}
      {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl z-0"></div> */}

      {/* Main content layer */}
      <div className="relative z-10">
        {/* Navigation Bar */}
        <nav className="flex items-center gap-2 ml-4 text-white  text-lg font-medium px-3 py-4   ">
          <span className="hover:underline cursor-pointer text-white/50">Home</span>
          <span className="mx-1 text-gray-400">/</span>
          <span className="hover:underline cursor-pointer text-white/50">TV</span>
          <span className="mx-1 text-gray-400">/</span>
          <span className="text-white font-semibold text-lg">{/* Anime name */}anime name</span>
        </nav>

        {/* Video section - no blur */}
        <section className="flex flex-col">
          <div className="w-full pl-6">
            <VideoPlayer animeId={id} />
          </div>
        </section>

        {/* Recommendations - will have glass effect underneath */}
        <RecomendedAnime />
        {/* <UpcomingReleases /> */}
        <Spotlight />
      </div>
    </div>
  );
};

export default Player;
