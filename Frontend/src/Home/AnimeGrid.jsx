import { useState } from "react";
import { Star, Calendar, Play, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Genres from "../utils/Geners";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchRomanceAnimeForAnimeGrid } from "../services/JikhanAnimeApi";



const AnimeGrid = () => {
  // Remove unused state variables for animeData and loading, use TanStack Query instead
  // const [animeData, setAnimeData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [hoveredAnime, setHoveredAnime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoverTimer, setHoverTimer] = useState(null);

  const navigate = useNavigate();

  const genreColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-cyan-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-500',
  ];

  // Use TanStack Query for fetching and caching
  const { data: animeData = [], isLoading: loading } = useQuery({
    queryKey: ["romance-anime"],
    queryFn: fetchRomanceAnimeForAnimeGrid,
    staleTime: 1000 * 60 * 10, // 10 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  const handleMouseEnter = (anime, e) => {
    // Clear any existing timer
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
    setHoveredAnime(anime);

    setHoverPosition({ x: e.clientX + 20, y: e.clientY - 20 });
  };

  const handleMouseMove = (e) => {
    setHoverPosition({ x: e.clientX + 20, y: e.clientY - 20 });
  };

  const handleMouseLeave = () => {
    // Set a 2-second timer to hide the card
    const timer = setTimeout(() => {
      setHoveredAnime(null);
    }, 2000);
    setHoverTimer(timer);
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
          <h1 className="text-4xl font-bold text-white">Romance Anime</h1>
          <h2 className="text-white text-3xl font-bold">Genres</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-6">
              {loading || animeData.length === 0
                ? [...Array(8)].map((_, i) => <div key={i}>{renderSkeletonCard()}</div>)
                : animeData.map((anime, i) => {
                  const title =
                    anime.title_english || anime.title || "Unknown Title";
                  const image =
                    anime.images?.jpg?.large_image_url ||
                    anime.images?.jpg?.image_url;
                  const score = anime.score?.toFixed(1) || "N/A";
                  const year =
                    anime.year ||
                    (anime.aired?.from
                      ? new Date(anime.aired.from).getFullYear()
                      : null);
                  const episodes = anime.episodes || "?";
                  const status = anime.status || "Unknown";
                  const members = anime.members || 0;

                  return (
                    <div
                      key={anime.mal_id || i}
                      className="group relative cursor-pointer bg-slate-900 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                      // onMouseEnter={(e) => handleMouseEnter(anime, e)}
                      // onMouseMove={handleMouseMove}
                      // onMouseLeave={handleMouseLeave}
                      onClick={() =>
                        navigate(`/play/${anime.mal_id}`)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-56 object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        />
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
                            <Play className="w-7 h-7 text-white fill-white" />
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
                            {anime.genres.slice(0, 3).map((genre, index) => {
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

          <div className="w-[25%]">
            <Genres />
          </div>
        </div>
      </div>

      {/* Hover Card */}
      {/* <AnimatePresence>
        {hoveredAnime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut",
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="fixed z-[60] w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-white/20 overflow-hidden pointer-events-none p-4"
            style={{
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`,
            }}
          >
            {/* Title & Score */}
            {/* <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-bold text-lg line-clamp-2">{hoveredAnime.title_english || hoveredAnime.title}</h3>
              {hoveredAnime.score && (
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {hoveredAnime.score.toFixed(1)}
                </div>
              )}
            </div>

            // {/* Year & Status */}
            {/* // <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            //   {hoveredAnime.year && (
            //     <span className="bg-white/10 px-2 py-0.5 rounded-full">{hoveredAnime.year}</span>
            //   )}
            //   {hoveredAnime.status && (
            //     <span
            //       className={`px-2 py-0.5 rounded-full ${hoveredAnime.status === "Finished Airing"
            //           ? "bg-green-500/20 text-green-400"
            //           : hoveredAnime.status === "Currently Airing"
            //             ? "bg-blue-500/20 text-blue-400"
            //             : "bg-gray-500/20 text-gray-400"
            //         }`}
            //     >
            //       {hoveredAnime.status}
            //     </span>
            //   )}
            // </div>

            {/* Synopsis */}
            {/* {hoveredAnime.synopsis && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-4">
                {hoveredAnime.synopsis}
              </p>
            )} */}

            {/* Genres in hover card */}
            {/* {hoveredAnime.genres && (
              <div className="flex flex-wrap gap-1 mb-3">
                {hoveredAnime.genres.slice(0, 4).map((genre, index) => {
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
            )} */}

            {/* Extra Info */}
            {/* <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              {hoveredAnime.episodes && (
                <div>
                  Episodes: <span className="text-white">{hoveredAnime.episodes}</span>
                </div>
              )}
              {hoveredAnime.members && (
                <div>
                  Members:{" "}
                  <span className="text-white">
                    {hoveredAnime.members > 1000
                      ? `${Math.round(hoveredAnime.members / 1000)}k`
                      : hoveredAnime.members}
                  </span>
                </div>
              )} */}
            {/* </div>
          </motion.div> */} 
        {/* )} */}
      {/* // </AnimatePresence> */} 
    </div>
  );
};

export default AnimeGrid;
