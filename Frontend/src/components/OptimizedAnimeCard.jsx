import React, { useState, useEffect, useCallback } from 'react';
import { Star, Calendar, Eye, Play, Bookmark, Heart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useImageOptimization, useIntersectionObserver, usePerformanceMonitor } from '../hooks/usePerformance';

const OptimizedAnimeCard = ({ 
  anime, 
  variant = 'default',
  showActions = true,
  showRating = true,
  showStatus = true,
  showGenres = false,
  className = '',
  onCardClick,
  onActionClick,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const navigate = useNavigate();
  
  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor('AnimeCard');
  
  // Intersection observer for lazy loading
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Image optimization
  const { src: optimizedImageSrc, loading: imageLoading, error: imageError } = useImageOptimization(
    anime.image || anime.images?.jpg?.large_image_url || anime.posterImage?.original,
    {
      quality: 85,
      format: 'webp',
      lazy: true
    }
  );

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Extract anime data with fallbacks
  const animeData = useMemo(() => ({
    id: anime.id || anime.mal_id || anime.kitsu_id,
    title: anime.title || anime.title_english || anime.titleRomaji || 'Unknown Title',
    image: optimizedImageSrc,
    bannerImage: anime.bannerImage || anime.images?.jpg?.large_image_url || anime.coverImage?.original,
    rating: anime.rating || anime.score || 'N/A',
    score: anime.score || anime.averageRating,
    status: anime.status || 'Unknown',
    year: anime.year || anime.seasonYear || (anime.startDate ? new Date(anime.startDate).getFullYear() : null),
    episodes: anime.episodes || anime.episodeCount,
    genres: anime.genres || [],
    description: anime.description || anime.synopsis,
    popularity: anime.popularity || anime.popularityRank,
    members: anime.members || anime.userCount,
    source: anime.source || 'unknown'
  }), [anime, optimizedImageSrc]);

  // Get responsive dimensions based on variant
  const getCardDimensions = useCallback(() => {
    const baseDimensions = {
      mobile: {
        default: { width: 'w-[45vw]', height: 'h-[35vh]', aspect: 'aspect-[2/3]' },
        compact: { width: 'w-[40vw]', height: 'h-[30vh]', aspect: 'aspect-[2/3]' },
        detailed: { width: 'w-[90vw]', height: 'h-[40vh]', aspect: 'aspect-[16/9]' },
        banner: { width: 'w-[95vw]', height: 'h-[25vh]', aspect: 'aspect-[16/9]' }
      },
      tablet: {
        default: { width: 'w-[30vw]', height: 'h-[40vh]', aspect: 'aspect-[2/3]' },
        compact: { width: 'w-[25vw]', height: 'h-[35vh]', aspect: 'aspect-[2/3]' },
        detailed: { width: 'w-[45vw]', height: 'h-[50vh]', aspect: 'aspect-[16/9]' },
        banner: { width: 'w-[95vw]', height: 'h-[30vh]', aspect: 'aspect-[16/9]' }
      },
      desktop: {
        default: { width: 'w-[15vw]', height: 'h-[45vh]', aspect: 'aspect-[2/3]' },
        compact: { width: 'w-[12vw]', height: 'h-[40vh]', aspect: 'aspect-[2/3]' },
        detailed: { width: 'w-[25vw]', height: 'h-[60vh]', aspect: 'aspect-[16/9]' },
        banner: { width: 'w-[95vw]', height: 'h-[35vh]', aspect: 'aspect-[16/9]' }
      }
    };

    const screenSize = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
    return baseDimensions[screenSize][variant];
  }, [isMobile, isTablet, variant]);

  const dimensions = getCardDimensions();

  // Status color mapping
  const getStatusColor = useCallback((status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'finished airing':
      case 'finished':
        return 'bg-emerald-500/80 text-white';
      case 'currently airing':
      case 'releasing':
        return 'bg-blue-500/80 text-white';
      case 'not yet aired':
      case 'not_yet_released':
        return 'bg-amber-500/80 text-white';
      case 'cancelled':
        return 'bg-red-500/80 text-white';
      case 'hiatus':
        return 'bg-orange-500/80 text-white';
      default:
        return 'bg-gray-500/80 text-white';
    }
  }, []);

  // Format rating
  const formatRating = useCallback((rating) => {
    if (typeof rating === 'number') {
      return rating > 10 ? (rating / 10).toFixed(1) : rating.toFixed(1);
    }
    return rating;
  }, []);

  // Handle card click
  const handleCardClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(animeData);
    } else {
      navigate(`/anime/${animeData.id}`);
    }
  }, [onCardClick, animeData, navigate]);

  // Handle action click
  const handleActionClick = useCallback((action, e) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(action, animeData);
    }
  }, [onActionClick, animeData]);

  // Render stars for rating
  const renderStars = useCallback((rating) => {
    const numRating = typeof rating === 'number' ? rating : parseFloat(rating);
    if (isNaN(numRating)) return null;
    
    const stars = Math.round(numRating / 2);
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-2 w-2 ${i < stars ? 'text-amber-400 fill-current' : 'text-gray-400'}`}
          />
        ))}
      </div>
    );
  }, []);

  // Don't render until intersection
  if (!hasIntersected) {
    return (
      <div
        ref={ref}
        className={`${dimensions.width} ${dimensions.height} ${dimensions.aspect} bg-white/10 rounded-xl animate-pulse ${className}`}
      />
    );
  }

  // Loading state
  if (imageLoading) {
    return (
      <div className={`${dimensions.width} ${dimensions.height} ${dimensions.aspect} bg-white/10 rounded-xl animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Main card render
  return (
    <motion.div
      className={`${dimensions.width} ${dimensions.height} ${dimensions.aspect} relative rounded-xl overflow-hidden cursor-pointer group ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Image */}
      <div className="relative w-full h-full">
        <img
          src={optimizedImageSrc}
          alt={animeData.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {showStatus && (
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(animeData.status)}`}>
              {animeData.status}
            </span>
          )}
          {showRating && animeData.rating !== 'N/A' && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded">
              <Star className="h-2 w-2 text-amber-400" />
              <span className="text-white text-xs font-medium">{formatRating(animeData.rating)}</span>
            </div>
          )}
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Play className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => handleActionClick('bookmark', e)}
              className="p-1.5 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
              aria-label="Bookmark"
            >
              <Bookmark className="h-3 w-3 text-white" />
            </button>
            <button
              onClick={(e) => handleActionClick('favorite', e)}
              className="p-1.5 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
              aria-label="Favorite"
            >
              <Heart className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight">
          {animeData.title}
        </h3>
        {variant === 'default' && (
          <div className="flex items-center justify-between mt-1 text-xs text-gray-300">
            {animeData.year && <span>{animeData.year}</span>}
            {animeData.episodes && <span>{animeData.episodes} eps</span>}
          </div>
        )}
      </div>

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-1 right-1 text-xs text-gray-500 opacity-50">
          {performanceMetrics.renderCount}
        </div>
      )}
    </motion.div>
  );
};

export default OptimizedAnimeCard;
