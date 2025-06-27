import axios from "axios";

export const getRomComAnime = async () =>{
  const response = await axios.get("https://kitsu.io/api/edge/anime?filter[categories]=romance,comedy&page[limit]=10&sort=-popularityRank");

    return response.data.data;

}

export const getRandomAnime = async () => {
  const randomOffset = Math.floor(Math.random() * 100)
  const res = await axios.get(
    `https://kitsu.io/api/edge/anime?sort=ratingRank&page[limit]=1&page[offset]=${randomOffset}`
  );
  // Return as an array for compatibility with AnimeBanner
  return [res.data.data[0]];
}