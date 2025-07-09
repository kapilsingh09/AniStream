import { useContext } from "react";
import { Star, Calendar, Play, Users } from "lucide-react";
import Genres from "../utils/Geners";
import { ApiDataContext } from "../context/ApiContext";

const AnimeGrid = () => {
  // Get romance anime data from ApiDataContext
  const { loading, error, romanceAnime } = useContext(ApiDataContext);
  const animeData = romanceAnime || [];
console.log(animeData);

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
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">Romance Anime</h1>
          </div>
          <h2 className="text-white text-3xl mr-65 font-bold">Genres</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-6">
              {loading || animeData.length === 0
                ? [...Array(8)].map((_, i) => <div key={i}>{renderSkeletonCard()}</div>)
                : animeData.map((anime, i) => {
                  const title = anime.title_english || anime.title || "Unknown Title";
                  const image = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
                  const score = anime.score?.toFixed(1) || "N/A";
                  const year = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null);
                  const episodes = anime.episodes || "?";
                  const status = anime.status || "Unknown";
                  const members = anime.members || 0;

                  return (
                    <div
                      key={anime.mal_id || i}
                      className="group relative cursor-pointer bg-gradient-to-l from-purple-500/90 to-pink-500/80 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10  hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={image}
                          alt={title}
                          className="w-full h-65 object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/300x400/1f2937/6b7280?text=No+Image";
                          }}
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
                            <Play className="w-4 h-4 scale-220 text-white fill-white" />
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 leading-snug group-hover:text-gray-300 transition-colors duration-300">
                          {title}
                        </h3>
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
    </div>
  );
};

export default AnimeGrid;
