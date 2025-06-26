import React, { createContext, useEffect, useState } from 'react';
import { 
  FetchTrendingAnime, 
  FetchSeasonalAnime, 
  FetchUpcomingAnime
} from '../services/JikhanAnimeApi';
import { FetchRomComAnime ,getRandomAnime } from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [randomAnime, setrandomAnime] = useState([])
  const [romCom, setRomCom] = useState([]);


  const fetchAllData = async () => {
    const [trending, upcoming, seasonal, romComData ,randomAnime] = await Promise.allSettled([
      FetchTrendingAnime(),
      FetchUpcomingAnime(),
      FetchSeasonalAnime(),
      FetchRomComAnime()
    ]);
    setTrendingAnime(trending || []);
    setUpcomingAnime(upcoming || []);
    setSeasonalAnime(seasonal || []);
    setrandomAnime(randomAnime || []
    )
    // setRomCom(romComData || []);
  
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    seasonalAnime,
    randomAnime,
    romCom,
   
    refetch: fetchAllData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;