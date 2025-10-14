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

// List of nice color pairs for genre text backgrounds on hover
const colorPairs = [
  // [text, bg]
  ["text-pink-400", "bg-pink-100/10"],
  ["text-purple-400", "bg-purple-100/10"],
  ["text-blue-400", "bg-blue-100/10"],
  ["text-green-400", "bg-green-100/10"],
  ["text-yellow-400", "bg-yellow-100/10"],
  ["text-orange-400", "bg-orange-100/10"],
  ["text-red-400", "bg-red-100/10"],
  ["text-teal-400", "bg-teal-100/10"],
  ["text-indigo-400", "bg-indigo-100/10"],
  ["text-fuchsia-400", "bg-fuchsia-100/10"],
  ["text-violet-400", "bg-violet-100/10"],
  ["text-rose-400", "bg-rose-100/10"],
  ["text-cyan-400", "bg-cyan-100/10"],
  ["text-emerald-400", "bg-emerald-100/10"],
  ["text-amber-400", "bg-amber-100/10"],
];

const GenreList = () => {
  const [showAll, setShowAll] = useState(true);
  const [shrink, setShrink] = useState(false);
  const navigate = useNavigate();

  const initialCount = 26;
  const displayedGenres = showAll ? genres : genres.slice(0, initialCount);

  const handleClick = (genre) => {
    setShrink(true);
    navigate(`/search?query=${genre}`);
    setTimeout(() => setShrink(false), 700);
  };

  return (
    <div
      className={`rounded-2xl p-6 flex flex-col 
      bg-white/20 backdrop:blur-2xl  backdrop-blur-lg transition-all duration-300 ease-in-out
      ${showAll ? "h-[calc(100vh)]" : "h-[70vh]"}`}
    >
      <h2
  className="text-3xl font-semibold mb-4 tracking-wide 
  bg-[#ffbade]
  bg-clip-text text-transparent select-none"
>
  Browse Genres
</h2>


      {/* Genre Grid */}
      <div
        className={`transition-all duration-300 flex-1 ${
          showAll ? "overflow-y-auto pr-1" : "overflow-hidden"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayedGenres.map((genre, i) => {
            // Pick a color pair for this genre based on index for variety
            const [text, bg] = colorPairs[i % colorPairs.length];
            return (
              <button
                key={genre}
                onClick={() => handleClick(genre)}
                className={`
                  group
                  bg-transparent
                  font-semibold text-sm px-3 py-2 
                  transition-all duration-150 ease-out
                  flex items-center justify-center
                  cursor-pointer
                  ${text}
                  hover:${bg}
                  hover:shadow-lg
                  hover:bg-white/20
                  focus:outline-none
                  focus:ring-2 focus:ring-white/40
                `}
              >
                <span className="truncate">{genre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Show More/Less */}
      <div className="mt-5">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center justify-center gap-2
          border-white/30
          bg-white/10
          text-white px-4 py-3 rounded-lg text-sm font-semibold w-full
        hover:shadow-lg transform hover:scale-[1.02]
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
