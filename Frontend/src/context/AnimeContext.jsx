import React, { createContext, useEffect, useState } from 'react';
import {
  // FetchTrendingAnime,
  FetchUpcomingAnime,
  FetchRomComAnime,
  // FetchSeasonalAnime
} from '../services/JikhanAnimeApi';
import {
  fetchSeasonalAnime,
  getRandomAnime,
  fetchTrendingAnime
  // FetchSeasonalAnime,
} from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  const [seasonal,setSeasonalAnime] = useState([]);
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [randomAnime, setRandomAnime] = useState([]);
  const [romcomAnime, setRomcomAnime] = useState([]);


  const fetchAllData = async () => {
    const results = await Promise.allSettled([
      fetchSeasonalAnime(),
      fetchTrendingAnime(),
      FetchUpcomingAnime(),
      getRandomAnime(),
    ]);

    const [seasonal, trending, upcoming, random] = results;

    if (trending.status === 'fulfilled') setTrendingAnime(trending.value);
    if (upcoming.status === 'fulfilled') setUpcomingAnime(upcoming.value);
    if (random.status === 'fulfilled') setRandomAnime(random.value);
    // if (romcom.status === 'fulfilled') setRomcomAnime(romcom.value);
    if (seasonal.status === 'fulfilled') setSeasonalAnime(seasonal.value);
  };

  useEffect(() => {
    Promise.allSettled(fetchAllData());
  }, []);

  const contextValue = {
    trendingAnime,
    upcomingAnime,
    randomAnime,
    seasonal,
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
