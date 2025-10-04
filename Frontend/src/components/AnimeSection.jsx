import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ResponsiveAnimeGrid, { HorizontalAnimeScroll } from '../components/ResponsiveAnimeGrid';
import { animeService, handleApiError } from '../services/unifiedAnimeService';

const AnimeSection = ({
  title = "Anime Section",
  queryKey,
  queryFn,
  variant = 'default',
  showActions = true,
  showRating = true,
  showStatus = true,
  showGenres = false,
  className = '',
  onCardClick,
  onActionClick,
  limit = 12,
  enableHorizontalScroll = false,
  enableNavigation = false,
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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

  // React Query configuration
  const queryConfig = {
    queryKey: [queryKey, limit, retryCount],
    queryFn: async () => {
      try {
        const result = await queryFn(limit);
        return result.data || result;
      } catch (error) {
        const errorInfo = handleApiError(error);
        throw new Error(errorInfo.message);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (failureCount < 2) {
        setRetryCount(prev => prev + 1);
        return true;
      }
      return false;
    },
    retryDelay: 1000,
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: false,
    onError: (error) => {
      console.error(`Error in ${title}:`, error);
    }
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery(queryConfig);

  // Handle retry
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refetch();
  };

  // Handle card click
  const handleCardClick = (anime) => {
    if (onCardClick) {
      onCardClick(anime);
    } else {
      // Default navigation behavior
      window.location.href = `/anime/${anime.id}`;
    }
  };

  // Handle action click
  const handleActionClick = (action, anime) => {
    if (onActionClick) {
      onActionClick(action, anime);
    } else {
      console.log(`${action} clicked for anime:`, anime.title);
    }
  };

  // Render loading state
  const renderLoading = () => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-8">
        <div className="h-8 w-48 bg-white/10 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-white/10 rounded animate-pulse"></div>
      </div>
      {enableHorizontalScroll ? (
        <HorizontalAnimeScroll
          animeData={[]}
          loading={true}
          variant={variant}
          showActions={showActions}
          showRating={showRating}
          showStatus={showStatus}
          showGenres={showGenres}
          skeletonCount={isMobile ? 4 : isTablet ? 6 : 8}
        />
      ) : (
        <ResponsiveAnimeGrid
          animeData={[]}
          loading={true}
          variant={variant}
          showActions={showActions}
          showRating={showRating}
          showStatus={showStatus}
          showGenres={showGenres}
          skeletonCount={isMobile ? 4 : isTablet ? 6 : 8}
        />
      )}
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-8">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Failed to load {title}</h3>
        <p className="text-gray-400 mb-4">{error?.message || 'An error occurred while loading the data'}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Render empty state
  const renderEmpty = () => (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-8">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {autoRefresh && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCw className="h-4 w-4" />
            Auto-refresh enabled
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📺</div>
        <h3 className="text-lg font-semibold text-white mb-2">No anime found</h3>
        <p className="text-gray-400">Try refreshing or check back later</p>
      </div>
    </div>
  );

  // Render main content
  const renderContent = () => (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {isFetching && (
            <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
          )}
          {data && data.length > 0 && (
            <span className="text-sm text-gray-400">({data.length} items)</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {autoRefresh && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw className="h-4 w-4" />
              Auto-refresh
            </div>
          )}
          
          {enableNavigation && data && data.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* Implement navigation logic */}}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => {/* Implement navigation logic */}}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          )}
          
          <button
            onClick={handleRetry}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Anime Grid/Scroll */}
      {enableHorizontalScroll ? (
        <HorizontalAnimeScroll
          animeData={data || []}
          loading={isLoading}
          error={isError}
          variant={variant}
          showActions={showActions}
          showRating={showRating}
          showStatus={showStatus}
          showGenres={showGenres}
          onCardClick={handleCardClick}
          onActionClick={handleActionClick}
          {...props}
        />
      ) : (
        <ResponsiveAnimeGrid
          animeData={data || []}
          loading={isLoading}
          error={isError}
          variant={variant}
          showActions={showActions}
          showRating={showRating}
          showStatus={showStatus}
          showGenres={showGenres}
          onCardClick={handleCardClick}
          onActionClick={handleActionClick}
          {...props}
        />
      )}
    </div>
  );

  // Main render logic
  if (isLoading) {
    return renderLoading();
  }

  if (isError) {
    return renderError();
  }

  if (!data || data.length === 0) {
    return renderEmpty();
  }

  return renderContent();
};

// Pre-configured section components
export const TrendingAnimeSection = (props) => (
  <AnimeSection
    title="Trending Anime"
    queryKey="trending-anime"
    queryFn={animeService.getTrending}
    {...props}
  />
);

export const TopRatedAnimeSection = (props) => (
  <AnimeSection
    title="Top Rated Anime"
    queryKey="top-rated-anime"
    queryFn={animeService.getTopRated}
    {...props}
  />
);

export const NewArrivalsSection = (props) => (
  <AnimeSection
    title="New Arrivals"
    queryKey="new-arrivals"
    queryFn={animeService.getNewArrivals}
    {...props}
  />
);

export const AnimeByGenreSection = ({ genre, ...props }) => (
  <AnimeSection
    title={`${genre} Anime`}
    queryKey={`anime-by-genre-${genre}`}
    queryFn={(limit) => animeService.getByGenre(genre, limit)}
    {...props}
  />
);

export const SearchResultsSection = ({ query, ...props }) => (
  <AnimeSection
    title={`Search Results for "${query}"`}
    queryKey={`search-${query}`}
    queryFn={(limit) => animeService.search(query, limit)}
    {...props}
  />
);

export default AnimeSection;
