import React, { createContext, useState, useEffect } from 'react';
import { fetchTrendingAnime } from '../services/anilistApi';

export const ApiDataContext = createContext();

const ApiContext = ({ children }) => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrendingAnime = async () => {
      setLoading(true);
      try {
        const data = await fetchTrendingAnime(12);
        setFeaturedAnime(data);
      } catch (err) {
        console.error('Error fetching trending anime:', err);
        setError('Failed to load trending anime.');
      } finally {
        setLoading(false);
      }
    };

    loadTrendingAnime();
  }, []);

  return (
    <ApiDataContext.Provider
      value={{ featuredAnime, loading, error }}
    >
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiContext;
