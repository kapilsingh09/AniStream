import React, { createContext, useEffect, useState } from 'react';
import { 
  FetchTrendingAnime, 
  FetchSeasonalAnime, 
  FetchUpcomingAnime,
  FetchRomComAnime
} from '../services/JikhanAnimeApi';
import { getRandomAnime } from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [randomAnime, setrandomAnime] = useState([])
  const [romCom, setRomCom] = useState([]);


  const fetchAllData = async () => {
    const [trending, upcoming, romComData ,randomAnime] = await Promise.allSettled([
      FetchTrendingAnime(),
      FetchUpcomingAnime(),
      FetchRomComAnime(),
      // FetchSeasonalAnime(),
      // FetchRomComAnime()
    ]);
    setTrendingAnime(trending || []);
    setUpcomingAnime(upcoming || []);
    // setSeasonalAnime(seasonal || []);
    setrandomAnime(randomAnime || []);
    setRomCom(romComData || []);
  
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    // seasonalAnime,
    romCom,
    randomAnime,
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