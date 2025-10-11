import React, { useState, useEffect } from "react";
import { Play, Star, Calendar, Eye, Heart, Bookmark, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function FullAnimeBanner() {
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

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

          // Build a canonical "slugified" anime name for the route
          // fallbacks: en > en_jp > canonicalTitle, lowercased, with non-alphanum replaced by dash
          const rawName =
            attrs?.titles?.en ||
            attrs?.titles?.en_jp ||
            attrs?.canonicalTitle ||
            "unknown-title";
          const animeName = rawName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

          setAnime({
            id: animeObj.id,
            title: rawName,
            img: attrs?.coverImage?.original || attrs?.posterImage?.original || attrs?.posterImage?.large || null,
            synopsis: attrs?.synopsis ? attrs.synopsis.substring(0, 200) + "..." : "No description available",
            rating: attrs?.averageRating || "N/A",
            year: attrs?.startDate ? new Date(attrs.startDate).getFullYear() : "Unknown",
            status: attrs?.status || "Unknown",
            episodeCount: attrs?.episodeCount || "Unknown",
            genre: randomGenre,
            animeName, // add slugified animeName
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

          const rawName =
            attrs?.titles?.en ||
            attrs?.titles?.en_jp ||
            attrs?.canonicalTitle ||
            "unknown-title";
          const animeName = rawName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

          setAnime({
            id: animeObj.id,
            title: rawName,
            img: attrs?.coverImage?.original || attrs?.posterImage?.original || attrs?.posterImage?.large || null,
            status: attrs?.status || "Unknown",
            episodeCount: attrs?.episodeCount || "Unknown",
            animeName,
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
    <div className="relative w-full flex items-center justify-center h-[40vh] sm:h-[70vh] overflow-hidden bg-black">
      {/* Animated background particles */}

      {/* Main content container */}
      <div
        className="relative w-full h-full sm:w-full sm:max-w-7xl flex items-center justify-center  rounded-xl overflow-hidden transition-transform duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background image with parallax effect */}
        <div className={`absolute inset-0 transition-transform duration-700 ${isHovered ? 'scale-100' : 'scale-100'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          ) : anime?.img ? (
            <img
              src={anime.img}
              alt={anime.title}
              className="w-full h-full object-cover object-center transition-all duration-700"
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
        </div>

        {/* Content overlay */}
        <div className={`absolute inset-0 flex items-center transition-all duration-500 ${isHovered ? 'translate-x-0' : 'translate-x-0'}`}>
          <div className="max-w-2xl relative ml-8 md:ml-16 space-y-6">
            {/* Title with glowing effect */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute  left-0 w-16 h-12  border-l-2 border-white/60"
            ></motion.div>
            <h1 className={`text-2xl md:text-4xl font-black text-white leading-tight transition-all duration-500 ${
              isHovered ? 'text-shadow-glow' : ''
            }`}
            >
              <motion.span
                initial={{ y: 30, opacity: 0, scale: 0.95 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: { type: "spring", stiffness: 260, damping: 24 }
                }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                style={{
                  display: "inline-block"
                }}
              >
                {anime?.title || "Loading..."}
              </motion.span>
            </h1>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <motion.button
                className="bg-white/20 bg-clip-padding backdrop-blur-xl bg-opacity-20
                          flex items-center justify-center
                          border border-white/30 text-white 
                          py-3 px-5 rounded-3xl 
                          font-semibold text-sm
                          gap-1.5
                          transition-all duration-300 
                          hover:scale-105 hover:bg-white/20 hover:bg-opacity-30
                          cursor-pointer shadow-lg w-full max-w-[110px]
                          ring-1 ring-white/20"
                style={{
                  minWidth: '80px',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255,255,255,0.18)'
                }}
                onClick={() => {
                  navigate(`/kitsu/${anime.id}`);
                }}
              >
                <PlayCircle className="w-6 h-6" />
                <span className="inline">Watch</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}