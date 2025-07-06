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
    <div className="bg-zinc-900 rounded-xl p-4 border border-white/10">
      <div className={`transition-all duration-300 ${!showAll ? 'max-h-80 overflow-hidden' : 'max-h-96 overflow-y-auto'}`}>
        <div className="flex flex-wrap gap-2">
          {displayedGenres.map((genre) => (
            <button
              key={genre}
              className="bg-zinc-800 hover:bg-purple-600 border border-zinc-700 hover:border-purple-500 text-white text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 w-full"
        >
          {showAll ? "Show Less" : `Show All (${genres.length - 18} more)`}
        </button>
      </div>
    </div>
  );
};

export default GenreList;