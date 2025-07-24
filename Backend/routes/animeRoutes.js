import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Fetches all paginated episodes for a given anime ID from Kitsu
 */
const fetchAllEpisodes = async (animeId) => {
  let episodes = [];
  let url = `https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=20&page[offset]=0`;

  while (url) {
    const res = await axios.get(url);
    episodes = [...episodes, ...res.data.data];
    url = res.data.links?.next || null; // Continue to next page if available
  }

  return episodes;
};

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    // Step 1: Search anime by slug
    const searchRes = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(slug)}`
    );
    const anime = searchRes.data.data[0];

    if (!anime) {
      return res.status(404).json({ error: 'Anime not found on Kitsu.' });
    }

    // Step 2: Extract anime metadata
    const animeId = anime.id;
    const animeTitle = anime.attributes.titles?.en || anime.attributes.canonicalTitle || 'Unknown Title';
    const thumbnail = anime.attributes.posterImage?.original;
    const animeDescription = anime.attributes.description || 'No anime description available.';

    // Step 3: Fetch all episodes
    const episodesData = await fetchAllEpisodes(animeId);

    // Step 4: Format episodes
    const episodes = episodesData.map((ep, index) => {
      const episodeNum = ep.attributes.number || index + 1;
      const episodeTitle = ep.attributes.canonicalTitle || `Episode ${episodeNum}`;
      const episodeDescription = ep.attributes.synopsis || 'No episode description available.';
      const episodeLength = ep.attributes.length || null;
      const airdate = ep.attributes.airdate || null;

      const filename = `anime-${animeId}-ep${episodeNum}.mp4`;
      const filePath = path.join(__dirname, '..', 'videos', filename);
      const exists = fs.existsSync(filePath);

      return {
        episode: episodeNum,
        title: episodeTitle,
        description: episodeDescription,
        videoUrl: exists ? `http://localhost:3000/videos/${filename}` : null,
        thumbnail,
        duration: episodeLength,
        airdate,
      };
    });

    // Step 5: Send final response
    res.json({
      title: animeTitle,
      thumbnail,
      description: animeDescription,
      totalEpisodes: episodes.length,
      episodes,
    });

  } catch (error) {
    console.error('Kitsu API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch anime episodes from Kitsu.' });
  }
});

export default router;
