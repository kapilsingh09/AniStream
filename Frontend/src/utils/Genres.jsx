import React, { useState } from "react";
// import {navigate} from 'react-router-dom'
const genres = [
  "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama",
  "Ecchi", "Fantasy", "Game", "Harem", "Historical", "Horror", "Isekai",
  "Josei", "Kids", "Magic", "Martial Arts", "Mecha", "Military", "Music",
  "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai",
  "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen",
  "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power",
  "Supernatural", "Thriller", "Vampire"
];

const textColors = [
  "text-gray-800", "text-blue-700", "text-green-700", "text-red-700",
  "text-yellow-700", "text-purple-700", "text-teal-700"
];

const GenreList = () => {
  const [showAll, setShowAll] = useState(false);
  const [shrink, setShrink] = useState(false);

  const initialCount = 24;
  const displayedGenres = showAll ? genres : genres.slice(0, initialCount);

  const handleClick = (geners) => {
    setShrink(true);
    // navigate(`/{geners}`)
    setTimeout(() => setShrink(false), 300); // Restore height after 300ms
  };

  return (
    <div
      className={`rounded-xl p-4 max-h-screen flex flex-col bg-gradient-to-r from-violet-300/20 to-purple-500  shadow-md border border-gray-700 transition-all duration-300 ease-in-out ${
        shrink ? "h-[75vh]" : "h-[85vh]"
      }`}
    >
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
                handleClick(genre);
                console.log(`Navigate to /${genre}`);
              }}
              className={`hover:bg-transparent border border-gray-300 text-xs px-2 py-2 rounded-md cursor-pointer transition-all duration-200 h-8 flex items-center justify-center hover:underline font-medium bg-gray-800/70 text-white`}
            >
              <span className="truncate">{genre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Show More/Less */}
      <div className="mt-4">
        <button
          onClick={() => {
            setShowAll(!showAll);
            handleClick();
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 w-full transition"
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
