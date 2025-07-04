import React, { useEffect, useState } from 'react';
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
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  // const HoverButtons = () => (
  //   <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
  //     <button className="bg-white/10 p-2 rounded-full hover:bg-white/20">
  //       <Play className="w-4 h-4 text-white" />
  //     </button>
  //     <button className="bg-white/10 p-2 rounded-full hover:bg-white/20">
  //       <Heart className="w-4 h-4 text-white" />
  //     </button>
  //     <button className="bg-white/10 p-2 rounded-full hover:bg-white/20">
  //       <Share2 className="w-4 h-4 text-white" />
  //     </button>
  //   </div>
  // );

  return (
<div className="min-h-screen rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 py-12 px-4 md:px-8">
  {/* Header */}
  <div className="text-left mb-10">
    <div className="inline-flex items-center gap-3 mb-3">
      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
        <TrendingUp className="w-6 h-6 text-white" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-white">Trending Now</h1>
    </div>
    <p className="text-sm text-gray-400 max-w-xl">
      Discover the most popular anime captivating fans worldwide right now.
    </p>
  </div>

  {/* Anime Grid */}
  <div className="flex flex-wrap justify-center gap-6">
    {trendingAnime.length === 0
      ? [...Array(6)].map((_, idx) => (
          <div key={idx} className="bg-slate-800 rounded-xl p-4 w-[220px] h-[280px] animate-pulse">
            <div className="h-40 bg-slate-700 rounded mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        ))
      : trendingAnime.map((anime, idx) => (
          <div
            key={anime.mal_id || idx}
            className="bg-slate-800 hover:bg-slate-700 rounded-xl overflow-hidden shadow-md transition-all border border-white max-w-[240px] w-full relative"
          >
            {/* Rank Badge */}
            <div
              className={`absolute top-2 right-2 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getRankColor(
                idx
              )}`}
            >
              {getRankIcon(idx)} #{idx + 1}
            </div>

            {/* Anime Image */}
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={
                  anime.images?.webp?.large_image_url ||
                  anime.images?.jpg?.large_image_url ||
                  anime.images?.jpg?.image_url ||
                  '/fallback.jpg'
                }
                alt={anime.title || 'Anime Poster'}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Info */}
            <div className="p-3 space-y-1">
              <h3 className="text-sm font-semibold text-white line-clamp-2">{anime.title}</h3>

              <div className="text-[11px] text-gray-400 flex flex-wrap gap-1">
                {anime.year && <span>{anime.year}</span>}
                {anime.type && <span>{anime.type}</span>}
              </div>

              <div className="text-[11px] text-gray-300 space-y-0.5">
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
              {anime.genres && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {anime.genres.slice(0, 2).map((genre, i) => (
                    <span
                      key={i}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        genreColors[genre.name] ||
                        'bg-gray-600 text-gray-200 border-gray-400/30'
                      }`}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Watch Button */}
            <div className="px-3 pb-3">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-1.5 rounded-md transition-all">
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
