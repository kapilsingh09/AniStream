import React, { useState, useEffect } from 'react';
import { getRandomAnime } from '../services/kitsuAnimeApi';
import { Sparkle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimeBanner = () => {
  // const navigate = useNavigate(); // Removed for demo 
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(true);

  useEffect(() => {
    getRandomAnime().then((data) => {
      if (data && data.length > 0) {
        setAnime(data[0]);
      }
      setLoading(false);
    });
  }, []);

  const playHandler = () =>{
    navigate
  }

  const getImage = () => {
    if (!anime || !anime.attributes) return '';
    const { bannerImage, coverImage, posterImage } = anime.attributes;
    return (
      bannerImage ||
      coverImage?.original ||
      coverImage?.large ||
      posterImage?.original ||
      posterImage?.large ||
      ''
    );
  };

  return (
    <div className="h-[60vh] w-full flex overflow-hidden text-white relative">
      
      {/* Left Content */}
      <div className="w-[60%] bg-black flex flex-col justify-center p-6 md:p-12 z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {loading ? 'Loading...' : anime?.attributes?.canonicalTitle || 'Unknown Title'}
        </h1>
        <p className="text-sm md:text-lg text-slate-300 line-clamp-4">
          {anime?.attributes?.synopsis || 'No description available.'}
        </p>
        <div className="mt-10">
          <button className="px-6 py-2 font-semibold bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition flex items-center gap-2">
            <Play className="w-5 h-5" />
            Watch Now
          </button>
        </div>
      </div>

      {/* Right Image Side with Hover */}
      <div
        className="cursor-pointer w-full relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={getImage()}
          alt={anime?.attributes?.canonicalTitle || 'Anime'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />

        {/* Sparkle Icon + Hover Text */}
        <motion.div
          className="absolute top-3 right-3 z-20 flex items-center cursor-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-full py-1 px-3 overflow-hidden"
        >
          <Sparkle className="w-4  mr-1" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="whitespace-nowrap"
              >
                Recommended for you
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimeBanner;
