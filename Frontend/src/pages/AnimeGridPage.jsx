import { useState, useEffect } from "react";
import { Heart, Star, Calendar, Play, Users } from "lucide-react";
import Genres from '../utils/Genres';

const dummyAnimeData = [
  {
    mal_id: 1,
    title: "Your Name",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/5/87048.jpg"
      }
    },
    score: 8.9,
    year: 2016,
    episodes: 1,
    status: "Finished Airing",
    members: 1200000,
  },
  {
    mal_id: 2,
    title: "Toradora!",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/13/22128.jpg"
      }
    },
    score: 8.2,
    year: 2008,
    episodes: 25,
    status: "Finished Airing",
    members: 950000,
  },
  {
    mal_id: 3,
    title: "Clannad: After Story",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1299/110774.jpg"
      }
    },
    score: 8.9,
    year: 2008,
    episodes: 24,
    status: "Finished Airing",
    members: 800000,
  },
  {
    mal_id: 4,
    title: "Fruits Basket: The Final",
    images: {
      jpg: {
        large_image_url: "https://cdn.myanimelist.net/images/anime/1764/113231.jpg"
      }
    },
    score: 9.0,
    year: 2021,
    episodes: 13,
    status: "Finished Airing",
    members: 450000,
  },
];

const AnimeGridPage = () => {
  const [animeData, setAnimeData] = useState([]);

  useEffect(() => {
    setAnimeData(dummyAnimeData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <h1 className="text-4xl font-bold text-white">Romance Anime</h1>
          </div>
          <h2 className="text-white text-2xl font-bold">Genres</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-6">
              {animeData.map((anime) => {
                const {
                  mal_id,
                  title,
                  images,
                  score,
                  year,
                  episodes,
                  status,
                  members,
                } = anime;

                return (
                  <div
                    key={mal_id}
                    className="group relative cursor-pointer bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={images.jpg.large_image_url}
                        alt={title}
                        className="w-full h-65 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-2 left-2 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                        {year}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {score}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="rounded-full p-3 border-4 border-white/30 transform scale-75 px-6 py-6 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-9 h-9 text-white fill-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-white font-medium text-xs mb-1 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors duration-300">
                        {title}
                      </h3>

                      <div className="flex items-center justify-between text-[10px] text-white/70 mb-1">
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          <span>{episodes} eps</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{Math.round(members / 1000)}k</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          status === 'Finished Airing'
                            ? 'bg-green-500/20 text-green-400'
                            : status === 'Currently Airing'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {status}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-white/70">
                          <Calendar className="w-3 h-3" />
                          <span>{year}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-80">
            <Genres />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeGridPage;
