import React, { useState, useEffect } from 'react';
import {
  TrendingUp, ChevronLeft, ChevronRight, Star,
  Users, Play, Calendar, Heart, Eye, Info, ExternalLink
} from 'lucide-react';

const TrendingAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fetchTrendingAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://kitsu.io/api/edge/trending/anime?page[limit]=20');
      const data = await response.json();
      const formattedAnime = data.data.map(anime => ({
        id: anime.id,
        title: anime.attributes.en_us || anime.attributes.en_jp || anime.attributes.titles?.en || anime.attributes.titles?.en_jp,
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
        ageRating: anime.attributes.ageRating,
        subtype: anime.attributes.subtype
      }));
      setAnimeList(formattedAnime);
      localStorage.setItem('trendingAnime', JSON.stringify(formattedAnime));
    } catch (err) {
      setError('Failed to fetch trending anime');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem('trendingAnime');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setAnimeList(parsed);
      } catch (e) {
        fetchTrendingAnime();
      }
    } else {
      fetchTrendingAnime();
    }
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
      month: 'short'
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
    <div className="w-full rounded-2xl p-6 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
          Trending Anime
        </h2>
        <button className="flex items-center gap-2 text-white rounded-lg bg-gradient-to-r from-blue-600 to-violet-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg">
          View All
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl animate-pulse h-64 border border-slate-700/30"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-10 bg-slate-800/50 rounded-xl border border-slate-700/30">
          <p className="text-lg font-semibold">{error}</p>
          <button
            onClick={fetchTrendingAnime}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="relative overflow-hidden h-[60vh] border-white rounded-xl">
          <div
            className="flex transition-all duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: slidesToShow }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-5 h-80 gap-4 px-2">
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

          <div className="absolute left-0 top-0 bottom-0 w-42 bg-gradient-to-r from-black/70 to-transparent z-10 flex items-center justify-center">
            <button onClick={prevSlide} className="p-2 absolute left-5 bg-black/70 text-white rounded-full hover:scale-110 hover:cursor-pointer transition-all shadow">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-22 bg-gradient-to-l from-black/70 to-transparent z-10 flex items-center justify-center">
            <button onClick={nextSlide} className=" hover:cursor-pointer p-2 bg-black/70 text-white rounded-full hover:scale-110 transition-all shadow">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AnimeCard = ({ anime, formatDate, formatNumber, isHovered, onMouseEnter, onMouseLeave }) => {
  const [imageError, setImageError] = useState(false);

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'tv': return 'text-indigo-400 bg-indigo-500/10 border border-indigo-400/40';
      case 'movie': return 'text-pink-400 bg-pink-500/10 border border-pink-400/40';
      case 'ova': return 'text-yellow-400 bg-yellow-500/10 border border-yellow-400/40';
      default: return 'text-gray-300 bg-slate-600/20 border border-slate-400/20';
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'finished': return 'text-green-400 bg-green-500/10 border border-green-400/40';
      case 'current': return 'text-yellow-400 bg-yellow-500/10 border border-yellow-400/40';
      case 'upcoming': return 'text-blue-400 bg-blue-500/10 border border-blue-400/40';
      default: return 'text-gray-300 bg-slate-600/20 border border-slate-400/20';
    }
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-gray-700 transition-all h-[51.2vh] mt-8 duration-600 transform hover:scale-105 m-2 shadow-lg cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="h-72 overflow-hidden relative group">
        <img
          src={imageError ? '/api/placeholder/300/400' : anime.posterImage}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        {anime.popularityRank && anime.popularityRank <= 10 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
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

      <div className="p-3 space-y-1 text-sm text-white">
        <h3 className="font-bold line-clamp-2">{anime.title}</h3>
        <div className="flex justify-between text-xs text-gray-400">
          <span className={`px-2 py-0.5 rounded-full ${getStatusColor(anime.status)}`}>
            {anime.status}
          </span>
          <span className={`px-2 py-0.5 rounded-full ${getTypeColor(anime.showType)}`}>
            {anime.showType}
          </span>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-black/70 p-4 z-20 flex flex-col justify-between animate-slide-in-left">
          <div className="text-white space-y-2 text-xs">
            <div className="font-bold text-sm">{anime.title}</div>
            <p className="line-clamp-3 text-gray-200">{anime.synopsis || 'No synopsis available.'}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-1 text-yellow-400"><Star size={12} /> {anime.rating ? `${parseFloat(anime.rating).toFixed(1)}/10` : 'N/A'}</div>
              <div className="flex items-center gap-1 text-green-400"><Eye size={12} /> {anime.status}</div>
              <div className="flex items-center gap-1 text-blue-300"><Calendar size={12} /> {formatDate(anime.startDate)}</div>
              <div className="flex items-center gap-1 text-pink-300"><Heart size={12} /> {formatNumber(anime.favoritesCount)}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs py-2 rounded-lg">More Info</button>
            <button className="flex-1 border border-white/20 text-white text-xs py-2 rounded-lg">Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

if (typeof window !== 'undefined' && !document.getElementById('slide-in-left-keyframes')) {
  const style = document.createElement('style');
  style.id = 'slide-in-left-keyframes';
  style.innerHTML = `
  @keyframes slideInLeft {
    0% { transform: translateX(-100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in-left {
    animation: slideInLeft 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
  }
  `;
  document.head.appendChild(style);
}

export default TrendingAnime;
