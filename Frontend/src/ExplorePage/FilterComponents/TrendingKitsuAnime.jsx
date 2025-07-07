import React, { useState, useEffect } from 'react';
import {
  TrendingUp, ChevronLeft, ChevronRight, Star,
  Users, Play, Calendar, Heart, Eye, Info, ExternalLink
} from 'lucide-react';

// This is the main part that shows trending anime in a slider
const TrendingAnime = () => {
  // We keep track of the anime we get from the internet
  const [animeList, setAnimeList] = useState([]);
  // This tells us if we are still waiting for the anime to load
  const [loading, setLoading] = useState(false);
  // If something goes wrong, we show an error
  const [error, setError] = useState(null);
  // This remembers which group of anime cards we are showing
  const [currentSlide, setCurrentSlide] = useState(0);
  // This remembers which card the mouse is on
  const [hoveredCard, setHoveredCard] = useState(null);

  
  // This gets the trending anime from the internet
  const fetchTrendingAnime = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://kitsu.io/api/edge/trending/anime?page[limit]=20');
      const data = await response.json();
      // We make the anime data easier to use
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
    } catch (err) {
      setError('Failed to fetch trending anime');
    } finally {
      setLoading(false);
    }
  };

  // When the page loads, get the anime
  useEffect(() => {
    fetchTrendingAnime();
  }, []);

  // Go to the next group of anime cards
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(animeList.length / 5));
  };
  // Go to the previous group of anime cards
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(animeList.length / 5)) % Math.ceil(animeList.length / 5));
  };

  // Make the date look nice
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };
  // Make big numbers easier to read
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };


  const slidesToShow = Math.ceil(animeList.length / 5);

  
  return (
    // This is the big box that holds everything
    <div className="w-full mx-auto mt-10 bg-gradient-to-br from-slate-900 via-black to-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* The top part with the title and button */}
      <div className="flex items-center justify-between ">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
          {/* <TrendingUp className="text-pink-400 animate-pulse" /> */}
          Trending Anime
          {/* <span className="text-sm text-gray-400 font-normal">({animeList.length})</span> */}
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <ExternalLink size={16} />
          View All
        </button>
      </div>

      {/* If we are loading, show gray boxes. If error, show error. Otherwise, show the anime cards. */}
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
        // This is the slider with all the anime cards
        <div className="relative overflow-hidden h-[60vh] flex items-center justify-center-safe  border border-white rounded-xl bg-pink-400">
          <div
            className="flex transition-all duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* We show 5 cards at a time, and can slide left/right */}
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

          {/* The left and right arrow buttons */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/70 to-transparent z-10 flex items-center justify-center">
            <button onClick={prevSlide} className="p-2 bg-black/70 text-white rounded-full hover:scale-110 transition-all shadow">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/70 to-transparent z-10 flex items-center justify-center">
            <button onClick={nextSlide} className="p-2 bg-black/70 text-white rounded-full hover:scale-110 transition-all shadow">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* The little dots at the bottom to show which slide we are on */}
          {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/40 px-4 py-2 rounded-full">
            {Array.from({ length: slidesToShow }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-pink-500' : 'bg-gray-500'}`}
              />
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
};

// This is one anime card. It shows the picture, title, and more info when you hover.
const AnimeCard = ({ anime, formatDate, formatNumber, isHovered, onMouseEnter, onMouseLeave }) => {
  // If the image doesn't load, we show a placeholder
  const [imageError, setImageError] = useState(false);

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'tv':
        return 'text-indigo-400 bg-indigo-500/10 border border-indigo-400/40';
      case 'movie':
        return 'text-red-400 bg-red-500/10 border border-red-400/40';
      case 'ova':
        return 'text-yellow-400 bg-yellow-500/10 border border-yellow-400/40';
      case 'ona':
        return 'text-teal-400 bg-teal-500/10 border border-teal-400/40';
      case 'special':
        return 'text-pink-400 bg-pink-500/10 border border-pink-400/40';
      default:
        return 'text-gray-300 bg-slate-600/20 border border-slate-400/20';
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'finished':
        return 'text-green-400 bg-green-500/10 border border-green-400/40';
      case 'current':
      case 'ongoing':
        return 'text-yellow-400 bg-yellow-500/10 border border-yellow-400/40';
      case 'upcoming':
      case 'tba':
        return 'text-blue-400 bg-blue-500/10 border border-blue-400/40';
        default:
          return 'text-gray-300 bg-slate-600/20 border border-slate-400/20';
        }
      };
  
  return (
    // This is the card box
    <div
      className="relative rounded-xl overflow-hidden transition-all h-[50vh] duration-600 transform hover:scale-110  border-2
       border-gray-700/30 bg-gradient-to-l  from-violet-500/40 via-pink-500/70 to-purple-500  shadow-lg cursor-pointer"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* The anime picture */}
      <div className="h-72 overflow-hidden relative group">
        <img
          src={imageError ? '/api/placeholder/300/400' : anime.posterImage}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={() => setImageError(true)}
        />
        {/* If the anime is very popular, show its rank */}
        {anime.popularityRank && anime.popularityRank <= 10 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow">
            #{anime.popularityRank}
          </div>
        )}
        {/* Show the rating as a star */}
        {anime.rating && (
          <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            {parseFloat(anime.rating).toFixed(1)}
          </div>
        )}
      </div>

      {/* The title and status */}
      <div className="p-3 space-y-1 text-sm text-white">
        <h3 className="font-bold line-clamp-2">{anime.title}</h3>
        <div className="flex justify-between text-xs text-gray-400">
         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(anime.status)}`}>
            {anime.status}
          </span>

          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(anime.showType)}`}>
              {anime.showType}
           </span>

        </div>
      </div>
      {/* hovered card */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/80 p-4 z-20 flex flex-col justify-between animate-slide-in-left">
          <div className="text-white space-y-2 text-xs">
            <div className="font-bold text-sm">{anime.title}</div>
            <p className="line-clamp-3 text-gray-300">{anime.synopsis || 'No synopsis available.'}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star size={12} /> {anime.rating ? `${parseFloat(anime.rating).toFixed(1)}/10` : 'N/A'}
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <Eye size={12} /> {anime.status}
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Calendar size={12} /> {formatDate(anime.startDate)}
              </div>
              <div className="flex items-center gap-1 text-pink-400">
                <Heart size={12} /> {formatNumber(anime.favoritesCount)}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 bg-pink-600 text-white text-xs py-2 rounded-lg">More Info</button>
            <button className="flex-1 border border-white/20 text-white text-xs py-2 rounded-lg">Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

// This makes the hover box slide in from the left
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
