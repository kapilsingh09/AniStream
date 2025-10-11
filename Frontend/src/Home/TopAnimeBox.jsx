import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

/**
 * TopAnimeBox (React Query version)
 * - Caches API responses for 1 hour
 * - Handles both Kitsu and Jikan formats
 * - Horizontal responsive cards
 */
export default function TopAnimeBox({
  url,
  limit = 6,
  title = "Top Anime",
  className = "",
}) {
  // 🔥 Fetch function
  const fetchAnime = async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || data.results || [];
  };

  // ⚙️ TanStack Query hook
  const {
    data: allAnime = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["animeList", url],
    queryFn: fetchAnime,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const anime = allAnime.slice(0, limit);

  return (
    <aside className={`h-full overflow-auto ${className}`} aria-label="Top anime list">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={() => refetch()}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Refresh
          </button>
        </div>

        {/* 🌀 Loading Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-800 rounded-lg h-28 flex items-center p-3"
              >
                <div className="bg-gray-700 w-24 h-24 rounded-md mr-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ❌ Error */}
        {isError && (
          <div className="text-sm text-red-400 mt-2">
            Error fetching anime: {error.message}
          </div>
        )}

        {/* ✅ Anime List */}
        {!isLoading && !isError && (
          <div className="space-y-4">
            {anime.map((a) => {
              const attr = a.attributes || {};
              const image =
                attr.posterImage?.medium ||
                attr.coverImage?.large ||
                a.images?.jpg?.large_image_url ||
                a.images?.jpg?.image_url;
              const title = attr.titles?.en || attr.canonicalTitle || a.title;
              const rating =
                attr.averageRating ||
                a.score ||
                a.rating ||
                attr.popularityRank;
              const type = attr.showType || a.type || "TV";
              const genres =
                a.genres ||
                attr.genres ||
                attr.categories ||
                attr.categoryTitles ||
                [];

              return (
                <article
                  key={a.id || a.mal_id}
                  className="flex flex-col sm:flex-row items-stretch bg-zinc-800 hover:bg-white/20 
                            border border-white/10 rounded-xl overflow-hidden shadow-md 
                            hover:shadow-lg transition-all duration-300"
                >
                  {/* Left: Image */}
                  <div className="sm:w-32 md:w-40 flex-shrink-0 relative">
                    <img
                      src={image}
                      alt={title}
                      className="object-cover w-full h-full sm:h-40"
                      loading="lazy"
                    />
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {type.toUpperCase()}{" "}
                        {a.episodes ? `• ${a.episodes} ep` : ""}
                      </p>
                    </div>

                    {/* Genres */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Array.isArray(genres) && genres.length > 0 ? (
                        genres.slice(0, 3).map((g, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-200"
                          >
                            {g.name || g.title || g}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No genres</span>
                      )}
                    </div>

                    {/* Rating + Details link */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{rating ? `${rating}/100` : "N/A"}</span>
                      </div>
                      <a
                        href={
                          a.url ||
                          `https://kitsu.io/anime/${a.id || attr.slug || ""}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
