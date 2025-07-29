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
 

  return (
    <DataContext.Provider
      value={{
        // === Jikan State & Functions ===
      
        // === Kitsu State & Functions ===
 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
