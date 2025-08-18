import React, { useState, useEffect } from "react";
import { Play, Star, Calendar, Eye, Heart, Bookmark } from "lucide-react";

export default function FullAnimeBanner() {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchRandomAnimeSimple = async () => {
      try {
        setLoading(true);

        const genres = [
          "action", "adventure", "comedy", "drama", "fantasy", "horror", "mystery",
          "romance", "sci-fi", "slice-of-life", "sports", "supernatural", "thriller", "mecha"
        ];
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        const randomOffset = Math.floor(Math.random() * 100);

        const res = await fetch(
          `https://kitsu.io/api/edge/anime?filter[categories]=${randomGenre}&sort=ratingRank&page[limit]=6&page[offset]=${randomOffset}`
        );
        const data = await res.json();

        if (Array.isArray(data.data) && data.data.length > 0) {
          const animeObj = data.data[Math.floor(Math.random() * data.data.length)];
          const attrs = animeObj.attributes;

          setAnime({
            title: attrs?.titles?.en || attrs?.canonicalTitle || attrs?.titles?.en_jp || "Unknown Title",
            img: attrs?.coverImage?.original || attrs?.posterImage?.original || attrs?.posterImage?.large || null,
            synopsis: attrs?.synopsis ? attrs.synopsis.substring(0, 200) + "..." : "No description available",
            rating: attrs?.averageRating || "N/A",
            year: attrs?.startDate ? new Date(attrs.startDate).getFullYear() : "Unknown",
            status: attrs?.status || "Unknown",
            episodeCount: attrs?.episodeCount || "Unknown",
            genre: randomGenre
          });
        }
      } catch (e) {
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAnimeSimple();
  }, []);

  const handleRefresh = () => {
    setImageLoaded(false);
    const fetchNewAnime = async () => {
      try {
        setLoading(true);
        const randomOffset = Math.floor(Math.random() * 200);
        
        const res = await fetch(
          `https://kitsu.io/api/edge/anime?sort=ratingRank&page[limit]=1&page[offset]=${randomOffset}`
        );
        const data = await res.json();
        
        if (Array.isArray(data.data) && data.data.length > 0) {
          const animeObj = data.data[0];
          const attrs = animeObj.attributes;
          
          setAnime({
            title: attrs?.titles?.en || attrs?.canonicalTitle || attrs?.titles?.en_jp || "Unknown Title",
            img: attrs?.coverImage?.original || attrs?.posterImage?.original || attrs?.posterImage?.large || null,
            // synopsis: attrs?.synopsis ? attrs.synopsis.substring(0, 200) + "..." : "No description available",
            // rating: attrs?.averageRating || "N/A",
            // year: attrs?.startDate ? new Date(attrs.startDate).getFullYear() : "Unknown",
            status: attrs?.status || "Unknown",
            episodeCount: attrs?.episodeCount || "Unknown"
          });
        }
      } catch (e) {
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNewAnime();
  };
  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-black">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div 
        className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background image with parallax effect */}
        <div className={`absolute inset-0 transition-transform duration-700 ${isHovered ? 'scale-103' : 'scale-100'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          ) : anime?.img ? (
            <img
              src={anime.img}
              alt={anime.title}
              className={`w-full h-full object-cover object-center transition-all duration-700 `}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400">
              <div className="text-center">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl">Image unavailable</p>
              </div>
            </div>
          )}
          
          {/* Dynamic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        </div>

        {/* Content overlay */}
        <div className={`absolute inset-0 flex items-center transition-all duration-500 ${isHovered ? 'translate-x-0' : 'translate-x-0'}`}>
          <div className="max-w-2xl ml-8 md:ml-16 space-y-6">
            {/* Title with glowing effect */}
            <h1 className={`text-2xl md:text-4xl font-black text-white leading-tight transition-all duration-500 ${
              isHovered ? 'text-shadow-glow' : ''
            }`} 
            style={{
              // textShadow: isHovered 
              //   ? '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)' 
              //   : '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              {anime?.title || "Loading..."}
            </h1>

            {/* Anime info badges */}
            {anime && (
              <div className="flex flex-wrap gap-3 items-center">
                {/* <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/30">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-200 text-sm font-medium">{anime.rating}/10</span>
                </div> */}
                <div className="flex items-center space-x-1  justify-center bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-500/30">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-200 text-sm font-medium">{anime.year}</span>
                </div>
                {/* <div className="bg-purple-500/20 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500/30">
                  <span className="text-purple-200 text-sm font-medium">{anime.episodeCount} Episodes</span>
                </div> */}
                <div className="bg-green-500/20 flex items-center justify-center backdrop-blur-sm px-3 py-1 rounded-full border border-green-500/30">
                  <span className="text-green-200 text-sm font-medium capitalize">{anime.status}</span>
                </div>
              </div>
            )}

       

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
              
              className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="cursor-pointer  relative flex items-center space-x-2">
                  <Play className="w-6 h-6 fill-white" />
                  <span>Watch Now</span>
                </div>
              </button>

              {/* <button 
                onClick={() => setIsFavorited(!isFavorited)}
                className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isFavorited 
                    ? 'bg-red-500/20 border-2 border-red-500 text-red-400' 
                    : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorited ? 'fill-red-400' : ''}`} />
              </button> */}

              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                  isBookmarked 
                    ? 'bg-blue-500/20 border-2 border-blue-500 text-blue-400' 
                    : 'bg-white/10 border-2 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-blue-400' : ''}`} />
              </button>
            </div>

            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="text-white/60 hover:text-white text-sm underline transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading new anime...' : 'Show different anime'}
            </button>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-white/20"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-white/20"></div>
      </div>
    </div>
  );
}