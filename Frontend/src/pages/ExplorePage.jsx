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
  fetchHorrorAnime
} from "../services/kitsuAnimeApi";
import AnimeGrid from "../Home/AnimeGrid";

export default function ExplorePage() {
  const { kitsuTrendingAnime, loadingStates, errors, refetch } = useContext(DataContext);

  return (
    <div className="min-h-screen text-white">
      <div className="space-x-6 bg-slate-900">

        {/* <Community /> */}

        {/* Trending Anime - Main section */}
      

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
        <AnimeGrid
          queryKey={["currently-airing-anime"]}
          title="💖 Currently Airing Anime"
          fetchFn={fetchAnimeTVSeries}
        />

        <TrendingManga />

        {/* <Spotlight /> */}
        {/* <Trending /> */}
        {/* <FactsSlider /> */}

      </div>
    </div>
  );
}