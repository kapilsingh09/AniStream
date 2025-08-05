import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, Star,ChevronRight, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const filterAndDedupAnime = (data) => {
  if (!Array.isArray(data)) return [];
  const validData = data.filter(
    item =>
      item?.id &&
      item?.attributes?.titles?.en_jp &&
      item?.attributes?.posterImage?.large
  );
  // Remove duplicate entries
  const seen = new Set();
  return validData.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const SectionComponentKitsu = ({
  subtitle = '',
  title = 'Trending Anime',
  fetchFunction,
  className = '',
}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Overlay state
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const sliderRef = useRef();
  const showOverlayTimer = useRef(null);
  const hideOverlayTimer = useRef(null);
  const isMouseOverCard = useRef(false);
  const isMouseOverOverlay = useRef(false);

  const navigate = useNavigate();

  // TanStack Query for fetching and caching
  const {
    data: animeRawData,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ['kitsuAnime', title, subtitle],
    queryFn: async () => {
      if (!fetchFunction) throw new Error('No fetch function provided');
      const data = await fetchFunction();
      return filterAndDedupAnime(data);
    },
    enabled: !!fetchFunction, // only run if fetchFunction is provided
    staleTime: 24 * 60 * 60 * 1000, // cache forever unless manually invalidated
    cacheTime: Infinity,
    retry: (failureCount, err) => {
      // Stop retrying if we already have data
      if (failureCount > 3) return false;
      if (err?.message?.includes('No fetch function')) return false;
      return true;
    },
  });


  const animeData = animeRawData || [];
  // console.log(animeData);
  
  // Retry handler
  const handleRetry = async () => {
    setRetrying(true);
    await refetch();
    setRetrying(false);
  };

  // Scroll logic
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
    navigate(`/anime/${anime.id}`);
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

  // console.log(animeRawData);
  
  const handleCardClick = (anime) => {
    navigate(`/kitsu/${anime.id}`);
  };

  const getSubtypeLabelClass = (subtype) => {
  switch (subtype?.toLowerCase()) {
    case "tv":
      return "bg-indigo-600 text-white";
    case "movie":
      return "bg-red-600 text-white";
    case "ova":
      return "bg-purple-600 text-white";
    case "ona":5
      return "bg-teal-600 text-white";
    case "special":
      return "bg-pink-600 text-white";
    case "music":
      return "bg-yellow-600 text-black";
    default:
      return "bg-gray-400 text-white";
  }
};

const getAgeRatingInfo = (rating) => {
  switch (rating?.toUpperCase()) {
    case "G":
      return {
        className: "bg-green-500 text-white",
        icon: "👶",
        label: "G",
      };
    case "PG":
      return {
        className: "bg-blue-500 text-white",
        icon: "👦",
        label: "PG",
      };
    case "PG-13":
      return {
        className: "bg-yellow-500 text-black",
        icon: "🧒",
        label: "PG-13",
      };
    case "R":
    case "R18":
      return {
        className: "bg-red-600 text-white",
        icon: "⚠️",
        label: "R",
      };
    case "R+":
      return {
        className: "bg-orange-600 text-white",
        icon: "🔞",
        label: "R+",
      };
    default:
      return {
        className: "bg-gray-500 text-white",
        icon: "❓",
        label: "N/A",
      };
  }
};





  // Loading state
  if (loading || isFetching) {
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

  // Error state
  if (isError) {
    return (
      <div className={`h-[60vh]  to-black py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-lg mb-4">{error?.message || 'An error occurred'}</div>
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

  // No data state
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

  // Main render
  return (
    <div className={`h-[60vh] bg-black py-3 ${className} relative text-white`}>
      <div className="absolute left-0 top-0 bottom-0 w-30 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-30 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

      <div className="flex items-center px-10 mb-2">
        <h1 className="text-white text-2xl font-bold drop-shadow-lg">{title}</h1>
        <div className="flex-1 h-px bg-white/30 ml-4"></div>
        <div className="text-white/80 text-sm ml-4 drop-shadow">{animeData.length} items</div>
      </div>

      {/* <h3 className=" ml-10 text-red-300 text-sm  font-bold drop-shadow-lg">{subtitle}</h3> */}
      <div className="relative px-8">
        <div
          ref={sliderRef}
          className="w-full h-[55vh] flex overflow-x-auto gap-5 scroll-smooth py-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* maincard component parent   of cards */}
          {animeData.map((anime, index) => {
            const attr = anime.attributes;
            return (
              <motion.div
                key={anime.id}
                onClick={() => {
                  handleCardClick(anime);
                }}
                onMouseEnter={(e) => handleCardMouseEnter(anime, e)}
                onMouseLeave={handleCardMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="min-w-[14vw] max-w-[12vw] rounded-xl overflow-hidden text-white flex flex-col hover:scale-[1.03] transition-transform duration-300 cursor-pointer group"
              >
                <div className="relative h-[44vh] w-full">
                  <img
                    src={attr?.posterImage?.large || attr?.posterImage?.medium}
                    alt={attr?.titles?.en_jp || attr?.titles?.en || 'Anime'}
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-xl group-hover:brightness-110 transition-all duration-300"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  {/* Subtype label */}
                  {/* Star Rating */}
                  {typeof attr?.averageRating === 'string' && (() => {
                    // Kitsu averageRating is a string percentage, e.g. "87.65"
                    const rating = parseFloat(attr.averageRating);
                    if (isNaN(rating)) return null;
                    return (
                      <div className="absolute top-2 right-2 flex items-center text-xm    gap-1  bg-red-500 text-white font-semibold  px-2 py-1 rounded-lg backdrop-blur-sm">
                         <Star className="w-3 h-3" />
                        <span className="font-semibold text-xs">{(rating / 10).toFixed(1) || 'N/A'}</span>
                      </div>
                    );
                  })()}

                  {/* Age rating label */}
                  {attr?.ageRating && (() => {
                    const { className, label } = getAgeRatingInfo(attr.ageRating);
                    return (
                      <div className={`absolute top-2 left-2 ${className}  text-xs px-3 py-1 rounded`}>
                        {label}
                      </div>
                    );
                  })()}
                </div>
                
                <div className="py-2 ml-1 text-sm font-medium leading-tight h-[4.5vh]">
                  <div className="line-clamp-2 group-hover:text-yellow-400 transition-colors" title={attr?.titles?.en_jp || attr?.titles?.en}>
                    {attr?.titles?.en_us || attr?.titles?.en || 'Unknown Title'}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
                  src={hoveredAnime.attributes?.posterImage?.large || hoveredAnime.attributes?.posterImage?.medium}
                  alt={hoveredAnime.attributes?.titles?.en_jp || hoveredAnime.attributes?.titles?.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                {/* Auto-hide indicator */}
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Auto-hide: 2s
                </div>

                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
                    {hoveredAnime.attributes?.titles?.en_jp || hoveredAnime.attributes?.titles?.en}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    {hoveredAnime.attributes?.averageRating && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {Math.round(hoveredAnime.attributes.averageRating / 10 * 10) / 10}
                      </span>
                    )}
                    {hoveredAnime.attributes?.startDate && (
                      <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                        {new Date(hoveredAnime.attributes.startDate).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                {hoveredAnime.attributes?.synopsis && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                    {hoveredAnime.attributes.synopsis}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                  {hoveredAnime.attributes?.episodeCount && (
                    <div>Episodes: <span className="text-white">{hoveredAnime.attributes.episodeCount}</span></div>
                  )}
                  {hoveredAnime.attributes?.status && (
                    <div>Status: <span className="text-white">{hoveredAnime.attributes.status}</span></div>
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

export default SectionComponentKitsu;