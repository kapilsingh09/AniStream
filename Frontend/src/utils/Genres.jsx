import React, { useState } from "react";

const genres = [
  "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama",
  "Ecchi", "Fantasy", "Game", "Harem", "Historical", "Horror", "Isekai",
  "Josei", "Kids", "Magic", "Martial Arts", "Mecha", "Military", "Music",
  "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai",
  "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen",
  "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power",
  "Supernatural", "Thriller", "Vampire"
];

const GenreList = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedGenres = showAll ? genres : genres.slice(0, 18);

  return (
    <div className="flex justify-center items-center  text-white">
      <div className="w-80 bg-gradient-to-br from-purple-500/80 via-purple-600/30 to-purple-500/40 rounded-xl p-4 backdrop-blur-sm border border-white/10 h-fit">
        <h2 className="text-white text-xl font-bold mb-4 text-center">Anime Genres</h2>

        <div className={`transition-all duration-300 ${!showAll ? 'max-h-80 overflow-hidden' : 'max-h-96 overflow-y-auto'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {displayedGenres.map((genre) => (
              <button
                key={genre}
                className="bg-white/10 hover:bg-purple-500/40 h-12 w-full rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:underline cursor-pointer border border-white/20"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {showAll ? 'Show Less' : `Show All (${genres.length - 18} more)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreList;
