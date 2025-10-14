import React from "react";
import { useNavigate } from "react-router-dom";

const AtoZSearch = ({ onResults }) => {
  const navigate = useNavigate();

  const alphabetArray = [
    "All",
    "#",
    "0-9",
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ];

  const handleAlphabet = (letter) => {
    navigate(`/search?query=${encodeURIComponent(letter)}`);
  };

  return (
    <div className="p-3 sm:p-4">
      {/* Header Section */}
      <section className="flex gap-2 sm:gap-4 items-center mb-3 sm:mb-4 flex-wrap">
        <h1 className="text-lg sm:text-2xl font-medium">A-Z LIST</h1>
        <span>|</span>
        <p className="text-sm sm:text-xl">
          Search anime ordered by alphabet name A to Z.
        </p>
      </section>

      {/* Alphabet Buttons */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {alphabetArray.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphabet(letter)}
            className={`h-7 w-7 sm:h-8 sm:w-8 md:h-9 hover:cursor-pointer md:w-9 
                        rounded-md sm:rounded-[9px] 
                        
                        font-semibold text-xs sm:text-sm md:text-base
                        transition-colors duration-200 
                        shadow-sm focus:outline-none focus:ring-2 
                      bg-white/20 hover:bg-purple-700 
                        text-white focus:ring-purple-400`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AtoZSearch;
