import React, { useState, useEffect } from 'react';
import { Play, Search, X, Star, Calendar, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Searchbar = ({ onClose }) => {
  const [search, setSearch] = useState('naruto');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()
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
    'bg-gradient-to-r from-pink-500 to-rose-500', 
    'bg-gradient-to-r from-purple-500 to-indigo-500', 
    'bg-gradient-to-r from-blue-500 to-cyan-500', 
    'bg-gradient-to-r from-green-500 to-emerald-500',
    'bg-gradient-to-r from-yellow-500 to-orange-500', 
    'bg-gradient-to-r from-orange-500 to-red-500', 
    'bg-gradient-to-r from-red-500 to-pink-500', 
    'bg-gradient-to-r from-teal-500 to-green-500',
    'bg-gradient-to-r from-indigo-500 to-purple-500', 
    'bg-gradient-to-r from-rose-500 to-pink-500', 
    'bg-gradient-to-r from-amber-500 to-yellow-500', 
    'bg-gradient-to-r from-lime-500 to-green-500',
    'bg-gradient-to-r from-cyan-500 to-blue-500', 
    'bg-gradient-to-r from-fuchsia-500 to-purple-500', 
    'bg-gradient-to-r from-violet-500 to-indigo-500', 
    'bg-gradient-to-r from-emerald-500 to-teal-500',
  ];

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

  const handleSearch = (e, keyword) => {
    e.stopPropagation();
  
    // Check if keyword is an object and has a title
    const title =
      typeof keyword === "string"
        ? keyword
        : keyword?.title || keyword?.title_english || "";
  
    if (!title) return; // Prevent navigation if no title found
  
    navigate(`/find?keyword=${encodeURIComponent(title)}`);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search)}`);
    onClose?.();
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 7) return 'text-yellow-400';
    if (rating >= 6) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Search Anime</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} className="text-white" />
        </button>
      </div>

      <div>
        <form  className="space-y-4" onClick={handleSubmit}>

       
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
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          Search
        </button>
      </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-5">
          <h3 className="text-lg font-semibold  text-white mb-3 flex items-center gap-2">
            <Eye size={18} />
            Search Results
          </h3>
          <div className="bg-slate-900/50 cool-scrollbar backdrop-blur-sm overflow-y-auto max-h-[40vh] rounded-2xl border border-white/10">
            <div className="p-4 space-y-4 cool-scrollbar">
              {results.map((anime, index) => (
                <div
                  onClick={(e) => handleSearch(e, anime)}
                  key={anime.mal_id}
                  className="group relative  bg-white/5 hover:bg-white/10 rounded-xl p-4 cool-scrollbar  transition-all duration-300 cursor-pointer border border-white/10 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-500/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-4">
                    {/* Enhanced Image Container */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-28 rounded-lg overflow-hidden bg-gradient-to-br from-violet-500/20 to-pink-500/20">
                        <img
                          src={anime.images?.jpg?.image_url}
                          alt={anime.title}
                          className="w-full h-full object-cover transition-transform duration-300 "
                        />
                        <div className="absolute inset-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-transparent  border-2 border-black rounded-full p-2 transform hover:scale-110 transition-transform duration-200">
                            <Play className="text-black h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating Badge */}
                      {/* {anime.score && (
                        <div className="absolute -top-2 -right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className={`text-xs font-semibold ${getRatingColor(anime.score)}`}>
                              {anime.score}
                            </span>
                          </div>
                        </div>
                      )} */}
                    </div>

                    {/* Enhanced Info Section */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg leading-tight text-white group-hover:text-violet-300 transition-colors">
                          {anime.title_english || anime.title || "Unknown"}
                        </h3>
                        {anime.episodes && (
                          <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                            {anime.episodes} eps
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                        {anime.synopsis
                          ? anime.synopsis.length > 120
                            ? `${anime.synopsis.substring(0, 120)}...`
                            : anime.synopsis
                          : 'No description available'}
                      </p>

                      {/* Enhanced Metadata */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full font-medium">
                          {anime.type || 'Unknown'}
                        </span>
                        
                        {anime.duration && (
                          <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {anime.duration}
                          </span>
                        )}
                        
                        {anime.aired?.from && (
                          <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(anime.aired.from).getFullYear()}
                          </span>
                        )}
                        
                        {anime.status && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            anime.status === 'Finished Airing' 
                              ? 'bg-green-500/20 text-green-400' 
                              : anime.status === 'Currently Airing'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {anime.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Gradient Border */}
                  {/* <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-pink-500/0 to-violet-500/0 group-hover:from-violet-500/20 group-hover:via-pink-500/20 group-hover:to-violet-500/20 transition-all duration-300 pointer-events-none"></div> */}
                </div>
              ))}

              {/* Enhanced View More Button */}
              <div className="pt-2">
                <button 
                  onClick={() => navigate(`/search?query=${encodeURIComponent(search)}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold text-sm uppercase tracking-wide transition-all duration-300 transform hover:cursor-pointer hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View All Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Genres Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Star size={18} />
          Trending Genres
        </h3>
        <div className="flex gap-2 flex-wrap">
          {genres.map((genre, index) => {
            const color = genreColors[index % genreColors.length];
            return (
              <button
                key={genre.mal_id}
                className={`text-sm text-white rounded-xl px-3 py-2 font-medium transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${color} hover:shadow-current/25`}
                title={genre.description}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;