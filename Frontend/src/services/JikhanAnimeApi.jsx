// // services/api.js
// import axios from 'axios';

// const BASE_URL = 'https://api.jikan.moe/v4';

// // Set default limit to 50 for all requests
// const DEFAULT_LIMIT = 10;

// export const FetchTrendingRomanceComedyAnime = async (limit = DEFAULT_LIMIT) => {
//   const genreRomance = 22;
//   const genreComedy = 4;
//   const res = await axios.get(`${BASE_URL}/anime`, {
//     params: {
//       genres: `${genreRomance},${genreComedy}`,
//       order_by: 'popularity',
//       sort: 'asc',
//       limit,
//     },
//   });
//   return res.data.data;
// };

// export const FetchTrendingAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/top/anime?filter=bypopularity&limit=${limit}`);
//   return res.data.data;
// };

// export const FetchTopRatedAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/top/anime?filter=airing&limit=${limit}`);
//   return res.data.data;
// };

// export const FetchPopularAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/anime?order_by=popularity&sort=asc&limit=${limit}`);
//   return res.data.data;
// };

// export const FetchTopAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/top/anime?limit=${limit}`);
//   return res.data.data;
// };

// export const SearchAnime = async (query, limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`);
//   return res.data.data;
// };

// export const FetchAnimeDetails = async (id) => {
//   const res = await axios.get(`${BASE_URL}/anime/${id}`);
//   return res.data.data;
// };

// export const FetchAnimeEpisodes = async (id) => {
//   const res = await axios.get(`${BASE_URL}/anime/${id}/episodes`);
//   return res.data.data;
// };

// export const FetchSeasonalAnime = async (year, season, limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/seasons/${year}/${season}?limit=${limit}`);
//   return res.data.data;
// };

// export const FetchCurrentSeasonAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/seasons/now?limit=${limit}`);
//   return res.data.data;
// };

// export const FetchUpcomingAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`${BASE_URL}/top/anime?filter=upcoming&limit=${limit}`);
//   return res.data.data;
// };

// export const FetchRomcomAnime = async (limit = DEFAULT_LIMIT) => {
//   const response = await fetch(`https://api.jikan.moe/v4/anime?genres=22,4&order_by=popularity&sort=desc&limit=${limit}`);
//   const data = await response.json();
//   return data.data;
// };

// export const FetchRomanceAnime = async (limit = DEFAULT_LIMIT) => {
//   const res = await axios.get(`https://api.jikan.moe/v4/anime?genres=22&order_by=score&sort=desc&limit=${limit}`);
//   return res.data.data;
// };