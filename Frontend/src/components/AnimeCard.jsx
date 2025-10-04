import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Star, Calendar, Eye, Play, Bookmark, Heart, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AnimeCard = ({ 
  anime, 
  variant = 'default', // 'default', 'compact', 'detailed', 'banner'
  showActions = true,
  showRating = true,
  showStatus = true,
  showGenres = false,
  className = '',
  onCardClick,
  onActionClick,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const navigate = useNavigate();

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
    image: anime.image || anime.images?.jpg?.large_image_url || anime.posterImage?.original,
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
  }), [anime]);

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
  const getStatusColor = (status) => {
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
  };

  // Format rating
  const formatRating = (rating) => {
    if (typeof rating === 'number') {
      return rating > 10 ? (rating / 10).toFixed(1) : rating.toFixed(1);
    }
    return rating;
  };

  // Handle card click
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(animeData);
    } else {
      // Default navigation behavior
      navigate(`/anime/${animeData.id}`);
    }
  };

  // Handle action click
  const handleActionClick = (action, e) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(action, animeData);
    }
  };

  // Render stars for rating
  const renderStars = (rating) => {
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
  };

  // Card variants
  if (variant === 'banner') {
    return (
      <motion.div
        className={`${dimensions.width} ${dimensions.height} ${dimensions.aspect} relative rounded-xl overflow-hidden cursor-pointer group ${className}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {/* Background Image */}
        <img
          src={imageError ? '/images/seasonal1.jpg' : animeData.bannerImage || animeData.image}
          alt={animeData.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{animeData.title}</h3>
          {showGenres && animeData.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {animeData.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-sm">
            {showRating && animeData.rating !== 'N/A' && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                <span>{formatRating(animeData.rating)}</span>
              </div>
            )}
            {animeData.year && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{animeData.year}</span>
              </div>
            )}
            {showStatus && (
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(animeData.status)}`}>
                {animeData.status}
              </span>
            )}
          </div>
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        className={`${dimensions.width} ${dimensions.height} ${dimensions.aspect} relative rounded-xl overflow-hidden cursor-pointer group ${className}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {/* Background Image */}
        <img
          src={imageError ? '/images/seasonal1.jpg' : animeData.image}
          alt={animeData.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {showStatus && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(animeData.status)}`}>
              {animeData.status}
            </span>
          )}
          {showRating && animeData.rating !== 'N/A' && (
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
              <Star className="h-3 w-3 text-amber-400" />
              <span className="text-white text-xs font-medium">{formatRating(animeData.rating)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{animeData.title}</h3>
          {animeData.description && (
            <p className="text-sm text-gray-300 mb-2 line-clamp-2">{animeData.description}</p>
          )}
          {showGenres && animeData.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {animeData.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              {animeData.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{animeData.year}</span>
                </div>
              )}
              {animeData.episodes && (
                <div className="flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  <span>{animeData.episodes} eps</span>
                </div>
              )}
            </div>
            {renderStars(animeData.rating)}
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={(e) => handleActionClick('bookmark', e)}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <Bookmark className="h-3 w-3 text-white" />
            </button>
            <button
              onClick={(e) => handleActionClick('favorite', e)}
              className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <Heart className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Default and compact variants
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
          src={imageError ? '/images/seasonal1.jpg' : animeData.image}
          alt={animeData.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
          loading="lazy"
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
              className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full hover:bg-black/70 transition-colors"
            >
              <Bookmark className="h-3 w-3 text-white" />
            </button>
            <button
              onClick={(e) => handleActionClick('favorite', e)}
              className="bg-black/50 backdrop-blur-sm p-1.5 rounded-full hover:bg-black/70 transition-colors"
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
    </motion.div>
  );
};

export default AnimeCard;
