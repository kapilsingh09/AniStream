import { MonitorPlay, RefreshCcw } from 'lucide-react';
import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Star, Calendar, Heart, Eye
} from 'lucide-react';

const TrendingAnime = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'from-green-400 to-emerald-500';
      case 'not_yet_released':
        return 'from-sky-300 to-blue-400';
      case 'finished':
        return 'bg-purple-600';
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

  // Fake anime data
  const animeList = [
    {
      id: 1,
      title: "Attack on Titan: Final Season",
      synopsis: "As the truth behind the walls comes to light, Eren and his friends face their greatest challenge yet. The final battle for humanity's survival begins.",
      rating: 92,
      popularityRank: 1,
      ratingRank: 1,
      status: "finished",
      episodeCount: 24,
      startDate: "2023-03-03",
      posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      userCount: 2500000,
      favoritesCount: 180000,
      showType: "TV",
      ageRating: "R",
      subtype: "TV",
      rank: 1,
      year: 2023
    },
    {
      id: 2,
      title: "Demon Slayer: Infinity Castle",
      synopsis: "Tanjiro and his companions infiltrate the mysterious Infinity Castle for the final confrontation against Muzan and the Upper Moons.",
      rating: 90,
      popularityRank: 2,
      ratingRank: 2,
      status: "releasing",
      episodeCount: 12,
      startDate: "2024-02-10",
      posterImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop",
      userCount: 2200000,
      favoritesCount: 165000,
      showType: "TV",
      ageRating: "R",
      subtype: "TV",
      rank: 2,
      year: 2024
    },
    {
      id: 3,
      title: "Jujutsu Kaisen: Hidden Inventory",
      synopsis: "A prequel arc focusing on Gojo and Geto's past, revealing the events that shaped their relationship and the jujutsu world.",
      rating: 89,
      popularityRank: 3,
      ratingRank: 3,
      status: "finished",
      episodeCount: 5,
      startDate: "2023-07-06",
      posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      userCount: 1800000,
      favoritesCount: 145000,
      showType: "TV",
      ageRating: "R",
      subtype: "TV",
      rank: 3,
      year: 2023
    },
    {
      id: 4,
      title: "One Piece: Egghead Island",
      synopsis: "The Straw Hat Pirates arrive at Egghead Island, the island of the future, where they encounter Dr. Vegapunk and face new challenges.",
      rating: 88,
      popularityRank: 4,
      ratingRank: 4,
      status: "releasing",
      episodeCount: 20,
      startDate: "2024-01-07",
      posterImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop",
      userCount: 1900000,
      favoritesCount: 135000,
      showType: "TV",
      ageRating: "PG",
      subtype: "TV",
      rank: 4,
      year: 2024
    },
    {
      id: 5,
      title: "Chainsaw Man Movie: Reze Arc",
      synopsis: "Denji encounters a mysterious girl named Reze who may not be what she seems. A story of young love and devastating revelations.",
      rating: 87,
      popularityRank: 5,
      ratingRank: 5,
      status: "not_yet_released",
      episodeCount: 1,
      startDate: "2024-12-13",
      posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      userCount: 1500000,
      favoritesCount: 120000,
      showType: "Movie",
      ageRating: "R",
      subtype: "Movie",
      rank: 5,
      year: 2024
    },
    {
      id: 6,
      title: "My Hero Academia: Final Act",
      synopsis: "The final battle between heroes and villains reaches its climax as Deku faces All For One in the ultimate confrontation.",
      rating: 86,
      popularityRank: 6,
      ratingRank: 6,
      status: "hiatus",
      episodeCount: 13,
      startDate: "2024-04-06",
      posterImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop",
      userCount: 1700000,
      favoritesCount: 110000,
      showType: "TV",
      ageRating: "PG",
      subtype: "TV",
      rank: 6,
      year: 2024
    },
    {
      id: 7,
      title: "Frieren: Beyond Journey's End",
      synopsis: "An elf mage reflects on her long life and the fleeting nature of human relationships after the death of her companions.",
      rating: 91,
      popularityRank: 7,
      ratingRank: 7,
      status: "finished",
      episodeCount: 28,
      startDate: "2023-09-29",
      posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      userCount: 1400000,
      favoritesCount: 95000,
      showType: "TV",
      ageRating: "PG",
      subtype: "TV",
      rank: 7,
      year: 2023
    },
    {
      id: 8,
      title: "Spy x Family Code: White",
      synopsis: "The Forger family goes on their first family vacation, but their trip takes an unexpected turn when they get caught up in a conspiracy.",
      rating: 85,
      popularityRank: 8,
      ratingRank: 8,
      status: "finished",
      episodeCount: 1,
      startDate: "2023-12-22",
      posterImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop",
      userCount: 1300000,
      favoritesCount: 88000,
      showType: "Movie",
      ageRating: "PG",
      subtype: "Movie",
      rank: 8,
      year: 2023
    },
    {
      id: 9,
      title: "Tokyo Revengers: Tenjiku Arc",
      synopsis: "Takemichi faces his most dangerous mission yet as he attempts to prevent the tragic fate of his friends in the Tenjiku arc.",
      rating: 84,
      popularityRank: 9,
      ratingRank: 9,
      status: "cancelled",
      episodeCount: 13,
      startDate: "2024-01-09",
      posterImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
      userCount: 1200000,
      favoritesCount: 75000,
      showType: "TV",
      ageRating: "R",
      subtype: "TV",
      rank: 9,
      year: 2024
    },
    {
      id: 10,
      title: "Vinland Saga: Return to Iceland",
      synopsis: "Thorfinn returns to Iceland with his family, seeking to establish a peaceful settlement away from the violence of war.",
      rating: 89,
      popularityRank: 10,
      ratingRank: 10,
      status: "not_yet_released",
      episodeCount: 24,
      startDate: "2025-01-10",
      posterImage: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=600&fit=crop",
      userCount: 1100000,
      favoritesCount: 82000,
      showType: "TV",
      ageRating: "R",
      subtype: "TV",
      rank: 10,
      year: 2025
    }
  ];

  const loading = false;
  const error = null;

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
            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300">
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

const AnimeCard = ({ anime, formatDate, formatNumber, getStatusColor, getStatusText, genreColors, isHovered, onMouseEnter, onMouseLeave }) => {
  const [imageError, setImageError] = useState(false);

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
            <span className={`px-3 py-1 rounded-full flex items-center gap-1 bg-gradient-to-r ${getStatusColor(anime.status)} text-white`}>
              <RefreshCcw size={12} className="opacity-80" />
              <span className="font-medium">{getStatusText(anime.status)}</span>
            </span>
          )}
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-black/70 p-4 z-20 flex flex-col justify-between backdrop-blur-sm rounded-2xl">
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
                <Eye size={12} /> {getStatusText(anime.status)}
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
        </div>
      )}
    </div>
  );
};

export default TrendingAnime;