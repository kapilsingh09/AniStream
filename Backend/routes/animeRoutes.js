import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// __dirname workaround for ES modulesjj
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fetchAllEpisodes = async (animeId) => {
  let episodes = [];
  let url = `https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=20&page[offset]=0`;

  while (url) {
    const res = await axios.get(url);
    episodes = [...episodes, ...res.data.data];
    url = res.data.links?.next || null;
  }

  return episodes;
};

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const searchRes = await axios.get(
      `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(slug)}`
    );

    const anime = searchRes.data.data[0];

    if (!anime) {
      return res.status(404).json({ error: 'Anime not found on Kitsu.' });
    }

    const animeId = anime.id;
    const attributes = anime.attributes;

    // Gather all relevant anime data
    const animeData = {
      id: animeId,
      slug: attributes.slug,
      title: attributes.titles?.en || attributes.canonicalTitle || 'Unknown Title',
      title_jp: attributes.titles?.ja_jp || attributes.titles?.en_jp || null,
      canonicalTitle: attributes.canonicalTitle,
      synopsis: attributes.synopsis,
      description: attributes.description || 'No anime description available.',
      subtype: attributes.subtype,
      status: attributes.status,
      ageRating: attributes.ageRating,
      ageRatingGuide: attributes.ageRatingGuide,
      startDate: attributes.startDate,
      endDate: attributes.endDate,
      episodeCount: attributes.episodeCount,
      episodeLength: attributes.episodeLength,
      showType: attributes.showType,
      // nsfw: attributes.nsfw,
      averageRating: attributes.averageRating,
      ratingRank: attributes.ratingRank,
      popularityRank: attributes.popularityRank,
      userCount: attributes.userCount,
      favoritesCount: attributes.favoritesCount,
      ratingFrequencies: attributes.ratingFrequencies,
      posterImage: attributes.posterImage,
      coverImage: attributes.coverImage,
      youtubeVideoId: attributes.youtubeVideoId,
      genres: [], // will fill below
      // Add more fields as needed
    };

    // Fetch genres
    let genres = [];
    if (anime.relationships && anime.relationships.genres && anime.relationships.genres.links?.related) {
      try {
        const genresRes = await axios.get(anime.relationships.genres.links.related);
        genres = genresRes.data.data.map(g => g.attributes.name);
      } catch (err) {
        genres = [];
      }
    }
    animeData.genres = genres;

    // Fetch episodes
    const episodesData = await fetchAllEpisodes(animeId);

    const episodes = episodesData.map((ep, index) => {
      const epAttr = ep.attributes;
      const episodeNum = epAttr.number || index + 1;
      const filename = `anime-${animeId}-ep${episodeNum}.mp4`;
      const filePath = path.join(__dirname, '..', 'videos', filename);
      const exists = fs.existsSync(filePath);

      return {
        id: ep.id,
        episode: episodeNum,
        title: epAttr.canonicalTitle || `Episode ${episodeNum}`,
        description: epAttr.synopsis || 'No episode description available.',
        videoUrl: exists ? `http://localhost:3000/videos/${filename}` : null,
        thumbnail: animeData.posterImage?.original || null,
        duration: epAttr.length || null,
        airdate: epAttr.airdate || null,
        seasonNumber: epAttr.seasonNumber || null,
        relativeNumber: epAttr.relativeNumber || null,
        // Add more episode fields as needed
      };
    });

    // Compose all data to send to frontend
    res.json({
      ...animeData,
      episodes,
      totalEpisodes: episodes.length,
    });

  } catch (error) {
    console.error('Kitsu API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch anime episodes from Kitsu.' });
  }
});

export default router;
