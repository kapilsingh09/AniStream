import React, { createContext, useEffect, useState } from 'react';

// ===== JIKAN API IMPORTS =====
import {
  FetchTrendingAnime,
  FetchTopRatedAnime,
  FetchPopularAnime,
  FetchUpcomingAnime,
  FetchTopAnime,
  FetchSeasonalAnime,
  FetchCurrentSeasonAnime,
  FetchTrendingRomanceComedyAnime,
  FetchRomcomAnime
} from '../services/JikhanAnimeApi';

// ===== KITSU API IMPORTS =====
import {
  fetchSeasonalAnime,
  fetchTrendingAnime,
  getRandomAnime,
  searchAnime,
  fetchRomanceAnime,
  fetchActionAnime,
  fetchHorrorAnime,
  fetchAllAnime
} from '../services/kitsuAnimeApi';

export const DataContext = createContext();

const AnimeContext = ({ children }) => {
  // ===== STATE: Jikan Anime =====
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [topRatedAnime, setTopRatedAnime] = useState([]);
  const [popularAnime, setPopularAnime] = useState([]);
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [currentSeasonAnime, setCurrentSeasonAnime] = useState([]);
  const [trendingRomanceComedyAnime, setTrendingRomanceComedyAnime] = useState([]);
  const [romcom, setRomcom] = useState([]);

  // ===== STATE: Kitsu Anime =====
  const [allAnime, setAllanime] = useState([]);
  const [kitsuSeasonalAnime, setKitsuSeasonalAnime] = useState([]);
  const [kitsuTrendingAnime, setKitsuTrendingAnime] = useState([]);
  const [kitsuRandomAnime, setKitsuRandomAnime] = useState([]);
  const [kitsuRomcomAnime, setKitsuRomcomAnime] = useState([]);

  // ===== STATE: Ghibli API =====
  const [ghibliFilms, setGhibliFilms] = useState([]);
  const [ghibliLoading, setGhibliLoading] = useState(false);
  const [ghibliError, setGhibliError] = useState(null);

  // ===== STATE: UI/Errors =====
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});

  // ===== HELPER: Universal Error Handler =====
  const fetchWithErrorHandling = async (fetchFunc, setFunc, loadingKey, errorKey) => {
    try {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
      setErrors(prev => ({ ...prev, [errorKey]: null }));
      const data = await fetchFunc();
      setFunc(data);
    } catch (err) {
      // console.error(`${errorKey} error:`, err);
      // setErrors(prev => ({ ...prev, [errorKey]: err.message }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // ===== JIKAN FETCH FUNCTIONS =====
  const fetchTrendingData = (limit = 18) =>
    fetchWithErrorHandling(() => FetchTrendingAnime(limit), setTrendingAnime, 'trending', 'trendingError');

  const fetchTopRatedData = (limit = 18) =>
    fetchWithErrorHandling(() => FetchTopRatedAnime(limit), setTopRatedAnime, 'topRated', 'topRatedError');

  const fetchPopularData = (limit = 18) =>
    fetchWithErrorHandling(() => FetchPopularAnime(limit), setPopularAnime, 'popular', 'popularError');

  const fetchUpcomingData = (limit = 15) =>
    fetchWithErrorHandling(() => FetchUpcomingAnime(limit), setUpcomingAnime, 'upcoming', 'upcomingError');

  const fetchSeasonalData = (year = 2024, season = 'spring', limit = 15) =>
    fetchWithErrorHandling(() => FetchSeasonalAnime(year, season, limit), setSeasonalAnime, 'seasonal', 'seasonalError');

  const fetchCurrentSeasonData = (limit = 15) =>
    fetchWithErrorHandling(() => FetchCurrentSeasonAnime(limit), setCurrentSeasonAnime, 'currentSeason', 'currentSeasonError');

  const fetchTrendingRomanceComedyData = (limit = 18) =>
    fetchWithErrorHandling(() => FetchTrendingRomanceComedyAnime(limit), setTrendingRomanceComedyAnime, 'trendingRomanceComedy', 'trendingRomanceComedyError');

  const fetchTopAnimeData = (limit = 18) =>
    fetchWithErrorHandling(() => FetchTopAnime(limit), setTopAnime, 'topAnime', 'topAnimeError');

  // ===== KITSU FETCH FUNCTIONS =====
  const fetchKitsuSeasonalData = (season = 'summer', year = 2024, limit = 20) =>
    fetchWithErrorHandling(() => fetchSeasonalAnime(season, year, limit), setKitsuSeasonalAnime, 'kitsuSeasonal', 'kitsuSeasonalError');

  const fetchKitsuTrendingData = (limit = 20) =>
    fetchWithErrorHandling(() => fetchTrendingAnime(limit), setKitsuTrendingAnime, 'kitsuTrending', 'kitsuTrendingError');

  const fetchKitsuRandomData = () =>
    fetchWithErrorHandling(getRandomAnime, setKitsuRandomAnime, 'kitsuRandom', 'kitsuRandomError');

  const searchKitsuAnime = (query, limit = 20) =>
    fetchWithErrorHandling(() => searchAnime(query, limit), setKitsuTrendingAnime, 'search', 'searchError');

  const fetchRomanceData = (limit = 20) =>
    fetchWithErrorHandling(() => fetchRomanceAnime(limit), setKitsuRomcomAnime, 'romance', 'romanceError');

  const fetchActionData = (limit = 20) =>
    fetchWithErrorHandling(() => fetchActionAnime(limit), setKitsuTrendingAnime, 'action', 'actionError');

  const fetchHorrorData = (limit = 20) =>
    fetchWithErrorHandling(() => fetchHorrorAnime(limit), setKitsuTrendingAnime, 'horror', 'horrorError');

  // ===== GHIBLI FETCH FUNCTION =====


  // ===== FETCH EVERYTHING ON STARTUP =====
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        // Jikan
        fetchTrendingData(),
        fetchUpcomingData(),
        fetchTopRatedData(),
        fetchTopAnimeData(),
        fetchSeasonalData(),
        fetchCurrentSeasonData(),
        fetchTrendingRomanceComedyData(),
        FetchRomcomAnime(),

        // Kitsu
        fetchKitsuTrendingData(),
        fetchRomanceData(),
        fetchKitsuRandomData(),
        fetchHorrorData(),
        fetchAllAnime(),

        // Ghibli
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
        // === Jikan State & Functions ===
        trendingAnime,
        topRatedAnime,
        popularAnime,
        upcomingAnime,
        topAnime,
        seasonalAnime,
        currentSeasonAnime,
        trendingRomanceComedyAnime,
        romcom,
        fetchTrendingData,
        fetchTopRatedData,
        fetchPopularData,
        fetchUpcomingData,
        fetchSeasonalData,
        fetchCurrentSeasonData,
        fetchTrendingRomanceComedyData,
        fetchTopAnimeData,
        setRomcom,

        // === Kitsu State & Functions ===
        allAnime,
        kitsuSeasonalAnime,
        kitsuTrendingAnime,
        kitsuRandomAnime,
        kitsuRomcomAnime,
        fetchKitsuSeasonalData,
        fetchKitsuTrendingData,
        fetchKitsuRandomData,
        searchKitsuAnime,
        fetchRomanceData,
        fetchActionData,
        fetchHorrorData,

        // === Ghibli ===
        ghibliFilms,
        ghibliLoading,
        ghibliError,

        // === Utility ===
        isLoading,
        loadingStates,
        errors,
        fetchAllData,
        refetch: fetchAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
