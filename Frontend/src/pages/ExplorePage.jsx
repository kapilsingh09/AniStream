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
import CharacterSpotlight from "../ExplorePage/CharacterSpotlight";



export default function ExplorePage() {

  const seasons = ["Spring 2024", "Summer 2024", "Fall 2024", "Winter 2025"];
;


  return (
    <div className="bg-zinc-900  min-h-screen text-white">
      {/* Hero Section */}
      {/* <div className="relative h-96 bg-gradient-to-r from-purple-900/50 to-pink-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 p-8 h-full flex flex-col justify-center">
          <h1 className="text-6xl font-bold mb-4 flex items-center gap-4">
            <Compass className="text-pink-500" /> Explore Anime Universe
          </h1>
          <p className="text-xl text-gray-300 mb-8">Discover your next favorite anime from thousands of titles</p>
          <div className="relative w-1/2">
            <Search className="absolute left-4 top-4 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search anime, manga, characters..."
              className="w-full bg-gray-800/80 backdrop-blur-sm rounded-2xl pl-12 pr-6 py-4 text-white text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div> */}

      <div className="p-8 space-y-12">
        {/* Quick Filters */}
        <Filter />

        {/* Featured Spotlight */}
   {/* <Spotlight /> */}

        {/* Trending Now */}
        <Trending />
        {/* Genre Explorer */}
      
        {/* Seasonal Anime */}
        <SeasonalAnime />
      
        <CharacterSpotlight />
        {/* Upcoming Releases */}
      

        {/* Top Studios */}
     
        <TrendingManga />
        {/* Community Section */}
      
        {/* <Community /> */}
        {/* Watch Parties */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <PlayCircle className="text-green-400" /> Watch Parties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-3xl p-6 border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <PlayCircle className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Attack on Titan Marathon</h3>
                    <p className="text-sm text-gray-400">Starting in 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">24 participants</span>
                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    Join Party
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Manga Corner */}
        {/* <TrendingManga /> */}
      </div>
    </div>
  );
}
