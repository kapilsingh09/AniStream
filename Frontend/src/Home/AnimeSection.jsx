import React, { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/AnimeContext';

const SectionComponent = ({ title = "Trending Anime", className = "" }) => {
  const { TrendingAnime } = useContext(DataContext);
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const sliderRef = useRef();
  const navigate = useNavigate();

  // Clean, filter, and remove duplicates
  useEffect(() => {
    const prepareData = () => {
      setLoading(true);
      const validData = Array.isArray(TrendingAnime)
        ? TrendingAnime.filter(anime =>
            anime?.mal_id &&
            anime?.title &&
            (anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url)
          )
        : [];

      const seen = new Set();
      const unique = validData.filter(anime => {
        if (seen.has(anime.mal_id)) return false;
        seen.add(anime.mal_id);
        return true;
      });

      setAnimeData(unique);
      setLoading(false);
    };

    prepareData();
  }, [TrendingAnime]);

  const checkScrollPosition = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    if (animeData.length > 0) {
      setTimeout(checkScrollPosition, 100);
    }
  }, [animeData, checkScrollPosition]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition]);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300);
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x400/374151/ffffff?text=No+Image';
  };

  const handleCardClick = (anime) => {
    navigate(`/play/${anime.mal_id}`);
  };

  const handleMoreInfo = (anime, e) => {
    e.stopPropagation();
    navigate(`/anime/${anime.mal_id}`);
  };

  const handleMouseEnter = (anime, e) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const newTimeout = setTimeout(() => {
      setHoverPosition({
        x: rect.right + 10,
        y: rect.top
      });
      setHoveredAnime(anime);
    }, 300); // 300ms delay before showing

    setHoverTimeout(newTimeout);
  };

  const handleMouseLeave = () => {
    // Clear timeout if mouse leaves before delay
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Hide immediately when mouse leaves
    setHoveredAnime(null);
  };

  const handleHoverCardEnter = () => {
    // Keep the hover card visible when mouse enters it
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
  };

  const handleHoverCardLeave = () => {
    // Hide when mouse leaves the hover card
    setHoveredAnime(null);
  };

  if (loading) {
    return (
      <div className={`h-[60vh] bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 py-3 flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-lg">Loading {title.toLowerCase()}...</div>
        </div>
      </div>
    );
  }

  if (!animeData || animeData.length === 0) {
    return (
      <div className={`h-[60vh] bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-2">📺</div>
          <div className="text-lg">No anime found</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[60vh] bg-gradient-to-r from-pink-400 via-violet-400 via-purple-400 via-cyan-400 to-indigo-400 py-3 ${className} relative`}>
      {/* Left dark overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none"></div>
      
      {/* Right dark overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/60 to-transparent z-10 pointer-events-none"></div>

      <div className="flex items-center px-10 mb-2">
        <h1 className="text-white text-2xl font-bold drop-shadow-lg">{title}</h1>
        <div className="flex-1 h-px bg-white/30 ml-4"></div>
        <div className="text-white/80 text-sm ml-4 drop-shadow">{animeData.length} items</div>
      </div>

      <div className="relative px-10">
        <div
          ref={sliderRef}
          className="w-full h-[50vh] flex overflow-x-auto gap-6 scroll-smooth py-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animeData.map((anime, index) => (
            <motion.div
              key={anime.mal_id}
              onClick={() => handleCardClick(anime)}
              onMouseEnter={(e) => handleMouseEnter(anime, e)}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="min-w-[13vw] max-w-[13vw] rounded-xl overflow-hidden text-white flex flex-col hover:scale-[1.03] transition-transform duration-300 cursor-pointer group"
            >
              <div className="relative h-[40vh] w-full">
                <img
                  src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                  alt={anime.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover rounded group-hover:brightness-110 transition-all duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>
                {anime.score && (
                  <motion.div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded backdrop-blur-sm">
                    ⭐ {anime.score}
                  </motion.div>
                )}
                {anime.rank && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-xs px-3 py-1 rounded backdrop-blur-sm">
                    #{anime.rank}
                  </div>
                )}
              </div>
              <div className="py-2 ml-1 text-sm font-medium leading-tight h-[4.5vh]">
                <div className="line-clamp-2 group-hover:text-blue-300 transition-colors" title={anime.title}>
                  {anime.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hover Details Card */}
        <AnimatePresence>
          {hoveredAnime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleHoverCardEnter}
              onMouseLeave={handleHoverCardLeave}
              className="fixed z-50 w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl border border-white/20 overflow-hidden"
              style={{
                left: `${hoverPosition.x}px`,
                top: `${hoverPosition.y}px`,
                transform: 'translateY(-20px)'
              }}
            >
              <div className="relative h-40">
                <img
                  src={hoveredAnime.images?.jpg?.large_image_url || hoveredAnime.images?.jpg?.image_url}
                  alt={hoveredAnime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                    {hoveredAnime.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    {hoveredAnime.score && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {hoveredAnime.score}
                      </span>
                    )}
                    {hoveredAnime.year && (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                        {hoveredAnime.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                {hoveredAnime.synopsis && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                    {hoveredAnime.synopsis}
                  </p>
                )}
                
                {hoveredAnime.genres && hoveredAnime.genres.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {hoveredAnime.genres.slice(0, 4).map((genre, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                  {hoveredAnime.episodes && (
                    <div>Episodes: <span className="text-white">{hoveredAnime.episodes}</span></div>
                  )}
                  {hoveredAnime.status && (
                    <div>Status: <span className="text-white">{hoveredAnime.status}</span></div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCardClick(hoveredAnime)}
                    className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm rounded-lg transition-all duration-200 font-medium"
                  >
                    Watch Now
                  </button>
                  <button
                    onClick={(e) => handleMoreInfo(hoveredAnime, e)}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-1"
                  >
                    <Info size={14} />
                    More Info
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {canScrollLeft && (
          <motion.button
            onClick={scrollLeft}
            className="absolute top-1/2 -translate-y-1/2 left-12 bg-gray-700/90 hover:bg-gray-600 p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            onClick={scrollRight}
            className="absolute top-1/2 -translate-y-1/2 right-12 bg-gray-700/90 hover:bg-gray-600 p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SectionComponent;