// AniList API service using GraphQL
const ANILIST_API_URL = 'https://graphql.anilist.co';

// GraphQL query for trending anime
const TRENDING_ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME, status: RELEASING) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        duration
        genres
        averageScore
        popularity
        status
        season
        seasonYear
        format
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }
`;

// GraphQL query for popular anime
const POPULAR_ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        duration
        genres
        averageScore
        popularity
        status
        season
        seasonYear
        format
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }
`;

// GraphQL query for top rated anime
const TOP_RATED_ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        duration
        genres
        averageScore
        popularity
        status
        season
        seasonYear
        format
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }
`;

// GraphQL query for seasonal anime
const SEASONAL_ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
    Page(page: $page, perPage: $perPage) {
      media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        duration
        genres
        averageScore
        popularity
        status
        season
        seasonYear
        format
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
      }
    }
  }
`;

// Helper function to make GraphQL requests
const makeGraphQLRequest = async (query, variables = {}) => {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error('AniList API Error:', error);
    throw error;
  }
};

// Helper function to format anime data
const formatAnimeData = (anime) => {
  return {
    id: anime.id,
    title: anime.title.english || anime.title.romaji || anime.title.native,
    titleRomaji: anime.title.romaji,
    titleEnglish: anime.title.english,
    titleNative: anime.title.native,
    image: anime.coverImage?.large || anime.coverImage?.medium,
    bannerImage: anime.bannerImage,
    description: anime.description,
    episodes: anime.episodes,
    duration: anime.duration,
    genres: anime.genres,
    rating: anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A',
    score: anime.averageScore,
    popularity: anime.popularity,
    status: anime.status,
    season: anime.season,
    seasonYear: anime.seasonYear,
    format: anime.format,
    studio: anime.studios?.nodes?.[0]?.name || 'Unknown',
    startDate: anime.startDate,
    endDate: anime.endDate,
    year: anime.seasonYear || anime.startDate?.year
  };
};

export const fetchPopularAnime = async (limit = 20) => {
  try {
    const perPage = Math.min(limit, 50);
    const anime = await makeGraphQLRequest(POPULAR_ANIME_QUERY, {
      page: 1,
      perPage
    });
    return anime.slice(0, limit).map(formatAnimeData);
  } catch (error) {
    console.error('Error fetching popular anime:', error);
    return [];
  }
};

export const fetchTopRatedAnime = async (limit = 20) => {
  try {
    const perPage = Math.min(limit, 50);
    const anime = await makeGraphQLRequest(TOP_RATED_ANIME_QUERY, {
      page: 1,
      perPage
    });
    return anime.slice(0, limit).map(formatAnimeData);
  } catch (error) {
    console.error('Error fetching top rated anime:', error);
    return [];
  }
};

export const fetchSeasonalAnime = async (season = 'WINTER', year = new Date().getFullYear(), limit = 20) => {
  try {
    const perPage = Math.min(limit, 50);
    const anime = await makeGraphQLRequest(SEASONAL_ANIME_QUERY, {
      page: 1,
      perPage,
      season,
      seasonYear: year
    });
    return anime.slice(0, limit).map(formatAnimeData);
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    return [];
  }
};

export const fetchCurrentSeasonAnime = async (limit = 20) => {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  let season = 'WINTER';
  
  if (month >= 3 && month <= 5) season = 'SPRING';
  else if (month >= 6 && month <= 8) season = 'SUMMER';
  else if (month >= 9 && month <= 11) season = 'FALL';
  
  return fetchSeasonalAnime(season, currentDate.getFullYear(), limit);
};

export const searchAnime = async (query, limit = 20) => {
  const SEARCH_QUERY = `
    query ($search: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
            medium
          }
          bannerImage
          description
          episodes
          duration
          genres
          averageScore
          popularity
          status
          season
          seasonYear
          format
          studios(isMain: true) {
            nodes {
              name
            }
          }
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
        }
      }
    }
  `;

  try {
    const perPage = Math.min(limit, 50);
    const anime = await makeGraphQLRequest(SEARCH_QUERY, {
      search: query,
      page: 1,
      perPage
    });
    return anime.slice(0, limit).map(formatAnimeData);
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const fetchAnimeDetails = async (id) => {
  const DETAILS_QUERY = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        bannerImage
        description
        episodes
        duration
        genres
        averageScore
        popularity
        status
        season
        seasonYear
        format
        studios(isMain: true) {
          nodes {
            name
          }
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        characters(sort: ROLE, perPage: 10) {
          nodes {
            name {
              full
            }
            image {
              large
            }
          }
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: DETAILS_QUERY,
        variables: { id: parseInt(id) }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return formatAnimeData(data.data.Media);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}; 
// onwork
export const fetchTrendingManga = async (limit) => {
  const query = `
    query ($limit: Int) {
      Page(page: 1, perPage: $limit) {
        media(type: MANGA, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
  `;

  const variables = {
    limit,
  };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    return json.data.Page.media;
  } catch (error) {
    console.error("AniList API error:", error);
    return [];
  }
};
// onwork
export const fetchTrendingAnime = async (limit = 12) => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          averageScore
          status
          startDate {
            year
          }
          episodes
          genres
        }
      }
    }
  `;

  const variables = {
    page: 1,
    perPage: limit,
  };

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();
    const animeList = json?.data?.Page?.media || [];

    return animeList.map((anime) => ({
      id: anime.id,
      title: anime.title.english || anime.title.romaji || 'Unknown Title',
      image: anime.coverImage.large,
      rating: anime.averageScore ? `${(anime.averageScore / 10).toFixed(1)}/10` : 'N/A',
      status: anime.status || 'TBA',
      year: anime.startDate?.year?.toString() || 'TBA',
      episodes: anime.episodes || '?',
      genres: anime.genres || [],
    }));
  } catch (error) {
    console.error("AniList API error:", error);
    return [];
  }
};
