import axios from 'axios';

const BASE_URL = 'https://kitsu.io/api/edge';

//done
export const fetchTrendingAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/trending/anime?limit=${limit}`);
  return res.data.data;
};

// 2. Seasonal Anime (Filtered by season and year)
export const fetchSeasonalAnime = async (season = 'spring', year = 2024, limit = 20) => {
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

// 3. Search Anime by Title
export const searchAnime = async (query, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[text]': query,
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// 4. Get Anime by Category Slug (ex: action, romance, drama)
export const fetchAnimeByCategory = async (categorySlug, limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': categorySlug,
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 5. Random Popular Romance + Comedy (Romcom)
export const fetchRandomRomcomAnime = async () => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[genres]': 'romance,comedy',
      'page[limit]': 20,
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

// 6. Get Random Highly Rated Anime
// export const getRandomAnime = async () => {
//   const randomOffset = Math.floor(Math.random() * 100);
//   const res = await axios.get(
//     `${BASE_URL}/anime?sort=ratingRank&page[limit]=1&page[offset]=${randomOffset}`
//   );
//   return [res.data.data[0]];
// };

export const getRandomAnime = async () => {
  const randomOffset = Math.floor(Math.random() * 100)
  const res = await axios.get(
    `https://kitsu.io/api/edge/anime?sort=ratingRank&page[limit]=1&page[offset]=${randomOffset}`
  );
  // Return as an array for compatibility with AnimeBanner
  return [res.data.data[0]];
}

// 7. Get All Categories
export const fetchCategories = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/categories?page[limit]=${limit}`);
  return res.data.data;
};

// 8. Get School Anime (using school category)


// 9. Get Action Anime
export const fetchActionAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'action',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 10. Get Romance Anime
export const fetchRomanceAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'romance',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 11. Get Comedy Anime
export const fetchComedyAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'comedy',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 12. Get Drama Anime
export const fetchDramaAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'drama',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 13. Get Fantasy Anime
export const fetchFantasyAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'fantasy',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 14. Get Horror Anime
export const fetchHorrorAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'horror',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 15. Get Sports Anime
export const fetchSportsAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'sports',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// 16. Get Slice of Life Anime
export const fetchSliceOfLifeAnime = async (limit = 20) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'slice-of-life',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};