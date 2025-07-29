import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";
import { Star, Calendar, Play, Users } from "lucide-react";
import Genres from "../utils/Geners";

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



  const genreColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-cyan-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-500',
  ]

  return (
    <div className="min-h-[50vh] h-auto  bg-slate-900 p-6 mt-14">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Local Anime Grid</h1>
          <h2 className="text-white text-2xl font-bold">Genres</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-6 gap-6">
              {loading
                ? [...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse h-72 bg-white/10 rounded-xl"></div>
                  ))

                : animeData.map((anime) => {
                    const {
                      id,
                      title,
                      start_date,
                      episodes_aired,
                      status,
                      cast,
                      genres,
                      img,
                    } = anime;
                    const year = new Date(start_date).getFullYear();

                    return (
                      <div
                        key={id}
                        onClick={() => handleClick(id)}
                        className="group cursor-pointer bg-slate-800 backdrop-blur-lg rounded-xl hover:backdrop-blur-sm overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <div className="h-56 bg-white/20 relative flex items-center justify-center text-white text-xl font-bold">
                          <img
                            src={img}
                            alt={title}
                            className="object-cover w-full h-full absolute inset-0"
                          />
                          <div className="absolute top-2 right-2 bg-black/60 text-xs px-2 py-0.5 rounded">
                            {year}
                          </div>
                          <div className="absolute top-2 left-2 bg-black/60 text-xs px-2 py-0.5 rounded">
                            {id}
                          </div>
                        </div>
                        <div className="p-3 text-white">
                          <h3 className="text-sm font-semibold mb-1 line-clamp-2">{title}</h3>
                          <div className="flex justify-between text-xs text-white/70 mb-1">
                            {/* <div className="flex items-center gap-1">
                              <Play className="w-3 h-3" />
                              {episodes_aired || "?"} eps
                            </div> */}
                            {/* <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {(status)}
                            </div> */}
                          </div>
                          {/* <div className="flex flex-wrap gap-1 mt-1">
                            {genres?.slice(0, 3).map((genre, i) => (
                                <span
                                  key={genre}
                                  className={`px-1.5 py-0.5 text-[10px] text-white rounded ${genreColors[i % genreColors.length]}`}
                                >
                                  {genre}
                                </span>
                              ))}
                          </div> */}

                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>

          {/* <div className="w-[25%]">
            <Genres />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AviAnime;

