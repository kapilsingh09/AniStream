import React, { useEffect, useContext } from 'react';
import { Flame, Star, Calendar, Film } from 'lucide-react';
import { ApiDataContext } from '../context/ApiContext';
import { NavLink } from 'react-router-dom';
const Spotlight = () => {
  const { featuredAnime, loading, error, fetchTrendingAnime } = useContext(ApiDataContext);

  // Retry on error
  useEffect(() => {
    let retryTimeout;
    if (error && fetchTrendingAnime) {
      retryTimeout = setTimeout(() => {
        fetchTrendingAnime();
      }, 2000);
    }
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [error, fetchTrendingAnime]);

  // Status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'from-green-400 to-emerald-500';
      case 'not_yet_released':
        return 'from-sky-300 to-blue-400';
      case 'finished':
        return 'from-fuchsia-400 to-violet-500';
      case 'cancelled':
        return 'from-red-400 to-rose-500';
      case 'hiatus':
        return 'from-yellow-300 to-amber-400';
      default:
        return 'from-slate-400 to-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'Airing Now';
      case 'not_yet_released':
        return 'Coming Soon';
      case 'finished':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'hiatus':
        return 'On Hiatus';
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
  };

  const genreColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-cyan-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-500',
  ];

  const getGenreColor = (genre, idx) => genreColors[idx % genreColors.length];

  return (
    <section className="space-y-6 px-6 min-h-screen  border-b-2 w-full border-gray-700  p-6 bg-slate-900 ">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white flex items-center pl-3">
          Spotlight
        </h2>
        <div className="flex justify-end px-6 mt-4">
        <NavLink className='flex items-center gap-2 cursor-pointer hover:underline text-white rounded-lg border border-gray-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg' to='/manga/all'>View More</NavLink>
          </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[16rem] bg-gray-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? null : (
        <div className="grid grid-cols-2 sm:grid-cols-3 pl-3  min-h-screen pr-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
          {featuredAnime.map((anime, index) => (
            <div
              key={anime.id}
              className="group relative border border-gray-700 hover:cursor-pointer  h-[47vh] backdrop-blur-md rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Spotlight Badge */}
              <div className="absolute top-2 left-2 z-20 bg-purple-600/90 text-white px-2 py-1 rounded-full text-[11px] font-semibold text-center flex items-center justify-center shadow-md">
                #Spotlight {index + 1}
              </div>

              {/* Rating Badge */}
              {anime.rating && anime.rating !== 'N/A' && (
                <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Star size={10} fill="white " />
                  {anime.rating}
                </div>
              )}

              {/* Image */}
              <div className="relative h-61 overflow-hidden">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300/1f2937/9ca3af?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
                <div
                  className={`absolute bottom-2 left-2 text-[9px] font-medium text-white px-1.5 py-0.5 rounded-md bg-gradient-to-r ${getStatusColor(
                    anime.status
                  )} shadow-sm`}
                >
                  {getStatusText(anime.status)}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <h3 className="text-white text-xs font-semibold line-clamp-1 group-hover:text-purple-300 transition leading-tight">
                  {anime.title}
                </h3>
                <div className="text-[10px] text-gray-400 italic truncate">{anime.studio}</div>
                <div className="flex justify-between text-[11px] items-center text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    {anime.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Film size={10} />
                    {anime.episodes} eps
                  </div>
                </div>

                {/* Genres */}
                {anime.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {anime.genres.slice(0, 1).map((genre, idx) => (
                      <span
                        key={idx}
                        className={`${getGenreColor(genre, idx)} text-white px-1.5 py-1 text-[10px] rounded-full`}
                      >
                        {genre}
                      </span>
                    ))}
                    {anime.genres.length > 1 && (
                      <span className="bg-gray-500 text-white px-1.5 py-1.5 text-center text-[8px] rounded-full">
                        +{anime.genres.length - 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
  
    </section>
  );
};

export default Spotlight;