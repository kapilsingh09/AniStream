import React, { createContext, useEffect, useState } from 'react';
import {
  FetchTrendingAnime,
  FetchSeasonalAnime,
  FetchUpcomingAnime,
} from '../services/JikhanAnimeApi';
import {
  getRandomAnime,
  getRomComAnime,
} from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [randomAnime, setRandomAnime] = useState([]);
  const [romComAnime, setRomComAnime] = useState([]);

  const fetchAllData = async () => {
    const results = await Promise.allSettled([
      FetchTrendingAnime(),
      FetchUpcomingAnime(),
      getRandomAnime(),
      getRomComAnime(),
    ]);

    const [trending, upcoming, random, romcom] = results;

    if (trending.status === 'fulfilled') setTrendingAnime(trending.value);
    if (upcoming.status === 'fulfilled') setUpcomingAnime(upcoming.value);
    if (random.status === 'fulfilled') setRandomAnime(random.value);
    if (romcom.status === 'fulfilled') setRomComAnime(romcom.value);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    seasonalAnime,
    randomAnime,
    romComAnime,
    refetch: fetchAllData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
