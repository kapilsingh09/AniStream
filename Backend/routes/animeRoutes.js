import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { log } from 'console';

const router = express.Router();
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

    const animeData = {
      id: animeId,
      slug: attributes.slug,
      title: attributes.titles?.en || attributes.canonicalTitle || 'Unknown Title',
      title_jp: attributes.titles?.ja_jp || attributes.titles?.en_jp || null,
      synopsis: attributes.synopsis,
      description: attributes.description || 'No anime description available.',
      subtype: attributes.subtype,
      status: attributes.status,
      startDate: attributes.startDate,
      endDate: attributes.endDate,
      episodeCount: attributes.episodeCount,
      episodeLength: attributes.episodeLength,
      showType: attributes.showType,
      averageRating: attributes.averageRating,
      ratingRank: attributes.ratingRank,
      popularityRank: attributes.popularityRank,
      userCount: attributes.userCount,
      favoritesCount: attributes.favoritesCount,
      posterImage: attributes.posterImage,
      coverImage: attributes.coverImage,
      youtubeVideoId: attributes.youtubeVideoId,
      genres: attributes.genres,
    };

    // Fetch genres
    try {
      const genreLink = anime.relationships?.genres?.links?.related;
      if (genreLink) {
        const genresRes = await axios.get(genreLink);
        animeData.genres = genresRes.data.data.map(g => g.attributes.name);
      }
    } catch (err) {
      animeData.genres = [];
    }

    // Fetch episodes
    const episodesData = await fetchAllEpisodes(animeId);

    const episodes = episodesData.map((ep, index) => {
      const epAttr = ep.attributes;
      const epNum = epAttr.number || index + 1;
      const filename = `anime-${animeId}-ep${epNum}.mp4`;
      const filePath = path.join(__dirname, '..', 'videos', filename);
      const fileExists = fs.existsSync(filePath);

      // console.log(filePath);
      // console.log(fileExists);
      
      return {
        id: ep.id,
        episode: epNum,
        title: epAttr.canonicalTitle || `Episode ${epNum}`,
        description: epAttr.synopsis || 'No episode description available.',
        airdate: epAttr.airdate || null,
        duration: epAttr.length || null,
        videoUrl: fileExists ? `http://localhost:3000/videos/${filename}` : null,
        thumbnail: animeData.posterImage?.original || null,
        seasonNumber: epAttr.seasonNumber || null,
        relativeNumber: epAttr.relativeNumber || null,
      };
    });

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
