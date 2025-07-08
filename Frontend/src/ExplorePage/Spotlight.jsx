import React, { useContext } from 'react';
import { Flame, Star, Calendar, Film } from 'lucide-react';
import { ApiDataContext } from '../context/ApiContext'; // ✅ Adjust path

const Spotlight = () => {
  const { featuredAnime, loading, error } = useContext(ApiDataContext);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'not_yet_released':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'finished':
        return 'bg-gradient-to-r from-purple-500 to-violet-500';
      default:
        return 'bg-gradient-to-r from-pink-500 to-rose-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'Ongoing';
      case 'not_yet_released':
        return 'Upcoming';
      case 'finished':
        return 'Completed';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <section className="space-y-6 px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white flex items-center gap-3">
          <Flame className="text-orange-500 animate-pulse" size={36} />
          Spotlight
        </h2>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[16rem] h-[24rem] bg-gray-800/50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="grid grid-flow-col auto-cols-[minmax(16rem,1fr)] gap-6">
            {featuredAnime.map((anime, index) => (
              <div
                key={anime.id}
                className="group relative min-w-[16rem] max-w-[18rem] bg-gray-900/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition"
              >
                <div className="absolute top-3 left-3 z-20 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Spotlight #{index + 1}
                </div>

                {anime.rating && anime.rating !== 'N/A' && (
                  <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    {anime.rating}
                  </div>
                )}

                <div className="relative h-64 overflow-hidden">
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/300x400/1f2937/9ca3af?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                  <div
                    className={`absolute bottom-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded-full shadow-lg ${getStatusColor(
                      anime.status
                    )}`}
                  >
                    {getStatusText(anime.status)}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-white text-sm font-bold line-clamp-2 group-hover:text-purple-400 transition">
                    {anime.title}
                  </h3>
                  <div className="text-xs text-gray-400 mb-1">
                    <span className="italic">{anime.studio}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{anime.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Film size={12} />
                      <span>{anime.episodes} eps</span>
                    </div>
                  </div>

                  {anime.genres?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {anime.genres.slice(0, 2).map((genre, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-2 py-1 text-xs rounded-md"
                        >
                          {genre}
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 text-xs rounded-md">
                          +{anime.genres.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Spotlight;
