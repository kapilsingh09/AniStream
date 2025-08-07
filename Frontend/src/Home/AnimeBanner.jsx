import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkle, Play, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getRandomAnime } from '../services/kitsuAnimeApi';
import SorryCard from '../utils/SorryCard';

const AnimeBanner = () => {
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [malId, setMalId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showSorry, setShowSorry] = useState(false);

  const [showmore, Setshowmore] = useState(false)

  const fetchMalIdFromTitle = async (title) => {
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime`, {
        params: { q: title, limit: 1 },
      });
      return res.data.data[0]?.mal_id || null;
    } catch (err) {
      console.error('Error fetching MAL ID from Jikan:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadAnime = async () => {
      const animeData = await getRandomAnime();
      if (animeData && animeData.length > 0) {
        const selectedAnime = animeData[0];
        setAnime(selectedAnime);

        let fetchedMalId = null;

        if (selectedAnime.attributes?.mappings) {
          const malMapping = selectedAnime.attributes.mappings.find(
            mapping => mapping.externalSite === 'myanimelist/anime'
          );
          if (malMapping) {
            fetchedMalId = malMapping.externalId;
          }
        }

        if (!fetchedMalId) {
          const title = selectedAnime.attributes?.titles?.en ||
            selectedAnime.attributes?.canonicalTitle ||
            selectedAnime.attributes?.titles?.en_jp;
          if (title) {
            fetchedMalId = await fetchMalIdFromTitle(title);
          }
        }

        if (!fetchedMalId && selectedAnime.id) {
          fetchedMalId = selectedAnime.id;
        }

        setMalId(fetchedMalId);
      }
      setLoading(false);
    };

    loadAnime();
  }, []);

  const handleWatchClick = () => {
    if (malId) {
      navigate(`/kitsu/${malId}`);
    } else {
      setShowSorry(true);
    }
  };

  const handleAddToWatchlist = () => {
    // You can update this to actually store in a DB or global state
    alert('Added to watchlist!');
  };

  const genres = anime?.attributes?.genres || [];

  // Get English title, fallback to canonical or JP if not available
  const englishTitle =
    anime?.attributes?.titles?.en ||
    anime?.attributes?.canonicalTitle ||
    anime?.attributes?.titles?.en_jp ||
    'Unknown Title';

  return (
    <div className="h-[65vh]  relative flex flex-col md:flex-row bg-black text-white  overflow-hidden shadow-2xl ">
      {/* Text Content */}
      <div className="w-full md:w-[55%] flex flex-col justify-center p-6 md:p-10 z-10 relative bg-black bg-opacity-70">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {loading ? 'Loading...' : englishTitle}
        </h1>
        <p className={`text-sm md:text-lg text-slate-300 mb-4  ${showmore ? '' : 'line-clamp-6'}`}>
          {anime?.attributes?.synopsis || 'No description available.'}
          {anime?.attributes?.synopsis?.length > 200 && (
            <button
              onClick={() => Setshowmore(!showmore)}
              className="ml-2 inline-block align-baseline text-xs px-3 py-0.5 rounded-full border border-pink-400 bg-pink-600/10 text-pink-300 hover:bg-pink-500/20 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50"
              style={{
                marginLeft: '10px',
                fontWeight: 600,
              }}
            >
              {showmore ? (
                <>
                  Show Less <span className="inline-block transform rotate-180">▼</span>
                </>
              ) : (
                <>
                  Show More <span className="inline-block">▼</span>
                </>
              )}
            </button>
          )}
        </p>

        {/* Genres */}
        {anime?.attributes?.genres && (
          <div className="flex flex-wrap gap-2 mb-6">
            {anime.attributes.genres.map((genre, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-pink-600/20 text-pink-300 border border-pink-400/30 rounded-full"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleWatchClick}
            disabled={loading}
            className="relative inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 
            bg-gradient-to-br from-blue-600 via-cyan-500 to-green-400
            hover:from-blue-700 hover:to-green-500
            shadow-lg hover:shadow-2xl 
            transform hover:scale-105 active:scale-95 
            focus:outline-none focus:ring-4 focus:ring-cyan-400/50 
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            {loading ? 'Loading...' : 'Watch Now'}
          </button>

          <button
            onClick={handleAddToWatchlist}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white bg-gradient-to-br from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add to Watchlist
          </button>
        </div>
      </div>

      {/* Image Side */}
      <div
        className="w-full md:w-[45%] h-[300px] md:h-full relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWatchClick}
      >
        <img
          src={anime?.attributes?.coverImage?.original || ''}
          alt={englishTitle}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />

        <motion.div className="absolute top-3 right-3 z-20 flex items-center cursor-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-full py-1 px-3 overflow-hidden">
          <Sparkle className="w-4 mr-1" />
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

      <SorryCard show={showSorry} onClose={() => setShowSorry(false)} />
    </div>
  );
};

export default AnimeBanner;
