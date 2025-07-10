import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const Searchbar = ({ onClose }) => {
  const [search, setSearch] = useState('naruto');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Live fetch while typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchData(search);
      } else {
        setResults([]);
      }
    }, 500); // debounce time

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchData = async (query) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      setError('Failed to fetch results.');
      setResults([]);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search)}`);
    onClose?.(); // optional close if modal
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Search Anime</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} className="text-white" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for anime, characters, or genres..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-600 hover:to-pink-600 transition-all duration-300"
        >
          Search
        </button>
      </form>

    
      {loading && <p className="text-white text-center">Loading...</p>}
{error && <p className="text-red-400 text-center">{error}</p>}
{!loading && results.length > 0 && (
  <div className="bg-slate-800 overflow-y-auto cool-scrollbar h-[30vh] mt-5 rounded-2xl p-3 overflow-auto">
    <ul className="grid gap-3">
      {results.map((anime) => (
        <li key={anime.mal_id} className="flex items-start gap-3 text-white hover:bg-white/10 p-2 rounded-lg cursor-pointer">
          <img 
            src={anime.images?.jpg?.image_url} 
            alt={anime.title} 
            className="w-12 h-16 object-cover rounded-md flex-shrink-0" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-tight">{anime.title}</h3>
              <div className="flex flex-col items-end text-xs text-gray-300 flex-shrink-0">
                <span className="bg-blue-600 px-2 py-1 rounded text-white">
                  {anime.type || 'Unknown'}
                </span>
                <span className="mt-1">
                  {anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Unknown'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {anime.synopsis ? (
                anime.synopsis.length > 100 
                  ? `${anime.synopsis.substring(0, 100)}...`
                  : anime.synopsis
              ) : 'No description available'}
            </p>
          </div>
        </li>
      ))}
<div className='w-full mt-2 h-12 bg-purple-600 rounded-2xl flex items-center uppercase text-2xl font-semibold text-center justify-center '>

<button>view more</button>
</div>
    </ul>
  </div>
)}
{!loading && search.trim() !== '' && results.length === 0 && (
  <p className="text-gray-300 text-center">No suggestions found.</p>
)}
      </div>
    
  );
};

export default Searchbar;
