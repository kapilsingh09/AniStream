import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Calendar, Play, Info, PlayCircle, Users, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Slider() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('trending');
  const hasFetched = useRef(false);


  const apiEndpoints = {
    trending: 'https://kitsu.io/api/edge/trending/anime?limit=8&fields[anime]=titles,synopsis,coverImage,posterImage,averageRating,status,startDate,episodeCount,ageRating,userCount,favoritesCount,popularityRank&include=genres',

    topRated: 'https://kitsu.io/api/edge/anime?filter[status]=finished&sort=-averageRating&limit=8&fields[anime]=titles,synopsis,coverImage,posterImage,averageRating,status,startDate,episodeCount,ageRating,userCount,favoritesCount,popularityRank',
    
    romcom: 'https://kitsu.io/api/edge/anime?filter[categories]=romance,comedy&sort=-userCount&limit=8&fields[anime]=titles,synopsis,coverImage,posterImage,averageRating,status,startDate,episodeCount,ageRating,userCount,favoritesCount,popularityRank',

    airing: 'https://kitsu.io/api/edge/anime?filter[status]=current&sort=-userCount&limit=8&fields[anime]=titles,synopsis,coverImage,posterImage,averageRating,status,startDate,episodeCount,ageRating,userCount,favoritesCount,popularityRank'
  };

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiEndpoints[currentCategory]);
        const response = await res.json();
        const data = response.data;

        if (!data || data.length === 0) {
          console.warn('No anime data received');
          setSlides([]);
          setLoading(false);
          return;
        }

        const formattedSlides = data.map((anime) => {
          const attributes = anime.attributes;
          
          return {
            id: anime.id,
            malId: attributes.mappings?.find(m => m.externalSite === 'myanimelist/anime')?.externalId,
            image: attributes.coverImage?.original ||
              attributes.coverImage?.large ||
              attributes.posterImage?.original ||
              attributes.posterImage?.large ||
              attributes.posterImage?.medium ||
              'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=No+Image',
            title: attributes.titles?.en ||
              attributes.titles?.en_jp ||
              attributes.titles?.ja_jp ||
              attributes.canonicalTitle ||
              'Unknown Title',
            description: attributes.synopsis ? 
              (attributes.synopsis.length > 200 ? 
                attributes.synopsis.slice(0, 200) + '...' : 
                attributes.synopsis) : 
              'No description available.',
            rating: attributes.averageRating ? 
              (parseFloat(attributes.averageRating) / 10).toFixed(1) : 
              'N/A',
            status: attributes.status,
            startDate: attributes.startDate,
            episodeCount: attributes.episodeCount,
            ageRating: attributes.ageRating,
            userCount: attributes.userCount,
            favoritesCount: attributes.favoritesCount,
            popularityRank: attributes.popularityRank,
            category: currentCategory
          };
        });

        setSlides(formattedSlides);
        setCurrent(0); // Reset to first slide when changing category
      } catch (error) {
        console.error('Error fetching anime:', error);
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [currentCategory]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides.length]);

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

  const changeCategory = (category) => {
    if (category !== currentCategory) {
      setCurrentCategory(category);
      setLoading(true);
    }
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
      case 'current': return 'bg-green-500';
      case 'finished': return 'bg-blue-500';
      case 'upcoming': return 'bg-yellow-500';
      case 'tba': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'current': return 'Airing';
      case 'finished': return 'Completed';
      case 'upcoming': return 'Upcoming';
      case 'tba': return 'TBA';
      default: return 'Unknown';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'topRated': return <Star className="w-4 h-4" />;
      case 'romcom': return '💕';
      case 'airing': return <Play className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'trending': return 'Trending';
      case 'topRated': return 'Top Rated';
      case 'romcom': return 'Rom-Com';
      case 'airing': return 'Currently Airing';
      default: return 'Anime';
    }
  };

  // Motion Variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.6, duration: 0.3 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-white text-xl flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          Loading {getCategoryTitle(currentCategory).toLowerCase()} anime...
        </motion.div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[60vh] bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No anime data available for {getCategoryTitle(currentCategory)}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] overflow-hidden bg-black">
      {/* Category Selector */}
      <div className="absolute top-4 left-4 z-40 flex gap-2">
        {Object.keys(apiEndpoints).map((category) => (
          <motion.button
            key={category}
            onClick={() => changeCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm ${
              currentCategory === category
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-black/40 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getCategoryIcon(category)}
            {getCategoryTitle(category)}
          </motion.button>
        ))}
      </div>

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
                e.target.src = 'https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Image+Not+Available';
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
                <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(slides[current].status)}`}>
                  {getStatusText(slides[current].status)}
                </span>
                {slides[current].ageRating && (
                  <span className="px-2 py-1 bg-gray-800 rounded text-xs font-medium">
                    {slides[current].ageRating}
                  </span>
                )}
                {slides[current].popularityRank && (
                  <span className="px-2 py-1 bg-yellow-600 rounded text-xs font-medium">
                    #{slides[current].popularityRank}
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3 drop-shadow-lg" variants={itemVariants}>
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
                    <span className="text-gray-300 text-sm">{formatDate(slides[current].startDate)}</span>
                  </div>
                )}
                {slides[current].episodeCount && (
                  <div className="flex items-center gap-1">
                    <Play className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-300 text-sm">{slides[current].episodeCount} Episodes</span>
                  </div>
                )}
                {slides[current].userCount && (
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-300" />
                    <span className="text-gray-300 text-sm">{formatNumber(slides[current].userCount)} Users</span>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.p className="text-gray-200 text-sm leading-relaxed max-w-md line-clamp-3" variants={itemVariants}>
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
              current === index ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/70'
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
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}