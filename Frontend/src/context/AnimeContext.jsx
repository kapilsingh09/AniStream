// AnimeContext.jsx
import React, { createContext, useEffect, useState } from 'react';
import { FetchTrendingAnime, FetchSeasonalAnime, FetchUpcomingAnime, FetchTopRatedAnime } from '../services/JikhanAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [sesonalAnime, setSesonalAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [trending, upcoming, topRated, seasonal] = await Promise.allSettled([
          FetchTrendingAnime(),
          FetchUpcomingAnime(),
          FetchTopRatedAnime(),
          FetchSeasonalAnime(2025, 'summer')
        ]);

        // Handle trending anime
        if (trending.status === 'fulfilled') {
          setTrendingAnime(trending.value || []);
        } else {
          console.error('Failed to fetch trending anime:', trending.reason);
        }

        // Handle upcoming anime
        if (upcoming.status === 'fulfilled') {
          setUpcomingAnime(upcoming.value || []);
        } else {
          console.error('Failed to fetch upcoming anime:', upcoming.reason);
        }

        // Handle top rated anime
        if (topRated.status === 'fulfilled') {
          setTopRatedAnime(topRated.value || []);
        } else {
          console.error('Failed to fetch top rated anime:', topRated.reason);
        }

        // Handle seasonal anime
        if (seasonal.status === 'fulfilled') {
          setSesonalAnime(seasonal.value || []);
        } else {
          console.error('Failed to fetch seasonal anime:', seasonal.reason);
        }

        // Set error if all requests failed
        if (trending.status === 'rejected' && upcoming.status === 'rejected' && topRated.status === 'rejected') {
          setError('Failed to fetch anime data');
        }
      } catch (err) {
        console.error('Error fetching anime data:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    topRatedAnime,
    sesonalAnime,
    loading,
    error,
    // Utility function to refetch data
    refetch: () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const [trending, upcoming, topRated] = await Promise.allSettled([
            FetchTrendingAnime(),
            FetchUpcomingAnime(),
            FetchTopRatedAnime(),
            FetchSeasonalAnime(2025, 'summer')
          ]);

          if (trending.status === 'fulfilled') setTrendingAnime(trending.value || []);
          if (upcoming.status === 'fulfilled') setUpcomingAnime(upcoming.value || []);
          if (topRated.status === 'fulfilled') setTopRatedAnime(topRated.value || []);
        } catch (err) {
          console.error('Error refetching anime data:', err);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;