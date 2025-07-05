import React, { useState, useEffect } from "react";
import { fetchRomanceAnime } from "../services/kitsuAnimeApi";

const AnimeGrid = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchRomanceAnime(7); // Fetch 12 anime
        setAnimeData(data);
      } catch (err) {
        console.error('Error fetching anime:', err);
        setError('Failed to load anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-8 bg-black min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 animate-pulse">
              <div className="w-full h-48 bg-zinc-800"></div>
              <div className="p-4">
                <div className="h-6 bg-zinc-800 rounded mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-zinc-800 rounded w-16"></div>
                  <div className="h-4 bg-zinc-800 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
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
    <div className="px-4 py-8 bg-black min-h-screen flex">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {animeData.map((anime, i) => {
          const attributes = anime.attributes;
          const title = attributes?.canonicalTitle || attributes?.titles?.en_jp || attributes?.titles?.en || "Unknown Title";
          const image = attributes?.posterImage?.original || attributes?.posterImage?.large || attributes?.coverImage?.original;
          const episodeCount = attributes?.episodeCount || "?";
          const status = attributes?.status || "Unknown";
          
          return (
            <div
              key={anime.id || i}
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:scale-105 transition-transform duration-300"
            >
              <img
                src={image}
                alt={title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200/1f2937/6b7280?text=No+Image";
                }}
              />
              <div className="p-4 text-white">
                <h2 className="text-lg font-bold line-clamp-2">{title}</h2>
                <div className="flex items-center justify-between text-sm mt-2 text-zinc-300">
                  <span>{episodeCount > 0 ? `Ep ${episodeCount}` : status}</span>
                  <span className="px-2 py-0.5 bg-purple-600 rounded-full text-xs font-semibold">
                    {status === 'current' ? 'Airing' : status === 'finished' ? 'Complete' : status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-purple-500 h-full w-[40%]">

      </div>
    </div>
  );
};

export default AnimeGrid;
  