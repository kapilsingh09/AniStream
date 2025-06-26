import React, { createContext, useEffect, useState } from 'react';
import { 
  FetchTrendingAnime, 
  FetchSeasonalAnime, 
  FetchUpcomingAnime
} from '../services/JikhanAnimeApi';
import { FetchRomComAnime } from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [romCom, setRomCom] = useState([]);


  const fetchAllData = async () => {
    setLoading(true);
    const [trending, upcoming, seasonal, romComData] = await Promise.allSettled([
      FetchTrendingAnime(),
      FetchUpcomingAnime(),
      FetchSeasonalAnime(),
      // FetchRomComAnime()
    ]);
    setTrendingAnime(trending || []);
    setUpcomingAnime(upcoming || []);
    setSeasonalAnime(seasonal || []);
    // setRomCom(romComData || []);
  
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    seasonalAnime,
    // romCom,
   
    refetch: fetchAllData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;