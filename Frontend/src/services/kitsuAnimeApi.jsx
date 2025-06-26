import axios from "axios";

const FetchRomComAnime = async () =>{
  const response = await axios.get("https://kitsu.io/api/edge/anime?filter[categories]=romance,comedy&page[limit]=10&sort=-popularityRank");

    return response.data.data;

}

export { FetchRomComAnime };