// services/api.js
import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

export const FetchTrendingRomanceComedyAnime = async (limit = 18) => {
  const genreRomance = 22;
  const genreComedy = 4;

  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      genres: `${genreRomance},${genreComedy}`,
      order_by: 'popularity',
      sort: 'asc',
      limit,
    },
  });

  return res.data.data;
};


export const FetchTrendingAnime = async (limit = 18) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=bypopularity&limit=${limit}`);
  return res.data.data;
};

// ✅ 2. Top Rated / Currently Airing Anime
export const FetchTopRatedAnime = async (limit = 18) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=airing&limit=${limit}`);
  return res.data.data;
};

// ✅ 3. Most Popular Anime
export const FetchPopularAnime = async (limit = 18) => {
  const res = await axios.get(`${BASE_URL}/anime?order_by=popularity&sort=asc&limit=${limit}`);
  return res.data.data;
};

// ✅ 4. Top Anime of All Time
export const FetchTopAnime = async (limit = 18) => {
  const res = await axios.get(`${BASE_URL}/top/anime?limit=${limit}`);
  return res.data.data;
};

// ✅ 5. Search Anime by Keyword
export const SearchAnime = async (query, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
  return res.data.data;
};

// ✅ 6. Get Anime Details by ID
export const FetchAnimeDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}`);
  return res.data.data;
};

// ✅ 7. Get Anime Episodes by Anime ID
export const FetchAnimeEpisodes = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/episodes`);
  return res.data.data;
};

// ✅ 8. Seasonal Anime by Year & Season
export const FetchSeasonalAnime = async (year, season, limit = 15) => {
  const res = await axios.get(`${BASE_URL}/seasons/${year}/${season}?limit=${limit}`);
  return res.data.data;
};

// ✅ 9. Current Season Anime
export const FetchCurrentSeasonAnime = async (limit = 15) => {
  const res = await axios.get(`${BASE_URL}/seasons/now?limit=${limit}`);
  return res.data.data;
};

// 10. Upcoming Anime
export const FetchUpcomingAnime = async (limit = 15) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=upcoming&limit=${limit}`);
  return res.data.data;
};

// rom com

export const FetchRomcomAnime = async () => {
  const response = await fetch('https://api.jikan.moe/v4/anime?genres=22,4&order_by=popularity&sort=desc');
  const data = await response.json();
  return data.data; // anime list
};
// src/api/fetchJikanActionAnime.js

export const FetchRomanceAnime = async () => {
  try {
    const res = await axios.get(`https://api.jikan.moe/v4/anime?genres=22&order_by=score&sort=desc&limit=8`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch romance anime:", error);
    return [];
  }
};