import { useState, useEffect, useCallback } from 'react';
import { animeService } from '../services/unifiedAnimeService';

// Custom hook for anime data management with caching
export const useAnimeData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);

  // Generic data fetcher with error handling
  const fetchData = useCallback(async (fetchFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunction(...args);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Specific anime data fetchers
  const getTrendingAnime = useCallback((limit = 12) => 
    fetchData(animeService.getTrending, limit), [fetchData]);

  const getTopRatedAnime = useCallback((limit = 12) => 
    fetchData(animeService.getTopRated, limit), [fetchData]);

  const getNewArrivals = useCallback((limit = 12) => 
    fetchData(animeService.getNewArrivals, limit), [fetchData]);

  const getAnimeByGenre = useCallback((genre, limit = 12) => 
    fetchData(animeService.getByGenre, genre, limit), [fetchData]);

  const searchAnime = useCallback((query, limit = 12) => 
    fetchData(animeService.search, query, limit), [fetchData]);

  const getAnimeDetails = useCallback((id, source = 'auto') => 
    fetchData(animeService.getDetails, id, source), [fetchData]);

  // Cache management functions
  const clearCache = useCallback((pattern = null) => 
    fetchData(animeService.clearCache, pattern), [fetchData]);

  const getCacheStats = useCallback(() => 
    fetchData(animeService.getCacheStats), [fetchData]);

  const warmUpCache = useCallback(() => 
    fetchData(animeService.warmUpCache), [fetchData]);

  const getCacheHealth = useCallback(() => 
    fetchData(animeService.getCacheHealth), [fetchData]);

  // Load cache stats on mount
  useEffect(() => {
    getCacheStats()
      .then(stats => setCacheStats(stats.data))
      .catch(err => console.error('Failed to load cache stats:', err));
  }, [getCacheStats]);

  return {
    // State
    loading,
    error,
    cacheStats,
    
    // Data fetchers
    getTrendingAnime,
    getTopRatedAnime,
    getNewArrivals,
    getAnimeByGenre,
    searchAnime,
    getAnimeDetails,
    
    // Cache management
    clearCache,
    getCacheStats,
    warmUpCache,
    getCacheHealth,
    
    // Utility functions
    setError,
    setLoading
  };
};

// Hook for specific anime categories with automatic data fetching
export const useAnimeCategory = (category, limit = 12) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getTrendingAnime, getTopRatedAnime, getNewArrivals, getAnimeByGenre } = useAnimeData();

  const fetchCategoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      switch (category) {
        case 'trending':
          result = await getTrendingAnime(limit);
          break;
        case 'top-rated':
          result = await getTopRatedAnime(limit);
          break;
        case 'new-arrivals':
          result = await getNewArrivals(limit);
          break;
        default:
          result = await getAnimeByGenre(category, limit);
      }
      setData(result.data || result);
    } catch (err) {
      setError(err.message || 'Failed to fetch anime data');
    } finally {
      setLoading(false);
    }
  }, [category, limit, getTrendingAnime, getTopRatedAnime, getNewArrivals, getAnimeByGenre]);

  useEffect(() => {
    if (category) {
      fetchCategoryData();
    }
  }, [category, limit, fetchCategoryData]);

  return {
    data,
    loading,
    error,
    refetch: fetchCategoryData
  };
};

// Hook for anime search with debouncing
export const useAnimeSearch = (query, limit = 12, debounceMs = 500) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchAnime } = useAnimeData();

  useEffect(() => {
    if (!query || query.length < 2) {
      setData([]);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await searchAnime(query, limit);
        setData(result.data || result);
      } catch (err) {
        setError(err.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, limit, debounceMs, searchAnime]);

  return {
    data,
    loading,
    error
  };
};

export default useAnimeData;
