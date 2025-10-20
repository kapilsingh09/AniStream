import axios from 'axios';
import NodeCache from 'node-cache';

// Initialize cache with 1 hour TTL (3600 seconds)
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour cache
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false // Better performance for large objects
});

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const KITSU_BASE_URL = 'https://kitsu.io/api/edge';

// Unified anime data structure
const normalizeAnimeData = (anime, source) => {
  if (source === 'jikan') {
    return {
      id: anime.mal_id,
      source: 'jikan',
      title: anime.title_english || anime.title || 'Unknown Title',
      titleRomaji: anime.title,
      titleEnglish: anime.title_english,
      titleNative: anime.title_japanese,
      image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      bannerImage: anime.images?.jpg?.large_image_url,
      description: anime.synopsis,
      episodes: anime.episodes,
      duration: anime.duration,
      genres: anime.genres?.map(g => g.name) || [],
      rating: anime.score ? (anime.score / 10).toFixed(1) : 'N/A',
      score: anime.score,
      popularity: anime.popularity,
      status: anime.status,
      year: anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null),
      members: anime.members,
      mal_id: anime.mal_id,
      url: anime.url,
      aired: anime.aired,
      studios: anime.studios?.map(s => s.name) || [],
      demographics: anime.demographics?.map(d => d.name) || [],
      themes: anime.themes?.map(t => t.name) || []
    };
  } else if (source === 'kitsu') {
    const attrs = anime.attributes;
    return {
      id: anime.id,
      source: 'kitsu',
      title: attrs.titles?.en || attrs.canonicalTitle || 'Unknown Title',
      titleRomaji: attrs.titles?.en_jp,
      titleEnglish: attrs.titles?.en,
      titleNative: attrs.titles?.ja_jp,
      image: attrs.posterImage?.original || attrs.posterImage?.medium,
      bannerImage: attrs.coverImage?.original,
      description: attrs.synopsis,
      episodes: attrs.episodeCount,
      duration: attrs.episodeLength,
      genres: [], // Will be populated separately
      rating: attrs.averageRating ? (attrs.averageRating / 10).toFixed(1) : 'N/A',
      score: attrs.averageRating,
      popularity: attrs.popularityRank,
      status: attrs.status,
      year: attrs.startDate ? new Date(attrs.startDate).getFullYear() : null,
      members: attrs.userCount,
      kitsu_id: anime.id,
      slug: attrs.slug,
      startDate: attrs.startDate,
      endDate: attrs.endDate,
      subtype: attrs.subtype,
      showType: attrs.showType,
      ratingRank: attrs.ratingRank,
      popularityRank: attrs.popularityRank,
      favoritesCount: attrs.favoritesCount,
      youtubeVideoId: attrs.youtubeVideoId
    };
  }
};

// Fetch from Jikan API
const fetchFromJikan = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${JIKAN_BASE_URL}${endpoint}`, { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Jikan API Error:', error.message);
    return [];
  }
};

// Fetch from Kitsu API
const fetchFromKitsu = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${KITSU_BASE_URL}${endpoint}`, { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Kitsu API Error:', error.message);
    return [];
  }
};

// Unified service functions
export const getTrendingAnime = async (limit = 12) => {
  const cacheKey = `trending_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const [jikanTrending, kitsuTrending] = await Promise.all([
      fetchFromJikan('/top/anime', { filter: 'bypopularity', limit: Math.ceil(limit / 2) }),
      fetchFromKitsu('/anime/trending', { 'page[limit]': Math.ceil(limit / 2) })
    ]);

    const normalizedJikan = jikanTrending.map(anime => normalizeAnimeData(anime, 'jikan'));
    const normalizedKitsu = kitsuTrending.map(anime => normalizeAnimeData(anime, 'kitsu'));

    // Combine and shuffle for variety
    const combined = [...normalizedJikan, ...normalizedKitsu]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    cache.set(cacheKey, combined);
    return combined;
  } catch (error) {
    console.error('Error fetching trending anime:', error);
    return [];
  }
};

export const getTopRatedAnime = async (limit = 12) => {
  const cacheKey = `top_rated_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const [jikanTop, kitsuTop] = await Promise.all([
      fetchFromJikan('/top/anime', { filter: 'airing', limit: Math.ceil(limit / 2) }),
      fetchFromKitsu('/anime', { 
        'page[limit]': Math.ceil(limit / 2),
        'sort': '-averageRating'
      })
    ]);

    const normalizedJikan = jikanTop.map(anime => normalizeAnimeData(anime, 'jikan'));
    const normalizedKitsu = kitsuTop.map(anime => normalizeAnimeData(anime, 'kitsu'));

    const combined = [...normalizedJikan, ...normalizedKitsu]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);

    cache.set(cacheKey, combined);
    return combined;
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    return [];
  }
};

export const getNewArrivals = async (limit = 12) => {
  const cacheKey = `new_arrivals_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const [jikanNew, kitsuNew] = await Promise.all([
      fetchFromJikan('/anime', { 
        order_by: 'start_date', 
        sort: 'desc', 
        status: 'airing',
        limit: Math.ceil(limit / 2) 
      }),
      fetchFromKitsu('/anime', { 
        'filter[status]': 'current',
        'sort': '-startDate',
        'page[limit]': Math.ceil(limit / 2)
      })
    ]);

    const normalizedJikan = jikanNew.map(anime => normalizeAnimeData(anime, 'jikan'));
    const normalizedKitsu = kitsuNew.map(anime => normalizeAnimeData(anime, 'kitsu'));

    const combined = [...normalizedJikan, ...normalizedKitsu]
      .sort((a, b) => new Date(b.year || 0) - new Date(a.year || 0))
      .slice(0, limit);

    cache.set(cacheKey, combined);
    return combined;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
};

export const getAnimeByGenre = async (genre, limit = 12) => {
  const cacheKey = `genre_${genre}_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const [jikanGenre, kitsuGenre] = await Promise.all([
      fetchFromJikan('/anime', { 
        genres: genre,
        order_by: 'popularity',
        sort: 'desc',
        limit: Math.ceil(limit / 2) 
      }),
      fetchFromKitsu('/anime', { 
        'filter[categories]': genre,
        'sort': '-popularityRank',
        'page[limit]': Math.ceil(limit / 2)
      })
    ]);

    const normalizedJikan = jikanGenre.map(anime => normalizeAnimeData(anime, 'jikan'));
    const normalizedKitsu = kitsuGenre.map(anime => normalizeAnimeData(anime, 'kitsu'));

    const combined = [...normalizedJikan, ...normalizedKitsu]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    cache.set(cacheKey, combined);
    return combined;
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    return [];
  }
};

export const searchAnime = async (query, limit = 12) => {
  const cacheKey = `search_${query}_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const [jikanSearch, kitsuSearch] = await Promise.all([
      fetchFromJikan('/anime', { 
        q: query,
        limit: Math.ceil(limit / 2) 
      }),
      fetchFromKitsu('/anime', { 
        'filter[text]': query,
        'page[limit]': Math.ceil(limit / 2)
      })
    ]);

    const normalizedJikan = jikanSearch.map(anime => normalizeAnimeData(anime, 'jikan'));
    const normalizedKitsu = kitsuSearch.map(anime => normalizeAnimeData(anime, 'kitsu'));

    const combined = [...normalizedJikan, ...normalizedKitsu]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);

    cache.set(cacheKey, combined);
    return combined;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const getAnimeDetails = async (id, source = 'auto') => {
  const cacheKey = `details_${id}_${source}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    let animeData = null;
    
    if (source === 'jikan' || source === 'auto') {
      try {
        const response = await axios.get(`${JIKAN_BASE_URL}/anime/${id}`);
        animeData = normalizeAnimeData(response.data.data, 'jikan');
      } catch (error) {
        console.log('Jikan fetch failed, trying Kitsu...');
      }
    }
    
    if ((!animeData && source === 'kitsu') || source === 'auto') {
      try {
        const response = await axios.get(`${KITSU_BASE_URL}/anime/${id}`);
        animeData = normalizeAnimeData(response.data.data, 'kitsu');
      } catch (error) {
        console.log('Kitsu fetch failed');
      }
    }

    if (animeData) {
      cache.set(cacheKey, animeData);
      return animeData;
    }

    return null;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    return null;
  }
};

// Enhanced cache management functions
export const clearCache = (pattern = null) => {
  if (pattern) {
    const keys = cache.keys().filter(key => key.includes(pattern));
    keys.forEach(key => cache.del(key));
    console.log(`Cleared ${keys.length} cache entries matching pattern: ${pattern}`);
  } else {
    cache.flushAll();
    console.log('Cleared all cache entries');
  }
};

// Get cache stats with detailed information
export const getCacheStats = () => {
  const stats = cache.getStats();
  return {
    ...stats,
    keys: cache.keys().length,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  };
};

// Warm up cache with popular endpoints
export const warmUpCache = async () => {
  console.log('Warming up cache...');
  try {
    await Promise.all([
      getTrendingAnime(12),
      getTopRatedAnime(12),
      getNewArrivals(12),
      getAnimeByGenre('action', 12),
      getAnimeByGenre('romance', 12),
      getAnimeByGenre('comedy', 12)
    ]);
    console.log('Cache warmed up successfully');
  } catch (error) {
    console.error('Error warming up cache:', error);
  }
};

// Cache health check
export const checkCacheHealth = () => {
  const stats = getCacheStats();
  const health = {
    status: 'healthy',
    cacheHitRate: stats.hits / (stats.hits + stats.misses) || 0,
    memoryUsage: stats.memoryUsage,
    keyCount: stats.keys,
    uptime: stats.uptime
  };
  
  if (health.cacheHitRate < 0.5) {
    health.status = 'warning';
    health.message = 'Low cache hit rate detected';
  }
  
  return health;
};
