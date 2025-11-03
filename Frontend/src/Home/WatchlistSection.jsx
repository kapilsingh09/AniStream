import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, Star, ChevronRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

const WatchlistSection = ({
  title = 'Your Watchlist',
  className = '',
  showIfEmpty = false,
}) => {
  const { watchlist, loading } = useWatchlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const sliderRef = useRef(null);

  // Transform watchlist data to match component format
  const transformWatchlistData = (watchlistItems) => {
    if (!watchlistItems || watchlistItems.length === 0) return [];
    
    return watchlistItems.map((item) => ({
      id: item.animeId,
      attributes: {
        canonicalTitle: item.title,
        titles: {
          en: item.title,
          en_jp: item.title,
        },
        posterImage: {
          large: item.image,
          medium: item.image,
          small: item.image,
        },
      },
      // Add source info for navigation
      source: 'watchlist',
      watchlistItem: item,
    }));
  };

  // Transform watchlist data and limit to 10 items for homepage display
  const allAnimeData = transformWatchlistData(watchlist);
  // Limit to first 10 anime for homepage (shows preview, can view all on watchlist page)
  const animeData = allAnimeData.slice(0, 10);

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

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === 'left'
          ? sliderRef.current.scrollLeft - scrollAmount
          : sliderRef.current.scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleCardClick = (anime) => {
    // Try Kitsu first, then Jikan
    navigate(`/kitsu/${anime.id}`);
  };

  const handleCardMouseEnter = (anime, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredAnime({
      ...anime,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top,
      },
    });
  };

  const handleCardMouseLeave = () => {
    setHoveredAnime(null);
  };

  // Don't show if user is not logged in or watchlist is empty (unless showIfEmpty is true)
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className={`py-8 px-4 ${className}`}>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-800 border-t-amber-400"></div>
            <div className="text-gray-400">Loading your watchlist...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!showIfEmpty && animeData.length === 0) {
    return null;
  }

  if (animeData.length === 0 && showIfEmpty) {
    return (
      <div className={`py-8 px-4 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bookmark className="h-6 w-6 text-amber-400" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
          </div>
        </div>
        <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
          <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Your watchlist is empty</p>
          <button
            onClick={() => navigate('/explore')}
            className="mt-4 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Explore Anime
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-4 md:py-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Bookmark className="h-6 w-6 md:h-7 md:w-7 text-amber-400" fill="currentColor" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {title}
          </h2>
          <span className="text-gray-400 text-sm md:text-base">
            ({watchlist.length} {watchlist.length === 1 ? 'anime' : 'anime'}
            {animeData.length < watchlist.length && ` • Showing ${animeData.length}`})
          </span>
        </div>
        <button
          onClick={() => navigate('/watchlist')}
          className="text-amber-400 hover:text-amber-300 text-sm md:text-base font-medium transition-colors flex items-center gap-1"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Anime Slider */}
      <div className="relative px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Scroll Buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 shadow-lg border border-gray-700 hover:border-amber-400/50"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 backdrop-blur-sm rounded-full p-2 md:p-3 transition-all duration-300 shadow-lg border border-gray-700 hover:border-amber-400/50"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        )}
        <div
          ref={sliderRef}
          onScroll={checkScrollPosition}
          className="w-full h-auto md:h-[45vh] lg:h-[55vh] flex flex-nowrap overflow-x-auto gap-2 sm:gap-3 md:gap-4 lg:gap-5 scroll-smooth py-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {animeData.map((anime, index) => {
            const attr = anime.attributes;
            const posterImage = attr?.posterImage?.large || attr?.posterImage?.medium || anime.watchlistItem?.image;
            const title = attr?.canonicalTitle || attr?.titles?.en || attr?.titles?.en_jp || anime.watchlistItem?.title;

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
                    src={posterImage || 'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Image'}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Watchlist Badge */}
                  <div className="absolute top-2 right-2 bg-amber-600/90 backdrop-blur-sm rounded-full p-1.5">
                    <Bookmark className="h-4 w-4 text-white" fill="white" />
                  </div>
                </div>

                {/* Title */}
                <div className="mt-2 px-1">
                  <h3 className="text-white text-sm sm:text-base font-semibold line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hover Overlay (optional - can be enhanced) */}
      {hoveredAnime && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${hoveredAnime.position.x}px`,
              top: `${hoveredAnime.position.y}px`,
              transform: 'translateX(-50%) translateY(-100%)',
            }}
          >
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-gray-700 shadow-xl">
              <p className="text-white text-sm font-semibold">
                {hoveredAnime.attributes?.canonicalTitle || hoveredAnime.watchlistItem?.title}
              </p>
              <p className="text-gray-400 text-xs mt-1">Click to view details</p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default WatchlistSection;

