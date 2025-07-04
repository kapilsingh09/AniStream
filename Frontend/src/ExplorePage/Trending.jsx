import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Flame,
  Sparkles,
  Play,
  Heart,
  Share2,
  Star,
  Video,
  Calendar,
} from "lucide-react";
import { FetchTopAnime } from "../services/JikhanAnimeApi";

const genreColors = {
  Action: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  Adventure: "bg-green-500/20 text-green-300 border-green-400/30",
  Comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
  Drama: "bg-red-500/20 text-red-300 border-red-400/30",
  Fantasy: "bg-pink-500/20 text-pink-300 border-pink-400/30",
  Horror: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
  Romance: "bg-rose-500/20 text-rose-300 border-rose-400/30",
  SciFi: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
  Supernatural: "bg-purple-500/20 text-purple-300 border-purple-400/30",
};

const getRankColor = (index) => {
  if (index === 0) return "bg-yellow-500";
  if (index === 1) return "bg-gray-400";
  if (index === 2) return "bg-orange-500";
  return "bg-purple-500";
};

const getRankIcon = (index) => {
  return index < 3 ? <Flame className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />;
};

const HoverButtons = () => (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
    <button
      className="bg-white/10 p-2 rounded-full hover:bg-white/20"
      aria-label="Play"
    >
      <Play className="w-4 h-4 text-white" />
    </button>
    <button
      className="bg-white/10 p-2 rounded-full hover:bg-white/20"
      aria-label="Like"
    >
      <Heart className="w-4 h-4 text-white" />
    </button>
    <button
      className="bg-white/10 p-2 rounded-full hover:bg-white/20"
      aria-label="Share"
    >
      <Share2 className="w-4 h-4 text-white" />
    </button>
  </div>
);

const Trending = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchTopAnime(10);
        setTrendingAnime(data);
      } catch (error) {
        console.error("Failed to fetch trending anime:", error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 py-12 px-4 md:px-12">
      {/* Header */}
      <div className="text-left mb-10">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white">Trending Now</h1>
        </div>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover the most popular anime captivating fans worldwide right now.
        </p>
      </div>

      {/* Anime Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {trendingAnime.length === 0
          ? [...Array(5)].map((_, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl p-4 animate-pulse">
                <div className="h-60 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))
          : trendingAnime.map((anime, idx) => (
              <div
                key={anime.mal_id || idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="bg-slate-800 hover:bg-slate-700 rounded-xl overflow-hidden shadow-md transition-all relative"
              >
                {/* Rank Badge */}
                <div
                  className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getRankColor(idx)}`}
                >
                  {getRankIcon(idx)} #{idx + 1}
                </div>

                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={anime.images?.jpg?.image_url || "/fallback.jpg"}
                    alt={anime.title || "Anime Poster"}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                  {hoveredIndex === idx && <HoverButtons />}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold text-white line-clamp-2">
                    {anime.title || "Untitled"}
                  </h3>
                  <div className="text-xs text-gray-400 space-x-2">
                    {anime.year && <span>{anime.year}</span>}
                    {anime.type && <span>{anime.type}</span>}
                    {anime.status && <span>{anime.status}</span>}
                  </div>

                  <div className="text-xs text-gray-300 space-y-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>Score:</span>
                      <span className="text-white">{anime.score ?? "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-3 h-3 text-red-400" />
                      <span>Episodes:</span>
                      <span className="text-white">{anime.episodes ?? "?"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      <span>Year:</span>
                      <span className="text-white">{anime.year ?? "Unknown"}</span>
                    </div>
                  </div>

                  {/* Genres */}
                  {anime.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-xs mt-2">
                      {anime.genres.slice(0, 2).map((genre, genreIdx) => (
                        <span
                          key={genreIdx}
                          className={`px-2 py-0.5 rounded-full font-medium border ${
                            genreColors[genre.name] ||
                            "bg-gray-600 text-gray-200 border-gray-400/30"
                          }`}
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Watch Button */}
                <div className="px-4 pb-4">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-all">
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Trending;
