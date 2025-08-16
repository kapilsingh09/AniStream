import { MonitorPlay, RefreshCcw } from 'lucide-react';
import React, { useContext, useState } from 'react';
import {
  ChevronLeft, ChevronRight, Star, Calendar, Heart, Eye
} from 'lucide-react';
import { ApiDataContext } from '../context/ApiContext';
const TrendingAnime = () => {
  const { newlyAddedAnime, loading, error } = useContext(ApiDataContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  
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

  const slidesToShow = Math.ceil((newlyAddedAnime?.length || 0) / 5) || 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToShow);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToShow) % slidesToShow);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="w-full  p-6  bg-slate-900 border-2 border-slate-800 ">
      <div className="flex items-center justify-between ml-4">
        <h2 className="text-4xl font-bold flex items-center gap-3 text-white ml-2">
        OVAReleases
        </h2>
        <button className="flex items-center gap-2 cursor-pointer hover:underline text-white rounded-lg border border-gray-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg">
          View All
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="bg-gray-800 rounded-2xl animate-pulse overflow-hidden">
                <div className="h-[280px] bg-gray-700 w-full"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-3 w-10 bg-gray-600 rounded"></div>
                    <div className="h-3 w-10 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 bg-slate-800/50 rounded-xl border border-slate-700/30 m-6">
            {/* <p className="text-lg font-semibold">{error}</p> */}
            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300">
              Try Again
            </button>
          </div>
        ) : (newlyAddedAnime && newlyAddedAnime.length === 0) ? (
          <div className="text-center py-10">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg inline-block" role="alert">
              <span className="font-bold">Alert:</span> No anime found.
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-all duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: slidesToShow }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
                      {newlyAddedAnime.slice(slideIndex * 5, (slideIndex + 1) * 5).map((anime) => (
                        <AnimeCard
                          key={anime.id}
                          anime={anime}
                          formatDate={formatDate}
                          getStatusColor={getStatusColor}
                          getStatusText={getStatusText}
                          genreColors={genreColors}
                          isHovered={hoveredCard === anime.id}
                          onMouseEnter={() => setHoveredCard(anime.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/70 text-white rounded-full hover:scale-110 hover:bg-black/80 transition-all duration-300 shadow-lg border border-gray-600/50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/70 text-white rounded-full hover:scale-110 hover:bg-black/80 transition-all duration-300 shadow-lg border border-gray-600/50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AnimeCard = ({ anime, formatDate, getStatusColor, getStatusText, genreColors, isHovered, onMouseEnter, onMouseLeave }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="relative bg-gray-900 rounded-2xl cursor-pointer overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-[51vh]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-full overflow-hidden relative">
        <img
          src={imageError ? '/images/seasonal1.jpg' : anime.image}
          alt={anime.title}
          className="w-full h-full  object-cover"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="p-1 flex-grow flex flex-col justify-between">
        <h3 className="font-bold text-sm mb-2 text-white line-clamp-2">{anime.title}</h3>
        <div className="text-xs text-gray-400  flex flex-wrap gap-2">
          {anime.format && (
            <span className="px-3 py-1 rounded-full bg-blue-800/30 text-blue-400 flex items-center gap-1">
              <MonitorPlay size={12} className="text-blue-400" />
              <span className="font-medium">{anime.format}</span>
            </span>
          )}
          {anime.status && (
            <span className={`px-3 py-1 rounded-full flex items-center gap-1 bg-gradient-to-r ${getStatusColor(anime.status)} text-white`}>
              <RefreshCcw size={12} className="opacity-80" />
              <span className="font-medium">{getStatusText(anime.status)}</span>
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Episodes: {anime.episodes}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {anime.genres && anime.genres.slice(0, 2).map((genre, idx) => (
            <span
              key={idx}
              className={`${genreColors[idx % genreColors.length]} text-white px-1.5 py-1 text-[10px] rounded-full`}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-black/70 p-4 z-20 flex flex-col justify-between backdrop-blur-sm rounded-2xl">
          <div className="text-white space-y-2 text-xs">
            <div className="font-bold text-sm">{anime.title}</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={12} /> {anime.rating}
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <Eye size={12} /> {getStatusText(anime.status)}
              </div>
              <div className="flex items-center gap-1 text-blue-300">
                <Calendar size={12} /> {anime.season && anime.seasonYear ? `${anime.season} ${anime.seasonYear}` : 'TBA'}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300">
              More Info
            </button>
            <button className="flex-1 border border-white/20 text-white text-xs py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              Add to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingAnime;