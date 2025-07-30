import { useState, useEffect } from "react";
import { Calendar, Star, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Status badge color classes
const navigate = useNavigate()
 const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case "ongoing":
    case "current":
      return "bg-green-600 text-white";
    case "finished":
    case "completed":
      return "bg-gray-600 text-white";
    case "upcoming":
      return "bg-yellow-500 text-black";
    default:
      return "bg-slate-500 text-white";
  }
};

// Star rating component
const StarRating = ({ rating }) => {
  if (!rating) return null;

  const numRating = parseFloat(rating) / 20;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-400"
          }`}
        />
      ))}
      <span className="text-xs text-white/70 ml-1">{numRating.toFixed(1)}</span>
    </div>
  );
};

const AviAnime = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/available_data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAnimeData(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  const handleClick = (id) => {
    console.log(`Navigate to /watch/${id}`);
    
  };

  return (
    <div className="min-h-[50vh] bg-slate-900 p-6 mt-14">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Local Anime Grid</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {loading
            ? [...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-60 bg-white/10 rounded-xl"
                ></div>
              ))
            : animeData.map((anime) => {
                const {
                  id,
                  title,
                  canonicalTitle,
                  startDate,
                  start_date,
                  status,
                  posterImage,
                  img,
                  averageRating,
                  rating,
                } = anime;

                const animeTitle = title || canonicalTitle;
                const animeDate = startDate || start_date;
                const animeImage =
                  posterImage?.small || posterImage?.medium || img;
                const animeRating = averageRating || rating;

                return (
                  <div
                    key={id}
                    onClick={() => handleClick(id)}
                    className="group cursor-pointer bg-slate-800 rounded-xl border border-white/10 hover:border-white/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {/* IMAGE */}
                    <div className="relative w-full h-40 bg-slate-700 overflow-hidden rounded-t-xl">
                      <img
                        src={animeImage}
                        alt={animeTitle}
                        className="object-cover w-full h-full"
                      />

                      {/* Play Button on Hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>

                      {/* Star Rating */}
                      {animeRating && (
                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded z-10">
                          <StarRating rating={animeRating} />
                        </div>
                      )}

                      {/* Status Badge */}
                      {status && (
                        <div className="absolute top-2 right-2 z-10">
                          <span
                            className={`rounded text-xs px-2 py-1 font-semibold backdrop-blur-sm ${getStatusBadgeClass(
                              status
                            )}`}
                          >
                            <Calendar className="w-3 h-3 inline-block mr-1" />
                            {status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TEXT INFO */}
                    <div>
                      <h3 className="text-sm font-medium text-white line-clamp-2 text-center group-hover:text-blue-400 transition-colors">
                        {animeTitle}
                      </h3>
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
