import React from 'react';
import SectionComponentKitsu from './SectionComponentKitsu';
import AnimeSlider from './AnimeSlider'
import AnimeBanner from './AnimeBanner'
import AnimeSection from './AnimeSection'
import {
   FetchUpcomingAnime,//
   FetchPopularAnime,
   FetchRomComAnime, //wasted
   FetchSeasonalAnime,
   FetchTrendingAnime,
   FetchCurrentSeasonAnime,//
   FetchComedyAnime,///wasted
   FetchMovieAnime,//wasted
   FetchFantasyAnime,///wasted
   FetchDramaAnime,//wasted
   FetchTopAnime,//alreday have
   FetchActionAnime,//wasted
   FetchHorrorAnime,//
   
  } from '../services/JikhanAnimeApi';
import {
  fetchTrendingAnime,
  fetchSeasonalAnime,
  // FetchHorrorAnime,
  fetchCategories,
  fetchRandomRomcomAnime,
} from '../services/kitsuAnimeApi';


import SimpleAnimeBanner from './SimpleAnimeBanner';

// Create a function that returns the seasonal anime data
const getSummerAnime = () => {
  return fetchSeasonalAnime('summer', 2025);
};

// For different seasons:
const getWinterAnime = () => fetchSeasonalAnime( 2024 ,'winter');
const getSpringAnime = () => fetchSeasonalAnime('spring', 2025);
const getFallAnime = () => fetchSeasonalAnime('fall', 2025);

const Homepage = () => {
  return (
    <div className="flex-1">
      {/* <AnimeSlider /> */}

{/* 
      <AnimeSection fetchFunction={FetchUpcomingAnime} title="Upcoming Anime 2025" />

      <SectionComponentKitsu  title="Trending Now!"  fetchFunction={fetchTrendingAnime} />

      <div className='flex items-center  justify-center'>
        <AnimeBanner /> 
      </div>
      
      <AnimeSection fetchFunction={FetchTrendingAnime} title="Trending  Anime" />
      
      <AnimeSection fetchFunction={FetchPopularAnime} title="Popular Anime" />
      
      <div className='flex items-center  justify-center'>
        <AnimeBanner /> 
      </div> */}
      {/* <SectionComponentKitsu  title="ROm com"  fetchFunction={fetchCategories} /> */}
      {/* <AnimeSection fetchFunction={FetchCurrentSeasonAnime} title="Current Season Anime" /> */}

      {/* <div className='flex items-center justify-center'>
        <SimpleAnimeBanner />
      </div> */}

<div className='mt-20'>

      <AnimeSection  title="Season Now!"  fetchFunction={FetchHorrorAnime  } />
</div>
      
    </div>
  );
};

export default Homepage;
