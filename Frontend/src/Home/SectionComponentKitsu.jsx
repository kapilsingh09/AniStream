import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SectionComponentKitsu = ({ title = "Trending Anime", fetchFunction, className = "" }) => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [retryDelay, setRetryDelay] = useState(2000);

  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const sliderRef = useRef();
  const showOverlayTimer = useRef(null);
  const hideOverlayTimer = useRef(null);
  const isMouseOverCard = useRef(false);
  const isMouseOverOverlay = useRef(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchFunction();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      const validData = data.filter(item => item.id && item.attributes?.titles?.en_jp && item.attributes?.posterImage?.large);
      setAnimeData(validData);
    } catch (err) {
      console.error(err);
      setError('Failed to load anime data');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-retry
  useEffect(() => {
    if ((error || !animeData.length) && !loading) {
      const delay = error?.includes('429') ? Math.min(retryDelay * 2, 30000) : 2000;
      setRetryDelay(delay);
      const retryTimeout = setTimeout(() => {
        fetchData();
      }, delay);
      return () => clearTimeout(retryTimeout);
    }
  }, [error, animeData, loading, fetchData, retryDelay]);

  const handleRetry = async () => {
    setRetrying(true);
    await fetchData();
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x400/374151/ffffff?text=No+Image';
  };

  const calculateHoverPosition = (rect) => {
    const width = 320;
    const height = 400;
    const padding = 20;
    let x = rect.right + 15;
    let y = rect.top;

    if (x + width > window.innerWidth - padding) {
      x = rect.left - width - 15;
    }
    if (y + height > window.innerHeight - padding) {
      y = window.innerHeight - height - padding;
    }
    if (y < padding) y = padding;
    return { x, y };
  };

  const clearAllTimers = () => {
    clearTimeout(showOverlayTimer.current);
    clearTimeout(hideOverlayTimer.current);
  };

  const showOverlay = (anime, rect) => {
    clearAllTimers();
    showOverlayTimer.current = setTimeout(() => {
      setHoveredAnime(anime);
      setHoverPosition(calculateHoverPosition(rect));
      hideOverlayTimer.current = setTimeout(() => {
        if (!isMouseOverOverlay.current) setHoveredAnime(null);
      }, 2000);
    }, 300);
  };

  const hideOverlay = () => {
    clearAllTimers();
    setTimeout(() => {
      if (!isMouseOverCard.current && !isMouseOverOverlay.current) {
        setHoveredAnime(null);
      }
    }, 100);
  };

  const handleCardMouseEnter = (anime, e) => {
    isMouseOverCard.current = true;
    showOverlay(anime, e.currentTarget.getBoundingClientRect());
  };

  const handleCardMouseLeave = () => {
    isMouseOverCard.current = false;
    hideOverlay();
  };

  const handleOverlayMouseEnter = () => {
    isMouseOverOverlay.current = true;
    clearAllTimers();
  };

  const handleOverlayMouseLeave = () => {
    isMouseOverOverlay.current = false;
    setHoveredAnime(null);
  };

  const handleCardClick = (anime) => {
    navigate(`/play/${anime.id}`);
  };

  const handleMoreInfo = (anime, e) => {
    e.stopPropagation();
    navigate(`/anime/${anime.id}`);
  };

  if (loading) {
    return (
      <div className={`h-[60vh] flex justify-center items-center ${className}`}>
        <div className="text-white">Loading {title}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-[60vh] flex justify-center items-center ${className}`}>
        <div className="text-white text-center">
          <p>{error}</p>
          <button onClick={handleRetry} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div  className={`h-[60vh] bg-zinc-900 py-3 ${className} relative text-white`}>
      <div className="flex items-center px-10 mb-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        {/* <div className="ml-4 text-sm opacity-70">{animeData.length} items</div> */}
      </div>

      <div className="relative px-10 " >
        <div ref={sliderRef} id='second-slider' className="w-full h-[50vh] flex overflow-x-auto gap-6 py-2 scrollbar-hide scroll-smooth">
          {animeData.map((anime, index) => {
            const attr = anime.attributes;
            return (
              <motion.div
                key={anime.id}
                onClick={() => handleCardClick(anime)}
                onMouseEnter={(e) => handleCardMouseEnter(anime, e)}
                onMouseLeave={handleCardMouseLeave}
                className="min-w-[13vw] max-w-[13vw] cursor-pointer group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-[40vh]">
                  <img
                    src={attr.posterImage.large}
                    alt={attr.titles.en_jp}
                    onError={handleImageError}
                    className="rounded w-full h-full object-cover"
                  />
                  {attr.averageRating && (
                    <div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded">
                      ⭐ {attr.averageRating}
                    </div>
                  )}
                  {attr.popularityRank && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-xs px-2 py-1 rounded">
                      #{attr.popularityRank}
                    </div>
                  )}
                </div>
                <div className="text-sm mt-2 line-clamp-2">{attr.titles.en_jp}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Hover Overlay */}
        <AnimatePresence>
          {hoveredAnime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onMouseEnter={handleOverlayMouseEnter}
              onMouseLeave={handleOverlayMouseLeave}
              className="fixed z-50 w-80 bg-zinc-900 rounded-xl shadow-xl border border-white/20 overflow-hidden"
              style={{ left: `${hoverPosition.x}px`, top: `${hoverPosition.y}px` }}
            >
              <img
                src={hoveredAnime.attributes.posterImage.large}
                alt={hoveredAnime.attributes.titles.en_jp}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{hoveredAnime.attributes.titles.en_jp}</h3>
                <p className="text-sm text-gray-300 line-clamp-3 mb-2">
                  {hoveredAnime.attributes.synopsis}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(hoveredAnime);
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded text-sm"
                  >
                    Watch Now
                  </button>
                  <button
                    onClick={(e) => handleMoreInfo(hoveredAnime, e)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded text-sm flex items-center justify-center gap-1"
                  >
                    <Info size={14} />
                    More Info
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={scrollRight}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SectionComponentKitsu;
