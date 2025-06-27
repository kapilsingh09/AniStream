import React, { createContext, useEffect, useState } from 'react';
import {
  FetchTrendingAnime,
  FetchSeasonalAnime,
  FetchUpcomingAnime,
  FetchRomComAnime,
  // FetchSeasonalAnime
} from '../services/JikhanAnimeApi';
import {
  getRandomAnime,
} from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [randomAnime, setRandomAnime] = useState([]);
  const [romcomAnime, setRomcomAnime] = useState([]);

  const fetchAllData = async () => {
    const results = await Promise.allSettled([
      FetchTrendingAnime(),
      FetchUpcomingAnime(),
      FetchSeasonalAnime(),
      getRandomAnime(),
      FetchRomComAnime(),
    ]);

    const [trending, upcoming, seasonal, random, romcom] = results;

    if (trending.status === 'fulfilled') setTrendingAnime(trending.value);
    if (upcoming.status === 'fulfilled') setUpcomingAnime(upcoming.value);
    if (seasonal.status === 'fulfilled') setSeasonalAnime(seasonal.value);
    if (random.status === 'fulfilled') setRandomAnime(random.value);
    if (romcom.status === 'fulfilled') setRomcomAnime(romcom.value);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    seasonalAnime,
    randomAnime,
    romcomAnime,
    refetch: fetchAllData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
