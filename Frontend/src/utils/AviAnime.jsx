// NOTE: The responsive width and aspect ratio styles for the anime image cards in this component
// are needed for other components as well. Consider reusing or extracting these styles for consistency.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star } from "lucide-react";

const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
      return "bg-green-600 text-white";
    case "finished":
      return "bg-blue-700 text-white";
    case "upcoming":
      return "bg-yellow-500 text-black";
    default:
      return "bg-slate-500 text-white";
  }
};

const AviAnime = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/available_data");
        if (!res.ok) throw new Error("Failed to fetch anime data");
        const data = await res.json();
        setAnimeData(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  const handleClick = (id) => {
    navigate(`/watch/${id}`);
  };

  return (
    <div className="min-h-[40vh] bg-black">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white px-4 sm:px-8">
            Local Anime Grid
          </h1>
        </div>

        {/* Responsive horizontal scroll on mobile, grid on larger screens */}
        <div
          className="
            flex 
            gap-3 
            px-1 sm:px-4 md:px-8 py-2 
            overflow-x-auto 
            scrollbar-hide
            sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6
            sm:overflow-x-visible
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="
                    animate-pulse 
                    aspect-[2/3]
                    w-[32vw] sm:w-[20vw] md:w-[14vw] lg:w-full
                    bg-white/10 
                    rounded-xl 
                    flex-shrink-0
                  "
                ></div>
              ))
            : animeData.map((anime) => {
                const { id, title, img, reception, status } = anime;

                const kitsuRatingRaw = reception?.ratings?.kitsu_average;
                let displayRating = "N/A";
                if (typeof kitsuRatingRaw === "number") {
                  displayRating = (kitsuRatingRaw / 10).toFixed(1);
                } else if (
                  typeof kitsuRatingRaw === "string" &&
                  kitsuRatingRaw !== "N/A"
                ) {
                  const num = parseFloat(kitsuRatingRaw);
                  if (!isNaN(num)) {
                    displayRating = (num / 10).toFixed(1);
                  }
                }

                return (
                  <div
                    key={id}
                    onClick={() => handleClick(id)}
                    className="
                      bg-black/20
                      rounded-xl 
                      overflow-hidden 
                      text-white 
                      flex flex-col 
                      hover:scale-[1.03] 
                      transition-transform 
                      duration-300 
                      cursor-pointer 
                      group 
                      flex-shrink-0
                      w-[32vw] sm:w-[20vw] md:w-[14vw] lg:w-full
                      max-w-[180px] sm:max-w-none
                    "
                  >
                    {/* Image Wrapper with fixed aspect ratio */}
                    <div className="relative aspect-[2/3] w-full">
                      <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover rounded-xl group-hover:brightness-110 transition-all duration-300"
                        loading="lazy"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />

                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="rounded-full z-40 border-2 border-white/40 h-10 w-10 flex items-center group-hover:scale-110 duration-400 animate-pulse justify-center text-white bg-black/40">
                          <Play size={18} />
                        </div>
                      </div>

                      {/* Star Rating */}
                      {displayRating !== "N/A" && (
                        <div className="absolute top-2 right-2 flex items-center text-xs gap-1 bg-red-500 text-white font-semibold px-2 py-1 rounded-lg backdrop-blur-sm z-30">
                          <Star className="w-3 h-3" />
                          <span className="font-semibold text-xs">
                            {displayRating}
                          </span>
                        </div>
                      )}

                      {/* Status Badge */}
                      {status && status.toLowerCase() && (
                        <div
                          className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(
                            status
                          )} z-30`}
                        >
                          {status}
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div className="py-1 ml-1 text-xs sm:text-sm font-medium leading-tight">
                      <div
                        className="line-clamp-2 group-hover:text-yellow-400 transition-colors"
                        title={title}
                      >
                        {title}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default AviAnime;
