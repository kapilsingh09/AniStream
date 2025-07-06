import { useState, useEffect } from "react";
import { Heart, Star, Calendar, Play, Users } from "lucide-react";
import Genres from '../utils/Genres';

const AnimeGrid = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRomanceAnime = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.jikan.moe/v4/anime?genres=22&order_by=score&sort=desc&limit=8`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch anime data');
      }

      const data = await response.json();
      setAnimeData(data.data || []);
    } catch (err) {
      console.error('Error fetching anime:', err);
      setError('Failed to load anime data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRomanceAnime();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-12 bg-white/10 rounded-lg w-64 animate-pulse"></div>
            <div className="h-6 bg-white/10 rounded w-24 animate-pulse"></div>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-6">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-white/10 rounded-xl overflow-hidden">
                      <div className="h-56 bg-white/20"></div>
                      <div className="p-3">
                        <div className="h-4 bg-white/20 rounded mb-2"></div>
                        <div className="h-3 bg-white/20 rounded w-3/4 mb-3"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-white/20 rounded w-16"></div>
                          <div className="h-3 bg-white/20 rounded w-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-80">
              <div className="bg-white/10 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="h-8 w-16 bg-white/20 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-white text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={fetchRomanceAnime}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h1 className="text-4xl font-bold text-white">Romance Anime</h1>
          </div>
          <h2 className="text-white text-2xl font-bold">Genres</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-6">
              {animeData.map((anime, i) => {
                const title = anime.title || anime.title_english || "Unknown Title";
                const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
                const score = anime.score ? anime.score.toFixed(1) : "N/A";
                const year = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null);
                const episodes = anime.episodes || "?";
                const status = anime.status || "Unknown";
                const members = anime.members || 0;

                return (
                  <div
                    key={anime.mal_id || i}
                    className="group relative cursor-pointer  bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <div className="relative  overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-65 object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x400/1f2937/6b7280?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {year && (
                        <div className="absolute top-2 left-2 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                          {year}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {score}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className=" rounded-full p-3 border-4 border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-white font-medium text-xs mb-1 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors duration-300">
                        {title}
                      </h3>

                      <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          <span>{episodes} eps</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{members > 1000 ? `${Math.round(members / 1000)}k` : members}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          status === 'Finished Airing' 
                            ? 'bg-green-500/20 text-green-400' 
                            : status === 'Currently Airing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {status}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-white/70">
                          <Calendar className="w-3 h-3" />
                          <span>{year || 'TBA'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-80">
            <Genres />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeGrid;
