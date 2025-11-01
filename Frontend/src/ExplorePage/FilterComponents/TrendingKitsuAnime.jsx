import { MonitorPlay, RefreshCcw } from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
    select: (result) => (Array.isArray(result) ? result.slice(0, limit) : []),
  });

  return {
    data: data || [],
    loading: isLoading,
    error: isError ? error?.message || "Failed to fetch anime data" : null,
    refetch,
  };
};

const CARDS_PER_SLIDE = 5; // always 5 cards per slide as per updated requirement

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
    20 // fetch a bit more, in case of multiple slides
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

  // chunk the anime into arrays of length CARDS_PER_SLIDE
  const slides = [];
  for (let i = 0; i < transformedAnimeList.length; i += CARDS_PER_SLIDE) {
    slides.push(
      transformedAnimeList.slice(i, i + CARDS_PER_SLIDE)
    );
  }
  const slidesToShow = slides.length;

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
      className={`w-full px-2 pt-5 bg-slate-900 border-slate-800 ${customClassName}`}
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
          <div className="flex flex-row gap-4 p-6 justify-center">
            {Array.from({ length: CARDS_PER_SLIDE }).map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl animate-pulse overflow-hidden flex flex-col bg-gray-800"
                style={{
                  minWidth: "90px",
                  maxWidth: "210px",
                  flex: "1 1 0",
                  height: "260px",
                }}
              >
                <div className="w-full h-full bg-gray-700"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
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
                style={{
                  width: "100%",
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="w-full flex-shrink-0"
                    style={{
                      display: "flex",
                      minWidth: "100%",
                    }}
                  >
                    <div className="flex flex-row gap-4 p-4 justify-center w-full">
                      {slide.map((anime) => (
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
                      {/* Fill up with empty slots if slide is less than 5 items */}
                      {slide.length < CARDS_PER_SLIDE &&
                        Array.from({ length: CARDS_PER_SLIDE - slide.length }).map((_, idx) => (
                          <div
                            key={`empty-slot-${slideIndex}-${idx}`}
                            className="flex-1"
                            style={{ minWidth: "90px", maxWidth: "210px" }}
                          ></div>
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-black/70 text-white rounded-full hover:scale-110 hover:bg-black/80 transition-all duration-300 shadow-lg border border-gray-600/50"
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

  const handlePlayClick = (e) => {
    e.stopPropagation();
    onPlayClick(anime.id);
  };

  // Always show 5 small cards per slide, full img cover, overlay minimal info, expand on hover
  return (
    <div
      className={`
        relative rounded-2xl cursor-pointer overflow-hidden transition-shadow group flex-1 bg-gray-900
        flex flex-col
        min-w-[90px] max-w-[210px] w-full
        h-[260px] sm:h-[260px] md:h-[280px] lg:h-[290px] xl:h-[315px]
        shadow
      `}
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
      style={{
        position: "relative",
        flex: "1 0 0%",
        minWidth: "0",
      }}
    >
      {/* Background Image (full cover) */}
      <img
        src={imageError ? "error occurs" : anime.posterImage}
        alt={anime.title}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{
          objectFit: "cover",
        }}
        onError={() => setImageError(true)}
        loading="lazy"
      />
      {/* Overlayed content always at bottom (minimal) */}
      <div className="absolute inset-0 flex flex-col justify-end z-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-3 pointer-events-auto w-full">
        <div className="w-full flex flex-col gap-0.5">
          <div className="flex justify-between items-center">
            {anime.rank && anime.rank <= 10 && (
              <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">{`#${anime.rank}`}</span>
            )}
          </div>
          <div className="font-bold text-base text-white line-clamp-1 drop-shadow-md mb-1">
            {anime.title}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px]">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={12} />{anime.rating ? `${parseFloat(anime.rating).toFixed(1)}/10` : "N/A"}
            </div>
            <div className="flex items-center gap-1 text-green-400">
              <Eye size={12} />{anime.status || "N/A"}
            </div>
            <div className="flex items-center gap-1 text-blue-300">
              <Calendar size={12} />{formatDate(anime.startDate)}
            </div>
            <div className="flex items-center gap-1 text-pink-300">
              <Heart size={12} />{formatNumber(anime.favoritesCount)}
            </div>
          </div>
        </div>
      </div>
      {/* Play Button (center, on hover) */}
      <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <button
          onClick={handlePlayClick}
          className={`rounded-full p-4 border-4 border-white/30 bg-black/60 hover:bg-black/80 transition-transform pointer-events-auto ${
            activeAnimeId === anime.id ? "animate-pulse" : ""
          }`}
          aria-label="Play"
          type="button"
        >
          <Play className="w-7 h-7 text-white fill-white" />
        </button>
      </div>
      {/* DETAILED HOVER OVERLAY */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 z-40 flex flex-col justify-between bg-black/90 backdrop-blur-md rounded-2xl p-3"
            style={{
              pointerEvents: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <div className="font-bold text-sm sm:text-base text-white line-clamp-2 mb-0.5">
                {anime.title}
              </div>
              <p className="text-xs text-gray-200 line-clamp-4 mb-1">{anime.synopsis || "No synopsis available."}</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] mb-1">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={12} />{anime.rating
                    ? `${parseFloat(anime.rating).toFixed(1)}/10`
                    : "N/A"}
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <Eye size={12} />{anime.status || "N/A"}
                </div>
                <div className="flex items-center gap-1 text-blue-300">
                  <Calendar size={12} />{formatDate(anime.startDate)}
                </div>
                <div className="flex items-center gap-1 text-pink-300">
                  <Heart size={12} />{formatNumber(anime.favoritesCount)}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMore(anime.id);
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg mt-2"
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
