import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [shrink, setShrink] = useState(false);
  const navigate = useNavigate();

  const initialCount = 26;
  const displayedGenres = showAll ? genres : genres.slice(0, initialCount);

  const handleClick = (genre) => {
    setShrink(true);
    navigate(`/search?query=${genre}`);
    // i have to show all onto result page
    setTimeout(() => setShrink(false), 700);
  };


  return (
    <div
      className={`rounded-2xl p-6 flex flex-col
      bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 backdrop-blur-lg transition-all duration-300 ease-in-out
      ${showAll ? "h-[calc(100vh-33px)]" : "h-[70vh]"}`}
    >
      <h2 className="text-xl font-bold text-white mb-4 tracking-wide">
        Browse Genres
      </h2>

      {/* Genre Grid */}
      <div
        className={`transition-all duration-300 flex-1 ${
          showAll ? "overflow-y-auto pr-1" : "overflow-hidden"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayedGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleClick(genre)}
              className="bg-white/5 text-white cursor-pointer 
              hover:bg-white/15 hover:scale-105 hover:shadow-lg
              font-medium text-xs px-3 py-2 rounded-lg border border-white/10
              transition-all duration-200 ease-out
              flex items-center justify-center"
            >
              <span className="truncate">{genre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Show More/Less */}
      <div className="mt-5">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2
          bg-purple-600
          text-white px-4 py-2 rounded-lg text-sm font-semibold w-full
          shadow-md hover:shadow-lg transform hover:scale-[1.02]
          transition-all duration-200"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show All ({genres.length - initialCount} more){" "}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <style>
        {`
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.5);
          }
        `}
      </style>
    </div>
  );
};

export default GenreList;
