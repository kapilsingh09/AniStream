import { useContext } from "react";
import Filter from '../ExplorePage/Filter';
import SeasonalAnime from "../ExplorePage/SeasonalAnime";
import TrendingManga from "../ExplorePage/TrendingManga";
import Spotlight from "../ExplorePage/Spotlight";
import Trending from "../ExplorePage/Trending";
import TrendingKitsuAnime from "../ExplorePage/FilterComponents/TrendingKitsuAnime";
import { DataContext } from "../context/AnimeContext";
import { 
  fetchTrendingAnime, 
  fetchActionAnime, 
  fetchTopRatedAnime,
  fetchCurrentlyAiringAnime, 
  fetchAnimeMovies,
  fetchAnimeTVSeries,
  fetchHorrorAnime,
  fetchFinishedAnime,
  fetchUpcomingAnime
} from "../services/kitsuAnimeApi";
import AnimeGrid from "../Home/AnimeGrid";
import Genres from "../utils/Geners";
import filters from "../ExplorePage/Filter"
import WatchlistSection from "../Home/WatchlistSection"



export default function ExplorePage() {
  const { kitsuTrendingAnime, loadingStates, errors, refetch } = useContext(DataContext);

  return (
    <div className="min-h-screen text-white">
      <div className="space-x-6 bg-slate-900">

        {/* <Community /> */}

        {/* User's Watchlist (if logged in) */}
        <WatchlistSection 
          title="📚 Your Watchlist"
          showIfEmpty={false}
        />

        {/* Trending Anime - Main se  ction */}
        {/* <Filter /> */}
        {/* Top Rated Anime */}
        <TrendingKitsuAnime 
          fetchFunction={fetchTopRatedAnime}
          title="Top Rated Anime"
          limit={10}
          showViewAll={true}
          customClassName="border-yellow-500/30"
        />
{/* <Filter /> */}
        {/* Currently Airing Anime */}
     
        {/* Action Anime */}
     
        <SeasonalAnime />
        {/* <SeasonalAnime /> */}
        {/* <Filter /> */}
       
   <div className="flex gap-3">
          <div className="flex-1">
          <AnimeGrid
        fetchFn={fetchUpcomingAnime}
        queryKey={["Upcoming-movies"]}
        title="un-Romance Anime💖"
      />
          </div>
          <div className="w-[25%]  mr-7 mt-6 ">
          <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {/* <h1 className="text-4xl font-bold text-white">{title}</h1> */}
         
           <h1 className="text-white text-4xl font-bold">Genres<sub>-searches</sub></h1>
        </div>
        </div>
        
            <Genres />
          </div>
        </div>
        <TrendingManga />

        {/* <Spotlight /> */}
        {/* <Trending /> */}
        {/* <FactsSlider /> */}

      </div>
    </div>
  );
}