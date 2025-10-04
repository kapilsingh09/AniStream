import express from 'express';
import { 
  getTrendingAnime, 
  getTopRatedAnime, 
  getNewArrivals, 
  getAnimeByGenre, 
  searchAnime, 
  getAnimeDetails,
  clearCache,
  getCacheStats,
  warmUpCache,
  checkCacheHealth
} from '../services/unifiedAnimeService.js';

const router = express.Router();

// Get trending anime
router.get('/trending', async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const anime = await getTrendingAnime(parseInt(limit));
    res.json({ success: true, data: anime, count: anime.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get top rated anime
router.get('/top-rated', async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const anime = await getTopRatedAnime(parseInt(limit));
    res.json({ success: true, data: anime, count: anime.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const { limit = 12 } = req.query;
    const anime = await getNewArrivals(parseInt(limit));
    res.json({ success: true, data: anime, count: anime.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get anime by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const { genre } = req.params;
    const { limit = 12 } = req.query;
    const anime = await getAnimeByGenre(genre, parseInt(limit));
    res.json({ success: true, data: anime, count: anime.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search anime
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 12 } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }
    const anime = await searchAnime(query, parseInt(limit));
    res.json({ success: true, data: anime, count: anime.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get anime details
router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { source = 'auto' } = req.query;
    const anime = await getAnimeDetails(id, source);
    if (!anime) {
      return res.status(404).json({ success: false, error: 'Anime not found' });
    }
    res.json({ success: true, data: anime });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cache management endpoints
router.post('/cache/clear', async (req, res) => {
  try {
    const { pattern } = req.body;
    clearCache(pattern);
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/cache/stats', async (req, res) => {
  try {
    const stats = getCacheStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Warm up cache endpoint
router.post('/cache/warmup', async (req, res) => {
  try {
    await warmUpCache();
    res.json({ success: true, message: 'Cache warmed up successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cache health check endpoint
router.get('/cache/health', async (req, res) => {
  try {
    const health = checkCacheHealth();
    res.json({ success: true, data: health });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
