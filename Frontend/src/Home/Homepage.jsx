import React from 'react';
import HeroSlider from './AnimeSlider';
import AnimeSection from '../Home/AnimeSection';
import { 
  FetchTrendingAnime, 
  FetchSeasonalAnime, 
  FetchUpcomingAnime,
  FetchTopRatedAnime
} from '../services/JikhanAnimeApi';
import { FetchRomComAnime, } from '../services/kitsuAnimeApi';
import { getRomComAnime } from '../services/kitsuAnimeApi';
import AnimeBanner from './AnimeBanner';
import SorryCard from '../utils/SorryCard';

const Homepage = () => {
  // Wrapper functions for seasonal anime
  const fetchWinter2025 = () => FetchSeasonalAnime(2025, 'winter');
  const fetchSpring2024 = () => FetchSeasonalAnime(2024, 'spring');
  const fetchSummer2024 = () => FetchSeasonalAnime(2024, 'summer');
  const fetchFall2024 = () => FetchSeasonalAnime(2024, 'fall');

  return (
    <div className="flex-1">
   {/* <HeroSlider /> */}
      
      {/* <AnimeSection 
        title="Trending Now" 
        fetchFunction={FetchTrendingAnime}
        className=""
    /> */}
       <AnimeBanner />
       
    <AnimeSection 
        title="Rom-Com Anime" 
        fetchFunction={getRomComAnime}
        className=""
      /> 
      {/* <div className='flex items-center justify-center bg-zinc-900'>  */}

{/* {/* </div>
      <AnimeSection 
        title="Top Rated Anime" 
        fetchFunction={FetchTopRatedAnime}
        className=""
      />
      <div className='flex items-center justify-center bg-zinc-900'> 

      <AnimeBanner />
      </div>
      <AnimeSection 
        title="Upcoming Anime" 
        fetchFunction={FetchUpcomingAnime}
        className="" 
      />   *}
       */}

    </div> 
  );
};

export default Homepage;