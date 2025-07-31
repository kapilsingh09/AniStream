import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Play, Star } from "lucide-react";

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
    <div className="min-h-[50vh] ml-3 p-5 mt-14">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Local Anime Grid</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-72 bg-white/10 rounded-xl"
                ></div>
              ))
            : animeData.map((anime) => {
                const { id, title, start_date, status, img, reception } = anime;
                // Show ratings: try to get kitsu, anilist, and mal ratings if available
                const kitsuRatingRaw = anime?.reception?.ratings?.kitsu_average;
                // We'll show the rating as a digit (e.g., 9.45) next to a star icon
                let displayRating = "N/A";
                if (typeof kitsuRatingRaw === "number") {
                  // Kitsu is usually 0-100, convert to 0-10
                  displayRating = (kitsuRatingRaw / 10).toFixed(2);
                } else if (typeof kitsuRatingRaw === "string" && kitsuRatingRaw !== "N/A") {
                  const num = parseFloat(kitsuRatingRaw);
                  if (!isNaN(num)) {
                    displayRating = (num / 10).toFixed(2);
                  }
                }

                return (
                  <div
                    key={id}
                    onClick={() => handleClick(id)}
                    className="group cursor-pointer  transition-all duration-300 overflow-hidden"
                  >
                    <div className="h-[44vh] p-2 relative">
                      <div className="relative h-full w-full overflow-hidden rounded-xl">
                     
                        <div className="relative h-full w-full rounded-xl overflow-hidden group/img">
                          <img
                            src={img}
                            alt={title}
                            className="object-cover w-full h-full rounded-xl"
                          />

                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-20">
                            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-black/80  to-transparent z-10" />
                            <div className="rounded-full z-40 border-2 border-white/40 h-14 flex items-center group-hover/img:scale-110 duration-400 animate-pulse justify-center w-14  text-white ">
                              <Play size={24} />
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {status && (
                          <div className="absolute top-2 left-2 z-20">
                            <span
                              className={`rounded-lg flex text-xs px-2 py-1 items-center gap-1 font-semibold ${getStatusBadgeClass(
                                status
                              )}`}
                            >
                              <Calendar className="w-3 h-3" />
                              {status}
                            </span>
                          </div>
                        )}

                        {/* Ratings Badge */}
                        <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1">
                          <span
                            className="rounded-lg flex text-xs px-2 py-1 items-center gap-1  bg-red-500 text-white font-semibold"
                            title={
                              displayRating !== "N/A"
                                ? `Kitsu: ${displayRating} / 10`
                                : "Kitsu Rating"
                            }
                          >
                            <Star className="w-3 h-4" />
                            {displayRating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-sm text-white">
                      <h3
                        className="font-semibold mr-2 ml-3 line-clamp-2"
                        title={title}
                      >
                        {title}
                      </h3>
                      {/* Uncomment for year:
                      <p className="text-xs text-white/50">{year}</p> 
                      */}
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
