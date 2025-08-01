import axios from 'axios';

const BASE_URL = 'https://kitsu.io/api/edge';

// FOR FILTER PAGE
export const fetchAllAnime = async (limit = 12, offset = 0) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'page[limit]': limit,
      'page[offset]': offset,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// ✅ Updated Trending Anime using current airing + recent startDate
export const fetchTrendingAnime = async (limit = 12) => {
  const today = new Date().toISOString().split('T')[0];
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[status]': 'current',
      'filter[startDate]': `2025-06-01..${today}`,
      'sort': '-popularityRank',
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// 🆕 New Arrivals Anime (optional extra)
export const fetchNewArrivals = async (limit = 12) => {
  const today = new Date().toISOString().split('T')[0];
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[status]': 'current',
      'filter[startDate]': `2025-06-01..${today}`,
      'sort': '-startDate',
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// Seasonal Anime
export const fetchSeasonalAnime = async (season = 'spring', year = 2024, limit = 12) => {
  const seasonMonths = {
    winter: ['01', '02', '03'],
    spring: ['04', '05', '06'],
    summer: ['07', '08', '09'],
    fall: ['10', '11', '12'],
  };
  const monthFilters = seasonMonths[season.toLowerCase()];
  const filters = monthFilters.map(month => `${year}-${month}`).join(',');

  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[startDate]': filters,
      'page[limit]': limit,
    },
  });

  return res.data.data;
};

// Search Anime
export const searchAnime = async (query, limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[text]': query,
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// By Category
export const fetchAnimeByCategory = async (categorySlug, limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': categorySlug,
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Random Romcom
export const fetchRandomRomcomAnime = async () => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[genres]': 'romance,comedy',
      'page[limit]': 12,
      'sort': 'popularity',
    },
  });

  const animeList = res.data.data;
  if (animeList.length === 0) throw new Error('No romcom anime found');

  const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];

  return {
    id: randomAnime.id,
    title: randomAnime.attributes.titles.en_jp || randomAnime.attributes.canonicalTitle,
    image: randomAnime.attributes.coverImage?.original || randomAnime.attributes.posterImage?.original,
    watchUrl: `https://kitsu.io/anime/${randomAnime.id}`,
  };
};

// Multiple Romcom
export const fetchRomanceComedyAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'romance,comedy',
      'page[limit]': limit,
      'sort': 'popularityRank',
    },
  });
  return res.data.data;
};

export const fetchRomanceticAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'romance,movie',
      'page[limit]': limit,
      'sort': 'popularityRank',
    },
  });
  return res.data.data;
};


// Random Highly Rated
export const getRandomAnime = async () => {
  const randomOffset = Math.floor(Math.random() * 100);
  const res = await axios.get(
    `${BASE_URL}/anime?sort=ratingRank&page[limit]=1&page[offset]=${randomOffset}`
  );
  return [res.data.data[0]];
};

// Categories
export const fetchCategories = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/categories?page[limit]=${limit}`);
  return res.data.data;
};

// Action
export const fetchActionAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'action',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Romance
export const fetchRomanceAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'romance',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Comedy
export const fetchComedyAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'comedy',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Drama
export const fetchDramaAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'drama',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Fantasy
export const fetchFantasyAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'fantasy',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Horror
export const fetchHorrorAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'horror',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Sports
export const fetchSportsAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'sports',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Slice of Life
export const fetchSliceOfLifeAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'slice-of-life',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};
