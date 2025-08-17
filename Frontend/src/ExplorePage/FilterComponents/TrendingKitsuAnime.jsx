import { MonitorPlay, RefreshCcw } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Play,
  Calendar,
  Heart,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// TanStack Query hook for fetching anime data
const useAnimeData = (fetchFunction, limit = 10) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trending-anime", fetchFunction, limit],
    queryFn: () => fetchFunction(limit),
    enabled: !!fetchFunction,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    select: (result) => (Array.isArray(result) ? result.slice(0, 10) : []),
  });

  return {
    data: data || [],
    loading: isLoading,
    error: isError ? error?.message || "Failed to fetch anime data" : null,
    refetch,
  };
};

const TrendingAnime = ({
  fetchFunction,
  title = "Popular Anime",
  showViewAll = true,
  customClassName = "",
  onAnimeClick,
  onViewAllClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeAnimeId, setActiveAnimeId] = useState(null);
  const navigate = useNavigate();

  const { data: animeList, loading, error, refetch } = useAnimeData(
    fetchFunction,
    10
  );

  const handleMore = useCallback(
    (id) => {
      if (onAnimeClick) {
        onAnimeClick(id);
      } else {
        navigate(`/kitsu/${id}`);
      }
    },
    [onAnimeClick, navigate]
  );

  const handleViewAll = useCallback(() => {
    if (onViewAllClick) {
      onViewAllClick();
    }
  }, [onViewAllClick]);

  const transformedAnimeList = Array.isArray(animeList)
    ? animeList.map((anime, index) => {
        const attrs = anime?.attributes || {};
        return {
          id: anime?.id || `anime-${index}`,
          title:
            attrs.canonicalTitle ||
            attrs.titles?.en ||
            attrs.titles?.en_jp ||
            attrs.titles?.en_us ||
            "Untitled",
          synopsis: attrs.synopsis || "No synopsis available.",
          rating: attrs.averageRating
            ? parseFloat(attrs.averageRating) / 10
            : null,
          status: attrs.status,
          episodeCount: attrs.episodeCount,
          startDate: attrs.startDate,
          posterImage:
            attrs.posterImage?.large ||
            attrs.posterImage?.medium ||
            attrs.posterImage?.original,
          favoritesCount: attrs.favoritesCount,
          showType: attrs.showType,
          rank: index + 1,
        };
      })
    : [];

  const cardsPerSlide = 5;
  const slidesToShow = Math.max(
    1,
    Math.ceil(transformedAnimeList.length / cardsPerSlide)
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slidesToShow);
  }, [slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slidesToShow) % slidesToShow);
  }, [slidesToShow]);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "TBA";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const formatNumber = (num) => {
    if (!num || isNaN(num)) return "0";
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000)
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  useEffect(() => {
    if (currentSlide >= slidesToShow) {
      setCurrentSlide(0);
    }
  }, [slidesToShow, currentSlide]);

  return (
    <div
      className={`w-full px-2 mt-19 bg-slate-900  border-slate-800 ${customClassName}`}
    >
      <div className="flex items-center justify-between ml-6">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {showViewAll && (
          <button
            onClick={handleViewAll}
            className="flex items-center gap-2 hover:underline mr-6 text-white rounded-lg border border-gray-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg"
            type="button"
          >
            View All
          </button>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
            {Array.from({ length: cardsPerSlide }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-2xl animate-pulse overflow-hidden"
              >
                <div className="h-[280px] bg-gray-700 w-full"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 bg-slate-800/50 rounded-xl border border-slate-700/30 m-6">
            <p className="text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              type="button"
            >
              Retry
            </button>
          </div>
        ) : transformedAnimeList.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-slate-800/50 rounded-xl border border-slate-700/30 m-6">
            <p className="text-lg font-semibold">No anime found</p>
          </div>
        ) : (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-all duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: slidesToShow }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
                      {transformedAnimeList
                        .slice(
                          slideIndex * cardsPerSlide,
                          (slideIndex + 1) * cardsPerSlide
                        )
                        .map((anime) => (
                          <AnimeCard
                            key={anime.id}
                            anime={anime}
                            formatDate={formatDate}
                            formatNumber={formatNumber}
                            isHovered={hoveredCard === anime.id}
                            onMouseEnter={() => setHoveredCard(anime.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onPlayClick={(id) => {
                              setActiveAnimeId(id);
                              setTimeout(() => setActiveAnimeId(null), 500);
                              if (onAnimeClick) {
                                onAnimeClick(id);
                              } else {
                                navigate(`/anime/${id}`);
                              }
                            }}
                            activeAnimeId={activeAnimeId}
                            handleMore={handleMore}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {slidesToShow > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4  top-1/2 -translate-y-1/2 z-10 p-4 bg-black/70 text-white rounded-full hover:scale-110 hover:bg-black/80 transition-all duration-300 shadow-lg border border-gray-600/50"
                  type="button"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black/70 text-white rounded-full hover:scale-110 hover:bg-black/80 transition-all duration-300 shadow-lg border border-gray-600/50"
                  type="button"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const AnimeCard = ({
  anime,
  formatDate,
  formatNumber,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onPlayClick,
  activeAnimeId,
  handleMore,
}) => {
  const [imageError, setImageError] = useState(false);

  // Modified getStatusStyle to use green for finished
  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "current":
      case "ongoing":
        return "bg-green-800/30 text-green-400";
      case "finished":
        return "bg-green-800/30 text-green-400";
      case "upcoming":
      case "tba":
        return "bg-yellow-800/30 text-yellow-400";
      case "cancelled":
      case "canceled":
        return "bg-red-800/30 text-red-400";
      default:
        return "bg-gray-700/30 text-gray-300";
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayClick(anime.id);
  };

  return (
    <div
      className="relative bg-gray-900 rounded-2xl cursor-pointer overflow-hidden hover:shadow-xl transition-shadow group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${anime.title}`}
      onClick={() => handleMore(anime.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleMore(anime.id);
        }
      }}
      // style={{ height: "40vh" }}

    >
      {/* Full image */}
      <img
        src={imageError ? "error occurs" : anime.posterImage}
        alt={anime.title}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        loading="lazy"
        style={{ minHeight: "100%", minWidth: "100%" }}
      />

      <div className="absolute bottom-0  left-0 w-full z-10 pointer-events-none">
        <div className="w-full h-26 inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent " />
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 pointer-events-auto">
          <h3 className="font-bold text-lg text-white line-clamp-2 drop-shadow-md">
            {anime.title}
          </h3>
        </div>
      </div>

      {/* Rank badge (top left) */}
      {anime.rank && anime.rank <= 10 && (
        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold z-20">
          #{anime.rank}
        </div>
      )}

      {/* Play button overlay (center, on hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={handlePlayClick}
          className={`rounded-full p-4 border-4 border-white/30 bg-black/40 hover:bg-black/60 transition-transform ${
            activeAnimeId === anime.id ? "animate-pulse" : ""
          }`}
          aria-label="Play"
          type="button"
        >
          <Play className="w-5 h-5 text-white fill-white" />
        </button>
      </div>

      {/* Info badges (showType, status) - bottom left, above title overlay */}
      {/* <div className="absolute left-0 bottom-14 px-4 flex flex-wrap gap-2 text-xs text-gray-400 z-20">
        {anime.showType && (
          <span className="px-2 py-1 rounded-full bg-blue-800/30 text-blue-400 flex items-center gap-1">
            <MonitorPlay size={12} />
            {anime.showType}
          </span>
        )}
        {anime.status && (
          <span
            className={`px-2 py-1 rounded-full flex items-center gap-1 ${getStatusStyle(
              anime.status
            )}`}
          >
            {/* Remove icon for finished, keep for others */}
            {/* {anime.status &&
            (anime.status.toLowerCase() === "finished" ||
              anime.status.toLowerCase() === "completed") ? null : (
              <RefreshCcw size={12} />
            )}
            {anime.status}
          </span>
        )}
      </div> */} 

      {/* Hover overlay with details */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 p-4 z-30 flex flex-col justify-between backdrop-blur-sm rounded-2xl"
          >
            <div className="text-white text-xs space-y-2">
              <div className="font-bold text-sm">{anime.title}</div>
              <p className="line-clamp-3 text-gray-200">
                {anime.synopsis || "No synopsis available."}
              </p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={12} />{" "}
                  {anime.rating
                    ? `${parseFloat(anime.rating).toFixed(1)}/10`
                    : "N/A"}
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <Eye size={12} /> {anime.status || "N/A"}
                </div>
                <div className="flex items-center gap-1 text-blue-300">
                  <Calendar size={12} /> {formatDate(anime.startDate)}
                </div>
                <div className="flex items-center gap-1 text-pink-300">
                  <Heart size={12} /> {formatNumber(anime.favoritesCount)}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMore(anime.id);
              }}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
              type="button"
            >
              More Info
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrendingAnime;
