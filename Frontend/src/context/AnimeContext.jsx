// NOTE: This context is now cleared as requested, but not deleted. 
// If you need to use Jikan API data, please import and use directly from '../services/JikhanAnimeApi' where needed.

import React, { useState, useEffect } from 'react';
import { fetchTrendingAnime } from '../services/kitsuAnimeApi';

export const DataContext = React.createContext();

const AnimeContext = ({ children }) => {
  // const [kitsuTrendingAnime, setKitsuTrendingAnime] = useState([]);
  // const [loadingStates, setLoadingStates] = useState({
  //   kitsuTrending: false
  // });
  // const [errors, setErrors] = useState({
  //   kitsuTrending: null
  // });

  // const fetchKitsuTrending = async () => {
  //   try {
  //     setLoadingStates(prev => ({ ...prev, kitsuTrending: true }));
  //     setErrors(prev => ({ ...prev, kitsuTrending: null }));
      
  //     const data = await fetchTrendingAnime(20);
  //     setKitsuTrendingAnime(data);
  //   } catch (error) {
  //     console.error('Error fetching Kitsu trending anime:', error);
  //     setErrors(prev => ({ ...prev, kitsuTrending: error.message || 'Failed to fetch trending anime' }));
  //   } finally {
  //     setLoadingStates(prev => ({ ...prev, kitsuTrending: false }));
  //   }
  // };

  // const refetch = () => {
  //   fetchKitsuTrending();
  // };

  // useEffect(() => {
  //   fetchKitsuTrending();
  // }, []);

  const contextValue = {
    // kitsuTrendingAnime,
    // loadingStates,
    // errors,
    // refetch
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
