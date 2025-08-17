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

// Trending Anime — uses the correct trending endpoint
export const fetchTrendingAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime/trending`, {
    params: {
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// New Arrivals
export const fetchNewArrivals = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[status]': 'current',
      'sort': '-startDate',
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// Seasonal Anime
export const fetchSeasonalAnime = async (season = 'spring', year = 2024, limit = 12) => {
  // Kitsu doesn't support season filter directly; this is a placeholder for manual logic
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[season]': season,
      'filter[seasonYear]': year,
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
      'filter[categories]': 'romance,comedy',
      'page[limit]': 12,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
  // const randomAnime = animeList[Math.floor(Math.random() * animeList.length)];
 
};

// Multiple Romcom
// export const fetchRomanceComedyAnime = async (limit = 12) => {
//   const res = await axios.get(`${BASE_URL}/anime`, {
//     params: {
//       'filter[categories]': 'romance,comedy',
//       'page[limit]': limit,
//       'sort': 'popularityRank',
//     },
//   });
//   return res.data.data;
// };

// Romantic Movies
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

export const fetchRomanceAnime = async (limit = 12) => {
    const res = await axios.get('https://kitsu.io/api/edge/anime', {
       params: {
         'filter[categories]': 'romance',
         'page[limit]': limit,
         'sort': '-popularityRank',
       },
     });
     return res.data.data;
   };
   
// Categories List
export const fetchCategories = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/categories`, {
    params: {
      'page[limit]': limit,
    },
  });
  return res.data.data;
};

// Genre-specific fetchers

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
export const fetchRomanceComedyAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'romance,comedy',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// export const fetchRomanceAnime = async (limit = 12) => {
//   const res = await axios.get(`${BASE_URL}/anime`, {
//     params: {
//       'filter[categories]': 'romance',
//       'page[limit]': limit,
//       'sort': '-popularityRank',
//     },
//   });
//   return res.data.data;
// };

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

// Improved: Fetch the most popular horror anime (by highest ratingRank, then popularityRank as fallback)
export const fetchHorrorAnime = async (limit = 12) => {
  // Try to get the highest rated horror anime, fallback to popularity if needed
  try {
    const res = await axios.get(`${BASE_URL}/anime`, {
      params: {
        'filter[categories]': 'horror',
        'page[limit]': limit,
        'sort': 'ratingRank,-popularityRank', // Highest rated, then most popular
      },
    });
    return res.data.data;
  } catch (error) {
    // fallback to popularityRank only if ratingRank fails
    const fallbackRes = await axios.get(`${BASE_URL}/anime`, {
      params: {
        'filter[categories]': 'horror',
        'page[limit]': limit,
        'sort': '-popularityRank',
      },
    });
    return fallbackRes.data.data;
  }
};

// Motivation/Strength/Sports Anime (most popular, with motivational themes)
export const fetchSportsAnime = async (limit = 12) => {
  // We'll try to fetch sports anime that are also tagged with "motivation" or "strength" if possible,
  // but Kitsu's API doesn't have a direct tag for "motivation" or "strength".
  // So, we fetch sports anime sorted by popularity, which usually surfaces motivational/success stories.
  // Optionally, you could filter by more categories if you know their slugs.
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[categories]': 'sports', // could try 'sports,motivation,strength' if those exist
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

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

// Popular anime by rating (highest rated)
export const fetchTopRatedAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'page[limit]': limit,
      'sort': 'ratingRank',
    },
  });
  return res.data.data;
};

// Currently airing anime
export const fetchCurrentlyAiringAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[status]': 'current',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Upcoming anime
export const fetchUpcomingAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[status]': 'upcoming',
      'page[limit]': limit,
      'sort': 'startDate',
    },
  });
  return res.data.data;
};

// Finished anime (completed series)
export const fetchFinishedAnime = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[status]': 'finished',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// Movies only
export const fetchAnimeMovies = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[subtype]': 'movie',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};

// TV series only
export const fetchAnimeTVSeries = async (limit = 12) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: {
      'filter[subtype]': 'TV',
      'page[limit]': limit,
      'sort': '-popularityRank',
    },
  });
  return res.data.data;
};
