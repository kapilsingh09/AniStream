import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkle, Play, Plus, Calendar, Film, ShieldAlert, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getRandomAnime } from '../services/kitsuAnimeApi';
import SorryCard from '../utils/SorryCard';

// Skeleton Loader Component (full width)
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-700/60 w-full rounded ${className}`} />
);

// Fetch MAL ID from Jikan
const fetchMalIdFromTitle = async (title) => {
  try {
    const res = await axios.get(`https://api.jikan.moe/v4/anime`, {
      params: { q: title, limit: 1 },
    });
    if (Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data[0]?.mal_id || null;
    }
    return null;
  } catch (err) {
    console.error('Error fetching MAL ID from Jikan:', err);
    return null;
  }
};

const AnimeBanner = () => {
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [malId, setMalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showSorry, setShowSorry] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAnime = async () => {
      setLoading(true);
      try {
        const animeData = await getRandomAnime();
        if (isMounted && animeData?.length > 0) {
          const selectedAnime = animeData[0];
          setAnime(selectedAnime);

          let fetchedMalId = null;
          if (selectedAnime.attributes?.mappings) {
            const malMapping = selectedAnime.attributes.mappings.find(
              mapping => mapping.externalSite === 'myanimelist/anime'
            );
            if (malMapping) fetchedMalId = malMapping.externalId;
          }
          if (!fetchedMalId) {
            const title =
              selectedAnime.attributes?.titles?.en ||
              selectedAnime.attributes?.canonicalTitle ||
              selectedAnime.attributes?.titles?.en_jp;
            if (title) fetchedMalId = await fetchMalIdFromTitle(title);
          }
          if (!fetchedMalId && selectedAnime.id) {
            fetchedMalId = selectedAnime.id;
          }
          setMalId(fetchedMalId);
        }
      } catch {
        if (isMounted) {
          setAnime(null);
          setMalId(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadAnime();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleWatchClick = () => {
    if (loading) return;
    if (malId) {
      navigate(`/kitsu/${malId}`);
    } else {
      setShowSorry(true);
    }
  };

  const handleAddToWatchlist = () => {
    if (loading) return;
    alert('Added to watchlist!');
  };

  const genres = Array.isArray(anime?.attributes?.genres) ? anime.attributes.genres : [];
  const englishTitle =
    anime?.attributes?.titles?.en ||
    anime?.attributes?.canonicalTitle ||
    anime?.attributes?.titles?.en_jp ||
    'Unknown Title';
  const synopsis = anime?.attributes?.synopsis || 'No description available.';
  const isLongSynopsis = synopsis.length > 120;

  return (
    <div className="h-[65vh] relative flex flex-col md:flex-row text-white overflow-hidden shadow-2xl">
      {/* Text Side */}
      <div className="w-full md:w-[45%] flex flex-col justify-center p-6 md:p-10 z-10 relative bg-black bg-opacity-70">
        
        {/* Title */}
        <h1 className="text-2xl md:text-5xl font-bold mb-4 text-white/70 leading-tight">
          {loading ? <Skeleton className="h-14" /> : englishTitle}
        </h1>

        {/* Metadata */}
        {loading ? (
          <Skeleton className="h-4 mb-3" />
        ) : (
          anime && (
            <div className="flex flex-wrap gap-4 text-xs mb-3">
              {anime.attributes?.startDate && (
                <div className="flex items-center gap-1 text-blue-400 bg-blue-900/60 px-2 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  <span className="font-semibold">{anime.attributes.startDate.slice(0, 4)}</span>
                </div>
              )}
              {anime.attributes?.episodeCount && (
                <div className="flex items-center gap-1 text-green-400 bg-green-900/60 px-2 py-1 rounded-md">
                  <Film className="w-3.5 h-3.5 text-green-300" />
                  <span className="font-semibold">{anime.attributes.episodeCount} eps</span>
                </div>
              )}
              {anime.attributes?.ageRating && (
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-900/60 px-2 py-1 rounded-md">
                  <ShieldAlert className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="font-semibold">{anime.attributes.ageRating}</span>
                </div>
              )}
              {anime.attributes?.averageRating && (
                <div className="flex items-center gap-1 text-pink-400 bg-pink-900/60 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 text-pink-300" />
                  <span className="font-semibold">{anime.attributes.averageRating}%</span>
                </div>
              )}
            </div>
          )
        )}

        {/* Synopsis */}
        <div className="mb-4">
          {loading ? (
            <>
              <Skeleton className="h-4 mb-1" />
              <Skeleton className="h-4 mb-1" />
              <Skeleton className="h-4 mb-1" />
              <Skeleton className="h-4" />
            </>
          ) : (
            <>
              <p
                className={`text-sm md:text-base text-white/90 ${
                  showMore ? 'line-clamp-none text-pink-300' : 'line-clamp-4 text-slate-300'
                } transition-colors duration-200`}
              >
                {synopsis}
              </p>
              {isLongSynopsis && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-1 text-xs text-gray-200 hover:text-white font-semibold"
                >
                  {showMore ? 'Read Less ▲' : 'Read More ▼'}
                </button>
              )}
            </>
          )}
        </div>

        {/* Genres */}
        {loading ? (
          <Skeleton className="h-5 mb-6" />
        ) : (
          genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-700 text-gray-200 border border-gray-500 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )
        )}

        {/* Buttons */}
        <div className="flex flex-col hover:cursor-pointer sm:flex-row gap-4 mt-2">
          <button
            onClick={handleWatchClick}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-base text-white 
                       bg-gradient-to-r from-orange-400 to-pink-500 
                       hover:from-orange-300 hover:to-pink-400
                       transition-all duration-200 disabled:opacity-50
                       focus:outline-none focus:ring-2 focus:ring-pink-300/50"
            style={{ minWidth: '160px', minHeight: '48px' }}
          >
            <Play className="w-5 h-5" />
            {loading ? <Skeleton className="h-5 w-20 bg-orange-300/60 rounded" /> : 'Watch Now'}
          </button>

          <div>
            <button
              onClick={handleAddToWatchlist}
              disabled={loading}
              className="inline-flex items-center justify-center hover:cursor-pointer gap-2 px-7 py-3 rounded-xl font-semibold text-base text-white 
                         bg-gradient-to-r from-violet-500 to-blue-500
                         hover:from-violet-400 hover:to-blue-400
                         transition-all duration-200 disabled:opacity-50
                         focus:outline-none focus:ring-2 focus:ring-violet-300/50"
              style={{ minWidth: '160px', minHeight: '48px' }}
            >
              {/* Bookmark icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
              </svg>
              {loading ? <Skeleton className="h-5 w-24 bg-violet-300/60 rounded" /> : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Image Side */}
      <div
        className="w-full md:w-[60%] h-[250px] md:h-full relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWatchClick}
      >
        {loading ? (
          <Skeleton className="h-full" />
        ) : (
          <img
            src={anime?.attributes?.coverImage?.original ||
                 anime?.attributes?.coverImage?.large ||
                 anime?.attributes?.posterImage?.original ||
                 anime?.attributes?.posterImage?.large ||
                 anime?.attributes?.posterImage?.medium ||
                 'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=No+Image'}
            alt={englishTitle}
            className="w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />

        {/* Recommendation Badge */}
        <motion.div className="absolute top-3 right-3 z-20 flex items-center cursor-text bg-purple-600 text-white font-bold text-xs rounded-full py-1 px-3 overflow-hidden">
          <Sparkle className="w-3.5 mr-1" />
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
