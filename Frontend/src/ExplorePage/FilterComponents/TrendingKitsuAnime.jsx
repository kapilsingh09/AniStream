import { MonitorPlay, RefreshCcw } from 'lucide-react';
import React, { useState, useContext } from 'react';
import {
  ChevronLeft, ChevronRight, Star, Calendar, Heart, Eye
} from 'lucide-react';
import { DataContext } from '../../context/AnimeContext';
import { motion } from 'framer-motion';

const TrendingAnime = ({exFun, loading, error, refetch}) => {
  // Use exFun prop instead of context
  // Remove useContext(DataContext)

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const animeList = (exFun || []).slice(0, 10).map((anime, index) => ({
    id: anime.id,
    title: anime.attributes.en_us || anime.attributes.en_jp || anime.attributes.titles?.en || anime.attributes.titles?.en_jp,
    synopsis: anime.attributes.synopsis,
    rating: anime.attributes.averageRating,
    popularityRank: anime.attributes.popularityRank || index + 1,
    ratingRank: anime.attributes.ratingRank,
    status: anime.attributes.status,
    episodeCount: anime.attributes.episodeCount,
    startDate: anime.attributes.startDate,
    posterImage: anime.attributes.posterImage?.large || anime.attributes.posterImage?.medium,
    userCount: anime.attributes.userCount,
    favoritesCount: anime.attributes.favoritesCount,
    showType: anime.attributes.showType,
    ageRating: anime.attributes.ageRating,
    subtype: anime.attributes.subtype,
    rank: index + 1,
    year: anime.attributes.startDate ? new Date(anime.attributes.startDate).getFullYear() : null
  }));

  const slidesToShow = Math.ceil(animeList.length / 5);

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

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="w-full rounded-2xl p-6 mt-10 bg-slate-900 border-2 border-slate-800 ">
      <div className="flex items-center justify-between ml-4">
        <h2 className="text-4xl  font-bold flex items-center gap-3 text-white ml-2">
          Popular Anime
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
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              Try Again
            </button>
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
                      {animeList.slice(slideIndex * 5, (slideIndex + 1) * 5).map((anime) => (
                        <AnimeCard
                          key={anime.id}
                          anime={anime}
                          formatDate={formatDate}
                          formatNumber={formatNumber}
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

const AnimeCard = ({ anime, formatDate, formatNumber, isHovered, onMouseEnter, onMouseLeave }) => {
  const [imageError, setImageError] = useState(false);
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'current':
      case 'ongoing':
        return 'bg-green-800/30 text-green-400';
      case 'finished':
        return 'bg-purple-800/30 text-purple-400';
      case 'upcoming':
      case 'tba':
        return 'bg-yellow-800/30 text-yellow-400';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-800/30 text-red-400';
      default:
        return 'bg-gray-700/30 text-gray-300';
    }
  };

  return (
    <div
      className="relative bg-gray-900 rounded-2xl cursor-pointer overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-[51vh]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-full overflow-hidden relative">
        <img
          src={imageError ? '/images/seasonal1.jpg' : anime.posterImage}
          alt={anime.title}
          className="w-full h-full  object-cover"
          onError={() => setImageError(true)}
        />
        {anime.rank && anime.rank <= 10 && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            #{anime.rank}
          </div>
        )}
      </div>

      <div className="p-1 flex-grow flex flex-col justify-between">
        <h3 className="font-bold text-sm mb-2 text-white line-clamp-2">{anime.title}</h3>
        <div className="text-xs text-gray-400  flex flex-wrap gap-2">
          {anime.showType && (
            <span className="px-3 py-1 rounded-full bg-blue-800/30 text-blue-400 flex items-center gap-1">
              <MonitorPlay size={12} className="text-blue-400" />
              <span className="font-medium">{anime.showType}</span>
            </span>
          )}
          {anime.status && (
            <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${getStatusStyle(anime.status)}`}>
              <RefreshCcw size={12} className="opacity-80" />
              <span className="font-medium capitalize">{anime.status}</span>
            </span>
          )}
        </div>
      </div>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 bg-black/70 p-4 z-20 flex flex-col justify-between backdrop-blur-sm rounded-2xl"
        >
          <div className="text-white space-y-2 text-xs">
            <div className="font-bold text-sm">{anime.title}</div>
            <p className="line-clamp-4 text-gray-200">
              {anime.synopsis || 'No synopsis available.'}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={12} /> {anime.rating ? `${parseFloat(anime.rating).toFixed(1)}/10` : 'N/A'}
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <Eye size={12} /> {anime.status}
              </div>
              <div className="flex items-center gap-1 text-blue-300">
                <Calendar size={12} /> {formatDate(anime.startDate)}
              </div>
              <div className="flex items-center gap-1 text-pink-300">
                <Heart size={12} /> {formatNumber(anime.favoritesCount)}
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
        </motion.div>
      )}
    </div>
  );
};

export default TrendingAnime;
