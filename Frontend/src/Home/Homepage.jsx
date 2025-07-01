import React from 'react';
import AnimeSlider from './AnimeSlider';
import AnimeSection from './AnimeSection';
import AnimeBanner from './AnimeBanner';
import SectionComponentKitsu from './SectionComponentKitsu';
import GhibliMovieBanner from './GhibliBanner';

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

const Homepage = () => {
  return (
    <div className="min-h-screen mt-15 bg-zinc-900">
      {/* Hero Slider */}
      <AnimeSlider />

      {/* Sections with meaningful titles */}
      <AnimeSection title="Top Anime of 2025" fetchFunction={FetchTopAnime} />
      
      <AnimeSection title="Upcoming Releases – 2025" fetchFunction={FetchUpcomingAnime} />

      <SectionComponentKitsu title="Trending Now – Kitsu Picks" fetchFunction={fetchTrendingAnime} />

      <div className="flex items-center justify-center">
        <AnimeBanner />
      </div>

      <AnimeSection title="All-Time Top Rated" fetchFunction={FetchTopRatedAnime} />

      <SectionComponentKitsu title="Romantic Drama" subtitle="Suggested by Anime-X" fetchFunction={fetchRomanceAnime} />

      <div className="flex items-center justify-center">
        <GhibliMovieBanner />
      </div>

      <SectionComponentKitsu title="Chilling Horror & Dark Themes" fetchFunction={fetchHorrorAnime} />

      <AnimeSection title="Current Season Highlights" fetchFunction={FetchCurrentSeasonAnime} />

      <AnimeSection title="Trending Romance & Comedy" fetchFunction={FetchTrendingRomanceComedyAnime} />

      <SectionComponentKitsu title="Action & Adventure Picks" fetchFunction={fetchActionAnime} />

      {/* Optional: More banners */}
      <div className="flex items-center justify-center">
        <AnimeBanner />
      </div>
    </div>
  );
};

export default Homepage;
