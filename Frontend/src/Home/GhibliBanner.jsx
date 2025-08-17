import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Play, Loader, Star, Calendar, User } from "lucide-react"

// Local Ghibli Images
import spiritedAway from "../assets/Spirited Away.jpeg"
import howlsMovingCastle from "../assets/Howl's Moving Castle (1).jpeg"
import kikiDeliveryService from "../assets/Kiki's Delivery Service.jpeg"
import castleInTheSky from "../assets/castle in the sky scenery.jpeg"
import nausicaa from "../assets/Nausicaä of the Valley of the Wind (Hayao….jpeg"
import ponyo from "../assets/ponyo and sosuke.jpeg"
import windRises from "../assets/The Wind Rises.jpeg"

const GhibliMovieBanner = () => {
  const [films, setFilms] = useState([])
  const [currentFilm, setCurrentFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Local overrides for key films
  const localImages = {
    "Spirited Away": spiritedAway,
    "Howl's Moving Castle": howlsMovingCastle,
    "Kiki's Delivery Service": kikiDeliveryService,
    "Castle in the Sky": castleInTheSky,
    "Nausicaä of the Valley of the Wind": nausicaa,
    Ponyo: ponyo,
    "The Wind Rises": windRises,
  }

  const getImageSource = (title, apiImage) =>
    localImages[title] ||
    apiImage ||
    "https://via.placeholder.com/300x400/1f2937/6b7280?text=No+Image"

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films")
        if (!res.ok) throw new Error("Failed to fetch films.")
        const raw = await res.json()

        const cleaned = raw.map((film) => ({
          id: film.id,
          title: film.title,
          description: film.description,
          director: film.director,
          release: film.release_date,
          score: film.rt_score,
          image: getImageSource(film.title, film.image),
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
  },[])

  // Auto-rotate films
  useEffect(() => {
    if (!films.length) return
    const rotate = () => {
      const random = Math.floor(Math.random() * films.length)
      setCurrentFilm(films[random])
    }
    rotate()
    const interval = setInterval(rotate, 15000)
    return () => clearInterval(interval)
  }, [films])

  if (loading) {
    return (
      <div className="relative h-[32rem] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-purple-400" />
        <p className="ml-4 text-white font-medium">Loading Studio Ghibli Films...</p>
      </div>
    )
  }

  if (error || !currentFilm) {
    return (
      <div className="relative h-[32rem] w-full bg-gradient-to-br from-red-900 via-slate-900 to-red-900 rounded-2xl overflow-hidden flex items-center justify-center">
        <p className="text-white text-lg font-semibold">Failed to load films. Try again later.</p>
      </div>
    )
  }

  return (
    <div className="relative h-[32rem] w-full overflow-hidden rounded-2xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFilm.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={currentFilm.image}
            alt={currentFilm.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Badges */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        <StudioBadge />
        <ScoreBadge score={currentFilm.score} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row h-full px-12">
        {/* Left Panel */}
        <motion.div
          key={currentFilm.title + "-text"}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex flex-col justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {currentFilm.title}
          </h1>
          <FilmDetails director={currentFilm.director} release={currentFilm.release} />
          <p className="text-gray-300 text-base mt-4 max-w-lg">
            {currentFilm.description.length > 160
              ? currentFilm.description.slice(0, 160) + "..."
              : currentFilm.description}
          </p>
          <div className="mt-6">
            <WatchButton title={currentFilm.title} />
          </div>
        </motion.div>

        {/* Right Panel Poster */}
        <motion.div
          key={currentFilm.title + "-poster"}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 flex items-center justify-center"
        >
          <div className="relative w-72 h-96 rounded-xl overflow-hidden shadow-2xl group">
            <img
              src={currentFilm.image}
              alt={currentFilm.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                currentFilm.title + " Studio Ghibli movie watch online"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="rounded-full p-4 border-4 border-white/40"
              >
                <Play className="w-6 h-6 text-white fill-white" />
              </motion.div>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ===== Components ===== //

const StudioBadge = () => (
  <div className="flex items-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-2xl py-2 px-4 backdrop-blur-sm shadow-md">
    <Sparkles className="w-4 h-4 mr-2" />
    Studio Ghibli
  </div>
)

const ScoreBadge = ({ score }) => (
  <div className="flex items-center bg-black/70 backdrop-blur-sm text-white font-bold text-sm rounded-full py-2 px-4 border border-white/20">
    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
    {score}%
  </div>
)

const FilmDetails = ({ director, release }) => (
  <div className="flex items-center gap-4 text-sm text-gray-400">
    <div className="flex items-center gap-1">
      <Calendar className="w-4 h-4" />
      <span>{release}</span>
    </div>
    <div className="flex items-center gap-1">
      <User className="w-4 h-4" />
      <span>{director}</span>
    </div>
  </div>
)

const WatchButton = ({ title }) => (
  <a
    href={`https://www.google.com/search?q=${encodeURIComponent(
      title + " Studio Ghibli movie watch online"
    )}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-full font-bold text-base flex items-center gap-3 shadow-lg hover:shadow-2xl transition-transform hover:scale-105">
      <Play className="w-5 h-5" />
      Watch Now
    </button>
  </a>
)

export default GhibliMovieBanner
