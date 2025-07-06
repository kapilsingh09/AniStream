import React, { useState, useEffect } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight, Star, Users, Play, X } from 'lucide-react';

const TrendingAnime = () => {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
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
        coverImage: anime.attributes.coverImage?.large || anime.attributes.coverImage?.original,
        ageRating: anime.attributes.ageRating,
        showType: anime.attributes.showType
      }));
      
      setAnimeList(formattedAnime);
    } catch (err) {
      setError('Failed to fetch trending anime');
      console.error('Error fetching anime:', err);
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

  const displayedAnime = showAll ? animeList : animeList.slice(0, 5);
  const slidesToShow = Math.ceil(animeList.length / 5);

  return (
    <div className="w-full mx-auto py-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-2 border-slate-700 rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
          <TrendingUp className="text-pink-400" />
          Trending Anime
        </h2>
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl animate-pulse overflow-hidden">
              <div className="h-48 bg-slate-700 w-full"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                <div className="h-3 bg-slate-600 rounded w-2/3"></div>
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
        <>
          {/* Slider Container */}
          <div className="relative">
            {showAll && (
              <div className="absolute top-0 right-0 z-10">
                <button
                  onClick={() => setShowAll(false)}
                  className="p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {showAll ? (
              /* Slider View */
              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                  }}
                >
                  {Array.from({ length: slidesToShow }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 px-2">
                        {animeList.slice(slideIndex * 5, (slideIndex + 1) * 5).map((anime) => (
                          <AnimeCard key={anime.id} anime={anime} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                {slidesToShow > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 bg-black/80 text-white rounded-full hover:bg-black transition-all z-10 shadow-lg"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 bg-black/80 text-white rounded-full hover:bg-black transition-all z-10 shadow-lg"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Slide Indicators */}
                {slidesToShow > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: slidesToShow }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-pink-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Grid View */
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 transition-all duration-500">
                {displayedAnime.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const AnimeCard = ({ anime }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-black rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-800 hover:border-purple-500">
      {/* Image */}
      <div className="h-48 overflow-hidden relative group">
        <img
          src={imageError ? '/api/placeholder/300/400' : anime.posterImage}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Play className="text-white text-2xl" />
        </div>
        {anime.popularityRank && anime.popularityRank <= 10 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            #{anime.popularityRank}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-white line-clamp-2 leading-tight mb-2">
          {anime.title}
        </h3>
        
        <div className="text-xs text-gray-400">
          <span className="text-green-400 font-medium">
            {anime.status || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrendingAnime;