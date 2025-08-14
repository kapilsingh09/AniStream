import axios from 'axios';

export const fetchAllEpisodes = async (animeId) => {
  let episodes = [];
  let url = `https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=20&page[offset]=0`;

  while (url) {
    const res = await axios.get(url);
    episodes = [...episodes, ...res.data.data];
    url = res.data.links?.next || null;
  }

  return episodes;
};

export const searchAnimeBySlug = async (slug) => {
  const res = await axios.get(
    `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(slug)}`
  );
  return res.data.data[0] || null;
};

export const fetchGenres = async (genreLink) => {
  if (!genreLink) return [];
  const res = await axios.get(genreLink);
  return res.data.data.map(g => g.attributes.name);
};
