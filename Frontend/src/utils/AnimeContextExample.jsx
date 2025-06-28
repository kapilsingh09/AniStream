import React, { useContext, useEffect } from 'react';
import { DataContext } from '../context/AnimeContext';

/**
 * Example Component - How to use AnimeContext
 * 
 * This component demonstrates how to:
 * 1. Access anime data from the context
 * 2. Call fetch functions
 * 3. Handle loading and error states
 * 4. Use different API sources (Jikan vs Kitsu)
 * 
 * Copy this pattern for your own components!
 */
const AnimeContextExample = () => {
  const {
    // === STATES ===
    trendingAnime,
    upcomingAnime,
    horrorAnime,
    kitsuTrendingAnime,
    isLoading,
    loadingStates,
    errors,

    // === FUNCTIONS ===
    fetchTrendingData,
    fetchUpcomingData,
    fetchHorrorData,
    fetchKitsuTrendingData,
    fetchSeasonalData,
    searchKitsuAnime,
    fetchAllData,
  } = useContext(DataContext);

  // Example: Fetch specific data on component mount
  useEffect(() => {
    // Fetch trending anime from MyAnimeList (Jikan API)
    fetchTrendingData(10);
    
    // Fetch trending anime from Kitsu API
    fetchKitsuTrendingData(10);
    
    // Fetch summer 2024 seasonal anime
    fetchSeasonalData(2024, 'summer', 10);
  }, [fetchTrendingData, fetchKitsuTrendingData, fetchSeasonalData]);

  // Example: Handle search
  const handleSearch = (query) => {
    searchKitsuAnime(query, 10);
  };

  // Example: Refresh all data
  const handleRefresh = () => {
    fetchAllData();
  };

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">AnimeContext Usage Examples</h1>

      {/* Loading State Example */}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-600 rounded">
          Loading all data...
        </div>
      )}

      {/* Individual Loading States */}
      {loadingStates.trending && (
        <div className="mb-4 p-4 bg-yellow-600 rounded">
          Loading trending anime...
        </div>
      )}

      {/* Error Handling Example */}
      {errors.trendingError && (
        <div className="mb-4 p-4 bg-red-600 rounded">
          Error loading trending anime: {errors.trendingError}
        </div>
      )}

      {/* Data Display Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* MyAnimeList (Jikan) Data */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">MyAnimeList Trending ({trendingAnime.length})</h2>
          <div className="space-y-2">
            {trendingAnime.slice(0, 5).map((anime) => (
              <div key={anime.mal_id} className="bg-gray-700 p-2 rounded">
                <h3 className="font-medium">{anime.title}</h3>
                <p className="text-sm text-gray-300">Score: {anime.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Kitsu Data */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Kitsu Trending ({kitsuTrendingAnime.length})</h2>
          <div className="space-y-2">
            {kitsuTrendingAnime.slice(0, 5).map((anime) => (
              <div key={anime.id} className="bg-gray-700 p-2 rounded">
                <h3 className="font-medium">{anime.attributes?.canonicalTitle}</h3>
                <p className="text-sm text-gray-300">
                  Rating: {anime.attributes?.averageRating}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Horror Anime */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Horror Anime ({horrorAnime.length})</h2>
          <div className="space-y-2">
            {horrorAnime.slice(0, 5).map((anime) => (
              <div key={anime.mal_id} className="bg-gray-700 p-2 rounded">
                <h3 className="font-medium">{anime.title}</h3>
                <p className="text-sm text-gray-300">Score: {anime.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Anime */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Upcoming Anime ({upcomingAnime.length})</h2>
          <div className="space-y-2">
            {upcomingAnime.slice(0, 5).map((anime) => (
              <div key={anime.mal_id} className="bg-gray-700 p-2 rounded">
                <h3 className="font-medium">{anime.title}</h3>
                <p className="text-sm text-gray-300">Type: {anime.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-x-4">
        <button
          onClick={() => fetchTrendingData(5)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Fetch 5 Trending
        </button>
        
        <button
          onClick={() => fetchHorrorData(5)}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Fetch 5 Horror
        </button>
        
        <button
          onClick={() => handleSearch('naruto')}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Search "Naruto"
        </button>
        
        <button
          onClick={handleRefresh}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          Refresh All Data
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">How to Use This Context:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Wrap your app with AnimeContext provider</li>
          <li>Import DataContext and useContext hook</li>
          <li>Destructure the states and functions you need</li>
          <li>Call fetch functions in useEffect or event handlers</li>
          <li>Use loading and error states for better UX</li>
        </ol>
      </div>
    </div>
  );
};

export default AnimeContextExample; 