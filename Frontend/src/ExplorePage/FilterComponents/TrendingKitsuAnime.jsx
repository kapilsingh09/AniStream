// Replace the full content of your current file with this

import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight, Star, Users, Play, Calendar, Heart, Eye } from 'lucide-react';

const TrendingAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchTrendingAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://kitsu.io/api/edge/trending/anime?page[limit]=20');
      const data = await response.json();
      const formattedAnime = data.data.map(anime => ({
        id: anime.id,
        title: anime.attributes.canonicalTitle || anime.attributes.titles?.en || anime.attributes.titles?.en_jp,
        synopsis: anime.attributes.synopsis,
        rating: anime.attributes.averageRating,
        popularityRank: anime.attributes.popularityRank,
        ratingRank: anime.attributes.ratingRank,
        status: anime.attributes.status,
        episodeCount: anime.attributes.episodeCount,
        startDate: anime.attributes.startDate,
        posterImage: anime.attributes.posterImage?.large || anime.attributes.posterImage?.medium,
        userCount: anime.attributes.userCount,
        favoritesCount: anime.attributes.favoritesCount,
        showType: anime.attributes.showType,
      }));
      setAnimeList(formattedAnime);
    } catch (err) {
      setError('Failed to fetch trending anime');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingAnime();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(animeList.length / 5));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(animeList.length / 5)) % Math.ceil(animeList.length / 5));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const slidesToShow = Math.ceil(animeList.length / 5);

  return (
    <div className="w-full mx-auto py-8 mt-10 bg-black/20 border-2 border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
          <TrendingUp className="text-pink-400" />
          Trending Anime
          <span className="text-sm text-gray-400 font-normal">({animeList.length})</span>
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl animate-pulse overflow-hidden">
              <div className="h-64 bg-slate-700 w-full"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-10 bg-slate-800 rounded-xl">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={fetchTrendingAnime}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="relative overflow-hidden h-[50vh] border-2 flex items-center justify-center rounded-xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: slidesToShow }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-2">
                  {animeList.slice(slideIndex * 5, (slideIndex + 1) * 5).map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} formatDate={formatDate} formatNumber={formatNumber} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={prevSlide} className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 bg-black/80 text-white rounded-full hover:bg-black transition-all z-10 shadow-lg">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-black/80 text-white rounded-full hover:bg-black transition-all z-10 shadow-lg">
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {Array.from({ length: slidesToShow }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-pink-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'} transition-all`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AnimeCard = ({ anime, formatDate, formatNumber }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 border border-purple-700 bg-gradient-to-br from-slate-800 via-black to-slate-900 text-white">
      <div className="h-64 overflow-hidden relative group">
        <img
          src={imageError ? '/api/placeholder/300/400' : anime.posterImage}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="text-white text-2xl" />
        </div>
        {anime.popularityRank && anime.popularityRank <= 10 && (
          <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
            #{anime.popularityRank}
          </div>
        )}
        {anime.rating && (
          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            {parseFloat(anime.rating).toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-bold line-clamp-2">{anime.title}</h3>
        <div className="flex justify-between text-xs text-gray-300">
          <span className="flex items-center gap-1 text-green-400">
            <Eye size={12} />
            {anime.status}
          </span>
          <span className="text-blue-400">{anime.showType}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-1">
          {anime.episodeCount && (
            <span className="flex items-center gap-1">
              <Play size={12} />
              {anime.episodeCount} eps
            </span>
          )}
          {anime.startDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(anime.startDate)}
            </span>
          )}
          {anime.userCount && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {formatNumber(anime.userCount)}
            </span>
          )}
          {anime.favoritesCount && (
            <span className="flex items-center gap-1 text-pink-400">
              <Heart size={12} />
              {formatNumber(anime.favoritesCount)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingAnime;
