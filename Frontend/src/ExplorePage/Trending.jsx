import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Video, Calendar } from 'lucide-react';
import { FetchTopAnime } from '../services/JikhanAnimeApi';

const Trending = () => {
  const [trendingAnime, setTrendingAnime] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await FetchTopAnime(10);
        setTrendingAnime(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch trending anime:", error);
      }
    })();
  }, []);

  return (
    <div className="py-12 px-4 md:px-12">
      <section className="space-y-6">
        <h2 className="text-4xl font-bold flex items-center gap-3 text-white">
          <TrendingUp className="text-green-400 w-8 h-8" />
          Trending Now
        </h2>

        <div className="bg-gray-900 rounded-3xl p-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {trendingAnime.map((anime, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-2xl p-4 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center group"
              >
                <div className="relative mb-4">
                  <img
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    className="w-32 h-44 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    #{idx + 1}
                  </div>
                </div>

                <h3 className="font-semibold text-lg text-white line-clamp-2 mb-2">{anime.title}</h3>

                <div className="text-gray-400 text-sm space-y-1">
                  <p className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Score: <span className="text-white">{anime.score ?? 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Video className="w-4 h-4 text-red-400" />
                    Episodes: <span className="text-white">{anime.episodes ?? 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Year: <span className="text-white">{anime.year ?? 'Unknown'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trending;
