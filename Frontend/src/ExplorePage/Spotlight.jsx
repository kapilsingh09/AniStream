import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight, Play, Heart, Share2 } from 'lucide-react';
import { fetchTrendingAnime, fetchPopularAnime, fetchTopRatedAnime } from '../services/anilistApi';

const Spotlight = () => {
  const [featuredAnime, setFeaturedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('trending');

  const categories = [
    { id: 'trending', label: 'Trending', icon: '🔥', fetchFn: fetchTrendingAnime },
    { id: 'popular', label: 'Popular', icon: '⭐', fetchFn: fetchPopularAnime },
    { id: 'topRated', label: 'Top Rated', icon: '🏆', fetchFn: fetchTopRatedAnime },
  ];

  const fetchAnimeData = async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      const categoryData = categories.find(cat => cat.id === category);
      if (!categoryData) return;
      
      const data = await categoryData.fetchFn(8); // Fetch 8 anime for spotlight
      setFeaturedAnime(data);
    } catch (err) {
      console.error('Error fetching anime:', err);
      setError('Failed to fetch anime data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeData(activeCategory);
  }, [activeCategory]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
      case 'currently airing':
        return 'bg-green-600';
      case 'not yet released':
      case 'not yet aired':
        return 'bg-blue-600';
      case 'finished':
      case 'finished airing':
        return 'bg-gray-600';
      default:
        return 'bg-purple-600';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'Ongoing';
      case 'not yet released':
        return 'Upcoming';
      case 'finished':
        return 'Completed';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <div>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Flame className="text-orange-500" /> Featured Spotlight
          </h2>
          <button className="flex items-center gap-2 text-pink-400 hover:text-pink-300">
            View All <ChevronRight />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl animate-pulse">
                <div className="h-64 bg-gray-800"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-800 rounded"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <p className="mb-4">{error}</p>
              <button
                onClick={() => fetchAnimeData(activeCategory)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Anime Grid */}
        {!loading && !error && featuredAnime.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredAnime.map((anime) => (
              <div key={anime.id} className="group bg-gray-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img 
                    src={anime.image} 
                    alt={anime.title} 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400/4a5568/cbd5e0?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2 mb-2">
                        <button className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors">
                          <Play size={16} />
                        </button>
                        <button className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition-colors">
                          <Heart size={16} />
                        </button>
                        <button className="bg-gray-800/80 p-2 rounded-full hover:bg-gray-700 transition-colors">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {anime.rating && anime.rating !== 'N/A' && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                      ★ {anime.rating}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">{anime.title}</h3>
                  <div className="flex justify-between text-sm text-gray-400 mb-4">
                    <span>{anime.year || 'TBA'}</span>
                    <span>{anime.episodes || '?'} eps</span>
                    <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(anime.status)}`}>
                      {getStatusText(anime.status)}
                    </span>
                  </div>
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {anime.genres.slice(0, 2).map((genre, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                          {genre}
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                          +{anime.genres.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  {anime.studio && anime.studio !== 'Unknown' && (
                    <p className="text-gray-400 text-sm">Studio: {anime.studio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && featuredAnime.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 bg-gray-800/20 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
              <p>No anime found for this category</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Spotlight;

