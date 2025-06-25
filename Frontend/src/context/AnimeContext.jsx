import React, { createContext, useContext, useEffect, useState } from 'react'
import { FetchTrendingAnime } from '../services/JikhanAnimeApi';
import axios from 'axios';

export const DataContext = createContext();

const AnimeContext = ({children}) => {
    const [TrendingAnime, setTrendingAnime] = useState([])

    useEffect(() => {
      (async()=>{
        try {
          setTrendingAnime(await FetchTrendingAnime());
        } catch (error) {
          console.error('Error fetching trending anime:', error);
          setTrendingAnime([]);
        }
      })()
    }, [])
    
  return (
    <DataContext.Provider value={{TrendingAnime}}>
        {children}
    </DataContext.Provider>
  )
}

export default AnimeContext
