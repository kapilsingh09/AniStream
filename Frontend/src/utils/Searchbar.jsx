import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const Searchbar = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
      // You can add your search logic here
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Search Anime</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} className="text-white" />
        </button>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for anime, characters, or genres..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            autoFocus
          />
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-600 hover:to-pink-600 transition-all duration-300"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
      
      {/* Quick search suggestions */}
      {/* <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {['Naruto', 'One Piece', 'Dragon Ball', 'Attack on Titan', 'Demon Slayer'].map((anime) => (
            <button
              key={anime}
              onClick={() => setSearchQuery(anime)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors"
            >
              {anime}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Searchbar;
