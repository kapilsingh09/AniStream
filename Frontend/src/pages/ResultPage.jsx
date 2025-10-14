import React, { useState } from "react";
import { Star, Calendar, Play, Users, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const fetchSearchResults = async (searchQuery, page) => {
  if (!searchQuery.trim()) {
    return { data: [], pagination: { items: { total: 0 }, last_visible_page: 1 } };
  }
  const response = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
      searchQuery
    )}&order_by=score&sort=desc&limit=12&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to fetch search results");
  return response.json();
};

const ResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(1);
  const [paginationWindow, setPaginationWindow] = useState(4);

  const genreColors = [
    "bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-green-500",
    "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-teal-500",
    "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-lime-500",
    "bg-cyan-500", "bg-fuchsia-500", "bg-violet-500", "bg-emerald-500",
  ];

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchResults", query, page],
    queryFn: () => fetchSearchResults(query, page),
    enabled: !!query.trim(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    keepPreviousData: true
  });

  const animeData = data?.data || [];
  const totalResults = data?.pagination?.items?.total || 0;
  const totalPages = data?.pagination?.last_visible_page || 1;

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

  // Calculate which page numbers to show
  let startPage = 1;
  let endPage = Math.min(totalPages, paginationWindow);

  // If current page is near the end, shift the window
  if (page > endPage) {
    startPage = page - Math.floor(paginationWindow / 2);
    endPage = startPage + paginationWindow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - paginationWindow + 1);
    }
  }

  // On click, set page and if 3rd button, increase window size
  const handlePageClick = (clickedPage, idxInWindow) => {
    setPage(clickedPage);
    // If the user clicks on the 3rd button (index 2 in window), increase window size by 2
    if (idxInWindow === 2 && paginationWindow < totalPages) {
      setPaginationWindow((prev) => Math.min(prev + 2, totalPages));
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 mt-14 pl-20 pr-20">
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
              {isLoading ? (
                <div className="grid grid-cols-6 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i}>{renderSkeletonCard()}</div>
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-xl">
                    Failed to fetch search results.
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Please try again later.
                  </p>
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
                  <div className="grid  md:grid-cols-4 grid-cols-6 xl:grid-cols-6 bg-slate-900 gap-6">
                    {animeData.map((anime, i) => {
                      const title = anime.title_english || anime.title || "Unknown Title";
                      const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
                      const score = typeof anime.score === "number" ? anime.score.toFixed(1) : "N/A";
                      const year = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null);
                      const episodes = anime.episodes || "?";
                      const status = anime.status || "Unknown";
                      const members = anime.members || 0;

                      return (
                        <div
                          key={anime.mal_id || i}
                          onClick={()=>(navigate(`/play/${anime.mal_id}`))}
                          className="group relative cursor-pointer bg-slate-800 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                        >
                          <div className="relative overflow-hidden">
                            <div className="h-56 w-full bg-black">
                              <img
                                src={image}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {year && (
                              <div className="absolute top-2 left-2  text-xm   flex text-xs  items-center gap-1  bg-blue-500 text-white font-semibold  px-2 py-1 rounded-lg backdrop-blur-sm">
                                <Calendar size={12} />
                                {year}
                              </div>
                            )}
                            <div className="absolute top-2 right-2  text-xm   flex text-xs  items-center gap-1  bg-red-500 text-white font-semibold  px-2 py-1 rounded-lg backdrop-blur-sm">
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

                            {/* Genre Tags */}
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
                              {/* <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>
                                  {members > 1000
                                    ? `${Math.round(members / 1000)}k`
                                    : members}
                                </span>
                              </div> */}
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
                  
                  {/* Pagination */}
                 <div className="flex justify-center mt-8 space-x-2 flex-wrap">
  {/* Prev Button */}
  <button
    onClick={() => handlePageClick(page - 1)}
    disabled={page === 1}
    className="flex items-center gap-1 px-3 py-1 border hover:cursor-pointer border-purple-500/50 rounded-full 
               text-white/70 bg-transparent hover:bg-purple-500/10 
               transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    <ChevronLeft size={25} className="flex items-center justify-center" />
    {/* Prev */}
  </button>

  {/* Page Number Buttons */}
  {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
    const pageNum = startPage + idx;
    return (
      <button
        key={pageNum}
        onClick={() => handlePageClick(pageNum, idx)}
        className={`transition-all duration-200 hover:cursor-pointer font-semibold border rounded-full h-10 w-10
          ${
            pageNum === page
              ? "bg-white/20 box-border border scale-105"
              : "border-purple-500/50 bg-transparent text-white/70 hover:bg-purple-500/10"
          }
        `}
      >
        {pageNum}
      </button>
    );
  })}

  {/* Ellipsis */}
  {endPage < totalPages && (
    <span className="mx-2 text-white/40 text-lg font-bold select-none">...</span>
  )}

  {/* Next Button */}
  <button
    onClick={() => handlePageClick(page + 1)}
    disabled={page === totalPages}
    className="flex items-center justify-center gap-1 hover:cursor-pointer p-1 h-10 w-10 border border-purple-500/50 rounded-full 
               text-white/70 bg-transparent hover:bg-purple-500/10 
               transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {/* Next */}
    <ChevronRight size={25} />
  </button>
</div>
                  
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
