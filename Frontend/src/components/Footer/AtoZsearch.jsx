import React from 'react';
import { data, useNavigate } from 'react-router-dom';

const AtoZSearch = () => {
    const Navigation= useNavigate()
  const alphabetArray = [
    'All',
    '#',
    '0-9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  const handleAlphabet = async (letter) => {
    console.log(letter);
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${letter}`);

    // console.log(response.json());
    const data = response.json()
    console.log(data);
    

    // You can call your filter/search function here
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <section className="flex gap-4 items-center mb-4">
        <h1 className="text-2xl font-medium">A-Z LIST</h1>
        <span>|</span>
        <p className="text-xl">Searching anime ordered by alphabet name A to Z.</p>
      </section>

        {/* Alphabet Buttons */}
      <div className="flex flex-wrap gap-2">
        {alphabetArray.map((letter) => (
          <button
            key={letter}
            onClick={() => handleAlphabet(letter)}
            aria-label={`Search for ${letter}`}
            className="px-3 py-2 bg-purple-400/40 hover:bg-purple-700 
                       rounded-xl text-white font-bold text-[2vh]
                       transition-colors duration-200 shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AtoZSearch;
