import { useState, useRef, useEffect } from "react";
import { Star, Calendar, Play, Users } from "lucide-react";
import Genres from "../utils/Geners";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GenreList from "../utils/Geners";

/**
 * How to use AnimeGrid
 * --------------------
 * AnimeGrid is a reusable React component for displaying a grid of anime cards.
 * You use it when you want to show a list of anime fetched from an API, with hover previews and genre tags.
 * 
 * What you need:
 * - An API fetch function that returns a Promise resolving to an array of anime objects (from Kitsu API or similar).
 * - Optionally, a unique queryKey for react-query caching.
 * - (Optional) A title for the grid section.
 * 
 * Example API fetch function (using kitsuAnimeApi):
 * 
 * // In your services/kitsuAnimeApi.jsx:
 *
 * 
 * How to use AnimeGrid in your component:
 * 
 * import AnimeGrid from './AnimeGrid';
 * import { fetchRomanceAnime } from '../services/kitsuAnimeApi';
 * 
 * function RomanceSection() {
 *   return (
 *     <AnimeGrid
 *       fetchFn={fetchRomanceAnime}
 *       queryKey={["romance-anime"]}
 *       title="Romance Anime"
 *     />
 *   );
 * }
 * 
 * // You can use AnimeGrid for any genre or custom API function:
 * // <AnimeGrid fetchFn={fetchActionAnime} queryKey={["action-anime"]} title="Action Anime" />
 */
const AnimeGrid = ({
  fetchFn,
  queryKey = ["anime-grid"],
  title = "Anime",
  showGenres = true,
  skeletonCount = 8,
  staleTime = 1000 * 60 * 10,
  cacheTime = 1000 * 60 * 30,
}) => {
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimerRef = useRef(null);

  const navigate = useNavigate();

  const genreColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-cyan-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-500',
  ];

  // Use TanStack Query for fetching and caching
  const { data: animeData = [], isLoading: loading } = useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime,
    cacheTime,
  });

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (anime, e) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredAnime(anime);
    setHoverPosition({ x: e.clientX + 20, y: e.clientY - 20 });
  };

  const handleMouseMove = (e) => {
    setHoverPosition({ x: e.clientX + 20, y: e.clientY - 20 });
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setHoveredAnime(null);
    }, 200); // Reduce delay to 200ms for better UX
  };

  const renderSkeletonCard = () => (
    <div className="animate-pulse">
      <div className="bg-white/10 rounded-xl overflow-hidden">
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
    <div className="min-h-screen p-6">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <div
              className="
                grid gap-6
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-5
                2xl:grid-cols-6

              "
            >
              {loading || animeData.length === 0
                ? [...Array(skeletonCount)].slice(0,8).map((_, i) => <div key={i}>{renderSkeletonCard()}</div>)
                : animeData.map((anime, i) => {
                    const animeTitle =
                      anime.title_english ||
                      anime.title ||
                      anime.attributes?.titles?.en_jp ||
                      anime.attributes?.canonicalTitle ||
                      "Unknown Title";
                    const image =
                      anime.images?.jpg?.large_image_url ||
                      anime.images?.jpg?.image_url ||
                      anime.attributes?.coverImage?.original ||
                      anime.attributes?.posterImage?.original;
                    // Fix: .toFixed(1) only if value is a number
                    const score =
                      typeof anime.score === "number"
                        ? anime.score.toFixed(1)
                        : typeof anime.attributes?.averageRating === "string"
                        ? parseFloat(anime.attributes.averageRating).toFixed(1)
                        : "N/A";
                    const year =
                      anime.year ||
                      (anime.attributes?.startDate
                        ? anime.attributes.startDate.split('-')[0]
                        : undefined) ||
                      (anime.aired?.from
                        ? new Date(anime.aired.from).getFullYear()
                        : null);
                    const episodes = anime.episodes || anime.attributes?.episodeCount || "?";
                    const status = anime.status || anime.attributes?.status || "Unknown";
                    const members = anime.members || anime.attributes?.userCount || 0;
                    const animeId = anime.mal_id || anime.id;
                    // Fix: genres array and keys
                    let genres = [];
                    if (Array.isArray(anime.genres) && anime.genres.length > 0) {
                      genres = anime.genres.map((g, idx) => ({
                        mal_id: g.mal_id || g.id || idx,
                        name: g.name || g.title || g.attributes?.title || g.attributes?.name || "Unknown"
                      }));
                    } else if (
                      anime.attributes?.categories &&
                      Array.isArray(anime.attributes.categories.data)
                    ) {
                      genres = anime.attributes.categories.data.map((cat, idx) => ({
                        mal_id: cat.id || idx,
                        name: cat.attributes?.title || cat.attributes?.name || "Unknown"
                      }));
                    }

                    return (
                      <div
                        key={animeId || i}
                        className="group relative cursor-pointer bg-slate-900 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                        onMouseEnter={(e) => handleMouseEnter(anime, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => navigate(`/play/${animeId}`)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={image}
                            alt={animeTitle}
                            className="w-full h-56 object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={e => { e.target.src = "/fallback.jpg"; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {year && (
                            <div className="absolute top-2 left-2 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-2xl shadow-md flex items-center gap-1">
                              # {year}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {score}
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="rounded-full p-4 border-4 border-white/30 transform scale-75 px-6 py-6 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-7 h-7 text-white fill-white" />
                            </div>
                          </div>
                        </div>

                        <div className="p-3">
                          <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 leading-snug group-hover:text-gray-300 transition-colors duration-300">
                            {animeTitle}
                          </h3>

                          {/* Genre Tags */}
                          {genres && genres.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2 mb-1">
                              {genres.slice(0, 3).map((genre, index) => {
                                const color = genreColors[index % genreColors.length];
                                return (
                                  <span
                                    key={genre.mal_id || genre.name || index}
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
                              className={`text-[10px] px-2 py-0.5 rounded-full ${status === "Finished Airing"
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
          </div>
     
        </div>
      </div>
    </div>
  );
};

export default AnimeGrid;
