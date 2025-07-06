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

// Color palette for text colors (looped)
const textColors = [
  "text-pink-400", "text-purple-400", "text-blue-400", "text-yellow-400",
  "text-green-400", "text-rose-400", "text-indigo-400", "text-teal-400",
  "text-emerald-400", "text-orange-400"
];

const GenreList = () => {
  const [showAll, setShowAll] = useState(false);
  const initialCount = 24;
  const displayedGenres = showAll ? genres : genres.slice(0, initialCount);

  return (
    <div className="rounded-xl p-4 h-[80vh] max-h-screen flex flex-col bg-gradient-to-br from-[#1f103f] via-[#2a0845] to-[#000] shadow-lg">
      {/* Genre Grid */}
      <div
        className={`overflow-hidden ${
          showAll ? "overflow-y-auto" : ""
        } genre-scroll transition-all duration-300 flex-1`}
      >
        <div className="grid grid-cols-2 gap-2 pr-1">
          {displayedGenres.map((genre, idx) => (
            <button
              key={genre}
              onClick={() => {
                console.log(`Navigate to /${genre}`);
              }}
              className={`hover:bg-purple-700 border border-zinc-700 hover:border-purple-500 text-xs px-2 py-2 rounded-lg transition-all duration-200 hover:scale-105 h-8 flex items-center justify-center cursor-pointer font-semibold ${textColors[idx % textColors.length]} bg-zinc-900/80`}
            >
              <span className="truncate">{genre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Show More/Less */}
      <div className="mt-4">
        <button
          onClick={() => setShowAll(!showAll)}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-violet-700 hover:from-purple-500 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 w-full"
        >
          {showAll ? "Show Less" : `Show All (${genres.length - initialCount} more)`}
        </button>
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .genre-scroll::-webkit-scrollbar {
          display: none;
        }
        .genre-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default GenreList;
