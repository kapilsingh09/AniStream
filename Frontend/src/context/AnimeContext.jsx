import React, { createContext, useEffect, useState } from 'react';
import {
  FetchTrendingAnime,//done
  FetchTopRatedAnime,//done
  FetchPopularAnime,//done
  FetchUpcomingAnime,//done
  FetchTopAnime,//
  FetchSeasonalAnime,//
  FetchCurrentSeasonAnime,//done
  FetchRomComAnime,//wasted
  FetchActionAnime,//wasted
  FetchShounenAnime,
  FetchSliceOfLifeAnime,
  FetchHorrorAnime,//
  FetchDramaAnime,
  FetchFantasyAnime,
  FetchComedyAnime,
  FetchThrillerAnime,
  FetchSportsAnime,
  FetchSchoolAnime,
  FetchIsekaiAnime,
  FetchMovieAnime,
  FetchOVAAnime,
  FetchRandomAnime,
  FetchTopCharacters,
  FetchGenres
} from '../services/JikhanAnimeApi';

import {
  fetchSeasonalAnime,//wasted
  fetchTrendingAnime,
  searchAnime,
  fetchAnimeDetails,
  fetchAnimeEpisodes,
  fetchCategories,
  fetchAnimeByCategory,
  fetchAnimeReviews,
  fetchAnimeCharacters,
  fetchRelatedAnime,
  fetchAnimeStaff,
  fetchTopManga,
  searchManga,
  fetchMangaDetails,
  fetchAnimeGenres,
  fetchStreamingLinks,
  fetchRandomRomcomAnime,
  getRandomAnime
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
  const [romcomAnime, setRomcomAnime] = useState([]);
  const [actionAnime, setActionAnime] = useState([]);
  const [shounenAnime, setShounenAnime] = useState([]);
  const [sliceOfLifeAnime, setSliceOfLifeAnime] = useState([]);
  const [horrorAnime, setHorrorAnime] = useState([]);
  const [dramaAnime, setDramaAnime] = useState([]);
  const [fantasyAnime, setFantasyAnime] = useState([]);
  const [comedyAnime, setComedyAnime] = useState([]);
  const [thrillerAnime, setThrillerAnime] = useState([]);
  const [sportsAnime, setSportsAnime] = useState([]);
  const [schoolAnime, setSchoolAnime] = useState([]);
  const [isekaiAnime, setIsekaiAnime] = useState([]);
  const [movieAnime, setMovieAnime] = useState([]);
  const [ovaAnime, setOvaAnime] = useState([]);
  const [randomAnime, setRandomAnime] = useState([]);
  const [topCharacters, setTopCharacters] = useState([]);
  const [genres, setGenres] = useState([]);

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
  const fetchRomcomData = (limit = 18) => fetchWithErrorHandling(() => FetchRomComAnime(limit), setRomcomAnime, 'romcom', 'romcomError');
  const fetchActionData = (limit = 18) => fetchWithErrorHandling(() => FetchActionAnime(limit), setActionAnime, 'action', 'actionError');
  const fetchHorrorData = (limit = 18) => fetchWithErrorHandling(() => FetchHorrorAnime(limit), setHorrorAnime, 'horror', 'horrorError');
  const fetchRandomData = () => fetchWithErrorHandling(FetchRandomAnime, setRandomAnime, 'random', 'randomError');

  // ===== KITSU FETCH FUNCTIONS =====
  const fetchKitsuSeasonalData = (season = 'summer', year = 2024, limit = 20) => fetchWithErrorHandling(() => fetchSeasonalAnime(season, year, limit), setKitsuSeasonalAnime, 'kitsuSeasonal', 'kitsuSeasonalError');
  const fetchKitsuTrendingData = (limit = 20) => fetchWithErrorHandling(() => fetchTrendingAnime(limit), setKitsuTrendingAnime, 'kitsuTrending', 'kitsuTrendingError');
  const fetchKitsuRandomData = () => fetchWithErrorHandling(getRandomAnime, setKitsuRandomAnime, 'kitsuRandom', 'kitsuRandomError');
  const searchKitsuAnime = (query, limit = 20) => fetchWithErrorHandling(() => searchAnime(query, limit), setKitsuTrendingAnime, 'search', 'searchError');

  // ===== ALL DATA LOADER =====
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.allSettled([
        // fetchSeasonalAnime(), /wasted
        //jikhan api...
        // FetchTopAnime(),//wasted
        // FetchDramaAnime(),//wasted
        FetchHorrorAnime(),
        fetchTrendingData(),
        fetchUpcomingData(),
        fetchRandomData(),
        fetchHorrorData(),
        // kisthuapi
        fetchKitsuTrendingData(),
        fetchKitsuRandomData(),
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
        romcomAnime,
        actionAnime,
        shounenAnime,
        sliceOfLifeAnime,
        horrorAnime,
        dramaAnime,
        fantasyAnime,
        comedyAnime,
        thrillerAnime,
        sportsAnime,
        schoolAnime,
        isekaiAnime,
        movieAnime,
        ovaAnime,
        randomAnime,
        topCharacters,
        genres,

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
        fetchRomcomData,
        fetchActionData,
        fetchHorrorData,
        fetchRandomData,

        // Kitsu Functions
        fetchKitsuSeasonalData,
        fetchKitsuTrendingData,
        fetchKitsuRandomData,
        searchKitsuAnime,

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
