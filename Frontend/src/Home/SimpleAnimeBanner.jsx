import { useState, useEffect } from 'react'
import { Sparkles, Play, Heart, Loader, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const GhibliMovieBanner = () => {
  const [currentFilm, setCurrentFilm] = useState(null)
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [apiError, setApiError] = useState(false)

  const fetchGhibliFilms = async () => {
    try {
      const response = await fetch('https://ghibliapi.vercel.app/films')
      if (!response.ok) throw new Error('API Error')

      const data = await response.json()
      const formattedFilms = data.map(film => ({
        id: film.id,
        title: film.title,
        release_date: film.release_date,
        rt_score: film.rt_score,
        director: film.director,
        description: film.description,
        image: film.image,
      }))

      setFilms(formattedFilms)
      setApiError(false)
    } catch (error) {
      console.error('API error:', error)
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGhibliFilms()
  }, [])

  useEffect(() => {
    if (films.length === 0) return

    const pickRandomFilm = () => {
      const randomIndex = Math.floor(Math.random() * films.length)
      setCurrentFilm(films[randomIndex])
    }

    pickRandomFilm()
    const interval = setInterval(pickRandomFilm, 6000)
    return () => clearInterval(interval)
  }, [films])

  if (loading) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white rounded-2xl">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-emerald-300" />
        </motion.div>
        <span className="ml-4 text-xl font-medium">Loading Studio Ghibli films...</span>
      </div>
    )
  }

  if (apiError || !currentFilm) {
    return (
      <div className="h-[70vh] w-full flex items-center justify-center bg-black text-white rounded-2xl">
        <p className="text-lg">Failed to load films. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] w-full bg-black text-white overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFilm.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full flex"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <motion.img
              src={currentFilm.image}
              alt={currentFilm.title}
              className="w-full h-full object-contain md:object-cover object-center"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
          </div>

          {/* Header Badges */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-8 z-30">
            {/* Studio Ghibli badge */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1.2 }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="font-bold text-white text-sm">Studio Ghibli</span>
            </motion.div>

            {/* Recommended badge with hover effect */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg backdrop-blur-sm overflow-hidden transition-all duration-500"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 1.2 }}
            >
              <Heart className="w-4 h-4 text-white transition-all duration-300" />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.5 }}
                    className="whitespace-nowrap font-bold text-white text-sm"
                  >
                    Recommended for you
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Movie Content */}
          <div className="relative w-full h-full flex items-center justify-center px-8 z-20">
            <div className="max-w-2xl w-full">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold text-white mb-4 text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {currentFilm.title}
              </motion.h1>

              <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold text-sm">{currentFilm.rt_score}%</span>
                </div>
                <div className="text-white text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
                  {currentFilm.release_date}
                </div>
                <div className="text-gray-200 text-sm font-semibold bg-black/40 px-3 py-1 rounded-full">
                  {currentFilm.director}
                </div>
              </motion.div>

              <motion.p 
                className="text-gray-200 text-base leading-relaxed mb-8 max-w-xl mx-auto text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {currentFilm.description?.length > 150 
                  ? `${currentFilm.description?.substring(0, 150)}...` 
                  : currentFilm.description}
              </motion.p>

              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <button className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-3 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/50">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Now
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default GhibliMovieBanner
