import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Needed because __dirname is not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const searchRes = await axios.get(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(slug)}`);
    const anime = searchRes.data.data[0];
    // console.log(anime);
    
    if (!anime) {
      return res.status(404).json({ error: 'Anime not found on Kitsu.' });
    }

    // 📌 Extract info
    const animeId = anime.id;
    const animeTitle = anime.attributes.titles?.en || anime.attributes.canonicalTitle || 'Unknown Title';
    const thumbnail = anime.attributes.posterImage.original;
    const animeDescription = anime.attributes.description || 'No anime description available.';

    const episodesRes = await axios.get(`https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=20`);
    const episodesData = episodesRes.data.data;

    const episodes = episodesData.map((ep, index) => {
      const filename = `anime-${animeId}-ep${index + 1}.mp4`;
      const filePath = path.join(__dirname, '..', '', 'videos', filename);
      const exists = fs.existsSync(filePath); 
      // console.log(filePath);
      // console.log(filename);

      return {
        episode: ep.attributes.number || index + 1,
        title: ep.attributes.canonicalTitle || `Episode ${index + 1}`,
        description: ep.attributes.synopsis || 'No episode description available.',
        videoUrl: exists ? `http://localhost:3000/videos/${filename}` : null,
        thumbnail,
      };
    }); 
    

    // Final response
    res.json({
      title: animeTitle,
      thumbnail,
      description: animeDescription,
      episodes,
    });

  } catch (error) {
    console.error('❌ Kitsu API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch anime episodes from Kitsu.' });
  }
});

export default router;
