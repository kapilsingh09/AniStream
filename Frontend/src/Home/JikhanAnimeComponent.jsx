import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Calendar, ChevronLeft, ShieldAlert, Baby, AlertTriangle, Eye, ChevronRight, Info, RefreshCw, Star, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

// Simulate API call to add to watchlist (replace with real API in production)
const addToWatchlistAPI = async (anime) => {
  // Simulate network delay
  return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
};

// Simulate API call to check if anime is in watchlist (replace with real API in production)
const isInWatchlistAPI = async (animeId) => {
  // For demo, always return false
  return false;
};

const SectionComponent = ({ title = "Unkown Anime", fetchFunction, className = "" }) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryDelay, setRetryDelay] = useState(1000);

  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [watchlistStatus, setWatchlistStatus] = useState({}); // { [mal_id]: true/false }
  const [addingWatchlist, setAddingWatchlist] = useState({}); // { [mal_id]: true/false }
  const sliderRef = useRef();
  const showOverlayTimer = useRef(null);
  const hideOverlayTimer = useRef(null);
  const isMouseOverCard = useRef(false);
  const isMouseOverOverlay = useRef(false);

  const navigate = useNavigate();

  // Use React Query
  const {
    isPending: loading,
    error,
    data: animeDataRaw,
    refetch,
  } = useQuery({
    queryKey: [`${title}`],
    staleTime: 3 * 60 * 1000,
    queryFn: async () => {
      if (!fetchFunction) throw new Error('No fetch function provided');
      const data = await fetchFunction();
      // Filter and dedupe as before
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
      return unique;
    },
    retry: false, // We'll handle retry manually
  });

  // Retry logic (manual, with delay/backoff)
  useEffect(() => {
    if ((error || !animeDataRaw || animeDataRaw.length === 0) && !loading && !retrying) {
      let nextDelay = retryDelay;
      if (error && error.message && error.message.toString().includes('429')) {
        nextDelay = Math.min(retryDelay * 2, 30000); // Max 30 seconds
        setRetryDelay(nextDelay);
      } else {
        setRetryDelay(2000); // Reset for other errors
      }
      const retryTimeout = setTimeout(() => {
        setRetrying(true);
        refetch().finally(() => setRetrying(false));
      }, nextDelay);
      return () => clearTimeout(retryTimeout);
    }
  }, [error, animeDataRaw, loading, retrying, refetch, retryDelay]);

  const handleRetry = async () => {
    setRetrying(true);
    await refetch();
    setRetrying(false);
  };

  const checkScrollPosition = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    if (animeDataRaw && animeDataRaw.length > 0) {
      setTimeout(checkScrollPosition, 100);
    }
  }, [animeDataRaw, checkScrollPosition]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, [checkScrollPosition]);

  // No responsive scroll amount
  const getScrollAmount = () => 1000;

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300);
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x400/374151/ffffff?text=No+Image';
  };

  const handleMoreInfo = (anime, e) => {
    e.stopPropagation();
    navigate(`/anime/${anime.mal_id}`);
  };

  // No responsive hover card size
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

  // Show overlay with delay (always enabled, no responsive check)
  const showOverlay = (anime, rect) => {
    clearAllTimers();

    showOverlayTimer.current = setTimeout(() => {
      const position = calculateHoverPosition(rect);
      setHoverPosition(position);
      setHoveredAnime(anime);

      // Optionally, check if in watchlist when overlay is shown
      if (anime?.mal_id && watchlistStatus[anime.mal_id] === undefined) {
        // Simulate API call to check if in watchlist
        isInWatchlistAPI(anime.mal_id).then((inWatchlist) => {
          setWatchlistStatus((prev) => ({
            ...prev,
            [anime.mal_id]: inWatchlist,
          }));
        });
      }

      // Auto-hide after 2 seconds
      hideOverlayTimer.current = setTimeout(() => {
        if (!isMouseOverOverlay.current) {
          setHoveredAnime(null);
        }
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
    const rect = e.currentTarget.getBoundingClientRect();
    showOverlay(anime, rect);
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

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);

  const handleCardClick = (anime) => {
    navigate(`/play/${anime.mal_id}`);
  };

  // Add to watchlist handler
  const handleAddToWatchlist = async (anime, e) => {
    e.stopPropagation();
    if (!anime?.mal_id) return;
    setAddingWatchlist((prev) => ({ ...prev, [anime.mal_id]: true }));
    try {
      // Simulate API call
      await addToWatchlistAPI(anime);
      setWatchlistStatus((prev) => ({
        ...prev,
        [anime.mal_id]: true,
      }));
    } catch (err) {
      // Optionally show error
    }
    setAddingWatchlist((prev) => ({ ...prev, [anime.mal_id]: false }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "currently airing":
        return "bg-green-600 text-white";
      case "finished":
        return "bg-gray-600 text-white";
      case "upcoming":
      case "not yet aired":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-600 text-white";
      case "paused":
        return "bg-blue-400 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const getAgeRatingBadge = (rating) => {
    switch (rating?.toUpperCase()) {
      case "G - ALL AGES":
        return {
          className: "bg-green-500 text-white",
          label: "G",
        };
      case "PG - CHILDREN":
        return {
          className: "bg-blue-500 text-white",
          label: "PG",
        };
      case "PG-13 - TEENS 13 OR OLDER":
        return {
          className: "bg-yellow-400 text-black",
          label: "PG-13",
        };
      case "R - 17+ (VIOLENCE & PROFANITY)":
        return {
          className: "bg-orange-600 text-white",
          label: "17+",
        };
      case "R+ - MILD NUDITY":
        return {
          className: "bg-red-600 text-white",
          label: "18+",
        };
      case "RX - HENTAI":
        return {
          className: "bg-black text-white",
          label: "Rx",
        };
      default:
        return {
          className: "bg-gray-400 text-white",
          label: "N/A",
        };
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'Airing Now';
      case 'not_yet_released':
        return 'Coming Soon';
      case 'finished':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'hiatus':
        return 'On Hiatus';
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
  };

  // Fixed card dimensions (no responsive)
  const cardDimensions = {
    minWidth: 'min-w-[14vw]',
    maxWidth: 'max-w-[12vw]',
    height: 'h-[44vh]',
    titleHeight: 'h-[4.5vh]'
  };

  if (loading) {
    return (
      <div className={`h-[60vh] py-3 flex items-center justify-center bg-black ${className}`}>
        <div className={`grid grid-cols-6 px-4 sm:px-6 md:px-8 gap-6 w-full mt-4`}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`h-75 bg-white/10 rounded-xl animate-pulse`}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center px-4">
          <div className={`text-lg mb-4`}>
            {error.message || error.toString()}
          </div>
          <motion.button
            onClick={handleRetry}
            disabled={retrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed text-base"
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

  if (!animeDataRaw || animeDataRaw.length === 0) {
    return (
      <div className={`h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center px-4">
          <div className="text-4xl mb-4">📺</div>
          <div className={`text-lg mb-4`}>No anime found</div>
          <motion.button
            onClick={handleRetry}
            disabled={retrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed text-base"
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

  // Use animeDataRaw as animeData
  const animeData = animeDataRaw;

  return (
    <div className={`h-[60vh] py-3 ${className} relative bg-black text-white`}>
      
      <div className="flex items-center px-10 mb-2 z-[999]">
        <h1 className={`text-white text-2xl font-bold drop-shadow-lg`}>
          {title}
        </h1>
        <div className="flex-1 h-px bg-white/30 ml-4"></div>
        <div className={`text-white/80 text-sm ml-4 drop-shadow`}>
          {animeData.length} items
        </div>
      </div>

      {/* Gradient overlays - always show */}
      <>
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      </>

      <div className="relative px-8">
        <div
          ref={sliderRef}
          className={`w-full h-[55vh] flex overflow-x-auto gap-5 scroll-smooth py-2 scrollbar-hide`}
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
              className={`${cardDimensions.minWidth} ${cardDimensions.maxWidth} rounded-xl overflow-hidden text-white flex flex-col transition-transform duration-300 cursor-pointer group hover:scale-[1.03]`}
            >
              <div className={`relative ${cardDimensions.height} w-full`}>
                <img
                  src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                  alt={anime.title}
                  onError={handleImageError}
                  className={`w-full h-full object-cover rounded transition-all duration-300 group-hover:brightness-110`}
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>

                {(anime.score || anime.scored_by) && (
                  <motion.div className={`absolute top-2 right-2 flex items-center gap-1 bg-red-500 text-white font-semibold px-2 py-1 rounded-lg backdrop-blur-sm text-xs`}>
                    <Star className={`w-3 h-3`} />
                    {anime.score || anime.scored_by || 'N/A'}
                  </motion.div>
                )}

                {watchlistStatus[anime.mal_id] && (
                  <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/10 text-white font-semibold px-2 py-2 rounded-lg backdrop-blur-sm text-xs">
                    <Check className="text-green-400  font-extrabold"  />
                    
                  </motion.div>
                )}

                {(() => {
                  if (
                    anime.status?.toLowerCase() !== "finished airing" &&
                    (anime.status || anime.popularity)
                  ) {
                    return (
                      <div
                        className={`absolute top-2 left-2 ${getStatusBadgeClass(anime.status)} text-xs px-3 py-1 flex items-center gap-1 rounded backdrop-blur-sm`}
                      >
                        <Calendar className={`w-3 h-3`} />
                        {anime.status || anime.popularity || "N/A"}
                      </div>
                    );

                  } else if (anime.rating || anime.scored_by) {
                    const { className, label } = getAgeRatingBadge(anime.rating);
                    return (
                      <motion.div
                        className={`absolute top-2 left-2 text-xs px-2 py-1 flex font-semibold items-center gap-1 ${className} font-semibold rounded-lg backdrop-blur-sm`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        {label}
                      </motion.div>
                    );
                  }

                  return null;
                })()}
              </div>

              <div className={`py-2 ml-1 text-sm font-medium leading-tight ${cardDimensions.titleHeight}`}>
                <div 
                  className={`line-clamp-2 transition-colors group-hover:text-yellow-400`} 
                  title={anime.title_english || anime.title}
                >
                  {anime.title_english || anime.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simplified Overlay - always show */}
        <AnimatePresence>
          {hoveredAnime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleOverlayMouseEnter}
              onMouseLeave={handleOverlayMouseLeave}
              className="fixed z-[60] w-80 bg-slate-900 rounded-xl shadow-2xl border border-white/20 overflow-hidden pointer-events-auto"
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
                    onClick={(e) => handleAddToWatchlist(hoveredAnime, e)}
                    disabled={!!watchlistStatus[hoveredAnime.mal_id] || addingWatchlist[hoveredAnime.mal_id]}
                    className={`flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-1
                      ${watchlistStatus[hoveredAnime.mal_id] ? 'opacity-80 cursor-not-allowed' : ''}
                    `}
                  >
                    {watchlistStatus[hoveredAnime.mal_id] ? (
                      <>
                        <Check size={20} className="text-green-400" />
                        Added
                      </>
                    ) : addingWatchlist[hoveredAnime.mal_id] ? (
                      <>
                        <Plus size={20} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={20}  className='font-semibold' />
                        Watchlist
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {canScrollLeft && (
          <motion.button
            onClick={scrollLeft}
            className={`absolute top-1/2 -translate-y-1/2 left-12 hover:cursor-pointer bg-gray-700/90 hover:bg-gray-600 p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 z-10`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            onClick={scrollRight}
            className={`absolute top-1/2 -translate-y-1/2 right-12  hover:cursor-pointer bg-gray-700/90 hover:bg-gray-600 p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 z-10`}
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