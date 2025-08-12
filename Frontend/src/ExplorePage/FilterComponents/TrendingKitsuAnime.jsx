import { MonitorPlay, RefreshCcw } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Star, Play, Calendar, Heart, Eye
} from 'lucide-react';
// import { DataContext } from '../../context/AnimeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Demo data for animeList
const demoAnimeList = [
  {
    id: '1',
    title: 'Attack on Titan',
    synopsis: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    rating: 8.9,
    popularityRank: 1,
    ratingRank: 1,
    status: 'finished',
    episodeCount: 75,
    startDate: '2013-04-07',
    posterImage: 'https://media.kitsu.io/anime/poster_images/7442/large.jpg',
    userCount: 1000000,
    favoritesCount: 500000,
    showType: 'TV',
    ageRating: 'R',
    subtype: 'TV',
    rank: 1,
    year: 2013
  },
  {
    id: '2',
    title: 'My Hero Academia',
    synopsis: 'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.',
    rating: 8.2,
    popularityRank: 2,
    ratingRank: 2,
    status: 'current',
    episodeCount: 113,
    startDate: '2016-04-03',
    posterImage: 'https://media.kitsu.io/anime/poster_images/10793/large.jpg',
    userCount: 800000,
    favoritesCount: 300000,
    showType: 'TV',
    ageRating: 'PG-13',
    subtype: 'TV',
    rank: 2,
    year: 2016
  },
  {
    id: '3',
    title: 'Demon Slayer',
    synopsis: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    rating: 8.7,
    popularityRank: 3,
    ratingRank: 3,
    status: 'current',
    episodeCount: 44,
    startDate: '2019-04-06',
    posterImage: 'https://media.kitsu.io/anime/poster_images/41370/large.jpg',
    userCount: 900000,
    favoritesCount: 400000,
    showType: 'TV',
    ageRating: 'R',
    subtype: 'TV',
    rank: 3,
    year: 2019
  },
  {
    id: '4',
    title: 'Jujutsu Kaisen',
    synopsis: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and thus exorcise himself.',
    rating: 8.6,
    popularityRank: 4,
    ratingRank: 4,
    status: 'current',
    episodeCount: 47,
    startDate: '2020-10-03',
    posterImage: 'https://media.kitsu.io/anime/poster_images/42544/large.jpg',
    userCount: 850000,
    favoritesCount: 350000,
    showType: 'TV',
    ageRating: 'R',
    subtype: 'TV',
    rank: 4,
    year: 2020
  },
  {
    id: '5',
    title: 'One Piece',
    synopsis: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger. The famous mystery treasure named "One Piece".',
    rating: 8.8,
    popularityRank: 5,
    ratingRank: 5,
    status: 'current',
    episodeCount: 1000,
    startDate: '1999-10-20',
    posterImage: 'https://media.kitsu.io/anime/poster_images/1/large.jpg',
    userCount: 2000000,
    favoritesCount: 1000000,
    showType: 'TV',
    ageRating: 'PG-13',
    subtype: 'TV',
    rank: 5,
    year: 1999
  },
  {
    id: '6',
    title: 'Fullmetal Alchemist: Brotherhood',
    synopsis: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.',
    rating: 9.1,
    popularityRank: 6,
    ratingRank: 6,
    status: 'finished',
    episodeCount: 64,
    startDate: '2009-04-05',
    posterImage: 'https://media.kitsu.io/anime/poster_images/5114/large.jpg',
    userCount: 700000,
    favoritesCount: 350000,
    showType: 'TV',
    ageRating: 'PG-13',
    subtype: 'TV',
    rank: 6,
    year: 2009
  },
  {
    id: '7',
    title: 'Naruto',
    synopsis: 'Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village\'s leader and strongest ninja.',
    rating: 7.9,
    popularityRank: 7,
    ratingRank: 7,
    status: 'finished',
    episodeCount: 220,
    startDate: '2002-10-03',
    posterImage: 'https://media.kitsu.io/anime/poster_images/20/large.jpg',
    userCount: 1500000,
    favoritesCount: 800000,
    showType: 'TV',
    ageRating: 'PG-13',
    subtype: 'TV',
    rank: 7,
    year: 2002
  },
  {
    id: '8',
    title: 'Death Note',
    synopsis: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
    rating: 8.6,
    popularityRank: 8,
    ratingRank: 8,
    status: 'finished',
    episodeCount: 37,
    startDate: '2006-10-04',
    posterImage: 'https://media.kitsu.io/anime/poster_images/1535/large.jpg',
    userCount: 1200000,
    favoritesCount: 600000,
    showType: 'TV',
    ageRating: 'R',
    subtype: 'TV',
    rank: 8,
    year: 2006
  },
  {
    id: '9',
    title: 'Spy x Family',
    synopsis: 'A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.',
    rating: 8.3,
    popularityRank: 9,
    ratingRank: 9,
    status: 'current',
    episodeCount: 25,
    startDate: '2022-04-09',
    posterImage: 'https://media.kitsu.io/anime/poster_images/44032/large.jpg',
    userCount: 600000,
    favoritesCount: 200000,
    showType: 'TV',
    ageRating: 'PG-13',
    subtype: 'TV',
    rank: 9,
    year: 2022
  },
  {
    id: '10',
    title: 'Chainsaw Man',
    synopsis: 'Denji is a young boy who works as a Devil Hunter to pay off his deceased father\'s debt. He is betrayed and killed, but is revived as Chainsaw Man, a human-devil hybrid.',
    rating: 8.4,
    popularityRank: 10,
    ratingRank: 10,
    status: 'current',
    episodeCount: 12,
    startDate: '2022-10-12',
    posterImage: 'https://media.kitsu.io/anime/poster_images/44204/large.jpg',
    userCount: 500000,
    favoritesCount: 150000,
    showType: 'TV',
    ageRating: 'R',
    subtype: 'TV',
    rank: 10,
    year: 2022
  }
];

const TrendingAnime = ({
  exFun, loading, error, refetch
}) => {
  // State for current carousel slide
  const [currentSlide, setCurrentSlide] = useState(0);
  // State for which card is hovered (for showing overlay)
  const [hoveredCard, setHoveredCard] = useState(null);
  // State for which anime's play button is active (blinking)
  const [activeAnimeId, setActiveAnimeId] = useState(null);
  const navigate = useNavigate();

  // Automatically refetch if there is an error
  useEffect(() => {
    if (error && typeof refetch === 'function') {
      refetch();
    }
  }, [error, refetch]);

  const handleMore = (id) => {
    navigate(`/kitsu/${id}`);
  };

  // Use demo data for the slider
  const animeList = demoAnimeList;

  // --- If you want to use actual fetched data, use the following and comment out the above line ---
  // const animeList = (exFun || []).slice(0, 10).map((anime, index) => ({
  //   id: anime.id,
  //   title: anime.attributes.en_us || anime.attributes.en_jp || anime.attributes.titles?.en || anime.attributes.titles?.en_jp,
  //   synopsis: anime.attributes.synopsis,
  //   rating: anime.attributes.averageRating,
  //   popularityRank: anime.attributes.popularityRank || index + 1,
  //   ratingRank: anime.attributes.ratingRank,
  //   status: anime.attributes.status,
  //   episodeCount: anime.attributes.episodeCount,
  //   startDate: anime.attributes.startDate,
  //   posterImage: anime.attributes.posterImage?.large || anime.attributes.posterImage?.medium,
  //   userCount: anime.attributes.userCount,
  //   favoritesCount: anime.attributes.favoritesCount,
  //   showType: anime.attributes.showType,
  //   ageRating: anime.attributes.ageRating,
  //   subtype: anime.attributes.subtype,
  //   rank: index + 1,
  //   year: anime.attributes.startDate ? new Date(anime.attributes.startDate).getFullYear() : null
  // }));

  // Calculate how many slides are needed (5 cards per slide)
  const slidesToShow = Math.ceil(animeList.length / 5);

  // Move to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesToShow);
  };

  // Move to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesToShow) % slidesToShow);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Format large numbers for display (e.g., 1.2K, 3.4M)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Main render
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
        {/* Loading state: show skeleton cards */}
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
          // Error state: show error message (no retry button)
          <div className="text-center text-red-400 py-10 bg-slate-800/50 rounded-xl border border-slate-700/30 m-6">
            <p className="text-lg font-semibold">{error}</p>
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
                          onPlayClick={(id) => {
                            setActiveAnimeId(id);
                            setTimeout(() => setActiveAnimeId(null), 500); // Remove blink after 500ms
                            navigate(`/anime/${id}`);
                          }}
                          activeAnimeId={activeAnimeId}
                          handleMore={handleMore}
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

// AnimeCard displays a single anime's info and hover overlay
const AnimeCard = ({ anime, formatDate, formatNumber, isHovered, onMouseEnter, onMouseLeave, onPlayClick, activeAnimeId, handleMore }) => {
  // State for image error fallback
  const [imageError, setImageError] = useState(false);

  // Helper to style status badge
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

  // Play button click handler
  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayClick(anime.id);
  };

  return (
    <div
      className="relative bg-gray-900 rounded-2xl cursor-pointer overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-[51vh] group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Anime poster image */}
      <div className="h-full overflow-hidden relative">
        <img
          src={imageError ? '/images/seasonal1.jpg' : anime.posterImage}
          alt={anime.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        {/* Rank badge for top 10 */}
        {anime.rank && anime.rank <= 10 && (
          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            #{anime.rank}
          </div>
        )}
        {/* Play button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePlayClick}
            className={`rounded-full p-4 border-4 border-white/30 transform scale-75 px-6 py-6 group-hover:scale-100 transition-transform duration-300 focus:outline-none ${activeAnimeId === anime.id ? 'animate-pulse' : ''}`}
            aria-label="Play"
          >
            <Play className="w-4 h-4 scale-220 text-white fill-white" />
          </button>
        </div>
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
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => handleMore(anime.id)}
              className="rounded-full p-4 border-4 border-white/30 transform scale-75 px-6 py-6 hover:scale-100 transition-transform duration-300 focus:outline-none"
              aria-label="Play"
            >
              <Play className="w-4 h-4 scale-220 text-white fill-white" />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleMore(anime.id)}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300">
              More Info
            </button>
            <button
              className="flex-1 border border-white/20 text-white text-xs py-2 rounded-lg hover:bg-white/10 transition-all duration-300">
              Add to List
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrendingAnime;
