import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkle, Play } from 'lucide-react';
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

        // Try multiple approaches to get the ID
        let fetchedMalId = null;

        // First, check if Kitsu data already has a MAL mapping
        if (selectedAnime.attributes?.mappings) {
          const malMapping = selectedAnime.attributes.mappings.find(
            mapping => mapping.externalSite === 'myanimelist/anime'
          );
          if (malMapping) {
            fetchedMalId = malMapping.externalId;
          }
        }

        // If no direct mapping, try fetching by title
        if (!fetchedMalId) {
          const title = selectedAnime.attributes?.canonicalTitle ||
            selectedAnime.attributes?.titles?.en ||
            selectedAnime.attributes?.titles?.en_jp;
          if (title) {
            fetchedMalId = await fetchMalIdFromTitle(title);
          }
        }

        // Fallback: use Kitsu ID if no MAL ID found
        if (!fetchedMalId && selectedAnime.id) {
          fetchedMalId = selectedAnime.id;
        }

        setMalId(fetchedMalId);
      }
      setLoading(false);
    };

    loadAnime();
  }, []);

  const getImage = () => {
    if (!anime || !anime.attributes) return '';
    const { bannerImage, coverImage, posterImage } = anime.attributes;
    return (
      bannerImage ||
      coverImage?.original ||
      coverImage?.large ||
      posterImage?.original ||
      posterImage?.large ||
      'https://imgs.search.brave.com/-Eam3dmMfduDIKs-dhRpNWG0pIQCpETsgmaC5rH4-PQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTUv/MDU1LzQ3My9zbWFs/bC9hLWJsYWNrLWJh/Y2tncm91bmQtd2l0/aC1zbW9rZS1jb21p/bmctb3V0LW9mLWl0/LWZyZWUtcGhvdG8u/anBn'
    );
  };

  const handleWatchClick = () => {
    if (malId) {
      navigate(`/kitsu/${malId}`);
      // console.log(malId); q

    } else {
      setShowSorry(true);
    }
  };
  const handleWatchClickKitsuId = () => {
    if (anime?.id) {
      navigate(`/kitsu/${anime.id}`);
    } else {
      setShowSorry(true);
    }
  };

  return (
    <div className="h-[60vh] mt-5 mb-5  bg-black flex overflow-hidden text-white relative">
      {/* Left Side */}
      <div className="w-[60%] bg-black flex flex-col justify-center p-6 md:p-12 z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {loading ? 'Loading...' : anime?.attributes?.canonicalTitle || 'Unknown Title'}
        </h1>
        <p className="text-sm md:text-lg text-slate-300 line-clamp-4">
          {anime?.attributes?.synopsis || 'No description available.'}
        </p>
        <div className="mt-10">
          <button
            onClick={handleWatchClick}
            disabled={loading}
            className={`relative inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 
    bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 
    hover:from-purple-700 hover:to-pink-500 
    shadow-lg hover:shadow-2xl 
    transform hover:scale-[1.03] active:scale-95 
    focus:outline-none focus:ring-4 focus:ring-pink-400/50 
    disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Play className="w-5 h-5" />
            {loading ? 'Loading...' : 'Watch Now'}
          </button>

        </div>
      </div>


      <div
        className="cursor-pointer w-full relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWatchClick}
      >
        <img
          src={getImage()}
          alt={anime?.attributes?.canonicalTitle || 'Anime'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />

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