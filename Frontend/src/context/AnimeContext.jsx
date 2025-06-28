import React, { createContext, useEffect, useState } from 'react';
import {
  FetchTrendingAnime,//done
  FetchTopRatedAnime,//done
  FetchPopularAnime,//done
  FetchUpcomingAnime,//done
  FetchTopAnime,//done
  FetchSeasonalAnime,//done
  FetchCurrentSeasonAnime,//done
  FetchTrendingRomanceComedyAnime,
} from '../services/JikhanAnimeApi';

import {
  fetchSeasonalAnime,//
  fetchTrendingAnime,//useing
  getRandomAnime,//imp 
  searchAnime,
  fetchRomanceAnime,//using
  fetchActionAnime,//working
  fetchHorrorAnime,//working
} from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  // ===== JIKAN STATES =====
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [currentSeasonAnime, setCurrentSeasonAnime] = useState([]);
  const [trendingRomanceComedyAnime, setTrendingRomanceComedyAnime] = useState([]);

  // ===== KITSU STATES =====
  const [kitsuSeasonalAnime, setKitsuSeasonalAnime] = useState([]);
  const [kitsuTrendingAnime, setKitsuTrendingAnime] = useState([]);
  const [kitsuRandomAnime, setKitsuRandomAnime] = useState([]);
  const [kitsuRomcomAnime, setKitsuRomcomAnime] = useState([]);
  const [kitsuCategories, setKitsuCategories] = useState([]);
  const [kitsuGenres, setKitsuGenres] = useState([]);
  const [kitsuTopManga, setKitsuTopManga] = useState([]);

  // ===== UI STATES =====
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});

  // ===== UNIVERSAL FETCHER =====
  const fetchWithErrorHandling = async (fetchFunc, setFunc, loadingKey, errorKey) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
      const data = await fetchFunc();
      setFunc(data);
    } catch (err) {
      console.error(`${errorKey} error:`, err);
      setErrors((prev) => ({ ...prev, [errorKey]: err.message }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // ===== JIKAN FETCH FUNCTIONS =====
  const fetchTrendingData = (limit = 18) => fetchWithErrorHandling(() => FetchTrendingAnime(limit), setTrendingAnime, 'trending', 'trendingError');
  const fetchTopRatedData = (limit = 18) => fetchWithErrorHandling(() => FetchTopRatedAnime(limit), setTopRatedAnime, 'topRated', 'topRatedError');
  const fetchPopularData = (limit = 18) => fetchWithErrorHandling(() => FetchPopularAnime(limit), setPopularAnime, 'popular', 'popularError');
  const fetchUpcomingData = (limit = 15) => fetchWithErrorHandling(() => FetchUpcomingAnime(limit), setUpcomingAnime, 'upcoming', 'upcomingError');
  const fetchSeasonalData = (year = 2024, season = 'spring', limit = 15) => fetchWithErrorHandling(() => FetchSeasonalAnime(year, season, limit), setSeasonalAnime, 'seasonal', 'seasonalError');
  const fetchCurrentSeasonData = (limit = 15) => fetchWithErrorHandling(() => FetchCurrentSeasonAnime(limit), setCurrentSeasonAnime, 'currentSeason', 'currentSeasonError');
  const fetchTrendingRomanceComedyData = (limit = 18) => fetchWithErrorHandling(() => FetchTrendingRomanceComedyAnime(limit), setTrendingRomanceComedyAnime, 'trendingRomanceComedy', 'trendingRomanceComedyError');

  // ===== KITSU FETCH FUNCTIONS =====
  const fetchKitsuSeasonalData = (season = 'summer', year = 2024, limit = 20) => fetchWithErrorHandling(() => fetchSeasonalAnime(season, year, limit), setKitsuSeasonalAnime, 'kitsuSeasonal', 'kitsuSeasonalError');
  const fetchKitsuTrendingData = (limit = 20) => fetchWithErrorHandling(() => fetchTrendingAnime(limit), setKitsuTrendingAnime, 'kitsuTrending', 'kitsuTrendingError');
  const fetchKitsuRandomData = () => fetchWithErrorHandling(getRandomAnime, setKitsuRandomAnime, 'kitsuRandom', 'kitsuRandomError');
  const searchKitsuAnime = (query, limit = 20) => fetchWithErrorHandling(() => searchAnime(query, limit), setKitsuTrendingAnime, 'search', 'searchError');
  
  // ===== ADDITIONAL KITSU FUNCTIONS =====
  const fetchRomanceData = (limit = 20) => fetchWithErrorHandling(() => fetchRomanceAnime(limit), setKitsuRomcomAnime, 'romance', 'romanceError');
  const fetchActionData = (limit = 20) => fetchWithErrorHandling(() => fetchActionAnime(limit), setKitsuTrendingAnime, 'action', 'actionError');
  const fetchHorrorData = (limit = 20) => fetchWithErrorHandling(() => fetchHorrorAnime(limit), setKitsuTrendingAnime, 'horror', 'horrorError');

  // ===== ALL DATA LOADER =====
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        fetchTrendingData(),
        fetchUpcomingData(),
        fetchTopRatedData(),
        FetchTopAnime(),
        fetchSeasonalData(),
        fetchCurrentSeasonData(),
        FetchTrendingRomanceComedyAnime(),
        // kisthuapi
        fetchKitsuTrendingData(),
        fetchRomanceData(),
        fetchKitsuRandomData(),
        fetchHorrorData(),
      ]);
    } catch (e) {
      console.error('Error in fetchAllData:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        // Jikan States
        trendingAnime,
        topRatedAnime,
        popularAnime,
        upcomingAnime,
        topAnime,
        seasonalAnime,
        currentSeasonAnime,
        trendingRomanceComedyAnime,

        // Kitsu States
        kitsuSeasonalAnime,
        kitsuTrendingAnime,
        kitsuRandomAnime,
        kitsuRomcomAnime,
        kitsuCategories,
        kitsuGenres,
        kitsuTopManga,

        // Loading & Errors
        isLoading,
        loadingStates,
        errors,

        // Jikan Functions
        fetchTrendingData,
        fetchTopRatedData,
        fetchPopularData,
        fetchUpcomingData,
        fetchSeasonalData,
        fetchCurrentSeasonData,
        fetchTrendingRomanceComedyData,

        // Kitsu Functions
        fetchKitsuSeasonalData,
        fetchKitsuTrendingData,
        fetchKitsuRandomData,
        searchKitsuAnime,
        fetchRomanceData,
        fetchActionData,
        fetchHorrorData,

        // Re-fetch all
        fetchAllData,
        refetch: fetchAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
