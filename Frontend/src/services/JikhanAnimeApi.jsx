// services/api.js
import { noop } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';
const DEFAULT_LIMIT = 11;
// noop
export const FetchTrendingRomanceComedyAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      genres: '22',
      status: 'airing',
      order_by: 'popularity',
      sort: 'desc',
      limit,
    },
  });
  return res.data.data;
};
export const fetchRomanceAnimeForAnimeGrid = async () => {
  const response = await fetch(
    `https://api.jikan.moe/v4/anime?genres=22&order_by=score&sort=desc&limit=8`
  );
  if (!response.ok) throw new Error("Failed to fetch anime data");
  const data = await response.json();
  return data.data || [];
};

// ✅ 
export const FetchTrendingAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/top/anime`, {
    params: {
      filter: 'bypopularity',
      limit,
    },
  });
  return res.data.data;
};

// ✅ 
export const FetchTopRatedAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/top/anime`, {
    params: {
      filter: 'airing',
      limit,
    },
  });
  return res.data.data;
};

export const FetchPopularAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      order_by: 'popularity',
      sort: 'desc',
      filter: 'airing',
      limit,
    },
  });
  return res.data.data;
};

// ✅ 
export const FetchTopAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/top/anime`, {
    params: { limit },
  });
  return res.data.data;
};

// forSearching
// export const SearchAnime = async (query, limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/anime`, {
//     params: {
//       q: query,
//       limit,
//     },
//   });
//   return res.data.data;
// };



// ✅ Anime Episodes by ID
export const FetchAnimeEpisodes = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/episodes`);
  return res.data.data;
};

// using somewheres
export const FetchSeasonalAnime = async (year, season, limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/seasons/${year}/${season}`, {
    params: { limit },
  });
  return res.data.data;
};

// ✅
export const FetchCurrentSeasonAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/seasons/now`, {
    params: { limit },
  });
  return res.data.data;
};

// ✅ Upcoming Anime
export const FetchUpcomingAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/top/anime`, {
    params: {
      filter: 'upcoming',
      limit,
    },
  });
  return res.data.data;
};

// ✅ Romcom Anime (romance + comedy, sorted by popularity)
export const FetchRomcomAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      genres: '22,4',
      order_by: 'popularity',
      sort: 'desc',
      limit,
    },
  });
  return res.data.data;
};

// ✅ Romance Anime (sorted by score)
export const FetchRomanceAnime = async (limit = DEFAULT_LIMIT) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      genres: '22',
      order_by: 'score',
      sort: 'desc',
      limit,
    },
  });
  return res.data.data;
};
