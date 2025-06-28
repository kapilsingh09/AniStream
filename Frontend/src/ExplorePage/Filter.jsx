import { Filter, Star, Play, Calendar, Eye, Sparkles, RefreshCw, Clock, Users, Globe } from "lucide-react";
import React, { useEffect, useState } from "react";

// Import Kitsu API functions
import {
  fetchTrendingAnime,
  fetchActionAnime,
  fetchRomanceAnime,
  fetchComedyAnime,
  fetchDramaAnime,
  fetchFantasyAnime,
} from "../services/kitsuAnimeApi";

// Import Jikan API functions
import {
  FetchTrendingAnime as JikanTrendingAnime,
  FetchTopRatedAnime,
  FetchPopularAnime,
  FetchUpcomingAnime,
  FetchCurrentSeasonAnime,
  SearchAnime,
} from "../services/JikhanAnimeApi";

const filters = [
  {label:"wait"},
  { label: "All", value: "all", api: "kitsu", icon: "🎬" },
  { label: "Trending", value: "trending", api: "jikan", icon: "🔥" },
  { label: "Top Rated", value: "topRated", api: "jikan", icon: "⭐" },
  { label: "Currently Airing", value: "airing", api: "jikan", icon: "📺" },
  { label: "Upcoming", value: "upcoming", api: "jikan", icon: "🗓️" },
  { label: "Action", value: "action", api: "kitsu", icon: "⚔️" },
  { label: "Romance", value: "romance", api: "kitsu", icon: "💕" },
  { label: "Comedy", value: "comedy", api: "kitsu", icon: "😂" },
  { label: "Drama", value: "drama", api: "kitsu", icon: "🎭" },
  { label: "Fantasy", value: "fantasy", api: "kitsu", icon: "✨" },
];

const FeaturedSection = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAnimeData, setCurrentAnimeData] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);

  const fetchAnimeData = async (filterValue) => {
    console.log(`🔄 Fetching data for ${filterValue}`);
    setLoading(true);
    setError(null);

    try {
      let result;
      switch (filterValue) {
        case "all":
          result = await fetchTrendingAnime(20);
          break;
        case "action":
          result = await fetchActionAnime(20);
          break;
        case "romance":
          result = await fetchRomanceAnime(20);
          break;
        case "comedy":
          result = await fetchComedyAnime(20);
          break;
        case "drama":
          result = await fetchDramaAnime(20);
          break;
        case "fantasy":
          result = await fetchFantasyAnime(20);
          break;
        case "trending":
          result = await JikanTrendingAnime(20);
          break;
        case "topRated":
          result = await FetchTopRatedAnime(20);
          break;
        case "airing":
          result = await FetchCurrentSeasonAnime(20);
          break;
        case "upcoming":
          result = await FetchUpcomingAnime(20);
          break;
        default:
          result = '';
      }
      setCurrentAnimeData(result);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setError("Failed to fetch anime data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAnimeData(activeFilter);
  };

  useEffect(() => {
    fetchAnimeData(activeFilter);
  }, [activeFilter]);

  const getAnimeInfo = (anime, apiSource) => {
    if (apiSource === "kitsu") {
      return {
        id: anime.id,
        title: anime.attributes.canonicalTitle || anime.attributes.titles?.en_jp || anime.attributes.titles?.en || "Unknown Title",
        image: anime.attributes.posterImage?.original || anime.attributes.posterImage?.large,
        type: anime.attributes.subtype,
        episodes: anime.attributes.episodeCount,
        rating: anime.attributes.averageRating ? `${(anime.attributes.averageRating / 10).toFixed(1)}/10` : 'N/A',
        status: anime.attributes.status,
        synopsis: anime.attributes.synopsis,
        startDate: anime.attributes.startDate,
        popularityRank: anime.attributes.popularityRank,
        ratingRank: anime.attributes.ratingRank,
        ageRating: anime.attributes.ageRating
      };
    } else {
      return {
        id: anime.mal_id,
        title: anime.title || anime.title_english || "Unknown Title",
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        type: anime.type,
        episodes: anime.episodes,
        rating: anime.score ? `${anime.score}/10` : 'N/A',
        status: anime.status,
        synopsis: anime.synopsis,
        startDate: anime.aired?.from,
        popularityRank: anime.popularity,
        ratingRank: anime.rank,
        members: anime.members,
        genres: anime.genres,
        year: anime.year
      };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'current':
      case 'currently airing':
        return 'bg-green-500 text-white';
      case 'upcoming':
      case 'not yet aired':
        return 'bg-blue-500 text-white';
      case 'finished':
      case 'finished airing':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-purple-500 text-white';
    }
  };

  const currentFilter = filters.find(f => f.value === activeFilter);
  const apiSource = currentFilter?.api || "kitsu";

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Anime Collection
          </h1>
          <p className="text-gray-400">
            Discover amazing anime from multiple sources
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>{currentFilter?.icon}</span>
            {currentFilter?.label}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-800 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Loading...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-400 bg-red-900/20 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
                <p className="mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && currentAnimeData.length === 0 && (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No anime found</p>
            </div>
          )}

          {!loading && currentAnimeData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {currentAnimeData.map((anime) => {
                const animeInfo = getAnimeInfo(anime, apiSource);
                return (
                  <div
                    key={animeInfo.id}
                    className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => setSelectedAnime(animeInfo)}
                  >
                    <div className="relative aspect-[3/4]">
                      <img
                        src={animeInfo.image}
                        alt={animeInfo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400/4a5568/cbd5e0?text=No+Image';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(animeInfo.status)}`}>
                          {animeInfo.status}
                        </span>
                      </div>
                      {animeInfo.ratingRank && animeInfo.ratingRank <= 100 && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded font-bold">
                            #{animeInfo.ratingRank}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="font-medium text-white text-sm mb-2 line-clamp-2">
                        {animeInfo.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>{animeInfo.type}</span>
                        <span>{animeInfo.episodes || '?'} eps</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs font-medium">{animeInfo.rating}</span>
                        </div>
                        {animeInfo.members && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Users className="w-3 h-3" />
                            <span className="text-xs">{(animeInfo.members / 1000).toFixed(0)}k</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && currentAnimeData.length > 0 && (
            <div className="mt-6 text-center text-gray-400 text-sm">
              Showing {currentAnimeData.length} anime from {apiSource.toUpperCase()}
            </div>
          )}
        </div>

        {/* Simple Modal */}
        {selectedAnime && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAnime(null)}>
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedAnime.title}</h2>
                  <button
                    onClick={() => setSelectedAnime(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex gap-4 mb-4">
                  <img
                    src={selectedAnime.image}
                    alt={selectedAnime.title}
                    className="w-32 h-44 object-cover rounded"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2">{selectedAnime.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Episodes:</span>
                        <span className="text-white ml-2">{selectedAnime.episodes || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rating:</span>
                        <span className="text-white ml-2">{selectedAnime.rating}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white ml-2">{selectedAnime.status}</span>
                      </div>
                      {selectedAnime.startDate && (
                        <div>
                          <span className="text-gray-400">Year:</span>
                          <span className="text-white ml-2">{formatDate(selectedAnime.startDate)}</span>
                        </div>
                      )}
                      {selectedAnime.ageRating && (
                        <div>
                          <span className="text-gray-400">Age Rating:</span>
                          <span className="text-white ml-2">{selectedAnime.ageRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedAnime.synopsis && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedAnime.synopsis}</p>
                  </div>
                )}
                
                {selectedAnime.genres && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnime.genres.map((genre, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedSection;