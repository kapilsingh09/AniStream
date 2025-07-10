import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, X } from 'lucide-react';

const Searchbar = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const genres = [
    { mal_id: 1, name: "Action", description: "Fast-paced battles, fights, and adrenaline-filled scenes." },
    { mal_id: 2, name: "Adventure", description: "Epic journeys, exploration, and quests in unknown lands." },
    { mal_id: 4, name: "Comedy", description: "Humorous stories meant to make the audience laugh." },
    { mal_id: 7, name: "Drama", description: "Emotionally intense narratives focusing on character development." },
    { mal_id: 8, name: "Fantasy", description: "Magical worlds, mythical creatures, and supernatural powers." },
    { mal_id: 10, name: "Horror", description: "Scary and creepy tales with suspense and fear elements." },
    { mal_id: 14, name: "Romance", description: "Stories focused on love, relationships, and emotional bonds." },
    { mal_id: 24, name: "Sci-Fi", description: "Technology, space, time travel, and futuristic settings." },
    { mal_id: 22, name: "Slice of Life", description: "Everyday stories of regular people, often heartwarming or relaxing." },
    { mal_id: 37, name: "Supernatural", description: "Ghosts, spirits, magic, and otherworldly powers." },
    { mal_id: 30, name: "Sports", description: "Focused on competitive games and the spirit of athletes." },
    { mal_id: 41, name: "Thriller", description: "Tense and suspenseful plots with unexpected twists." },
  ];
  
  const genreColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-cyan-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-500',
  ]
  // Debounce logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        fetchData(search);
      } else {
        setResults([]);
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [search]);
  
  const fetchData = async (query) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=8`);
      const data = await res.json();

      const uniqueAnimeMap = new Map();
      (data.data || []).forEach(anime => {
        if (!uniqueAnimeMap.has(anime.mal_id)) {
          uniqueAnimeMap.set(anime.mal_id, anime);
        }
      });

      const uniqueAnimeList = Array.from(uniqueAnimeMap.values());


      setResults(uniqueAnimeList || []);
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
    onClose?.();
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
          className="w-full bg-violet-500 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-600 hover:to-pink-600 transition-all duration-300"
        >
          Search
        </button>
      </form>

      {/* Results */}
  
        {loading && <p className="text-white text-center mt-2">Loading...</p>}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {!loading && results.length > 0 && (
              <div className="bg-slate-800 overflow-y-auto h-[30vh] mt-5 rounded-2xl p-3 cool-scrollbar">
          <ul className="grid gap-3">
            {results.map((anime) => (
              <li
                key={anime.mal_id}
                className="flex items-start gap-3 text-white  hover:bg-white/10 p-2 rounded-lg cursor-pointer relative group"
              >
                {/* Image with hover effect */}
                <div className="relative">
                  <img
                    src={anime.images?.jpg?.image_url}
                    alt={anime.title}
                    className="w-20 h-28 object-cover rounded-md"
                  />
                  <div className="absolute inset-0  bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                  <div className='border-2 rounded-full p-3 hover:scale-110 border-white/80 duration-300 ease-in-out  '>
                    <Play className="text-white h-4 w-4" />

                  </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl leading-tight">{anime.title_english || "Unkown" }</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {anime.synopsis
                      ? anime.synopsis.length > 150
                        ? `${anime.synopsis.substring(0, 150)}...`
                        : anime.synopsis
                      : 'No description available'}
                  </p>

                  <div className="flex justify-between items-center mt-2 text-sm text-gray-300">
                    <span className="bg-blue-600 px-2 py-1 rounded text-white">
                      {anime.type || 'Unknown'}
                    </span>
                    <span className=" px-2 py-1 rounded text-white">
                      {anime.duration  || 'Unknown'}
                    </span>
                    <span>
                      {anime.aired?.from
                        ? new Date(anime.aired.from).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </li>
            ))}

            {/* View more */}
            <li className="w-full mt-2 h-12 bg-purple-600 rounded-2xl flex items-center uppercase text-2xl font-semibold text-center justify-center">
              <button>View More</button>
            </li>
          </ul>
          </div>
        )}
      <h1 className='py-1'>Trending geners</h1>
      <div className='h-22  mt-2  flex gap-4 flex-wrap'>
  {genres.map((genre, index) => {
    const color = genreColors[index % genreColors.length];

    return (
      <button
        key={genre.mal_id}
        className={`text-sm text-white rounded-xl hover:cursor-pointer hover:scale-110 duration-300 ease-in-out px-2 py-1 ${color}`}
      >
        {genre.name}
      </button>
    );
  })}
</div>


        {!loading && search.trim() !== '' && results.length === 0 && (
          <p className="text-gray-300 text-center">No suggestions found.</p>
        )}
      </div>
   
  );
};

export default Searchbar;
