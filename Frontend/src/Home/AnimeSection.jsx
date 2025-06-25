import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SectionComponent = ({ title = "Trending Anime", fetchFunction, className = "" }) => {
  const [animeData, setAnimeData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [canScrollLeft, setCanScrollLeft] = useState(false); 
  const [canScrollRight, setCanScrollRight] = useState(false); 
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 }); 
  const [hoverTimeout, setHoverTimeout] = useState(null); 
  const [autoHideTimeout, setAutoHideTimeout] = useState(null);
  
  // 🆕 NEW: State for tracking which cards should be hidden
  const [hiddenCards, setHiddenCards] = useState(new Set());
  
  const sliderRef = useRef(); 
  const isHoveringCard = useRef(false); 
  const isHoveringHoverCard = useRef(false); 
  
  // 🆕 NEW: Refs for managing auto-hide timers for each card
  const cardHideTimers = useRef(new Map());

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
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
        setError('Failed to load anime data'); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

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

  // 🆕 NEW: Function to start auto-hide timer for a specific card
  const startAutoHideTimer = (cardIndex) => {
    // Clear existing timer if any
    if (cardHideTimers.current.has(cardIndex)) {
      clearTimeout(cardHideTimers.current.get(cardIndex));
    }

    // 🎯 CUSTOMIZATION POINT: Change delay here (currently 2000ms = 2 seconds)
    const hideDelay = 2000;

    const timer = setTimeout(() => {
      setHiddenCards(prev => new Set([...prev, cardIndex]));
      
      // Auto-unhide after another 2 seconds
      setTimeout(() => {
        setHiddenCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(cardIndex);
          return newSet;
        });
      }, hideDelay); // 🎯 CUSTOMIZATION POINT: Change auto-unhide delay here
      
    }, hideDelay);

    cardHideTimers.current.set(cardIndex, timer);
  };

  // 🆕 NEW: Function to cancel auto-hide timer for a specific card
  const cancelAutoHideTimer = (cardIndex) => {
    if (cardHideTimers.current.has(cardIndex)) {
      clearTimeout(cardHideTimers.current.get(cardIndex));
      cardHideTimers.current.delete(cardIndex);
    }
    
    // Also make sure the card is visible
    setHiddenCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardIndex);
      return newSet;
    });
  };

  const handleMouseEnter = (anime, e) => {
    isHoveringCard.current = true;

    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (autoHideTimeout) clearTimeout(autoHideTimeout);

    const rect = e.currentTarget.getBoundingClientRect();
    
    const newTimeout = setTimeout(() => {
      const position = calculateHoverPosition(rect);
      setHoverPosition(position);
      setHoveredAnime(anime);
    }, 300);

    setHoverTimeout(newTimeout);
  };

  const handleMouseLeave = () => {
    isHoveringCard.current = false;

    setTimeout(() => {
      if (!isHoveringHoverCard.current) {
        setHoveredAnime(null);
      }
    }, 200);
  };

  const handleHoverCardEnter = () => {
    isHoveringHoverCard.current = true;
    
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (autoHideTimeout) clearTimeout(autoHideTimeout);
  };

  const handleHoverCardLeave = () => {
    isHoveringHoverCard.current = false;

    setTimeout(() => {
      if (!isHoveringCard.current) {
        setHoveredAnime(null);
      }
    }, 200);
  };

  // 🆕 UPDATED: Enhanced card mouse enter handler with auto-hide logic
  const handleCardMouseEnter = (anime, e, index) => {
    handleMouseEnter(anime, e);
    
    // 🎯 CUSTOMIZATION POINT: Define which cards should have auto-hide behavior
    // Currently applies to first card (index 0) and its next sibling (index 1)
    const shouldAutoHide = index === 0 || index === 1;
    
    if (shouldAutoHide) {
      // Start auto-hide timer for the NEXT card (sibling)
      const siblingIndex = index === 0 ? 1 : 0; // If first card, hide second; if second card, hide first
      
      // 🎯 CUSTOMIZATION POINT: You can change the logic here
      // Example: Hide all cards after current one
      // for (let i = index + 1; i < animeData.length && i < index + 3; i++) {
      //   startAutoHideTimer(i);
      // }
      
      // Current logic: Hide the sibling card
      if (siblingIndex < animeData.length) {
        startAutoHideTimer(siblingIndex);
      }
    }
  };

  // 🆕 UPDATED: Enhanced card mouse leave handler
  const handleCardMouseLeave = (index) => {
    handleMouseLeave();
    
    // Cancel any pending auto-hide timers for nearby cards when mouse leaves
    const shouldCancelAutoHide = index === 0 || index === 1;
    
    if (shouldCancelAutoHide) {
      const siblingIndex = index === 0 ? 1 : 0;
      if (siblingIndex < animeData.length) {
        cancelAutoHideTimer(siblingIndex);
      }
    }
  };

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      if (autoHideTimeout) clearTimeout(autoHideTimeout);
      
      // Clear all card hide timers
      cardHideTimers.current.forEach(timer => clearTimeout(timer));
      cardHideTimers.current.clear();
    };
  }, [hoverTimeout, autoHideTimeout]);

  if (loading) {
    return (
      <div className={`h-[60vh]  to-indigo-400 py-3 flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <div className="text-white text-lg">Loading {title.toLowerCase()}...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-[60vh] bg-zinc-900 py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-2"></div>
          <div className="text-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!animeData || animeData.length === 0) {
    return (
      <div className={`h-[60vh] py-3 flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <div className="text-4xl mb-2">📺</div>
          <div className="text-lg">No anime found</div>
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
          {animeData.map((anime, index) => {
            const isHidden = hiddenCards.has(index);
            
            return (
              <motion.div
                key={anime.mal_id}
                onClick={() => handleCardClick(anime)}
                onMouseEnter={(e) => handleCardMouseEnter(anime, e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                initial={{ opacity: 1, y: 20 }}
                animate={{ 
                  opacity: isHidden ? 0 : 1,
                  y: 0,
                  scale: isHidden ? 0.95 : 1
                }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="min-w-[13vw] max-w-[13vw] rounded-xl overflow-hidden text-white flex flex-col hover:scale-[1.03] transition-transform duration-300 cursor-pointer group"
                style={{ pointerEvents: isHidden ? 'none' : 'auto' }}
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
                  
                  {/* 🆕 FIXED: Better fallback for score and rank display */}
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
            );
          })}
        </div>

        <AnimatePresence>
          {hoveredAnime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={handleHoverCardEnter}
              onMouseLeave={handleHoverCardLeave}
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