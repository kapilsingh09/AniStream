import React from 'react';

// --- COMPONENT IMPORTS (for clarity, grouped by type) ---

// Hero & Banners
import AnimeSlider from './AnimeSlider'; // Main hero slider at top
import AnimeBanner from './AnimeBanner'; // Banner for featured anime
import FullAnimeBanner from './FullAnimeBanner'; // Large full-width anime banner
import GhibliMovieBanner from './GhibliBanner'; // Studio Ghibli special banner

// Section/Category Components
import SectionComponentKitsu from './SectionComponentKitsu'; // Generic section for Kitsu API
import JikhanAnimeComponent from './JikhanAnimeComponent'; // Section for Jikhan API

// Grids & Lists
import AnimeGrid from '../Home/AnimeGrid'; // Grid for anime lists
import Genres from '../utils/Geners'; // Genre search/filter

// Utility/Other
import AviAnime from '../utils/AviAnime'; // Avatar/animation utility
import FactsSlider from '../ExplorePage/FactsSlider'; // Fun facts slider for footer

// Unused/Optional (commented for clarity)
// import Player from '../player/Player';
// import SorryCard from '../utils/SorryCard';
// import RecomendedAnime from '../components/RecomendedAnime';
// import UpcomingReleases from '../ExplorePage/UpcomingReleases';

// --- API IMPORTS (for reference, not all are used directly here) ---
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
import TopAnimeBox from './TopAnimeBox';

// --- HOMEPAGE COMPONENT ORDER SUGGESTION ---
// 1. Hero/Slider (AnimeSlider)
// 2. Avatar/Animation (AviAnime)
// 3. Top Anime (JikhanAnimeComponent - All-Time Top Anime)
// 4. Seasonal Highlights (SectionComponentKitsu - Seasonal)
// 5. Featured Banner (AnimeBanner)
// 6. Trending Now (JikhanAnimeComponent - Trending Now)
// 7. Romantic Movies (SectionComponentKitsu - Romantic Movies)
// 8. Romance Anime Grid + Genres (AnimeGrid + Genres)
// 9. Full Anime Banner (FullAnimeBanner)
// 10. Horror Anime (SectionComponentKitsu - Horror)
// 11. Ghibli Banner (GhibliMovieBanner)
// 12. Comedy Anime Grid + Genres (AnimeGrid + Genres)
// 13. Random Romcom (SectionComponentKitsu - Random Romcom)
// 14. Full Anime Banner (FullAnimeBanner)
// 15. Upcoming Anime (JikhanAnimeComponent - Upcoming)
// 16. Pure Romance (JikhanAnimeComponent - Pure Romance)
// 17. Full Anime Banner (FullAnimeBanner)
// 18. Footer (FactsSlider)

const Homepage = () => {
  return (
    <div className="min-h-screen bg-black flex-3">
  
      {/* 1. Hero Slider */}
      <AnimeSlider />

      {/* 2. Avatar/Animation */}
      {/* <AviAnime /> */}

      {/* 3. All-Time Top Anime */}
      <JikhanAnimeComponent
        title="All-Time Top Anime"
        fetchFunction={FetchTopAnime}
        sectionName="all-time-top"
      />

      {/* 4. Seasonal Highlights alreday on the   next */}
      {/* <SectionComponentKitsu
        title="🌸 Seasonal Highlights"
        fetchFunction={fetchSeasonalAnime}
      /> */}

<section className='flex items-center justify-center m-2 '>
        <FullAnimeBanner />

</section>
{/* bg-zinc-950 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-1 w-full h-full min-h-screen p-6  text-white">
      <TopAnimeBox
        title="Spring 2024 Most Popular"
        url="https://kitsu.io/api/edge/anime?sort=-userCount&filter[season]=spring&filter[year]=2024&page[limit]=6"
      />

      <TopAnimeBox
        title="Trending Right Now "
        url="https://api.jikan.moe/v4/top/anime?sfw&limit=6"
        limit={6}
      />

      <TopAnimeBox
        title="Top Rated ONA"
        url="https://api.jikan.moe/v4/top/anime?type=ona&limit=6"
        limit={6}
      />

      <TopAnimeBox
        title="Upcoming Anime "
        url="https://api.jikan.moe/v4/seasons/upcoming?limit=6"
        limit={6}
      />
    </div>
    

      {/* 5. Featured Banner */}
      {/* <AnimeBanner /> */}

      {/* 6. Trending Now */}
      {/* <JikhanAnimeComponent
        title="Trending Now"
        fetchFunction={FetchTopRatedAnime}
        sectionName="trending-now"
      /> */}

      {/* 7. Romantic Movies */}
      {/* <SectionComponentKitsu
        title="Romantic Movies for Your Heart"
        fetchFunction={fetchRomanceticAnime}
      /> */}

      {/* 8. Romance Anime Grid + Genres */}
      <div className="flex gap-3">
        <div className="flex-1">
          <AnimeGrid
            fetchFn={fetchRomanceAnimeForAnimeGrid}
            queryKey={["romance-anime"]}
            title="Romance Anime"
          />
        </div>
        <div className="w-[25%] mr-7 mt-6">
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center justify-between mb-8 mt-10">
              <h1 className="text-white text-4xl font-bold hidden">
                Genres<sub>-searches</sub>
              </h1>
            </div>
          </div>
          <Genres />
        </div>
      </div>

      {/* 9. Full Anime Banner */}
      {/* <FullAnimeBanner /> */}

      {/* 10. Horror Anime */}
      {/* <SectionComponentKitsu
        title="👻 Horror Anime"
        fetchFunction={fetchHorrorAnime}
      /> */}

      {/* 11. Ghibli Banner */}
      {/* <div className="my-8">
        <GhibliMovieBanner />
      </div> */}

      {/* 12. Comedy Anime Grid + Genres */}
      {/* <div className="flex gap-3"> */}
        {/* <div className="flex-1">
          <AnimeGrid
            fetchFn={fetchComedyAnime}
            queryKey={["comedy-anime"]}
            title="Comedy Anime"
          />
        </div> */}
          {/* <div className="w-[25%] mr-7 mt-6">
            <div className="max-w-8xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-white text-4xl font-bold">
                  Genres<sub>-searches</sub>
                </h1>
              </div>
            </div>
            <Genres />
          </div> */}
      {/* </div> */}

      {/* 13. Random Romcom */}
      {/* <SectionComponentKitsu
        title="🎲 Random Romcom"
        fetchFunction={fetchRandomRomcomAnime}
      /> */}

      {/* 14. Full Anime Banner */}

      {/* 15. Upcoming Anime */}
      {/* <JikhanAnimeComponent
        title=" Upcoming Anime (Peak Next Seasons)"
        fetchFunction={FetchUpcomingAnime}
        sectionName="upcoming-anime-peak"
      /> */}

      {/* 16. Pure Romance */}
      {/* <JikhanAnimeComponent
        title="Pure Romance"
        fetchFunction={FetchRomanceAnime}
        sectionName="pure-romance"
      /> */}

      {/* 17. Full Anime Banner */}
      {/* <div> */}
        {/* <FullAnimeBanner /> */}
      {/* </div> */}    

      {/* 18. Footer with Facts Slider */}
      {/* <footer>
        <FactsSlider />
      </footer> */}
    </div>
  );
};

export default Homepage;
