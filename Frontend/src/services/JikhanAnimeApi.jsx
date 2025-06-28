// services/api.js
import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';


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

// ✅ 10. Upcoming Anime
export const FetchUpcomingAnime = async (limit = 15) => {
  const res = await axios.get(`${BASE_URL}/top/anime?filter=upcoming&limit=${limit}`);
  return res.data.data;
};

// ✅ 11. Anime by Genre ID
export const FetchAnimeByGenre = async (genreId, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime?genres=${genreId}&limit=${limit}`);
  return res.data.data;
};

// ✅ 12. Fetch All Genres
export const FetchGenres = async () => {
  const res = await axios.get(`${BASE_URL}/genres/anime`);
  return res.data.data;
};

// ✅ 13. Recommendations by ID
export const FetchRecommendations = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/recommendations`);
  return res.data.data;
};

// ✅ 14. Romance Comedy Anime
export const FetchRomComAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=22,4&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};


export const FetchActionAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=1&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};


export const FetchShounenAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=27&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 17. Slice of Life Anime
export const FetchSliceOfLifeAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=36&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 18. Horror Anime
export const FetchHorrorAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=14&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 19. Random Anime
export const FetchRandomAnime = async () => {
  const res = await axios.get(`${BASE_URL}/random/anime`);
  return res.data.data;
};

// ✅ 20. Anime Characters by ID
export const FetchAnimeCharacters = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/characters`);
  return res.data.data;
};

// ✅ 21. Anime Reviews by ID
export const FetchAnimeReviews = async (id, page = 1) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/reviews?page=${page}`);
  return res.data.data;
};

// ✅ 22. Anime Statistics by ID
export const FetchAnimeStatistics = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/statistics`);
  return res.data.data;
};

// ✅ 23. Anime Pictures by ID
export const FetchAnimePictures = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/pictures`);
  return res.data.data;
};

// ✅ 24. Anime Videos by ID
export const FetchAnimeVideos = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}/videos`);
  return res.data.data;
};

// ✅ 25. Top Characters
export const FetchTopCharacters = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/top/characters?limit=${limit}`);
  return res.data.data;
};

// ✅ 26. Character Details by ID
export const FetchCharacterDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/characters/${id}`);
  return res.data.data;
};

// ✅ 27. Movie Anime
export const FetchMovieAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?type=movie&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 28. OVA Anime
export const FetchOVAAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?type=ova&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 29. Drama Anime
export const FetchDramaAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=8&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 30. Fantasy Anime
export const FetchFantasyAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=10&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 31. Comedy Anime
export const FetchComedyAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=4&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 32. Thriller Anime
export const FetchThrillerAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=41&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 33. Sports Anime
export const FetchSportsAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=30&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 34. School Anime
export const FetchSchoolAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=23&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};

// ✅ 35. Isekai Anime
export const FetchIsekaiAnime = async (limit = 18) => {
  const res = await axios.get(
    `${BASE_URL}/anime?genres=62&order_by=popularity&sort=desc&limit=${limit}`
  );
  return res.data.data;
};