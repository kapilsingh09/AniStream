import React, { useState, useEffect } from 'react';
import { Flame, Play, Heart, Share2, Star, Calendar, Film } from 'lucide-react';

import {
  fetchTrendingAnime,
} from "../services/kitsuAnimeApi";

const fetchSpotlightAnime = async (limit = 12) => {
  try {

    const trendingData = await fetchTrendingAnime(limit);
    
    if (trendingData && Array.isArray(trendingData)) {
      return trendingData.map((anime, index) => {
        const attrs = anime.attributes;
        return {
          id: anime.id,
          title: attrs.canonicalTitle || attrs.titles?.en_jp || attrs.titles?.en || "Unknown Title",
          image: attrs.posterImage?.original || attrs.posterImage?.large,
          rating: attrs.averageRating ? `${(attrs.averageRating / 10).toFixed(1)}/10` : 'N/A',
          status: attrs.status,
          year: attrs.startDate ? new Date(attrs.startDate).getFullYear().toString() : 'TBA',
          episodes: attrs.episodeCount || '?',
          genres: attrs.genres || ['Action', 'Adventure'],
          studio: attrs.studio || 'Unknown Studio',
          description: attrs.synopsis || `An amazing anime series: ${attrs.canonicalTitle || "Unknown Title"}`,
          popularityRank: attrs.popularityRank,
          ratingRank: attrs.ratingRank,
          ageRating: attrs.ageRating
        };
      });
    }
  } catch (error) {
    console.error('Kitsu API failed:', error);
  }


 


 
};



const Spotlight = () => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnimeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchSpotlightAnime(12);
      setFeaturedAnime(data);
    } catch (err) {
      console.error('Error fetching anime:', err);
      setError('Failed to fetch anime data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'current':
      case 'currently airing':
      case 'ongoing':
      case 'releasing':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'not yet aired':
      case 'not yet released':
      case 'anons':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'finished':
      case 'finished airing':
      case 'released':
        return 'bg-gradient-to-r from-purple-500 to-violet-500';
      default:
        return 'bg-gradient-to-r from-pink-500 to-rose-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'current':
      case 'currently airing':
      case 'ongoing':
      case 'releasing':
        return 'Ongoing';
      case 'not yet aired':
      case 'not yet released':
      case 'anons':
        return 'Upcoming';
      case 'finished':
      case 'finished airing':
      case 'released':
        return 'Completed';
      default:
        return status || 'Unknown';
    }
  };



  const handlePlayClick = (anime) => {
    console.log('Playing:', anime.title);
    // Add your play logic here
  };

  const handleHeartClick = (anime) => {
    console.log('Added to favorites:', anime.title);
    // Add to favorites logic
  };

  const handleShareClick = (anime) => {
    console.log('Sharing:', anime.title);
    // Share logic
  };

  return (
    <section className="space-y-8 ">
      <div className="flex items-center justify-between">
        <h2 className="text-5xl font-black text-white  flex items-center gap-4">
          <Flame className="text-orange-500 animate-pulse" size={48} /> 
          Spotlight
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, idx) => (
            <div key={idx} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden animate-pulse">
              <div className="h-72 bg-gradient-to-br from-gray-800 to-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-700 rounded-lg"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-red-400 text-lg mb-4">{error}</div>
            <button
              onClick={fetchAnimeData}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transform transition-all hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Anime Grid */}
      {!loading && !error && featuredAnime.length > 0 && (
        <div className='flex items-center justify-center'>
 <div className="grid grid-cols-1 md:grid-cols-2  w-[90%] lg:grid-cols-3  xl:grid-cols-4 gap-6">
          {featuredAnime.map((anime, index) => (
            <div 
              key={anime.id} 
              className="group relative  bg-gray-900/30 cursor-pointer  backdrop-blur-sm rounded-2xl overflow-hidden hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-500/20"
            >
              {/* Spotlight Number */}
              <div className={`absolute top-4 left-4 z-20 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                Spotlight #{index + 1}
              </div>
              
              {/* Rating Badge */}
              {anime.rating && anime.rating !== 'N/A' && (
                <div className="absolute top-4 right-4 z-20 bg-gradient-to-r to-yellow-500 via-purple-500 from-red-500 text-white backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg"> 
                  <Star size={14} fill="currentColor" />
                  {anime.rating}
                </div>
              )}
              <div className="relative overflow-hidden">
                <img 
                  src={anime.image} 
                  alt={anime.title} 
                  className="w-full h-80 object-center object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x400/1f2937/9ca3af?text=No+Image';
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                {/* Status Badge */}
                <div className={`absolute bottom-4 left-4 ${getStatusColor(anime.status)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                  {getStatusText(anime.status)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {anime.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{anime.year || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Film size={14} />
                    <span>{anime.episodes || '?'} eps</span>
                  </div>
                </div>

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {anime.genres.slice(0, 2).map((genre, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gradient-to-r rounded-lg text-xs font-medium from-pink-600 to-purple-600 text-white transition-all cursor-pointer"
                      >
                        {genre}
                      </span>
                    ))}
                    {anime.genres.length > 2 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-xs font-medium">
                        +{anime.genres.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Studio */}
                {anime.studio && anime.studio !== 'Unknown Studio' && (
                  <p className="text-gray-400 text-sm font-medium">
                    Studio: <span className="text-gray-300">{anime.studio}</span>
                  </p>
                )}

                {/* Age Rating */}
                {anime.ageRating && (
                  <p className="text-gray-400 text-sm font-medium">
                    Age: <span className="text-gray-300">{anime.ageRating}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        </div>
       
      )}

      {/* Empty State */}
      {!loading && !error && featuredAnime.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-gray-400 text-lg">No anime found in spotlight</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Spotlight