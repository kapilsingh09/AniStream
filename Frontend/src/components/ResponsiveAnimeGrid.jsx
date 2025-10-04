import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCard from './AnimeCard';

const ResponsiveAnimeGrid = ({
  animeData = [],
  loading = false,
  error = null,
  variant = 'default', // 'default', 'compact', 'detailed', 'banner'
  showActions = true,
  showRating = true,
  showStatus = true,
  showGenres = false,
  className = '',
  onCardClick,
  onActionClick,
  skeletonCount = 6,
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Get responsive grid configuration
  const getGridConfig = () => {
    const configs = {
      mobile: {
        default: { cols: 2, gap: 'gap-3', padding: 'px-4' },
        compact: { cols: 3, gap: 'gap-2', padding: 'px-3' },
        detailed: { cols: 1, gap: 'gap-4', padding: 'px-4' },
        banner: { cols: 1, gap: 'gap-4', padding: 'px-4' }
      },
      tablet: {
        default: { cols: 3, gap: 'gap-4', padding: 'px-6' },
        compact: { cols: 4, gap: 'gap-3', padding: 'px-4' },
        detailed: { cols: 2, gap: 'gap-6', padding: 'px-6' },
        banner: { cols: 1, gap: 'gap-6', padding: 'px-6' }
      },
      desktop: {
        default: { cols: 6, gap: 'gap-6', padding: 'px-8' },
        compact: { cols: 8, gap: 'gap-4', padding: 'px-6' },
        detailed: { cols: 4, gap: 'gap-8', padding: 'px-8' },
        banner: { cols: 1, gap: 'gap-8', padding: 'px-8' }
      }
    };

    const screenSize = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    return configs[screenSize][variant];
  };

  const gridConfig = getGridConfig();

  // Get responsive skeleton count
  const getSkeletonCount = () => {
    if (variant === 'banner') return 1;
    if (variant === 'detailed') return isMobile ? 1 : isTablet ? 2 : 4;
    return skeletonCount;
  };

  // Loading skeleton component
  const SkeletonCard = ({ index }) => (
    <motion.div
      key={index}
      className={`
        ${variant === 'banner' ? 'w-full h-[25vh]' : 
          variant === 'detailed' ? 'w-full h-[50vh]' :
          variant === 'compact' ? 'w-full h-[35vh]' : 'w-full h-[45vh]'}
        bg-white/10 rounded-xl animate-pulse
        ${gridConfig.gap}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    />
  );

  // Error component
  const ErrorComponent = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-semibold text-white mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-400 mb-4">We couldn't load the anime data</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-400 text-6xl mb-4">📺</div>
      <h3 className="text-xl font-semibold text-white mb-2">No anime found</h3>
      <p className="text-gray-400">Try adjusting your search or filters</p>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className={`grid grid-cols-${gridConfig.cols} ${gridConfig.gap} ${gridConfig.padding} py-4`}>
          {[...Array(getSkeletonCount())].map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${className}`}>
        <ErrorComponent />
      </div>
    );
  }

  // Empty state
  if (!animeData || animeData.length === 0) {
    return (
      <div className={`${className}`}>
        <EmptyState />
      </div>
    );
  }

  // Main grid
  return (
    <div className={`${className}`}>
      <div className={`grid grid-cols-${gridConfig.cols} ${gridConfig.gap} ${gridConfig.padding} py-4`}>
        <AnimatePresence>
          {animeData.map((anime, index) => (
            <motion.div
              key={anime.id || anime.mal_id || anime.kitsu_id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <AnimeCard
                anime={anime}
                variant={variant}
                showActions={showActions}
                showRating={showRating}
                showStatus={showStatus}
                showGenres={showGenres}
                onCardClick={onCardClick}
                onActionClick={onActionClick}
                {...props}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Horizontal scroll variant for mobile
export const HorizontalAnimeScroll = ({
  animeData = [],
  loading = false,
  error = null,
  variant = 'default',
  showActions = true,
  showRating = true,
  showStatus = true,
  showGenres = false,
  className = '',
  onCardClick,
  onActionClick,
  skeletonCount = 6,
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Loading skeleton for horizontal scroll
  const SkeletonCard = ({ index }) => (
    <div
      key={index}
      className={`
        ${variant === 'compact' ? 'w-[40vw] h-[30vh]' : 'w-[45vw] h-[35vh]'}
        bg-white/10 rounded-xl animate-pulse flex-shrink-0
      `}
    />
  );

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-hide">
          {[...Array(skeletonCount)].map((_, index) => (
            <SkeletonCard key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="text-red-400 text-4xl mb-2">⚠️</div>
          <p className="text-gray-400">Failed to load anime data</p>
        </div>
      </div>
    );
  }

  if (!animeData || animeData.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">📺</div>
          <p className="text-gray-400">No anime found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {animeData.map((anime, index) => (
          <motion.div
            key={anime.id || anime.mal_id || anime.kitsu_id || index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex-shrink-0"
          >
            <AnimeCard
              anime={anime}
              variant={variant}
              showActions={showActions}
              showRating={showRating}
              showStatus={showStatus}
              showGenres={showGenres}
              onCardClick={onCardClick}
              onActionClick={onActionClick}
              {...props}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveAnimeGrid;
