import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom'; // Removed for demo

const SectionComponent = ({ title = "Trending Anime", fetchFunction, className = "" }) => {
  const [animeData, setAnimeData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [canScrollLeft, setCanScrollLeft] = useState(false); 
  const [canScrollRight, setCanScrollRight] = useState(false); 
  const [retrying, setRetrying] = useState(false);
  const [retryDelay, setRetryDelay] = useState(1000); // Start with 2 seconds
  

  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 }); 
  
  const sliderRef = useRef(); 
  const showOverlayTimer = useRef(null);
  const hideOverlayTimer = useRef(null);
  const isMouseOverCard = useRef(false);
  const isMouseOverOverlay = useRef(false);

  const navigate = useNavigate(); // Removed for demo 

  const fetchData = useCallback(async () => {
    if (!fetchFunction) {
      setError('No fetch function provided');
      setLoading(false);
      return;
    }

    setLoading(true); 
    setError(null); 
    
    try {
      const data = await fetchFunction();
      
      const validData = Array.isArray(data)
        ? data.filter(anime =>
            anime?.mal_id && 
            anime?.title && 
            (anime?.images?.jpg?.large_image_url || anime?.images?.jpg?.image_url)
          )
        : [];

      // Remove duplicate entries
      const seen = new Set();
      const unique = validData.filter(anime => {
        if (seen.has(anime.mal_id)) return false; 
        seen.add(anime.mal_id); 
        return true;
      });

      setAnimeData(unique); 
    } catch (err) {
      console.error('Error fetching anime data:', err);
      setError(err?.response?.status === 429 ? 'Rate limit exceeded (429). Retrying...' : 'Failed to load anime data'); 
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-retry if error or no data
  useEffect(() => {
    if ((error || !animeData || animeData.length === 0) && !loading) {
      // If error is 429, increase delay (exponential backoff)
      let nextDelay = retryDelay;
      if (error && error.toString().includes('429')) {
        nextDelay = Math.min(retryDelay * 2, 30000); // Max 30 seconds
        setRetryDelay(nextDelay);
      } else {
        setRetryDelay(2000); // Reset for other errors
      }
      const retryTimeout = setTimeout(() => {
        fetchData();
      }, nextDelay);
      return () => clearTimeout(retryTimeout);
    }
  }, [error, animeData, loading, fetchData, retryDelay]);

  const handleRetry = async () => {
    setRetrying(true);
    await fetchData();
  };

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

  
  const handleMoreInfo = (anime, e) => {
    e.stopPropagation(); 
    navigate(`/anime/${anime.mal_id}`); 
  };
  
  const calculateHoverPosition = (rect) => {
    const hoverCardWidth = 320; 
    const hoverCardHeight = 400; 
    const screenWidth = window.innerWidth; 
    const screenHeight = window.innerHeight;
    const padding = 20; 
    
    let x = rect.right + 15; 
    let y = rect.top; 
    
    if (x + hoverCardWidth > screenWidth - padding) {
      x = rect.left - hoverCardWidth - 15;
    }
    
    if (y + hoverCardHeight > screenHeight - padding) {
      y = screenHeight - hoverCardHeight - padding;
    }
    
    if (y < padding) {
      y = padding;
    }
    
    return { x, y };
  };
  
  // Clear all timers
  const clearAllTimers = () => {
    if (showOverlayTimer.current) {
      clearTimeout(showOverlayTimer.current);
      showOverlayTimer.current = null;
    }
    if (hideOverlayTimer.current) {
      clearTimeout(hideOverlayTimer.current);
      hideOverlayTimer.current = null;
    }
  };
  
  // Show overlay with delay
  const showOverlay = (anime, rect) => {
    clearAllTimers();
    
    showOverlayTimer.current = setTimeout(() => {
      const position = calculateHoverPosition(rect);
      setHoverPosition(position);
      setHoveredAnime(anime);
      
      // Auto-hide after 2 seconds
      hideOverlayTimer.current = setTimeout(() => {
        if (!isMouseOverOverlay.current) {
          setHoveredAnime(null);
        }
      }, 2000);
    }, 300); // Show after 300ms
  };
  
  // Hide overlay immediately
  const hideOverlay = () => {
    clearAllTimers();
    
    // Small delay to allow mouse to move to overlay
    setTimeout(() => {
      if (!isMouseOverCard.current && !isMouseOverOverlay.current) {
        setHoveredAnime(null);
      }
    }, 100);
  };
  
  const handleCardMouseEnter = (anime, e) => {
    isMouseOverCard.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    showOverlay(anime, rect);
  };
  
  const handleCardMouseLeave = () => {
    isMouseOverCard.current = false;
    hideOverlay();
  };
  
  const handleOverlayMouseEnter = () => {
    isMouseOverOverlay.current = true;
    clearAllTimers(); // Cancel auto-hide when hovering overlay
  };
  
  const handleOverlayMouseLeave = () => {
    isMouseOverOverlay.current = false;
    setHoveredAnime(null); // Hide immediately when leaving overlay
  };
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);
  
  const handleCardClick = (anime) => {
    navigate(`/play/${anime.mal_id}`);
    // console.log("hell worl");
    
  };


  if (loading) {
    return (
      <div className={`h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-lg">
            {retrying ? `Retrying ${title.toLowerCase()}...` : `Loading ${title.toLowerCase()}...`}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-[60vh] bg-zinc-900 py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-lg mb-4">{error}</div>
          <motion.button
            onClick={handleRetry}
            disabled={retrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
          >
            <RefreshCw 
              size={18} 
              className={retrying ? 'animate-spin' : ''} 
            />
            {retrying ? 'Retrying...' : 'Try Again'}
          </motion.button>
        </div>
      </div>
    );
  }

  if (!animeData || animeData.length === 0) {
    return (
      <div className={`h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-4">📺</div>
          <div className="text-lg mb-4">No anime found</div>
          <motion.button
            onClick={handleRetry}
            disabled={retrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed"
          >
            <RefreshCw 
              size={18} 
              className={retrying ? 'animate-spin' : ''} 
            />
            {retrying ? 'Retrying...' : 'Retry'}
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[60vh] bg-zinc-900 py-3 ${className} relative text-white`}>
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none"></div>
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
              onMouseEnter={(e) => handleCardMouseEnter(anime, e)}
              onMouseLeave={handleCardMouseLeave}
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
                
                {(anime.score || anime.scored_by) && (
                  <motion.div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded backdrop-blur-sm">
                    ⭐ {anime.score || anime.scored_by || 'N/A'}
                  </motion.div>
                )}
                
                {(anime.rank || anime.popularity) && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-xs px-3 py-1 rounded backdrop-blur-sm">
                    #{anime.rank || anime.popularity || 'N/A'}
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

        {/* Simplified Overlay */}
        <AnimatePresence>
          {hoveredAnime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleOverlayMouseEnter}
              onMouseLeave={handleOverlayMouseLeave}
              className="fixed z-[60] w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl border border-white/20 overflow-hidden pointer-events-auto"
              style={{
                left: `${hoverPosition.x}px`,
                top: `${hoverPosition.y}px`,
              }}
            >
              <div className="relative h-40">
                <img
                  src={hoveredAnime.images?.jpg?.large_image_url || hoveredAnime.images?.jpg?.image_url}
                  alt={hoveredAnime.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                
                {/* Auto-hide indicator */}
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Auto-hide: 2s
                </div>
                
                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                    {hoveredAnime.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    {(hoveredAnime.score || hoveredAnime.scored_by) && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {hoveredAnime.score || hoveredAnime.scored_by}
                      </span>
                    )}
                    {(hoveredAnime.year || hoveredAnime.aired?.prop?.from?.year) && (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                        {hoveredAnime.year || hoveredAnime.aired?.prop?.from?.year}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(hoveredAnime);
                    }}
                    className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-sm rounded-lg transition-all duration-200 font-medium"
                  >
                    Watch Now
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreInfo(hoveredAnime, e);
                    }}
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