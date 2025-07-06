import { useState, useEffect } from "react";
import { FetchTrendingRomanceComedyAnime } from "../services/JikhanAnimeApi";
import Genres from "../utils/Genres";

const AnimeGrid = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await FetchTrendingRomanceComedyAnime(8);
        setAnimeData(data);
      } catch (err) {
        console.error("Error fetching anime:", err);
        setError("Failed to load anime data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-8 bg-black min-h-screen">
        <div className="flex gap-6 h-full">
          {/* Loading Cards */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-40 bg-zinc-900 rounded-xl overflow-hidden shadow-md border border-white/10 animate-pulse"
                >
                  <div className="w-full h-52 bg-zinc-800"></div>
                  <div className="p-3">
                    <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-zinc-800 rounded w-12"></div>
                      <div className="h-3 bg-zinc-800 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Genres */}
          <div className="w-80 bg-gradient-to-br from-purple-500/50 via-violet-600/40 to-purple-800/30 rounded-xl p-4">
            <div className="h-6 bg-white/20 rounded mb-4 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(18)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-16 bg-white/20 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">😔</div>
          <h2 className="text-white text-lg font-semibold mb-2">Failed to load anime</h2>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 bg-black min-h-screen ">
      <div className="flex gap-6 h-full">
        {/* Left Side - Anime Cards */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <h2 className="text-white text-4xl font-bold mb-4">Romance Anime</h2>
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {animeData.map((anime, i) => {
                const title = anime.title;
                const image =
                  anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
                const episodeCount = anime.episodes ?? "?";
                const status = anime.status ?? "Unknown";
                const score = anime.score ?? "-";

                return (
                  <div
                    key={anime.mal_id || i}
                    className="bg-zinc-900 rounded-xl overflow-hidden shadow-md border border-white/10 hover:scale-[1.02] transition-all duration-300 hover:shadow-purple-500/30 cursor-pointer"
                  >
                    <div className="relative w-full h-[240px]">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover rounded-t-xl"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/176x240/1f2937/6b7280?text=No+Image";
                        }}
                      />
                      <span className="absolute top-2 right-2 px-2 py-1 bg-purple-600 rounded-full text-xs text-white font-semibold capitalize">
                        {status === "Currently Airing" ? "Airing" : status}
                      </span>
                    </div>
                    <div className="p-3 text-white">
                      <h3
                        className="text-sm font-bold line-clamp-2 mb-2 leading-tight"
                        title={title}
                      >
                        {title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{episodeCount > 0 ? `Ep ${episodeCount}` : "Unknown"}</span>
                        <span className="text-purple-400 font-medium">⭐ {score}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Genres */}
        <div className="w-80 flex items-left flex-col overflow-y-auto h-full">
          <h1 className="text-4xl font-bold p-3">Genres</h1>
          <div >

          <Genres />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeGrid;
