import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Star } from "lucide-react";

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
    <div className="min-h-[50vh] border bg-black">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white px-8 ">Local Anime Grid</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-8 py-2">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-[55vh] bg-white/10 rounded-xl"
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
                    className="min-w-[14vw] max-w-[12vw] rounded-xl overflow-hidden text-white flex flex-col hover:scale-[1.03] transition-transform duration-300 cursor-pointer group h-[50vh]"
                  >
                    <div className="relative h-[44vh] w-full">
                      <img
                        src={img}
                        alt={title}
                        className="w-full h-full object-cover rounded-xl group-hover:brightness-110 transition-all duration-300"
                        loading="lazy"
                      />
                      {/* Play Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/80 to-transparent z-10" />
                        <div className="rounded-full z-40 border-2 border-white/40 h-14 flex items-center group-hover:scale-110 duration-400 animate-pulse justify-center w-14 text-white bg-black/40">
                          <Play size={24} />
                        </div>
                      </div>
                      {/* Black overlay on hover */}
                    
                      {/* Star Rating */}
                      {displayRating !== "N/A" && (
                        <div className="absolute top-2 right-2 flex items-center text-xs gap-1 bg-red-500 text-white font-semibold px-2 py-1 rounded-lg backdrop-blur-sm z-30">
                          <Star className="w-3 h-3" />
                          <span className="font-semibold text-xs">
                            {displayRating}
                          </span>
                        </div>
                      )}
                      {/* Ongoing Badge */}
                      {status && status.toLowerCase() === "ongoing" && (
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(status)} z-30`}>
                          Ongoing
                        </div>
                      )}
                    </div>
                    <div className="py-1 ml-1 text-sm font-medium leading-tight">
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
