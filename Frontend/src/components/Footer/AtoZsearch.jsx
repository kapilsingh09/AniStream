import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AtoZSearch = ({ onResults }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const alphabetArray = [
    "All",
    "#",
    "0-9",
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
  ];

  const handleAlphabet = async (letter) => {
    navigate(`/search?query=${encodeURIComponent(letter)}`);
    setLoading(true);
      // console.log(letter);
      
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <section className="flex gap-4 items-center mb-4 flex-wrap">
        <h1 className="text-2xl font-medium">A-Z LIST</h1>
        <span>|</span>
        <p className="text-xl">
          Search anime ordered by alphabet name A to Z.
        </p>
      </section>

      {/* Alphabet Buttons */}
      <div className="flex flex-wrap gap-2">
        {alphabetArray.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphabet(letter)}
            // aria-label={`Search for ${letter}`}
            // disabled={loading}
            className={`h-8 w-8 hover:cursor-pointer hover:underline rounded-[9px] font-semibold text-[2vh] transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-400/40 hover:bg-purple-700 text-white focus:ring-purple-400"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
      {/* Loading Indicator */}
      {/* {loading && (
        <div className="mt-4 text-purple-500 font-semibold">
          Loading results...
        </div>
      )} */}
    </div>
  );
};

export default AtoZSearch;
