import { useContext, useState } from "react";
import Filter from '../ExplorePage/Filter'
import { 
  Flame, Star, Compass, PlayCircle, Heart, Search, Users, BookOpen, 
  TrendingUp, Clock, Award, Globe, Zap, Calendar, Grid,
  ChevronRight, Play, Eye, MessageCircle, ThumbsUp, Share2
} from "lucide-react";
import Spotlight from "../ExplorePage/Spotlight";
import Trending from "../ExplorePage/Trending";
import SeasonalAnime from "../ExplorePage/SeasonalAnime";
import TrendingManga from "../ExplorePage/TrendingManga";
// import FunFacts from "../ExplorePage/FunFacts";
import FactsSlider from "../ExplorePage/FactsSlider";
import Community from "../Home/Community";
import TrendingKitsuAnime from "../ExplorePage/FilterComponents/TrendingKitsuAnime";
import Genres from '../utils/Geners';
import { DataContext } from "../context/AnimeContext";
// import ApiContext from "../context/ApiDataContext";





export default function ExplorePage() {
  const { kitsuTrendingAnime, loadingStates, errors, refetch } = useContext(DataContext);
  
  return (
    <div className=" min-h-screen text-white">
  <div className="space-x-6 bg-slate-900">

        {/* <Community /> */}
         <TrendingKitsuAnime 
           exFun={kitsuTrendingAnime}
           loading={loadingStates?.kitsuTrending}
           error={errors?.kitsuTrending}
           refetch={refetch}
         />
         <SeasonalAnime />
        {/* <SeasonalAnime /> */}
        <Filter />
        
        <TrendingManga />
      
        <Spotlight />
        <Trending />
        {/* <FactsSlider /> */}
 
    </div>
    </div>
  );
}