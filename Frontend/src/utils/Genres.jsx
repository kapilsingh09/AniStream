import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate(); //Initialize navigate here

  const initialCount = 26;
  const displayedGenres = showAll ? genres : genres.slice(0, initialCount);

  const handleClick = (genre) => {
    setShrink(true);
    navigate(`/genres/${genre}`); // ✅ Correct route
    console.log("Navigating to genre:", genre);
    setTimeout(() => setShrink(false), 300);
  };

  return (
    <div
      className={`rounded-2xl p-6 max-h-screen flex flex-col bg-gradient-to-br from-orange-100 via-rose-200 to-pink-300 shadow-lg border border-gray-200 transition-all duration-300 ease-in-out ${
        shrink ? "h-[99vh]" : "h-[100vh]"
      }`}
    >
      {/* Genre Grid */}
      <div
        className={`overflow-hidden ${
          showAll ? "overflow-y-auto" : ""
        } genre-scroll transition-all duration-300 flex-1`}
      >
        <div className="grid grid-cols-2 gap-3 pr-1">
          {displayedGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleClick(genre)}
              className="bg-white/50 text-gray-800 cursor-pointer hover:underline font-medium text-xs px-3 py-2 rounded-lg backdrop-blur-sm shadow-sm border border-gray-300 hover:bg-white hover:text-indigo-700 hover:shadow-md transition-all duration-200"
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
          className="bg-indigo-200 hover:bg-indigo-300 text-indigo-900 px-4 py-2 rounded-lg text-sm font-semibold w-full shadow-sm transition-all"
        >
          {showAll ? "Show Less" : `Show All (${genres.length - initialCount} more)`}
        </button>
      </div>

      {/* Hide Scrollbar */}
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
