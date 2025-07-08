import React, { useEffect, useState, useCallback } from "react";
import { RefreshCw, Star, Users, Eye } from "lucide-react";

// Kitsu API
import {
  fetchTrendingAnime,
  fetchActionAnime,
  fetchRomanceAnime,
  fetchComedyAnime,
  fetchDramaAnime,
  fetchFantasyAnime,
} from "../services/kitsuAnimeApi";

// Jikan API
import {
  FetchTrendingAnime as JikanTrendingAnime,
  FetchTopRatedAnime,
  FetchPopularAnime,
  FetchUpcomingAnime,
  FetchCurrentSeasonAnime,
} from "../services/JikhanAnimeApi";

// Filters with API info
const filters = [
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [animeData, setAnimeData] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAnimeData = useCallback(async (filter) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      switch (filter) {
        case "all": result = await fetchTrendingAnime(20); break;
        case "action": result = await fetchActionAnime(20); break;
        case "romance": result = await fetchRomanceAnime(20); break;
        case "comedy": result = await fetchComedyAnime(20); break;
        case "drama": result = await fetchDramaAnime(20); break;
        case "fantasy": result = await fetchFantasyAnime(20); break;
        case "trending": result = await JikanTrendingAnime(20); break;
        case "topRated": result = await FetchTopRatedAnime(20); break;
        case "airing": result = await FetchCurrentSeasonAnime(20); break;
        case "upcoming": result = await FetchUpcomingAnime(20); break;
        default: result = await fetchTrendingAnime(20);
      }
      setAnimeData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load anime. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleFilterClick = (value) => {
    if (value === activeFilter) {
      handleRefresh();
    } else {
      setActiveFilter(value);
    }
  };

  useEffect(() => {
    fetchAnimeData(activeFilter);
  }, [activeFilter, refreshKey, fetchAnimeData]);

  const getAnimeInfo = (anime, source) => {
    if (source === "kitsu") {
      const attrs = anime.attributes;
      return {
        id: anime.id,
        title: attrs.canonicalTitle || "Untitled",
        image: attrs.posterImage?.original || attrs.posterImage?.large,
        type: attrs.subtype,
        episodes: attrs.episodeCount,
        rating: attrs.averageRating ? `${(attrs.averageRating / 10).toFixed(1)}/10` : "N/A",
        status: attrs.status,
        synopsis: attrs.synopsis,
        startDate: attrs.startDate,
        popularityRank: attrs.popularityRank,
        ratingRank: attrs.ratingRank,
        ageRating: attrs.ageRating,
      };
    } else {
      return {
        id: anime.mal_id,
        title: anime.title || anime.title_english || "Untitled",
        image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
        type: anime.type,
        episodes: anime.episodes,
        rating: anime.score ? `${anime.score}/10` : "N/A",
        status: anime.status,
        synopsis: anime.synopsis,
        startDate: anime.aired?.from,
        popularityRank: anime.popularity,
        ratingRank: anime.rank,
        members: anime.members,
        genres: anime.genres,
        year: anime.year,
      };
    }
  };

  const formatDate = (date) => {
    if (!date) return "TBA";
    return new Date(date).getFullYear();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "currently airing":
      case "current": return "bg-green-500 text-white";
      case "upcoming":
      case "not yet aired": return "bg-blue-500 text-white";
      case "finished":
      case "finished airing": return "bg-gray-500 text-white";
      default: return "bg-purple-500 text-white";
    }
  };

  const currentFilter = filters.find(f => f.value === activeFilter);
  const apiSource = currentFilter?.api || "kitsu";

  // ✅ Filter out duplicates
  const seenIds = new Set();
  const uniqueAnimeData = animeData.filter((anime) => {
    const info = getAnimeInfo(anime, apiSource);
    const uniqueId = `${apiSource}-${info.id}`;
    if (seenIds.has(uniqueId)) return false;
    seenIds.add(uniqueId);
    return true;
  });

  return (
    <div className="min-h-screen  bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">Anime Collection</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 bg-gray-800 p-4 rounded-lg">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterClick(filter.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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

        {/* <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>{currentFilter?.icon}</span>
            {currentFilter?.label}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div> */}

        {/* <div className="bg-gray-800 rounded-lg p-6">
          {loading && (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
              <p>Loading anime...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-red-400">
              <p>{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && uniqueAnimeData.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Eye className="w-12 h-12 mx-auto mb-2" />
              No anime found
            </div>
          )}

          {!loading && uniqueAnimeData.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {uniqueAnimeData.map((anime) => {
                  const info = getAnimeInfo(anime, apiSource);
                  return (
                    <div
                      key={info.id}
                      className="bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                      onClick={() => setSelectedAnime(info)}
                    >
                      <div className="relative aspect-[3/4]">
                        <img
                          src={info.image}
                          alt={info.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x400/4a5568/cbd5e0?text=No+Image";
                          }}
                        />
                        <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${getStatusColor(info.status)}`}>
                          {info.status}
                        </span>
                        {info.ratingRank && info.ratingRank <= 100 && (
                          <span className="absolute top-2 left-2 px-2 py-1 text-xs bg-yellow-500 text-black rounded font-bold">
                            #{info.ratingRank}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium mb-2 line-clamp-2">{info.title}</h3>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{info.type}</span>
                          <span>{info.episodes || "?"} eps</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-white">{info.rating}</span>
                          </div>
                          {info.members && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Users className="w-3 h-3" />
                              <span>{(info.members / 1000).toFixed(0)}k</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </>
          )}
        </div> */}

        {/* Modal */}
        {/* {selectedAnime && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAnime(null)}>
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedAnime.title}</h2>
                  <button className="text-2xl text-gray-400 hover:text-white" onClick={() => setSelectedAnime(null)}>×</button>
                </div>
                <div className="flex gap-4 mb-4">
                  <img src={selectedAnime.image} alt={selectedAnime.title} className="w-32 h-44 object-cover rounded" />
                  <div className="flex-1 text-sm space-y-2">
                    <p><strong>Type:</strong> {selectedAnime.type}</p>
                    <p><strong>Episodes:</strong> {selectedAnime.episodes || "N/A"}</p>
                    <p><strong>Rating:</strong> {selectedAnime.rating}</p>
                    <p><strong>Status:</strong> {selectedAnime.status}</p>
                    {selectedAnime.startDate && <p><strong>Year:</strong> {formatDate(selectedAnime.startDate)}</p>}
                    {selectedAnime.ageRating && <p><strong>Age Rating:</strong> {selectedAnime.ageRating}</p>}
                  </div>
                </div>
                {selectedAnime.synopsis && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Synopsis</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedAnime.synopsis}</p>
                  </>
                )}
                {selectedAnime.genres?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnime.genres.map((g, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-600 rounded">{g.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FeaturedSection;
