// AnimeSlider.jsx
import React, { useContext } from 'react';
import { DataContext } from '../context/AnimeContext'; // adjust path as needed

const AnimeSlider = () => {
  const { trendingAnime } = useContext(DataContext);

  if (!trendingAnime || trendingAnime.length === 0) {
    return <div className="text-white text-center py-8">Loading anime...</div>;
  }

  return (
    <div className="w-full overflow-x-auto whitespace-nowrap">
      {trendingAnime.map(anime => (
        <div key={anime.mal_id} className="inline-block w-64 m-2 bg-gray-800 rounded-xl shadow-md">
          <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-40 object-cover rounded-t-xl" />
          <div className="p-2 text-white">
            <h2 className="text-lg font-semibold">{anime.title}</h2>
            <p className="text-sm text-gray-300">Score: {anime.score}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeSlider;
