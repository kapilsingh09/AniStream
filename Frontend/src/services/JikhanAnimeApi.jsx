// services/api.js
import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

// ✅ 1. Trending Anime
export const FetchTrendingAnime = async (limit = 18 ) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=bypopularity&limit=${limit}`);
  return res.data.data;
};

// ✅ 2. Top Rated / Currently Airing Anime
export const FetchTopRatedAnime = async (limit = 18) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=airing&limit=${limit}`);
  return res.data.data;
};

//  3. Search Anime by Keyword
export const SearchAnime = async (query, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
  return res.data.data;
};

//  4. Get Anime Details by ID
export const FetchAnimeDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}`);
  return res.data.data;
};

// ✅ 5. Get Anime Episodes by Anime ID
export const FetchAnimeEpisodes = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/episodes`);
  return res.data.data;
};

// ✅ 6. Seasonal Anime by Year & Season
export const FetchSeasonalAnime = async (year, season, limit = 15) => {
  const res = await axios.get(`${BASE_URL}/seasons/${year}/${season}?limit=${limit}`);
  return res.data.data;
};

// ✅ 7. Upcoming Anime
export const FetchUpcomingAnime = async (limit = 15) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=upcoming&limit=${limit}`);
  return res.data.data;
};

// ✅ 8. Anime by Genre ID
export const FetchAnimeByGenre = async (genreId, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime?genres=${genreId}&limit=${limit}`);
  return res.data.data;
};

// ✅ 9. Fetch All Genres
export const FetchGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genres/anime`);
  return res.data.data;
};


//recommendation route by id 
export const FetchRecommendations = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/recommendations`);
  return res.data.data;
};

export const FetchRomComAnime = async (limit = 18) => {
  const res = await axios.get(
    `https://api.jikan.moe/v4/anime?genres=22,4&order_by=popularity&sort=desc&limit=${limit}`
  );

  return res.data.data;
};
