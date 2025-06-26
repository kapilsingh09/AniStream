import axios from "axios";

const FetchRomComAnime = async () => {
  try {
    const response = await axios.get(
      "https://api.jikan.moe/v4/anime?genres=22,4&status=complete&order_by=members&sort=desc",
      {
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }
    );
    
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching rom-com anime from Kitsu:', error);
    throw error; // Re-throw to be handled by Promise.allSettled in context
  }
};

export { FetchRomComAnime };