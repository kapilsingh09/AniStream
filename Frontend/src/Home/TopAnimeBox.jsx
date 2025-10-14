import React from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * 🌸 Clean + Compact TopAnimeBox
 * - Uses TanStack Query for caching
 * - Responsive, no extra/empty space in cards.
 * - Card heights and widths gently adapt to content.
 */
export default function TopAnimeBox({
  url,
  limit = 6,
  title = "Top Anime",
  className = "",
}) {
  // Fetch anime
  const fetchAnime = async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || data.results || [];
  };

  const {
    data: allAnime = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["animeList", url],
    queryFn: fetchAnime,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const anime = allAnime.slice(0, limit);

  return (
    <aside
      className={`w-full max-w-xl mx-auto ${className} rounded-lg`}
      aria-label="Top anime list"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
          <button
            // onClick={() => refetch()}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            count-{limit}
          </button>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-zinc-800/70 rounded-lg flex flex-row items-center p-2 min-h-[80px]"
              >
                <div className="bg-zinc-700 w-16 h-20 rounded-md mr-3 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-zinc-700 rounded w-3/4" />
                  <div className="h-3 bg-zinc-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-sm text-red-400 px-4 py-4 flex items-center justify-center mt-2">
            Error fetching anime: {error.message}
            <button
            onClick={() => refetch()}
            className="text-xs text-blue-400  hover:text-blue-300 underline"
          >
            Refresh
          </button>
          </div>
        )}

        {/* Anime List */}
        {!isLoading && !isError && (
          <div className="flex flex-col gap-2">
            {anime.map((a) => {
              const attr = a.attributes || {};
              const image =
                attr.posterImage?.medium ||
                attr.coverImage?.large ||
                a.images?.jpg?.large_image_url ||
                a.images?.jpg?.image_url;
              // Use only English title
              const engTitle =
                (attr.titles && (attr.titles.en || attr.titles.en_jp)) ||
                a.title_english ||
                a.title ||
                attr.canonicalTitle ||
                "";
              const type = attr.showType || a.type || "TV";
              const rating =
                attr.averageRating || a.score || a.rating || "";
              const genres =
                a.genres ||
                attr.genres ||
                attr.categories ||
                attr.categoryTitles ||
                [];

              return (
                <article
                  key={a.id || a.mal_id}
                  className="flex flex-row items-stretch bg-zinc-900/70 border border-white/10 rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:bg-zinc-800 transition-all duration-300 min-w-0"
                  style={{ minHeight: "80px" }}
                >
                  {/* Image */}
                  <div className="w-17 sm:w-24 aspect-[3/4] flex-shrink-0">
                    <img
                      src={image}
                      alt={engTitle}
                      className="object-cover w-full h-full block"
                      loading="lazy"
                      style={{
                        minWidth: "5rem",
                        minHeight: "100%",
                        maxHeight: "120px",
                        borderRadius: "0.25rem"
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 px-3 py-2 flex flex-col justify-center min-w-0">
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-white leading-tight line-clamp-2 break-words mb-1">
                        {engTitle}
                      </h3>
                      <div className="flex items-center text-xs text-gray-400 flex-wrap gap-x-2">
                        <span>{type.toUpperCase()}</span>
                        {a.episodes ? (
                          <span className="inline text-gray-400">{`• ${a.episodes} ep`}</span>
                        ) : null}
                        {rating && (
                          <span className="inline text-yellow-400">{rating}</span>
                        )}
                      </div>
                    </div>
                    {/* Genres */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Array.isArray(genres) && genres.length > 0 ? (
                        genres.slice(0, 2).map((g, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-purple-500/20 text-purple-200 whitespace-nowrap"
                          >
                            {/* Use only English name for genres if available */}
                            {g.name_en || g.english || g.name || g.title || g}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500">No genres</span>
                      )}
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
