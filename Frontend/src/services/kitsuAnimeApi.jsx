import axios from 'axios';

const BASE_URL = 'https://kitsu.io/api/edge';

// ✅ 1. Get Trending Anime
export const fetchTrendingAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/trending/anime?limit=${limit}`);
  return res.data.data;
};

// ✅ 2. Search Anime by Title
export const searchAnime = async (query, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[text]': query,
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// ✅ 3. Get Anime Details by ID
export const fetchAnimeDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}`);
  return res.data.data;
};

// ✅ 4. Get Anime Episodes
export const fetchAnimeEpisodes = async (animeId, limit = 10) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}/episodes`, {
    params: {
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// ✅ 5. Get Categories
export const fetchCategories = async () => {
  const res = await axios.get(`${BASE_URL}/categories`);
  return res.data.data;
};

// ✅ 6. Get Anime by Category Slug
export const fetchAnimeByCategory = async (categorySlug, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': categorySlug,
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// ✅ 7. Get Anime Reviews
export const fetchAnimeReviews = async (animeId, limit = 5) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}/reviews`, {
    params: {
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// ✅ 8. Get Anime Characters
export const fetchAnimeCharacters = async (animeId) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}/characters`);
  return res.data.data;
};

// ✅ 9. Get Related Anime (Relationships)
export const fetchRelatedAnime = async (animeId) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}/relationships/anime`);
  return res.data.data;
};

// ✅ 10. Get Anime Staff (Cast/Credits)
export const fetchAnimeStaff = async (animeId) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}/staff`);
  return res.data.data;
};

// ✅ 11. Get Manga List (Top)
export const fetchTopManga = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      'sort': '-popularityRank',
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// ✅ 12. Search Manga by Title
export const searchManga = async (query, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/manga`, {
    params: {
      'filter[text]': query,
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// ✅ 13. Get Manga Details by ID
export const fetchMangaDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/manga/${id}`);
  return res.data.data;
};

// ✅ 14. Get Genres/Tags (Category-like)
export const fetchAnimeGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genres`);
  return res.data.data;
};

// ✅ 15. Get Streaming Links for an Anime
export const fetchStreamingLinks = async (animeId) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}/streaming-links`);
  return res.data.data;
};

// ✅ 16. Get Anime Cover Image + Poster
export const fetchAnimeMediaImages = async (animeId) => {
  const res = await axios.get(`${BASE_URL}/anime/${animeId}`);
  return {
    poster: res.data.data.attributes.posterImage,
    cover: res.data.data.attributes.coverImage,
  };
};

export const getRandomAnime = async () => {
  const randomOffset = Math.floor(Math.random() * 100)
  const res = await axios.get(
    `https://kitsu.io/api/edge/anime?sort=ratingRank&page[limit]=1&page[offset]=${randomOffset}`
  );
  // Return as an array for compatibility with AnimeBanner
  return [res.data.data[0]];
}