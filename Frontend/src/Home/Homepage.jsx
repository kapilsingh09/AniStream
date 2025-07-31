import React , {useRef} from 'react';
import AnimeSlider from './AnimeSlider';
import AnimeSection from './AnimeSection';
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
  fetchRomanceAnime,
  fetchActionAnime,
  fetchHorrorAnime,
} from '../services/kitsuAnimeApi';
import FactsSlider from '../ExplorePage/FactsSlider';
// import Vdplayer from '../videoJs/Vdplayer';
import AviAnime from '../utils/AviAnime';
import Player from '../player/Player';
import SorryCard from '../utils/SorryCard';

const Homepage = () => {
  return (
    <div className="min-h-screen   bg-slate-800  ">
      {/* Hero Slider */}
      <AnimeSlider />
    {/* <AviAnime /> */}
 {/* <SorryCard /> */}
    <AviAnime />
    {/* <Player /> */}
       {/* <div className="flex items-center justify-center ">
         <AnimeBanner />
      </div>  */}

      {/* <AnimeSection title="All-Time Top Rated" fetchFunction={FetchTopRatedAnime} /> */}
      {/* <SectionComponentKitsu title="Trending Now – Kitsu Picks" fetchFunction={fetchTrendingAnime} /> */}

      {/* <SectionComponentKitsu title="Romantic Drama" subtitle="Suggested by Anime-X" fetchFunction={fetchRomanceAnime} /> */}

       <div className="flex items-center justify-center">
        {/* <GhibliMovieBanner /> */}
      
      </div>  
      {/* <AviAnime /> */}
      {/* <SectionComponentKitsu title="Chilling Horror & Dark Themes" fetchFunction={fetchHorrorAnime} />

      <AnimeSection title="Current Season Highlights" fetchFunction={FetchCurrentSeasonAnime} />

      <AnimeSection title="Trending Romance & Comedy" fetchFunction={FetchTrendingRomanceComedyAnime} />

      <SectionComponentKitsu title="Action & Adventure Picks" fetchFunction={fetchActionAnime} /> */}

      {/* Optional: More banners */}
      {/* <div className="flex items-center justify-center">
        <AnimeBanner />
      </div>
      <footer>
        <FactsSlider />
      </footer> */}
    </div>
  );
};

export default Homepage;
