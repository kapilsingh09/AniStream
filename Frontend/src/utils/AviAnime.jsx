import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight, Calendar, Star } from "lucide-react";

const StarRating = ({ rating }) => {
  if (!rating) return null;
  const numRating = parseFloat(rating) / 20;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={`${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-500"
          }`}
        />
      ))}
    </div>
  );
};

const AviAnime = ({ className }) => {
  const [animeData, setAnimeData] = useState([]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "bg-green-600 text-white";
      case "finished":
        return "bg-gray-600 text-white";
      case "upcoming":
        return "bg-yellow-500 text-black";
      default:
        return "bg-slate-500 text-white";
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/available_data")
      .then((res) => res.json())
      .then((data) => setAnimeData(data));
  }, []);

  const handleCardClick = (anime) => console.log("Clicked", anime);


  return (
    <div
      className={`h-[60vh] bg-gradient-to-br from-zinc-900 via-gray-900 to-black py-3 ${className} relative text-white`}
    >
      <div className="flex items-center px-10 mb-2">
        <h1 className="text-white text-2xl font-bold drop-shadow-lg">
          Local Anime Slider
        </h1>
        <div className="flex-1 h-px bg-white/30 ml-4"></div>
        <div className="text-white/80 text-sm ml-4 drop-shadow">
          {animeData.length} items
        </div>
      </div>

      <div className="relative px-10">
        <div
          
          className="w-full h-[50vh] grid grid-flow-col auto-cols-[13vw] gap-6 overflow-x-auto scroll-smooth py-2 scrollbar-hide"
        >
          {animeData.map((anime, index) => {
            const img =
              anime.posterImage?.small ||
              anime.posterImage?.medium ||
              anime.img;
            const rating =
              anime.averageRating ||
              anime.rating ||
              anime.reception?.ratings?.kitsu_average;
            const year = anime.startDate
              ? new Date(anime.startDate).getFullYear()
              : null;

            return (
              <motion.div
                className="w-full rounded-xl overflow-hidden text-white flex flex-col hover:scale-[1.03] transition-transform duration-300 cursor-pointer group"
              >
                <div className="relative h-[40vh] w-full">
                  <img
                    src={img}
                    alt={anime.title}
                    className="w-full h-full object-cover rounded group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex items-center justify-center">
                    <button
                      onClick={() => handleCardClick(anime)}
                      className=" hover:bg-red-700 p-2 rounded-full border flex items-center justify-center pl-3 text-white shadow-md"
                    >
                      <Play size={24} />
                    </button>
                  </div>

                  {/* Status Badge */}
                  {anime.status && (
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`rounded text-[10px] px-2 py-1 font-semibold backdrop-blur-sm flex items-center gap-1 ${getStatusBadgeClass(
                          anime.status
                        )}`}
                      >
                        <Calendar className="w-3 h-3" />
                        {anime.status}
                      </span>
                    </div>
                  )}

                  {/* Star Rating */}
                  {rating && (
                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded backdrop-blur-md">
                      <StarRating rating={rating} />
                    </div>
                  )}
                </div>

                <div className="py-2 ml-1 text-sm font-medium leading-tight h-[4.5vh]">
                  <div
                    className="line-clamp-2 group-hover:text-blue-300 transition-colors"
                    title={anime.title}
                  >
                    {anime.title}
                  </div>
                  {year && (
                    <p className="text-xs text-white/50 mt-1">{year}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AviAnime;
