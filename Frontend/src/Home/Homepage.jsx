// Homepage.jsx
import React from 'react';
import HeroSlider from './AnimeSlider';
import AnimeSection from '../Home/AnimeSection';
import { 
  FetchTrendingAnime, 
  FetchSeasonalAnime, 
  FetchUpcomingAnime,
  FetchTopRatedAnime  // Added missing import
} from '../services/JikhanAnimeApi';

const Homepage = () => {
  // Wrapper fetch functions for seasonal anime
  const fetchWinter2025 = () => FetchSeasonalAnime(2025, 'winter');
  const fetchSpring2024 = () => FetchSeasonalAnime(2024, 'spring');
  const fetchSummer2024 = () => FetchSeasonalAnime(2024, 'summer');
  const fetchFall2024 = () => FetchSeasonalAnime(2024, 'fall');

  return (
    <div className='flex-1'>
      <HeroSlider />
{/*       
      <AnimeSection 
        title="Trending Now" 
        fetchFunction={FetchTrendingAnime}
        className=""
      /> */}

      {/* <AnimeSection 
        title="Top Rated Anime" 
        fetchFunction={FetchTopRatedAnime}
        className=""
      /> */}

      <AnimeSection 
        title="Upcoming Anime" 
        fetchFunction={FetchUpcomingAnime}
        className=""
      />
    </div>
  );
};

export default Homepage;