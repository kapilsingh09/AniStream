import { useState, useEffect } from "react";
import { Calendar, Star, Play } from "lucide-react";

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

const StarRating = ({ rating }) => {
  if (!rating) return null;
  
  const numRating = parseFloat(rating) / 20; // Convert from 0-100 scale to 0-5 scale
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

        console.log(data);
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
    // Replace with: navigate(`/watch/${id}`); in your actual app
  };

  return (
    <div className="min-h-[50vh] bg-slate-900 p-6 mt-14">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Local Anime Grid</h1>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {loading
                ? [...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-80 bg-white/10 rounded-xl"
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
                      rating
                    } = anime;

                    // Handle different possible data structures
                    const animeTitle = title || canonicalTitle;
                    const animeDate = startDate || start_date;
                    const animeImage = posterImage?.medium || posterImage?.large || img;
                    const animeRating = averageRating || rating;
                    
                    const year = animeDate ? new Date(animeDate).getFullYear() : null;

                    return (
                      <div
                        key={id}
                        onClick={() => handleClick(id)}
                        className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 hover:border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                      >
                        <div className="relative h-64 bg-slate-800">
                          <img
                            src={animeImage}
                            alt={animeTitle}
                            className="object-contain w-full h-full"
                          />
                          
                          {/* Hover Overlay with Play Button */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          </div>
                          
                          {/* Star Rating - Top Left */}
                          {animeRating && (
                            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg z-10">
                              <StarRating rating={animeRating} />
                            </div>
                          )}
                          
                          {/* Status Badge - Top Right */}
                          <div className="absolute top-3 right-3 z-10">
                            <span
                              className={`rounded-lg flex text-xs px-2 py-1 items-center gap-1 font-semibold backdrop-blur-sm ${getStatusBadgeClass(
                                status
                              )}`}
                            >
                              <Calendar className="w-3 h-3" />
                              {status}
                            </span>
                          </div>

                          {/* Gradient Overlay for better text readability */}
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-base font-semibold mb-2 text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                            {animeTitle}
                          </h3>
                          
                          <div className="flex justify-between items-center text-sm text-white/60">
                            {year && <span>{year}</span>}
                            <span className="text-xs bg-white/10 px-2 py-1 rounded">
                              ID: {id}
                            </span>
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

export default AviAnime;