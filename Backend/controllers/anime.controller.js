import { fetchAllEpisodes, searchAnimeBySlug, fetchGenres } from '../services/kitsu.service.js';
import { checkVideoFile } from '../utils/fileUtils.js';

export const getAnimeDetails = async (req, res) => {
  const { slug } = req.params;

  try {
    const anime = await searchAnimeBySlug(slug);
    if (!anime) return res.status(404).json({ error: 'Anime not found on Kitsu.' });

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
      genres: []
    };

    animeData.genres = await fetchGenres(anime.relationships?.genres?.links?.related);

    const episodesData = await fetchAllEpisodes(animeId);
    const episodes = episodesData.map((ep, index) => {
      const epAttr = ep.attributes;
      const epNum = epAttr.number || index + 1;
      const { exists, filename } = checkVideoFile(animeId, epNum);

      return {
        id: ep.id,
        episode: epNum,
        title: epAttr.canonicalTitle || `Episode ${epNum}`,
        description: epAttr.synopsis || 'No episode description available.',
        airdate: epAttr.airdate || null,
        duration: epAttr.length || null,
        videoUrl: exists ? `http://localhost:3000/videos/${filename}` : null,
        thumbnail: animeData.posterImage?.original || null,
        seasonNumber: epAttr.seasonNumber || null,
        relativeNumber: epAttr.relativeNumber || null,
      };
    });

    res.json({ ...animeData, episodes, totalEpisodes: episodes.length });

  } catch (error) {
    console.error('Kitsu API Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch anime episodes from Kitsu.' });
  }
};
