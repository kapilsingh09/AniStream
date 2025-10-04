import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, Star, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const filterAndDedupAnime = (data) => {
  if (!Array.isArray(data)) return [];
  const validData = data.filter(
    item =>
      item?.id &&
      (item?.attributes?.titles?.en_jp || item?.attributes?.titles?.en || item?.attributes?.titles?.en_us || item?.attributes?.canonicalTitle) &&
      (item?.attributes?.posterImage?.large || item?.attributes?.posterImage?.medium)
  );
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
  const [isMobile, setIsMobile] = useState(false);

  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const sliderRef = useRef();
  const showOverlayTimer = useRef(null);
  const hideOverlayTimer = useRef(null);
  const isMouseOverCard = useRef(false);
  const isMouseOverOverlay = useRef(false);

  const navigate = useNavigate();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    data: animeRawData,
    isLoading: loading,
    isError,
    error,
    refetch,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: [`${title}`],
    queryFn: async () => {
      if (!fetchFunction) throw new Error('No fetch function provided');
      const data = await fetchFunction();
      return filterAndDedupAnime(data);
    },
    enabled: !!fetchFunction, 
    staleTime: 3 * 60 * 1000,
    gcTime: Infinity,
    retry: (failureCount, err) => {
      if (failureCount > 3) return false;
      if (err?.message?.includes('No fetch function')) return false;
      return true;
    },
  });

  const animeData = animeRawData || [];
  
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

  // Responsive scroll amount
  const getScrollAmount = () => {
    if (window.innerWidth < 640) return 280; // Mobile
    if (window.innerWidth < 768) return 400; // Small tablet
    if (window.innerWidth < 1024) return 600; // Tablet
    return 900; // Desktop
  };

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300);
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    setTimeout(checkScrollPosition, 300);
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

  const showOverlay = (anime, rect) => {
    // Disable overlay on mobile
    if (isMobile) return;
    
    clearAllTimers();

    showOverlayTimer.current = setTimeout(() => {
      const position = calculateHoverPosition(rect);
      setHoverPosition(position);
      setHoveredAnime(anime);

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
    if (isMobile) return;
    isMouseOverCard.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    showOverlay(anime, rect);
  };

  const handleCardMouseLeave = () => {
    if (isMobile) return;
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

  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, []);
  
  const handleCardClick = (anime) => {
    navigate(`/kitsu/${anime.id}`);
  };

  const getAgeRatingInfo = (rating) => {
    switch (rating?.toUpperCase()) {
      case "G":
        return {
          className: "bg-green-500 text-white",
          icon: "G",
          label: "G",
        };
      case "PG":
        return {
          className: "bg-blue-500 text-white",
          icon: "PG",
          label: "PG",
        };
      case "PG-13":
        return {
          className: "bg-yellow-500 text-black",
          icon: " ",
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

  // Loading skeleton
  if (loading || isFetching) {
    return (
      <div className={`min-h-[300px] md:min-h-[400px] lg:h-[60vh] py-3 flex items-center justify-center bg-black ${className}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 px-4 md:px-8 gap-3 md:gap-6 w-full mt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 sm:h-56 md:h-64 lg:h-75 bg-white/10 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`min-h-[300px] md:min-h-[400px] lg:h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center px-4">
          <div className="text-3xl md:text-4xl mb-4">❌</div>
          <div className="text-base md:text-lg mb-4">
            {error?.message || 'An error occurred'}
          </div>
          <motion.button
            onClick={handleRetry}
            disabled={retrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed text-sm md:text-base mx-auto"
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
      <div className={`min-h-[300px] md:min-h-[400px] lg:h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center px-4">
          <div className="text-3xl md:text-4xl mb-4">📺</div>
          <div className="text-base md:text-lg mb-4">No anime found</div>
          <motion.button
            onClick={handleRetry}
            disabled={retrying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed text-sm md:text-base mx-auto"
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
    <div className={`min-h-[300px] md:min-h-[400px] lg:h-[60vh] bg-black py-3 ${className} relative text-white`}>
      {/* Gradient overlays - hidden on mobile for cleaner look */}
      <>
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-12 lg:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 lg:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      </>

      <div className="flex items-center px-4 md:px-6 lg:px-10 mb-2 md:mb-3">
        <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg">
          {title}
        </h1>
        <div className="flex-1 h-px bg-white/30 ml-3 md:ml-4"></div>
        <div className="text-white/80 text-xs sm:text-sm ml-3 md:ml-4 drop-shadow">
          {animeData.length} items
        </div>
      </div>

      <div className="relative px-2 sm:px-4 md:px-6 lg:px-8">
        <div
          ref={sliderRef}
          className="w-full h-auto md:h-[45vh] lg:h-[55vh] flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 md:gap-4 lg:gap-5 scroll-smooth py-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animeData.map((anime, index) => {
            const attr = anime.attributes;
            return (
              <motion.div
                key={anime.id}
                onClick={() => handleCardClick(anime)}
                onMouseEnter={(e) => handleCardMouseEnter(anime, e)}
                onMouseLeave={handleCardMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="min-w-[140px] max-w-[140px] sm:min-w-[160px] sm:max-w-[160px] md:min-w-[180px] md:max-w-[180px] lg:min-w-[14vw] lg:max-w-[12vw] rounded-xl overflow-hidden transition-transform duration-300 cursor-pointer group hover:scale-[1.03]"
              >
                <div className="relative h-[200px] sm:h-[230px] md:h-[260px] lg:h-[44vh] w-full">
                  <img
                    src={attr?.posterImage?.large || attr?.posterImage?.medium}
                    alt={
                      attr?.titles?.en_us ||
                      attr?.titles?.en ||
                      attr?.canonicalTitle ||
                      attr?.titles?.en_jp ||
                      'Anime'
                    }
                    className="w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:brightness-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Star Rating */}
                  {typeof attr?.averageRating === 'string' && (() => {
                    const rating = parseFloat(attr.averageRating);
                    if (isNaN(rating)) return null;
                    return (
                      <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 flex items-center gap-0.5 md:gap-1 bg-red-500 text-white font-semibold px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg backdrop-blur-sm text-[10px] md:text-xs">
                        <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        <span className="font-semibold">{(rating / 10).toFixed(1) || 'N/A'}</span>
                      </div>
                    );
                  })()}

                  {/* Age rating label */}
                  {attr?.ageRating && (() => {
                    const { className, label } = getAgeRatingInfo(attr.ageRating);
                    return (
                      <div className={`absolute top-1.5 left-1.5 md:top-2 md:left-2 ${className} text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded`}>
                        {label}
                      </div>
                    );
                  })()}
                </div>
                
                <div className="py-1.5 md:py-2 ml-1 text-xs sm:text-sm font-medium leading-tight h-[40px] sm:h-[45px] md:h-[50px] lg:h-[4.5vh]">
                  <div
                    className="line-clamp-2 transition-colors group-hover:text-yellow-400"
                    title={
                      attr?.titles?.en_us ||
                      attr?.titles?.en ||
                      attr?.canonicalTitle ||
                      attr?.titles?.en_jp
                    }
                  >
                    {attr?.titles?.en_us ||
                      attr?.titles?.en ||
                      attr?.canonicalTitle ||
                      attr?.titles?.en_jp ||
                      'Unknown Title'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hover Overlay - Desktop only */}
        <AnimatePresence>
          {hoveredAnime && !isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleOverlayMouseEnter}
              onMouseLeave={handleOverlayMouseLeave}
              className="fixed z-[60] w-80 bg-gradient-to-br from-zinc-900 via-gray-900 to-black rounded-xl shadow-2xl border border-white/20 overflow-hidden pointer-events-auto"
              style={{
                left: `${hoverPosition.x}px`,
                top: `${hoverPosition.y}px`,
              }}
            >
              <div className="relative h-40">
                <img
                  src={hoveredAnime.attributes?.posterImage?.large || hoveredAnime.attributes?.posterImage?.medium}
                  alt={
                    hoveredAnime.attributes?.titles?.en_us ||
                    hoveredAnime.attributes?.titles?.en ||
                    hoveredAnime.attributes?.canonicalTitle ||
                    hoveredAnime.attributes?.titles?.en_jp ||
                    'Anime'
                  }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  Auto-hide: 2s
                </div>

                <div className="absolute bottom-2 left-3 right-3">
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg line-clamp-2">
                    {hoveredAnime.attributes?.titles?.en_us ||
                      hoveredAnime.attributes?.titles?.en ||
                      hoveredAnime.attributes?.canonicalTitle ||
                      hoveredAnime.attributes?.titles?.en_jp ||
                      'Unknown Title'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    {hoveredAnime.attributes?.averageRating && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                        ⭐ {Math.round(parseFloat(hoveredAnime.attributes.averageRating) / 10 * 10) / 10}
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

        {/* Navigation Buttons - Adjusted for mobile */}
        {canScrollLeft && (
          <motion.button
            onClick={scrollLeft}
            className="absolute top-1/2 -translate-y-1/2 left-1 sm:left-4 md:left-8 lg:left-12 bg-gray-700/90 hover:bg-gray-600 p-2 md:p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} className="md:w-6 md:h-6" />
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            onClick={scrollRight}
            className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-4 md:right-8 lg:right-12 bg-gray-700/90 hover:bg-gray-600 p-2 md:p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} className="md:w-6 md:h-6" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default SectionComponentKitsu;