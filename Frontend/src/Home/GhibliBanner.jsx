import { useState, useEffect } from 'react'
import { Sparkles, Play, Heart, Loader, Star, Calendar, User } from 'lucide-react'

const GhibliMovieBanner = () => {
  const [films, setFilms] = useState([])
  const [currentFilm, setCurrentFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Fetch Ghibli films on component mount
  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const res = await fetch('https://ghibliapi.vercel.app/films')
        if (!res.ok) throw new Error('Failed to fetch films.')

        const raw = await res.json()

        // Clean and shape film data
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

  // Rotate to a random film every 20 seconds
  useEffect(() => {
    if (!films.length) return

    const rotate = () => {
      const random = Math.floor(Math.random() * films.length)
      setCurrentFilm(films[random])
    }

    rotate() // Set initial film
    const interval = setInterval(rotate, 20000) // Every 20s
    return () => clearInterval(interval)
  }, [films])

  // Loading State
  if (loading) {
    return (
      <div className="relative h-[32rem] w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading Studio Ghibli Films...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !currentFilm) {
    return (
      <div className="relative h-[32rem] w-full bg-gradient-to-br from-red-900 via-slate-900 to-red-900 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-white text-lg font-semibold">Failed to load films</p>
            <p className="text-red-300 text-sm mt-2">Please try again later</p>
          </div>
        </div>
      </div>
    )
  }

  // Main Banner Component
  return (
    <div
      className="relative h-[32rem] w-full  pl-30 pr-30 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 shadow-2xl transition-all duration-500 hover:shadow-purple-500/25"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={currentFilm.image}
          alt={currentFilm.title}
          className="w-full h-full object-cover opacity-30 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        <StudioBadge />
        <ScoreBadge score={currentFilm.score} isVisible={isHovered} />
      </div>

      {/* Content Layout */}
      <div className="relative z-10 flex h-full">
        {/* Left Content Panel */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                {currentFilm.title}
              </h1>
              <FilmDetails 
                director={currentFilm.director}
                release={currentFilm.release}
              />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base leading-relaxed max-w-lg">
              {currentFilm.description.length > 150
                ? currentFilm.description.slice(0, 150) + '...'
                : currentFilm.description}
            </p>

            {/* Action Button */}
            <WatchButton 
              title={currentFilm.title}
              isHovered={isHovered}
            />
          </div>
        </div>

        {/* Right Image Panel */}
        <div className="w-1/2 p-6 flex items-center justify-center">
          <div className="relative group">
            <div className="w-72 h-96 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-105">
              <img
                src={currentFilm.image}
                alt={currentFilm.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x400/1f2937/6b7280?text=No+Image";
                }}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className=" backdrop-blur-sm rounded-full p-4 border-4 border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Studio Badge Component
const StudioBadge = () => (
  <div className="flex items-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-2xl   py-2 px-4 backdrop-blur-sm">
    <Sparkles className="w-4 h-4 mr-2" />
    Studio Ghibli
  </div>
)

// Score Badge Component
const ScoreBadge = ({ score, isVisible }) => (
  <div className={`flex items-center bg-black/60 backdrop-blur-sm text-white font-bold text-sm rounded-full py-2 px-4 border border-white/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
    {score}%
  </div>
)

// Film Details Component
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

// Watch Button Component
const WatchButton = ({ title, isHovered }) => (
  <a
    href={`https://www.google.com/search?q=${encodeURIComponent(title + ' Studio Ghibli movie watch online')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block"
  >
    <button className={`group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-full font-bold text-base flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${isHovered ? 'animate-pulse' : ''}`}>
      <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
      Watch Now
    </button>
  </a>
)

export default GhibliMovieBanner  