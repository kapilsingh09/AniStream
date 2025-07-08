import React, { createContext, useState, useEffect } from 'react';
import { 
  fetchTrendingAnime, 
  fetchNewlyAddedAnime

} from '../services/anilistApi';

export const ApiDataContext = createContext();

const ApiContext = ({ children }) => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [newlyAddedAnime, setNewlyAddedAnime] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [trending, newlyAdded] = await Promise.all([
          fetchTrendingAnime(12),
          fetchNewlyAddedAnime(10)
        ]);
        setFeaturedAnime(trending);
        setNewlyAddedAnime(newlyAdded);
        setError(null);
      } catch (error) {
        setError(error);
        alert("Fetching anime data have error apicontext checkit!!", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ApiDataContext.Provider
      value={{ featuredAnime ,newlyAddedAnime, loading, error, fetchTrendingAnime }}
    >
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiContext;
