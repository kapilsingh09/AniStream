import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
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
    <div>
      <section className="space-y-6">
        <h2 className="text-4xl font-bold flex items-center gap-3">
          <TrendingUp className="text-green-400" /> Trending Now
        </h2>
        <div className="bg-gray-900 rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingAnime.map((anime, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group cursor-pointer">
                <div className="relative mb-4">
                  <img
                    src={anime.image_url}
                    alt={anime.title}
                    className="w-24 h-24 rounded-2xl object-cover group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{idx + 1}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2">{anime.title}</h3>
                <p className="text-gray-400 text-sm mb-1">{anime.views} views</p>
                <p className="text-green-400 text-sm font-bold">{anime.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trending;
