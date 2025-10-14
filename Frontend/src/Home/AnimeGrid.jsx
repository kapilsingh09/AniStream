  import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Star, Calendar, Play, Users } from "lucide-react";

const AnimeGrid = ({
  fetchFn,
  queryKey = ["anime-grid"],
  title = "Anime",
  showGenres = true,
  skeletonCount = 8,
  staleTime = 1000 * 60 * 10,
  cacheTime = 1000 * 60 * 30,
}) => {
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

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case "finished airing":
      case "finished":
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "currently airing":
      case "ongoing":
      case "publishing":
        return "bg-blue-500/20 text-blue-400";
      case "not yet aired":
      case "tba":
      case "upcoming":
        return "bg-yellow-500/20 text-yellow-400";
      case "hiatus":
        return "bg-orange-500/20 text-orange-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  }

  const renderSkeletonCard = () => (
    <div>
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
    <div className="min-h-screen p-6 px-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">{title}</h1>
        </div>
        {/* NO flex, NO responsive grid */}
        <div>
          <div>
            <div className="grid gap-4 grid-cols-4">
              {(loading || animeData.length === 0
                ? [...Array(skeletonCount)].slice(0, 8).map((_, i) => <div key={i}>{renderSkeletonCard()}</div>)
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
                        className="bg-zinc-900/70 rounded-xl overflow-hidden border border-white/10 transition-all duration-300 cursor-pointer hover:border-white/40"
                        onClick={() => navigate(`/play/${animeId}`)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={image}
                            alt={animeTitle}
                            className="w-full h-56 object-cover object-center"
                            loading="lazy"
                            onError={e => { e.target.src = "/fallback.jpg"; }}
                          />
                          {year && (
                            <div className="absolute top-2 left-2 bg-zinc-900/70 text-white text-[10px] font-bold px-2 py-1 rounded-2xl shadow-md flex items-center gap-1">
                              # {year}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {score}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 leading-snug">
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
                              className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(status)}`}
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
                }))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeGrid;
