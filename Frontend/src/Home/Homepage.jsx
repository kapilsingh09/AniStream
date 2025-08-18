import React from 'react';
import AnimeSlider from './AnimeSlider';
import AnimeBanner from './AnimeBanner';
import SectionComponentKitsu from './SectionComponentKitsu';
import GhibliMovieBanner from './GhibliBanner';
import AnimeGrid from '../Home/AnimeGrid';
import FactsSlider from '../ExplorePage/FactsSlider';
import FullAnimeBanner from './FullAnimeBanner';
// import GenreList from '../utils/Geners'; // Duplicate import, remove or comment out
import JikhanAnimeComponent from './JikhanAnimeComponent';
import AviAnime from '../utils/AviAnime';
import Player from '../player/Player';
import SorryCard from '../utils/SorryCard';
// import GenreList from '../utils/Geners'; // Duplicate import, remove or comment out
import RecomendedAnime from '../components/RecomendedAnime';

// Kitsu API imports
import {
  fetchTrendingAnime,
  fetchActionAnime,
  fetchHorrorAnime,
  fetchDramaAnime,
  fetchFantasyAnime,
  fetchComedyAnime,
  fetchRomanceticAnime,
  fetchRomanceAnime,
  fetchRomanceComedyAnime,
  fetchSeasonalAnime,
  fetchAllAnime,
  fetchNewArrivals,
  fetchRandomRomcomAnime,
  fetchCategories,
  fetchSportsAnime,
  fetchSliceOfLifeAnime,
  searchAnime,
  getRandomAnime,
  fetchAnimeByCategory,
} from '../services/kitsuAnimeApi';

// Jikhan API imports
import {
  FetchUpcomingAnime,
  FetchTopRatedAnime,
  FetchTopAnime,
  FetchCurrentSeasonAnime,
  FetchSeasonalAnime,
  FetchTrendingRomanceComedyAnime,
  FetchTrendingAnime,
  FetchRomanceAnime,
  fetchRomanceAnimeForAnimeGrid,
} from '../services/JikhanAnimeApi';

// Custom fetch for Adventure anime if not exported

// Fix: Genres component is used but not imported, so import it
import Genres from '../utils/Geners';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-black flex-3">
      {/* Hero Slider */}
      <AnimeSlider />
      <AviAnime />
      {/* Jikhan: Top Anime */}
      <JikhanAnimeComponent
        title="All-Time Top Anime"
        fetchFunction={FetchTopAnime}
        sectionName="all-time-top"
      />
      {/* Kitsu: Seasonal Highlights */}
      <SectionComponentKitsu
        title="🌸 Seasonal Highlights"
        fetchFunction={fetchSeasonalAnime}
      />
      <AnimeBanner />
      {/* Jikhan: Trending Now */}
      <JikhanAnimeComponent
        title="Trending Now"
        fetchFunction={FetchTopRatedAnime}
        sectionName="trending-now"
      />

      <SectionComponentKitsu
        title="Romantic Movies for Your Heart"
        fetchFunction={fetchRomanceticAnime}
      />
      {/* Kitsu: Adventure Anime
      <SectionComponentKitsu
        title="🌍 Adventure Picks"
        fetchFunction={fetchComedyAnime}
      /> */}

      {/* Jikhan: Romance Anime Grid */}
      <AnimeGrid
        fetchFn={fetchRomanceAnimeForAnimeGrid}
        queryKey={["romance-anime"]}
        title="💖 Romance Anime"
      />

      <FullAnimeBanner />
      {/* Kitsu: Romantic Movies */}

      {/* Kitsu: Comedy & Romance Mix */}
      {/* <SectionComponentKitsu
        title="💕 Romance & Comedy Mix"
        fetchFunction={fetchRomanceComedyAnime}
      /> */}

      {/* Kitsu: Action Anime */}
      {/* <SectionComponentKitsu
        title="⚔️ Action Anime"
        fetchFunction={fetchActionAnime}
      /> */}

      {/* Kitsu: Fantasy Worlds */}
      {/* <SectionComponentKitsu
        title="🧚‍♂️ Fantastical Worlds"
        fetchFunction={fetchFantasyAnime}
      /> */}

      {/* Kitsu: Horror Anime */}
      <SectionComponentKitsu
        title="👻 Horror Anime"
        fetchFunction={fetchHorrorAnime}
      />

      {/* Kitsu: Drama */}
      {/* <SectionComponentKitsu
        title="🎭 Dramatic Masterpieces"
        fetchFunction={fetchDramaAnime}
      /> */}

      {/* Kitsu: Comedy */}
      {/* <SectionComponentKitsu
        title="😂 Comedy Gold"
        fetchFunction={fetchComedyAnime}
      /> */}

      {/* Kitsu: Sports */}
      {/* <SectionComponentKitsu
        title="🏅 Sports Spirit"
        fetchFunction={fetchSportsAnime}
      /> */}

      {/* Kitsu: Slice of Life */}
      {/* <SectionComponentKitsu
        title="🍃 Slice of Life"
        fetchFunction={fetchSliceOfLifeAnime}
      /> */}

      {/* Ghibli Banner */}
      <div className="my-8">
        <GhibliMovieBanner />
      </div>

      <div>
        <div className="flex gap-6">
          <div className="flex-2">
            <AnimeGrid
              fetchFn={fetchComedyAnime}
              queryKey={["comedy-anime"]}
              title="Comedy Anime"
            />
          </div>
          <div className="w-[25%] flex ">
            <Genres />
          </div>
        </div>
        {/* Kitsu: New Arrivals */}
        {/* <SectionComponentKitsu
          title="🆕 New Arrivals"
          fetchFunction={fetchNewArrivals}
        /> */}

        {/* Kitsu: Random Romcom */}
        <SectionComponentKitsu
          title="🎲 Random Romcom"
          fetchFunction={fetchRandomRomcomAnime}
        />
        <FullAnimeBanner />

        {/* Jikhan: Popular Picks */}
        {/* <JikhanAnimeComponent
          title="⭐ Popular Picks"
          fetchFunction={FetchTrendingAnime}
          sectionName="popular-picks"
        /> */}

        {/* Jikhan: Upcoming Anime */}
        <JikhanAnimeComponent
          title=" Upcoming Anime (Peak Next Seasons)"
          fetchFunction={FetchUpcomingAnime}
          sectionName="upcoming-anime-peak"
        />

        {/* Jikhan: Romance & Comedy */}
        {/* <JikhanAnimeComponent
          title="💞 Romance & Comedy"
          fetchFunction={FetchTrendingRomanceComedyAnime}
          sectionName="romance-comedy"
        /> */}

        {/* Jikhan: Romance */}
        <JikhanAnimeComponent
          title="Pure Romance"
          fetchFunction={FetchRomanceAnime}
          sectionName="pure-romance"
        />

        {/* Full Anime Banner */}
        <div className="">
          <FullAnimeBanner />
        </div>

        {/* 
        <div className="">
          <RecomendedAnime />
        </div> 
        */}

        {/* Footer with Facts Slider */}
        <footer>
          <FactsSlider />
        </footer>
      </div>
    </div>
  );
};

export default Homepage;
