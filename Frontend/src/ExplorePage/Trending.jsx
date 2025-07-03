import React, { useEffect, useState } from 'react';
import { TrendingUp, Flame, Sparkles, Play, Heart, Share2, Star, Video, Calendar } from 'lucide-react';
import { FetchTopAnime } from '../services/JikhanAnimeApi';

const Trending = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchTopAnime(10);
        setTrendingAnime(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch trending anime:", error);
      }
    })();
  }, []);

  const getRankColor = (index) => {
    if (index === 0) return 'from-yellow-400 to-orange-500';
    if (index === 1) return 'from-gray-300 to-gray-500';
    if (index === 2) return 'from-orange-400 to-red-500';
    return 'from-purple-400 to-pink-500';
  };

  const getRankIcon = (index) => {
    if (index < 3) return <Flame className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 py-16 px-4 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Trending Now
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the most popular anime that's captivating audiences worldwide right now
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {trendingAnime.length === 0 ? (
            // Loading State
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="bg-gray-800/50 rounded-3xl p-6 animate-pulse">
                  <div className="w-full h-64 bg-gray-700 rounded-2xl mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {trendingAnime.map((anime, idx) => (
                <div
                  key={anime.mal_id || idx}
                  className="group relative"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Card Container */}
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-6 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2 border border-gray-700/50 relative overflow-hidden">
                    {/* Rank Badge */}
                    <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${getRankColor(idx)} text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg z-10 flex items-center gap-1`}>
                      {getRankIcon(idx)}
                      #{idx + 1}
                    </div>

                    {/* Image Container */}
                    <div className="relative mb-6 overflow-hidden rounded-2xl">
                      <img
                        src={anime.images?.jpg?.image_url || '/api/placeholder/200/280'}
                        alt={anime.title}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${hoveredIndex === idx ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                          <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                            <Play className="w-5 h-5 text-white" />
                          </button>
                          <div className="flex gap-2">
                            <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                              <Heart className="w-4 h-4 text-white" />
                            </button>
                            <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-xl text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
                        {anime.title}
                      </h3>
                      {/* Extra Info: Year, Type, Status */}
                      <div className="text-xs text-gray-400 mb-2 flex flex-wrap gap-2">
                        {anime.year && <span>Year: <span className="text-gray-200">{anime.year}</span></span>}
                        {anime.type && <span>Type: <span className="text-gray-200">{anime.type}</span></span>}
                        {anime.status && <span>Status: <span className="text-gray-200">{anime.status}</span></span>}
                      </div>
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-400">Score:</span>
                          <span className="text-white font-semibold">{anime.score ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="w-4 h-4 text-red-400" />
                          <span className="text-gray-400">Episodes:</span>
                          <span className="text-white font-semibold">{anime.episodes ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400">Year:</span>
                          <span className="text-white font-semibold">{anime.year ?? 'Unknown'}</span>
                        </div>
                      </div>
                      {/* Genres */}
                      {anime.genres && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {anime.genres.slice(0, 2).map((genre, genreIdx) => (
                            <span
                              key={genreIdx}
                              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs border border-purple-500/30"
                            >
                              {genre.name || genre}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Watch Button */}
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 mt-4">
                        Watch Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
            View All Trending Anime
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trending;