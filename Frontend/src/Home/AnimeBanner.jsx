import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkle, Play, Calendar, Film, ShieldAlert, Star, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRandomAnime } from '../services/kitsuAnimeApi';
import SorryCard from '../utils/SorryCard';

/** Skeleton UI Primitives */
const SkeletonBlock = ({ className = '', rounded = 'rounded' }) => (
  <div aria-hidden className={`animate-pulse bg-gray-700/60 ${rounded} ${className}`} />
);
const SkeletonLine = ({ width = 'w-full', className = '' }) => (
  <SkeletonBlock className={`${width} h-4 ${className}`} />
);
const SkeletonPill = ({ width = 'w-16', className = '' }) => (
  <SkeletonBlock className={`${width} h-6 rounded-full ${className}`} />
);

const ImageWithSkeleton = ({ src, alt, className = '', imgClassName = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0">
          <div className="h-full w-full animate-pulse bg-gradient-to-br from-gray-700/70 via-gray-700/40 to-gray-700/70" />
        </div>
      )}
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="eager"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-700 to-gray-800">
          <div className="text-xs md:text-sm text-gray-300/70">Image unavailable</div>
        </div>
      )}
    </div>
  );
};

const fetchMalIdFromTitle = async (title) => {
  try {
    const res = await axios.get('https://api.jikan.moe/v4/anime', {
      params: { q: title, limit: 1 },
    });
    return res?.data?.data?.[0]?.mal_id ?? null;
  } catch (err) {
    console.error('Error fetching MAL ID from Jikan:', err);
    return null;
  }
};

export default function AnimeBanner({ uniqueId }) {
  const navigate = useNavigate();
  const [malId, setMalId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showSorry, setShowSorry] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Only fetch MAL ID after anime is loaded, to avoid double API requests
  const {
    data: anime,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [`animebanner-${uniqueId}`],
    queryFn: async () => {
      const animeData = await getRandomAnime();
      if (!Array.isArray(animeData) || animeData.length === 0) return null;
      return animeData[0];
    },
    refetchOnWindowFocus: false,
    staleTime: 4000,
    retry: 1,
    keepPreviousData: true,
  });

  // Fetch MAL ID only when anime changes, not in the queryFn
  useEffect(() => {
    let ignore = false;
    const fetchMalId = async () => {
      if (!anime) {
        setMalId(null);
        return;
      }
      const title =
        anime?.attributes?.titles?.en ||
        anime?.attributes?.canonicalTitle ||
        anime?.attributes?.titles?.en_jp;

      let fetchedMalId = null;
      if (title) {
        try {
          fetchedMalId = await fetchMalIdFromTitle(title);
        } catch (e) {
          fetchedMalId = null;
        }
      }
      if (!fetchedMalId && anime?.id) fetchedMalId = anime.id;
      if (!ignore) setMalId(fetchedMalId);
    };
    fetchMalId();
    return () => { ignore = true; };
  }, [anime]);

  const handleWatchClick = () => {
    if (isLoading) return;
    if (malId) {
      const isNumeric = typeof malId === 'number' || /^\d+$/.test(String(malId));
      navigate(isNumeric ? `/play/${malId}` : `/kitsu/${malId}`);
    } else {
      setShowSorry(true);
    }
  };

  const handleAddToWatchlist = () => {
    if (!isLoading) alert('Added to watchlist!');
  };

  const genres = useMemo(() => {
    return Array.isArray(anime?.attributes?.genres) ? anime.attributes.genres : [];
  }, [anime]);
  // console.log(anime);

  const englishTitle =
    anime?.attributes?.titles?.en ||
    anime?.attributes?.canonicalTitle ||
    anime?.attributes?.titles?.en_jp ||
    'Unknown Title';

  const synopsis = anime?.attributes?.synopsis || 'No description available.';
  const isLongSynopsis = synopsis.length > 120;

  const heroImg = useMemo(() => {
    return (
      anime?.attributes?.coverImage?.original ||
      anime?.attributes?.coverImage?.large ||
      anime?.attributes?.posterImage?.original ||
      anime?.attributes?.posterImage?.large ||
      anime?.attributes?.posterImage?.medium ||
      null
    );
  }, [anime]);

  const textLoading = isLoading || (!anime && isFetching);

  return (
    <div className="h-[65vh] grid grid-cols-1 md:grid-cols-[35%_65%] overflow-hidden shadow-2xl">
      {/* Text Section */}
      <div className="flex flex-col justify-center bg-black/70 p-6 md:p-10">
        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-white/80 leading-tight min-h-[2.5rem]">
          {textLoading ? (
            <div className="space-y-2">
              <SkeletonLine className="h-7 md:h-9 w-3/4" />
              <SkeletonLine className="h-7 md:h-9 w-1/2" />
            </div>
          ) : (
            englishTitle
          )}
        </h1>

        {/* Metadata */}
        {textLoading ? (
          <div className="flex flex-wrap gap-3 mb-3">
            <SkeletonPill width="w-16" />
            <SkeletonPill width="w-20" />
            <SkeletonPill width="w-14" />
            <SkeletonPill width="w-16" />
          </div>
        ) : (
          anime && (
            <div className="flex flex-wrap gap-4 text-xs mb-3">
              {anime?.attributes?.startDate && (
                <div className="flex items-center gap-1 text-blue-400 bg-blue-900/60 px-2 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-blue-300" />
                  <span className="font-semibold">{anime.attributes.startDate.slice(0, 4)}</span>
                </div>
              )}
              {anime?.attributes?.episodeCount && (
                <div className="flex items-center gap-1 text-green-400 bg-green-900/60 px-2 py-1 rounded-md">
                  <Film className="w-3.5 h-3.5 text-green-300" />
                  <span className="font-semibold">{anime.attributes.episodeCount} eps</span>
                </div>
              )}
              {anime?.attributes?.ageRating && (
                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-900/60 px-2 py-1 rounded-md">
                  <ShieldAlert className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="font-semibold">{anime.attributes.ageRating}</span>
                </div>
              )}
              {anime?.attributes?.averageRating && (
                <div className="flex items-center gap-1 text-pink-400 bg-pink-900/60 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 text-pink-300" />
                  <span className="font-semibold">{anime.attributes.averageRating}%</span>
                </div>
              )}
            </div>
          )
        )}

        {/* Synopsis */}
        <div className="mb-4">
          {textLoading ? (
            <div className="space-y-2">
              <SkeletonLine />
              <SkeletonLine width="w-11/12" />
              <SkeletonLine width="w-10/12" />
              <SkeletonLine width="w-2/3" />
            </div>
          ) : (
            <>
              <p
                className={`text-sm md:text-base ${
                  showMore ? 'line-clamp-6 text-white font-normal' : 'line-clamp-3 text-slate-300'
                } transition-colors duration-200`}
              >
                {synopsis}
              </p>
              {isLongSynopsis && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="mt-1 text-xs text-gray-200 hover:text-white font-semibold"
                >
                  {showMore ? 'Read Less ▲' : 'Read More ▼'}
                </button>
              )}
            </>
          )}
        </div>

        {/* Genres */}
        {textLoading ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonPill key={i} width="w-16" />
            ))}
          </div>
        ) : (
          genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map((genre, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-700 text-gray-200 border border-gray-500 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-3">
          <button
            onClick={handleWatchClick}
            disabled={textLoading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base text-white
              bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-300 hover:to-pink-400
              transition-all duration-200 ${textLoading ? 'opacity-60 cursor-not-allowed' : ''} hover:cursor-pointer`}
          >
            <Play className="w-5 h-5 shrink-0" />
            {textLoading ? <SkeletonBlock className="h-5 w-24 rounded-md" /> : 'Watch Now'}
          </button>

          <button
            onClick={handleAddToWatchlist}
            disabled={textLoading}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base text-white
                       bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400
                       transition-all duration-200 ${textLoading ? 'opacity-60 cursor-not-allowed' : ''} hover:cursor-pointer`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z" />
            </svg>
            {textLoading ? <SkeletonBlock className="h-5 w-28 rounded-md" /> : 'Add to Watchlist'}
          </button>

          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-white
                       bg-gray-700/80 hover:bg-gray-700/95 transition-all duration-200 hover:cursor-pointer"
          >
            <RotateCw className={`w-4 h-4 shrink-0 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing…' : 'Another'}
          </button>
        </div>
      </div>

      {/* Image Section */}
      <div
        className="relative w-full h-full group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWatchClick}
      >
        <ImageWithSkeleton src={heroImg} alt={englishTitle} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-3 right-3 flex items-center bg-purple-600 text-white font-bold text-xs rounded-full py-1 px-3"
        >
          <Sparkle className="w-3.5 mr-1" />
          Recommended for you
        </motion.div>
      </div>

      {/* Error Modal */}
      <SorryCard show={showSorry || isError} onClose={() => setShowSorry(false)} />
    </div>
  );
}