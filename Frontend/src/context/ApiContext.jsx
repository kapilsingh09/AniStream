import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { 
  fetchTrendingAnime, 
  fetchNewlyAddedAnime
} from '../services/anilistApi';

export const ApiDataContext = createContext();

const LOCAL_API_URL = "http://localhost:3000/api/available_data";

const ApiContext = ({ children }) => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [newlyAddedAnime, setNewlyAddedAnime] = useState([]);
  const [localAnimeData, setLocalAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch from local API using axios
        const localRes = await axios.get(LOCAL_API_URL);
        setLocalAnimeData(localRes.data);

        // Fetch from other APIs
        const [trending, newlyAdded] = await Promise.all([
          fetchTrendingAnime(12),
          fetchNewlyAddedAnime(10)
        ]);
        setFeaturedAnime(trending);
        setNewlyAddedAnime(newlyAdded);

        setError(null);
      } catch (err) {
        setError(err);
        setLocalAnimeData([]);
        setFeaturedAnime([]);
        setNewlyAddedAnime([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <ApiDataContext.Provider
      value={{ 
        featuredAnime,
        newlyAddedAnime,
        localAnimeData,
        loading,
        error
      }}
    >
      {children}
    </ApiDataContext.Provider>
  );
};

export default ApiContext;
