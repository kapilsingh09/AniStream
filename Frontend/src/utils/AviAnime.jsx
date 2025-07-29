import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

// Optional: if you want to bring Genres back
// import Genres from "../utils/Geners";

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
    navigate(`/watch/${id}`);
  };

  return (
    <div className="min-h-[50vh] bg-slate-900 p-6 mt-14">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Local Anime Grid</h1>
          {/* <h2 className="text-white text-2xl font-bold">Genres</h2> */}
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-6 gap-6">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse h-72 bg-white/10 rounded-xl"
                    ></div>
                  ))
                : animeData.map((anime) => {
                    const {
                      id,
                      title,
                      start_date,
                      status,
                      img,
                    } = anime;
                    const year = new Date(start_date).getFullYear();

                    return (
                      <div
                        key={id}
                        onClick={() => handleClick(id)}
                        className="group cursor-pointer bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/10 hover:border-white/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                      >
                        <div className="relative h-auto w-full">
                          <img
                            src={img}
                            alt={title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 right-2  rounded text-white">
                            {/* ID: {id} */}  <div className="flex items-center gap-2 text-xs text-white/70">
                            <span
                              className={` rounded-lg flex  text-xs px-2 py-1 items-center gap-1 font-semibold ${getStatusBadgeClass(
                                status
                              )}`}
                            >
                              <Calendar className="w-3 h-3" />
                          <div className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-0.5 rounded text-white">
                            {}
                          </div>
                              {status}
                            </span>
                          </div>
                          </div>
                        </div>

                        <div className="p-4 text-white">
                          <h3 className="text-base font-semibold mb-2 line-clamp-2">
                            {title}
                          </h3>

                        
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* Optional Sidebar for Genres */}
          {/* <div className="w-[25%]">
            <Genres />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AviAnime;
