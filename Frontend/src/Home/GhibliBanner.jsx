import { useState, useEffect } from 'react'
import { Sparkles, Play, Heart, Loader, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const GhibliMovieBanner = () => {
  const [films, setFilms] = useState([])
  const [currentFilm, setCurrentFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch('https://ghibliapi.vercel.app/films')
        if (!res.ok) throw new Error('Failed to fetch films.')
        const raw = await res.json()

        const cleaned = raw.map(film => ({
          id: film.id,
          title: film.title,
          description: film.description,
          director: film.director,
          release: film.release_date,
          score: film.rt_score,
          image: film.image,
        }))

        setFilms(cleaned)
        setError(false)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchFilms()
  }, [])

  useEffect(() => {
    if (!films.length) return

    const rotate = () => {
      const random = Math.floor(Math.random() * films.length)
      setCurrentFilm(films[random])
    }

    rotate()
    const interval = setInterval(rotate, 20000) // Slower: 20 seconds
    return () => clearInterval(interval)
  }, [films])

  if (loading) {
    return (
      <div className="h-96 w-full flex items-center justify-center text-white rounded-xl">
        <Loader className="w-6 h-6 animate-spin text-emerald-300" />
        <span className="ml-3 text-base font-medium">Loading Studio Ghibli films...</span>
      </div>
    )
  }

  if (error || !currentFilm) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-black text-white rounded-xl">
        <p className="text-lg font-semibold">Failed to load films. Please try again later.</p>
      </div>
    )
  }

  return (
    <div
      className="relative h-[30rem] w-full rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 pl-30 via-black to-gray-800 text-white shadow-lg transition duration-700 hover:shadow-2xl hover:shadow-purple-500/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header badges */}
      <div className="absolute top-4 left-36 right-4 z-20 flex justify-between items-center">
        <Badge icon={<Sparkles className="w-3 h-3" />} text="Studio Ghibli" />
        <Badge icon={<Heart className="w-3 h-3" />} text="Recommended" show={isHovered} />
      </div>

      {/* Main layout */}
      <div className="flex h-full">
        {/* Left Content */}
        <div className="w-[30%] p-6 flex flex-col justify-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFilm.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 1 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-bold mb-3">{currentFilm.title}</h1>
              <div className="flex gap-3 text-xs mb-4">
                <Tag
                  icon={<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                  text={`${currentFilm.score}%`}
                />
                <Tag text={currentFilm.release} />
                <Tag text={currentFilm.director} className="text-gray-300 font-semibold" />
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                {currentFilm.description.length > 120
                  ? currentFilm.description.slice(0, 120) + '...'
                  : currentFilm.description}
              </p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  currentFilm.title + ' Studio Ghibli movie watch online'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="group bg-gradient-to-r from-purple-500 to-pink-600 cursor-pointer hover:scale-[1.1] text-white px-10 py-3 rounded-full font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg">
                  <Play className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  Watch Now
                </button>
              </a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Image */}
        <div className="w-[65%] relative overflow-hidden px-[30px]">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(currentFilm.title + ' Studio Ghibli movie')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentFilm.id}
                  src={currentFilm.image}
                  alt={currentFilm.title}
                  className="w-full h-full object-cover transition-all duration-1000"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                <div className="border-4 h-20 w-20 rounded-full flex items-center justify-center">
                  <Play className="w-7 h-9 text-white" fill="white" stroke="white" strokeWidth={2} />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

// === Badge Component ===
const Badge = ({ icon, text, show = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center cursor-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-full py-1 px-3 overflow-hidden"
    >
      {icon}
      <span className="ml-1">{text}</span>
    </motion.div>
  )
}

// === Tag Component ===
const Tag = ({ icon, text, className = '' }) => (
  <div className={`flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full ${className}`}>
    {icon}
    <span>{text}</span>
  </div>
)

export default GhibliMovieBanner
