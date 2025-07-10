import { useState, useEffect } from "react";
import { Star, Calendar, Play, Users, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Genres from "../utils/Geners";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);
  const genreColors = [
    "bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-green-500",
    "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-teal-500",
    "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-lime-500",
    "bg-cyan-500", "bg-fuchsia-500", "bg-violet-500", "bg-emerald-500",
  ];

  const fetchSearchResults = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setAnimeData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&order_by=score&sort=desc&limit=20`
      );
      if (!response.ok) throw new Error("Failed to fetch search results");
      const data = await response.json();
      setAnimeData(data.data || []);
      setTotalResults(data.pagination?.items?.total || 0);
      setVisibleCount(12);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setAnimeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(query);
  }, [query]);

  const renderSkeletonCard = () => (
    <div className="animate-pulse">
      <div className="bg-slate-900 rounded-xl overflow-hidden">
        <div className="h-56 bg-white/20"></div>
        <div className="p-3">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-3/4 mb-3"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-white/20 rounded w-16"></div>
            <div className="h-3 bg-white/20 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-slate-900    mt-14 pl-20 pr-20">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Search className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-4xl font-bold text-white">Search Results</h1>
              {query && (
                <p className="text-white/70 text-lg mt-1">
                  "{query}" - {totalResults} results found
                </p>
              )}
            </div>
          </div>
          {/* <h2 className="text-white text-3xl font-bold">Genres</h2> */}
        </div>

        {!query.trim() && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70 text-xl">No search query provided</p>
          </div>
        )}

        {query.trim() && (
          <div className="flex gap-6">
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i}>{renderSkeletonCard()}</div>
                  ))}
                </div>
              ) : animeData.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-xl">
                    No anime found for "{query}"
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-6 bg-slate-900 gap-6">
                    {animeData.slice(0, visibleCount).map((anime, i) => {
                      const title = anime.title_english || anime.title || "Unknown Title";
                      const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
                      const score = anime.score?.toFixed(1) || "N/A";
                      const year = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null);
                      const episodes = anime.episodes || "?";
                      const status = anime.status || "Unknown";
                      const members = anime.members || 0;

                      return (
                        <div
                          key={anime.mal_id || i}
                          className="group relative cursor-pointer bg-slate-800   backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                        >
                          <div className="relative overflow-hidden">
                              <div className="h-56 w-full bg-black ">

                            <img
                              src={image}
                              alt={title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/300x400/1f2937/6b7280?text=No+Image";
                              }}
                            />
                              </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {year && (
                              <div className="absolute top-2 left-2 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                {year}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {score}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="rounded-full p-4 border-4 border-white/30 transform scale-75 px-6 py-6 group-hover:scale-100 transition-transform duration-300">
                                <Play className="w-4 h-4 scale-220 text-white fill-white" />
                              </div>
                            </div>
                          </div>

                          <div className="p-3">
                            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 leading-snug group-hover:text-gray-300 transition-colors duration-300">
                              {title}
                            </h3>

                            {/* 🎨 Genre Tags */}
                            {anime.genres && (
                              <div className="flex flex-wrap gap-1 mt-2 mb-1">
                                {anime.genres.map((genre, index) => {
                                  const color = genreColors[index % genreColors.length];
                                  return (
                                    <span
                                      key={genre.mal_id}
                                      className={`text-[10px] text-white px-2 py-0.5 rounded-full ${color}`}
                                    >
                                      {genre.name}
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                              <div className="flex items-center gap-1">
                                <Play className="w-3 h-3" />
                                <span>{episodes} eps</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>
                                  {members > 1000
                                    ? `${Math.round(members / 1000)}k`
                                    : members}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  status === "Finished Airing"
                                    ? "bg-green-500/20 text-green-400"
                                    : status === "Currently Airing"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {status}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-white/70">
                                <Calendar className="w-3 h-3" />
                                <span>{year || "TBA"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {animeData.length > visibleCount && (
                    <div className="w-full mt-4 flex justify-center">
                      <button
                        className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                        onClick={() => setVisibleCount(animeData.length)}
                      >
                        Show More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Sidebar */}
            {/* <div className="w-[25%]">
              <Genres />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
