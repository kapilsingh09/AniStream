import { useState } from "react";
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




export default function ExplorePage() {

  

  return (
    <div className="bg-gradient-to-br from-black  to-black  min-h-screen text-white">
      <div className="p-8 space-y-12">
        {/* <Community /> */}
        <TrendingKitsuAnime />
        {/* <Filter /> */}
        {/* <Spotlight /> */}
        {/* <Trending /> */}
        {/* <SeasonalAnime /> */}
        {/* <TrendingManga /> */}
        {/* <FactsSlider />  */}

      </div>
    </div>
  );
}
