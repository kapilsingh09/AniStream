import React from 'react';
import SectionComponentKitsu from './SectionComponentKitsu';
import AnimeSlider from './AnimeSlider'
import AnimeBanner from './AnimeBanner'
import AnimeSection from './AnimeSection'
import { FetchUpcomingAnime } from '../services/JikhanAnimeApi';
import {
  fetchTrendingAnime,
  fetchSeasonalAnime,
} from '../services/kitsuAnimeApi';
import SimpleAnimeBanner from './SimpleAnimeBanner';

const Homepage = () => {
  return (
    <div className="flex-1">
   <AnimeSlider />
     {/* Seasonal Anime from Kitsu  */}
   <SectionComponentKitsu 
        title="Trending Now!" 
        fetchFunction={fetchTrendingAnime} 
      />

  {/* Rom-Com Anime from Kitsu  */}
 <SectionComponentKitsu 
        title="Rom-Com Anime" 
        fetchFunction={fetchSeasonalAnime} 
      />  
       {/* <AnimeSection fetchFunction={FetchUpcomingAnime} title='Upcoming Anime' /> */}
<div className='flex items-center justify-center'>

      <AnimeBanner /> 
</div>
      <div className='flex items-center justify-center'>

      <SimpleAnimeBanner />
      </div>
      
    </div>
  );
};

export default Homepage;
