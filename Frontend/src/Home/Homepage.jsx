import React , {useRef} from 'react';
import AnimeSlider from './AnimeSlider';
// import AnimeSection from './AnimeSection';
import AnimeBanner from './AnimeBanner';
import SectionComponentKitsu from './SectionComponentKitsu';
import GhibliMovieBanner from './GhibliBanner';
import AnimeGrid from '../Home/AnimeGrid';
import { 
  FetchUpcomingAnime,
  FetchTopRatedAnime,
  FetchTopAnime,
  FetchCurrentSeasonAnime,
  FetchSeasonalAnime,
  FetchTrendingRomanceComedyAnime
} from '../services/JikhanAnimeApi';

import { 
  fetchTrendingAnime,
  // fetchRomanceAnime,
  fetchActionAnime,
  fetchHorrorAnime,
  fetchDramaAnime,
  fetchFantasyAnime,
  fetchComedyAnime,
  fetchRomanceticAnime,
  fetchRomanceAnime,
  fetchRomanceComedyAnime,
} from '../services/kitsuAnimeApi';
import FactsSlider from '../ExplorePage/FactsSlider';
// import Vdplayer from '../videoJs/Vdplayer';
import JikhanAnimeComponent from './JikhanAnimeComponent';
import AviAnime from '../utils/AviAnime';
import Player from '../player/Player';
import SorryCard from '../utils/SorryCard';
import RecomendedAnime from '../components/RecomendedAnime';


const Homepage = () => {
  return (

    <div className="min-h-screen flex-1 shrink-1    ">


      <AnimeSlider />
       {/* <AviAnime /> */}

    
    {/* <JikhanAnimeComponent  title="Current Season Highlights" fetchFunction={FetchCurrentSeasonAnime} /> */}
    {/* <JikhanAnimeComponent  title="Trending Romance & Comedy" fetchFunction={fetchFantasyAnime} /> */}
     <JikhanAnimeComponent  title="Trending Now" fetchFunction={FetchTopRatedAnime} />

     {/* <RecomendedAnime />   */}
<AviAnime />

       <div className="flex items-center justify-center ">
         <AnimeBanner />
      </div> 


      <SectionComponentKitsu title="Trending Now – Kitsu Picks" fetchFunction={fetchRomanceComedyAnime} />

      {/* wholemf */}
      {/* <SectionComponentKitsu title="Romantic Drama" subtitle="Suggested by Anime-X" fetchFunction={fetchDramaAnime} /> */}

       {/* <div className="flex items-center justify-center"> */}
        <GhibliMovieBanner />
     
      <SectionComponentKitsu title="Peak Love: Top-Tier Romance Anime" fetchFunction={fetchRomanceticAnime} /> 


      <AnimeGrid />

         {/* <SectionComponentKitsu title="Action & Adventure Picks" fetchFunction={fetchActionAnime} /> */}

       {/* Optional: More banners */}
      <div className="flex items-center justify-center">
        <AnimeBanner />
      </div>
      <footer>
        <FactsSlider />
      </footer> 
    </div>
  );
};

export default Homepage;
