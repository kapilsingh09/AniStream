import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Unified anime service
export const animeService = {
  // Get trending anime
  getTrending: async (limit = 12) => {
    try {
      const response = await apiClient.get('/unified/trending', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending anime:', error);
      throw error;
    }
  },

  // Get top rated anime
  getTopRated: async (limit = 12) => {
    try {
      const response = await apiClient.get('/unified/top-rated', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated anime:', error);
      throw error;
    }
  },

  // Get new arrivals
  getNewArrivals: async (limit = 12) => {
    try {
      const response = await apiClient.get('/unified/new-arrivals', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },

  // Get anime by genre
  getByGenre: async (genre, limit = 12) => {
    try {
      const response = await apiClient.get(`/unified/genre/${genre}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching anime by genre:', error);
      throw error;
    }
  },

  // Search anime
  search: async (query, limit = 12) => {
    try {
      const response = await apiClient.get('/unified/search', {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching anime:', error);
      throw error;
    }
  },

  // Get anime details
  getDetails: async (id, source = 'auto') => {
    try {
      const response = await apiClient.get(`/unified/details/${id}`, {
        params: { source }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching anime details:', error);
      throw error;
    }
  },

  // Cache management
  clearCache: async (pattern = null) => {
    try {
      const response = await apiClient.post('/unified/cache/clear', { pattern });
      return response.data;
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  },

  // Get cache stats
  getCacheStats: async () => {
    try {
      const response = await apiClient.get('/unified/cache/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching cache stats:', error);
      throw error;
    }
  },

  // Warm up cache
  warmUpCache: async () => {
    try {
      const response = await apiClient.post('/unified/cache/warmup');
      return response.data;
    } catch (error) {
      console.error('Error warming up cache:', error);
      throw error;
    }
  },

  // Get cache health
  getCacheHealth: async () => {
    try {
      const response = await apiClient.get('/unified/cache/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching cache health:', error);
      throw error;
    }
  }
};

// React Query hooks for easy integration
export const useAnimeQuery = (queryKey, queryFn, options = {}) => {
  return {
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: 1000,
    ...options
  };
};

// Specific query hooks
export const useTrendingAnime = (limit = 12, options = {}) => {
  return useAnimeQuery(
    ['trending-anime', limit],
    () => animeService.getTrending(limit),
    options
  );
};

export const useTopRatedAnime = (limit = 12, options = {}) => {
  return useAnimeQuery(
    ['top-rated-anime', limit],
    () => animeService.getTopRated(limit),
    options
  );
};

export const useNewArrivals = (limit = 12, options = {}) => {
  return useAnimeQuery(
    ['new-arrivals', limit],
    () => animeService.getNewArrivals(limit),
    options
  );
};

export const useAnimeByGenre = (genre, limit = 12, options = {}) => {
  return useAnimeQuery(
    ['anime-by-genre', genre, limit],
    () => animeService.getByGenre(genre, limit),
    options
  );
};

export const useAnimeSearch = (query, limit = 12, options = {}) => {
  return useAnimeQuery(
    ['anime-search', query, limit],
    () => animeService.search(query, limit),
    {
      enabled: !!query && query.length > 2,
      ...options
    }
  );
};

export const useAnimeDetails = (id, source = 'auto', options = {}) => {
  return useAnimeQuery(
    ['anime-details', id, source],
    () => animeService.getDetails(id, source),
    {
      enabled: !!id,
      ...options
    }
  );
};

// Utility functions
export const formatAnimeData = (anime) => {
  if (!anime) return null;
  
  return {
    id: anime.id || anime.mal_id || anime.kitsu_id,
    title: anime.title || anime.title_english || anime.titleRomaji || 'Unknown Title',
    titleRomaji: anime.titleRomaji || anime.title,
    titleEnglish: anime.titleEnglish || anime.title_english,
    titleNative: anime.titleNative || anime.title_japanese,
    image: anime.image || anime.images?.jpg?.large_image_url || anime.posterImage?.original,
    bannerImage: anime.bannerImage || anime.images?.jpg?.large_image_url || anime.coverImage?.original,
    description: anime.description || anime.synopsis,
    episodes: anime.episodes || anime.episodeCount,
    duration: anime.duration || anime.episodeLength,
    genres: anime.genres || [],
    rating: anime.rating || anime.score || 'N/A',
    score: anime.score || anime.averageRating,
    popularity: anime.popularity || anime.popularityRank,
    status: anime.status || 'Unknown',
    year: anime.year || anime.seasonYear || (anime.startDate ? new Date(anime.startDate).getFullYear() : null),
    members: anime.members || anime.userCount,
    source: anime.source || 'unknown',
    mal_id: anime.mal_id,
    kitsu_id: anime.kitsu_id,
    slug: anime.slug,
    startDate: anime.startDate,
    endDate: anime.endDate,
    subtype: anime.subtype,
    showType: anime.showType,
    ratingRank: anime.ratingRank,
    popularityRank: anime.popularityRank,
    favoritesCount: anime.favoritesCount,
    youtubeVideoId: anime.youtubeVideoId,
    studios: anime.studios || [],
    demographics: anime.demographics || [],
    themes: anime.themes || []
  };
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.error || 'Server error occurred',
      status: error.response.status,
      type: 'server_error'
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'Network error - please check your connection',
      status: 0,
      type: 'network_error'
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      type: 'unknown_error'
    };
  }
};

export default animeService;
