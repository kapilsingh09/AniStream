import Anime from "../models/anime.model.js";
import axios from "axios";

export const fetchAndCacheAnime = async () => {
  const url = `https://api.jikan.moe/v4/anime?genres=22&order_by=popularity&sort=asc&limit=25`;
  
  const response = await axios.get(url);
  const animeListFromApi = response.data?.data;

  if (!animeListFromApi || animeListFromApi.length === 0) {
    throw new Error("No romantic anime found from API");
  }

  const results = [];

  for (const anime of animeListFromApi) {
    let existing = await Anime.findOne({ mal_id: anime.mal_id });

    if (existing) {
      existing.access_count += 1;
      existing.last_accessed = new Date();
      await existing.save();
      results.push(existing);
    } else {
      const newAnime = new Anime({
        mal_id: anime.mal_id,
        canonical_title: anime.title,
        synopsis: anime.synopsis,
        images: {
          banner: anime.trailer?.images?.maximum_image_url || "",
          cover: anime.images?.jpg?.large_image_url || "",
          poster: anime.images?.jpg?.image_url || "",
        },
        year:
          anime.year ||
          (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null),
        rating: anime.rating,
        episode_count: anime.episodes,
        status: anime.status,
        genres: anime.genres?.map((g) => g.name) || [],
        duration: anime.duration || "",
        members: anime.members,
        access_count: 1,
        last_accessed: new Date(),
      });

      await newAnime.save();
      results.push(newAnime);
    }
  }

  return results;
};