import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar, Play, Info, PlayCircle, Users, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

const API_ENDPOINTS = {
  // trending:
  //   'https://kitsu.io/api/edge/trending/anime?limit=20&fields[anime]=titles,synopsis,coverImage,posterImage,averageRating,status,startDate,episodeCount,ageRating,userCount,favoritesCount,popularityRank',
  topRated:
    'https://kitsu.io/api/edge/trending/anime?limit=10&fields[anime]=titles,synopsis,coverImage,posterImage,averageRating,status,startDate,episodeCount,ageRating,userCount,favoritesCount,popularityRank',
};

async function fetchAnimeTopRated() {
  const res = await fetch(API_ENDPOINTS.topRated);
  if (!res.ok) throw new Error('Failed to fetch anime');
  const response = await res.json();
  const data = response.data;
  if (!data || data.length === 0) {
    return [];
  }
  return data.map((anime) => {
    const attributes = anime.attributes;
    return {
      id: anime.id,
      malId: attributes.mappings?.find(m => m.externalSite === 'myanimelist/anime')?.externalId,
      image:
        attributes.coverImage?.original ||
        attributes.coverImage?.large ||
        attributes.posterImage?.original ||
        attributes.posterImage?.large ||
        attributes.posterImage?.medium ||
        'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=No+Image',
      title:
        attributes.titles?.en ||
        attributes.titles?.en_jp ||
        attributes.titles?.ja_jp ||
        attributes.canonicalTitle ||
        'Unknown Title',
      description: attributes.synopsis
        ? attributes.synopsis.length > 200
          ? attributes.synopsis.slice(0, 200) + '...'
          : attributes.synopsis
        : 'No description available.',
      rating: attributes.averageRating
        ? (parseFloat(attributes.averageRating) / 10).toFixed(1)
        : 'N/A',
      status: attributes.status,
      startDate: attributes.startDate,
      episodeCount: attributes.episodeCount,
      ageRating: attributes.ageRating,
      userCount: attributes.userCount,
      favoritesCount: attributes.favoritesCount,
      popularityRank: attributes.popularityRank,
      category: 'topRated',
    };
  });
}

// Skeleton Loader for the slider
function SliderSkeleton() {
  // Show 1 skeleton slide
  return (
    <div className="relative w-full h-[70vh] min-h-[80vh] overflow-hidden mt-1z5 bg-black">
      {/* Category Selector Skeleton */}
      <div className="absolute top-4 left-4 z-40 flex gap-2">
        <div className="px-8 py-2 rounded-lg bg-white/10 animate-pulse" />
      </div>
      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/100 via-black/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-black/90 via-black/10 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-black/100 via-black/50 to-transparent" />
      </div>
      {/* Slide Skeleton */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gray-800 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 z-10" />
        {/* Content Skeleton */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-lg ml-4 md:ml-8 text-white space-y-3">
            {/* Status & Age Rating Skeleton */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-16 h-6 rounded-full bg-white/10 animate-pulse" />
              <div className="w-10 h-6 rounded bg-white/10 animate-pulse" />
              <div className="w-10 h-6 rounded bg-white/10 animate-pulse" />
            </div>
            {/* Title Skeleton */}
            <div className="h-8 w-3/4 bg-white/10 rounded mb-3 animate-pulse" />
            {/* Info Skeleton */}
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
              <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
            </div>
            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
            </div>
            {/* Buttons Skeleton */}
            <div className="flex gap-3 pt-3">
              <div className="h-10 w-28 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-10 w-28 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Skeleton */}
      <div className="absolute bottom-[25%] right-4 z-30 flex flex-col space-y-2">
        <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
      </div>
      {/* Dots Skeleton */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-2 bg-white/20 rounded-full animate-pulse" />
        ))}
      </div>
      {/* Progress Bar Skeleton */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/30 z-90 overflow-hidden">
        <div className="h-full bg-white/20 w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const currentCategory = 'topRated';

  // TanStack Query for fetching anime, refetch every 24 hours (24*60*60*1000 ms)
  const {
    data: slides = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['anime', currentCategory],
    queryFn: fetchAnimeTopRated,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 25 * 60 * 60 * 1000, // 25 hours, just to be safe
    refetchOnWindowFocus: false,
  });

  // Reset current slide when slides change
  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  // Auto-advance slides
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'bg-green-500';
      case 'finished':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-yellow-500';
      case 'tba':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'current':
        return 'Airing';
      case 'finished':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'tba':
        return 'TBA';
      default:
        return 'Unknown';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'topRated':
        return <Star className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'topRated':
        return 'Top Rated';
      default:
        return 'Anime';
    }
  };

  // Motion Variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.6, duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  if (loading) {
    // Show skeleton loader
    return <SliderSkeleton />;
  }

  if (isError || !slides || slides.length === 0) {
    return (
      <div className="w-full h-[60vh] bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">
          No anime data available for {getCategoryTitle(currentCategory)}
        </div>
        <motion.button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200"
          whileHover={{ scale: 1.05, rotate: 3 }}
          whileTap={{ scale: 0.95, rotate: -3 }}
        >
          <RefreshCw className="w-5 h-5 animate-spin-slow" />
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[80vh] overflow-hidden mt-14 bg-black">
   

      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/100 via-black/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-black/90 via-black/10 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-black/100 via-black/50 to-transparent" />
      </div>

      {/* Slide */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0">
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Image+Not+Available';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 z-10" />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center">
            <motion.div
              className="max-w-lg ml-4 md:ml-8 text-white space-y-3"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Status & Age Rating */}
              <motion.div className="flex items-center gap-2 mb-2" variants={itemVariants}>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                    slides[current].status
                  )}`}
                >
                  {getStatusText(slides[current].status)}
                </span>
                {slides[current].ageRating && (
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium">
                    {slides[current].ageRating}
                  </span>
                )}
                {slides[current].popularityRank && (
                  <span className="px-2 py-1 bg-yellow-600 rounded text-xs font-medium">
                    #spotlight:{current + 1}
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-2xl md:text-3xl font-bold leading-tight mb-3 drop-shadow-lg"
                variants={itemVariants}
              >
                {slides[current].title}
              </motion.h1>

              {/* Info */}
              <motion.div className="flex items-center gap-4 mb-3 flex-wrap" variants={itemVariants}>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">{slides[current].rating}/10</span>
                </div>
                {slides[current].startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-300 text-sm">
                      {formatDate(slides[current].startDate)}
                    </span>
                  </div>
                )}
                {slides[current].episodeCount && (
                  <div className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-300 text-sm">
                      {slides[current].episodeCount} Episodes
                    </span>
                  </div>
                )}
                {slides[current].userCount && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-300 text-sm">
                      {formatNumber(slides[current].userCount)} Users
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.p
                className="text-gray-200 text-sm leading-relaxed max-w-md line-clamp-3"
                variants={itemVariants}
              >
                {slides[current].description}
              </motion.p>

              {/* Buttons */}
              <motion.div className="flex gap-3 pt-3" variants={itemVariants}>
                <motion.button
                  className="bg-transparent border-2 border-white/20 text-white p-2 px-4 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300 hover:bg-white/10 cursor-pointer backdrop-blur-sm"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch Now
                </motion.button>
                <motion.button
                  className="bg-transparent border-2 border-white/20 text-white p-2 px-4 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all duration-300 hover:bg-gradient-to-br hover:from-zinc-900/70 hover:via-gray-900/70 hover:to-black/70 hover:border-white/30 cursor-pointer backdrop-blur-sm"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Info className="w-4 h-4" />
                  Details
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-[25%] right-4 z-30 flex flex-col space-y-2">
        <motion.button
          onClick={prevSlide}
          className="bg-zinc-800/60 hover:bg-black/80 flex items-center justify-center text-white p-2 cursor-pointer rounded-lg transition-all duration-200 backdrop-blur-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="bg-zinc-800/60 flex items-center outline-none justify-center hover:bg-black/80 text-white p-2 cursor-pointer rounded-lg transition-all duration-200 backdrop-blur-none"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              current === index
                ? 'w-4 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/30 z-90 overflow-hidden">
        <motion.div
          className="h-full bg-white/50 relative"
          initial={{ width: 0 }}
          animate={{ width: `${((current + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}