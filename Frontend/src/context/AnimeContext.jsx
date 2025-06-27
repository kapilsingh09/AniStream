import React, { createContext, useEffect, useState, useCallback } from 'react';
import { FetchTopRatedAnime } from '../services/JikhanAnimeApi';

const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create a fetch function that can be called by components
  const fetchTopRatedAnime = useCallback(async () => {
    try {
      const data = await FetchTopRatedAnime();
      return data;
    } catch (error) {
      console.error('Error fetching top rated anime:', error);
      throw error; // Re-throw so components can handle it
    }
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopRatedAnime();
        setTopRatedAnime(data);
      } catch (error) {
        console.error('Error fetching top rated anime:', error);
        setError('Failed to load top rated anime');
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchTopRatedAnime]);

  // Refresh function for manual retry
  const refreshTopRatedAnime = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopRatedAnime();
      setTopRatedAnime(data);
      return data;
    } catch (error) {
      console.error('Error refreshing top rated anime:', error);
      setError('Failed to refresh top rated anime');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchTopRatedAnime]);

  return (
    <DataContext.Provider value={{ 
      // Data
      topRatedAnime, 
      loading, 
      error,
      
      // Functions for components
      fetchTopRatedAnime,
      refreshTopRatedAnime
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
export { DataContext };