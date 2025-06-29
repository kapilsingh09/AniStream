import { useState } from "react";
import Filter from '../ExplorePage/Filter'
import { 
  Flame, Star, Compass, PlayCircle, Heart, Search, Users, BookOpen, 
  TrendingUp, Clock, Award, Globe, Zap, Calendar, Grid,
  ChevronRight, Play, Eye, MessageCircle, ThumbsUp, Share2
} from "lucide-react";
import Spotlight from "../ExplorePage/Spotlight";
import Trending from "../ExplorePage/Trending";

export default function ExplorePage() {
  const [search, setSearch] = useState("");


  const featuredAnime = [
    {
      title: "Demon Slayer: Hashira Training Arc",
      image: "/images/demonslayer.jpg",
      rating: 9.2,
      year: 2024,
      episodes: 12,
      status: "Ongoing"
    },
    {
      title: "My Hero Academia Season 7",
      image: "/images/mha7.jpg",
      rating: 8.8,
      year: 2024,
      episodes: 21,
      status: "Completed"
    },
    {
      title: "Solo Leveling",
      image: "/images/sololeveling.jpg",
      rating: 9.5,
      year: 2024,
      episodes: 12,
      status: "Ongoing"
    },
    {
      title: "Frieren: Beyond Journey's End",
      image: "/images/frieren.jpg",
      rating: 9.8,
      year: 2024,
      episodes: 28,
      status: "Completed"
    }
  ];

  const trendingAnime = [
    { title: "Chainsaw Man", views: "2.5M", image: "/images/chainsaw.jpg", change: "+15%" },
    { title: "Jujutsu Kaisen", views: "3.2M", image: "/images/jjk.jpg", change: "+22%" },
    { title: "Attack on Titan", views: "4.1M", image: "/images/aot.jpg", change: "+8%" },
    { title: "One Piece", views: "5.8M", image: "/images/onepiece.jpg", change: "+12%" },
    { title: "Naruto", views: "3.7M", image: "/images/naruto.jpg", change: "+5%" }
  ];

  const genres = [
    { name: "Action", count: 1247, color: "bg-red-600" },
    { name: "Romance", count: 892, color: "bg-pink-600" },
    { name: "Comedy", count: 1156, color: "bg-yellow-600" },
    { name: "Horror", count: 543, color: "bg-purple-600" },
    { name: "Isekai", count: 678, color: "bg-blue-600" },
    { name: "Slice of Life", count: 789, color: "bg-green-600" },
    { name: "Fantasy", count: 1023, color: "bg-indigo-600" },
    { name: "Sci-Fi", count: 667, color: "bg-cyan-600" }
  ];

  const seasons = ["Spring 2024", "Summer 2024", "Fall 2024", "Winter 2025"];
;

  const upcomingAnime = [
    { title: "Attack on Titan: Final Season", date: "2025-07-15", studio: "Wit Studio" },
    { title: "Demon Slayer: Infinity Castle", date: "2025-08-20", studio: "Ufotable" },
    { title: "Jujutsu Kaisen Season 3", date: "2025-09-10", studio: "MAPPA" }
  ];

  const topStudios = [
    { name: "Studio Ghibli", shows: 23, rating: 9.1 },
    { name: "MAPPA", shows: 45, rating: 8.9 },
    { name: "Ufotable", shows: 18, rating: 9.0 },
    { name: "Wit Studio", shows: 32, rating: 8.7 }
  ];

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
        {/* <Filter /> */}

        {/* Featured Spotlight */}
   {/* <Spotlight /> */}

        {/* Trending Now */}
        <Trending />
        {/* Genre Explorer */}
      

        {/* Seasonal Anime */}
      

        {/* Upcoming Releases */}
      

        {/* Top Studios */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Award className="text-yellow-400" /> Top Studios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topStudios.map((studio, idx) => (
              <div key={idx} className="bg-gray-900 rounded-3xl p-6 text-center hover:bg-gray-800 transition-colors">
                <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-xl">
                  {studio.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{studio.name}</h3>
                <p className="text-gray-400 mb-1">{studio.shows} shows</p>
                <p className="text-yellow-400 font-bold">★ {studio.rating}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Users className="text-pink-400" /> Community Hub
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Polls */}
            <div className="bg-gray-900 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="text-pink-400" />
                Weekly Poll
              </h3>
              <h4 className="text-xl font-semibold mb-4">Best Anime Opening of 2024?</h4>
              <div className="space-y-3">
                {["Demon Slayer OP", "Frieren OP", "Solo Leveling OP", "JJK OP"].map((option, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      <span className="text-pink-400 font-bold">{35 - idx * 8}%</span>
                    </div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2">
                      <div className={`bg-pink-500 h-2 rounded-full`} style={{width: `${35 - idx * 8}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-gray-900 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="text-yellow-400" />
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                      <span className="font-semibold">User{idx + 1}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">Amazing animation and story! Definitely recommend...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <BookOpen className="text-purple-400" /> Manga Corner
          </h2>
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {["Jujutsu Kaisen", "Chainsaw Man", "Attack on Titan", "One Piece", "Naruto", "Dragon Ball", "Death Note", "Demon Slayer"].map((title, idx) => (
                <div key={idx} className="text-center group cursor-pointer">
                  <img src={`/images/manga${idx + 1}.jpg`} alt={title} className="w-full h-32 object-cover rounded-2xl mb-3 group-hover:scale-105 transition-transform" />
                  <h3 className="font-bold text-sm">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
