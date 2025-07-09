import React, { createContext, useState, useEffect } from 'react';
import { 
  fetchTrendingAnime, 
  fetchNewlyAddedAnime

} from '../services/anilistApi';
import { FetchRomanceAnime } from '../services/JikhanAnimeApi';
export const ApiDataContext = createContext();

const ApiContext = ({ children }) => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [newlyAddedAnime, setNewlyAddedAnime] = useState([])
  const [romanceAnime, setRomanceAnime] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [trending, newlyAdded, romance] = await Promise.all([
          fetchTrendingAnime(12),
          fetchNewlyAddedAnime(10),
          FetchRomanceAnime(),
        ]);
        console.log('Romance fetched:', romance);
        setRomanceAnime(romance);
        setFeaturedAnime(trending);
        setNewlyAddedAnime(newlyAdded);
        setError(null);
      } catch (error) {
        setError(error);
        console.error("Fetching anime data error in ApiContext:", error);
        alert("Fetching anime data have error apicontext checkit!!", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ApiDataContext.Provider
      value={{ featuredAnime, romanceAnime,newlyAddedAnime, loading, error }}
    >
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiContext;
