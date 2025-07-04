import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Flame,
  Sparkles,
  Star,
  Video,
} from 'lucide-react';
import { FetchTopAnime } from '../services/JikhanAnimeApi';

const genreColors = {
  Action: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  Adventure: 'bg-green-500/20 text-green-300 border-green-400/30',
  Comedy: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  Drama: 'bg-red-500/20 text-red-300 border-red-400/30',
  Fantasy: 'bg-pink-500/20 text-pink-300 border-pink-400/30',
  Horror: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
  Romance: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
  SciFi: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  Supernatural: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
};

const Trending = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchTopAnime(10);
        setTrendingAnime(data);
      } catch (error) {
        console.error('Failed to fetch trending anime:', error);
      }
    })();
  }, []);

  const getRankColor = (index) => {
    if (index === 0) return 'bg-yellow-500';
    if (index === 1) return 'bg-gray-400';
    if (index === 2) return 'bg-orange-500';
    return 'bg-purple-500';
  };

  const getRankIcon = (index) => {
    if (index < 3) return <Flame className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900/40 to-pink-900/40 py-12 px-4 md:px-8">
      {/* Header */}
      <div className="text-left mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <TrendingUp className="w-8 h-8 text-white" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Trending Now
          </h1>
        </div>
        <p className="text-lg text-gray-300 max-w-xl">
          Discover the most popular anime captivating fans worldwide right now.
        </p>
      </div>

      {/* Anime Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {trendingAnime.length === 0
          ? [...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-slate-800 rounded-2xl p-4 w-full h-[280px] animate-pulse"
              >
                <div className="h-40 bg-slate-700 rounded mb-3"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))
          : trendingAnime.map((anime, idx) => (
              <div
                key={anime.mal_id || idx}
                className="relative rounded-xl overflow-hidden w-full h-[400px] shadow-lg group"
              >
                {/* Full Image */}
                <img
                  src={
                    anime.images?.webp?.large_image_url ||
                    anime.images?.jpg?.large_image_url ||
                    anime.images?.jpg?.image_url ||
                    '/fallback.jpg'
                  }
                  alt={anime.title}
                  className="w-full h-full object-cover border-2 cursor-pointer border-gray-700 rounded-2xl bg-black"
                />
                 <div
                    className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${getRankColor(
                      idx
                    )} shadow-md`}
                  >
                    {getRankIcon(idx)} #{idx + 1}
                  </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 cursor-pointer bg-gradient-to-t from-purple-900/70 via-pink-800/30 to-transparent backdrop-blur-md text-white p-4 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out flex flex-col justify-end rounded-b-xl">
                  {/* Rank Badge */}
               

                  <h3 className="text-base font-bold line-clamp-2 drop-shadow-md">
                    {anime.title}
                  </h3>

                  <div className="text-xs text-gray-200 flex flex-wrap gap-2 mt-1">
                    {anime.year && <span>{anime.year}</span>}
                    {anime.type && <span>{anime.type}</span>}
                  </div>

                  <div className="flex items-center gap-4 mt-1 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{anime.score ?? 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-3 h-3 text-red-400" />
                      <span>{anime.episodes ?? 'N/A'} eps</span>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {anime.genres?.slice(0, 2).map((genre, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          genreColors[genre.name] ||
                          'bg-white/20 text-white border-white/30'
                        }`}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Watch Now */}
                  <button className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-1.5 rounded-md transition-all backdrop-blur-sm">
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
