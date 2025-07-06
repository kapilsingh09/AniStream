import { useState, useEffect } from 'react'
import { Sparkles, Play, Loader, Star, Calendar, User } from 'lucide-react'

// Local Ghibli Images
import spiritedAway from '../assets/Spirited Away.jpeg'
import howlsMovingCastle from '../assets/Howl\'s Moving Castle (1).jpeg'
import kikiDeliveryService from '../assets/Kiki\'s Delivery Service.jpeg'
import castleInTheSky from '../assets/castle in the sky scenery.jpeg'
import nausicaa from '../assets/Nausicaä of the Valley of the Wind (Hayao….jpeg'
import ponyo from '../assets/ponyo and sosuke.jpeg'
import windRises from '../assets/The Wind Rises.jpeg'

const GhibliMovieBanner = () => {
  const [films, setFilms] = useState([])
  const [currentFilm, setCurrentFilm] = useState(null)
  const [previousFilm, setPreviousFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const localImages = {
    'Spirited Away': spiritedAway,
    'Howl\'s Moving Castle': howlsMovingCastle,
    'Kiki\'s Delivery Service': kikiDeliveryService,
    'Castle in the Sky': castleInTheSky,
    'Nausicaä of the Valley of the Wind': nausicaa,
    'Ponyo': ponyo,
    'The Wind Rises': windRises,
  }

  const getImageSource = (title, apiImage) =>
    localImages[title] || apiImage || 'https://via.placeholder.com/300x400/1f2937/6b7280?text=No+Image'

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
  }, [])

  useEffect(() => {
    if (!films.length) return

    const rotate = () => {
      setPreviousFilm(currentFilm)
      const random = Math.floor(Math.random() * films.length)
      setCurrentFilm(films[random])
    }

    rotate()
    const interval = setInterval(rotate, 20000)
    return () => clearInterval(interval)
  }, [films])

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

  return (
    <div className="relative h-[32rem] w-full overflow-hidden pl-20 pr-20 bg-black shadow-2xl">
      {/* Background Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <img
          src={currentFilm.image}
          alt={`${currentFilm.title} background`}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
      </div>

      {/* Badges */}
      <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center">
        <StudioBadge />
        <ScoreBadge score={currentFilm.score} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Left Panel */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
                {currentFilm.title}
              </h1>
              <FilmDetails director={currentFilm.director} release={currentFilm.release} />
            </div>
            <p className="text-gray-300 text-base leading-relaxed max-w-lg">
              {currentFilm.description.length > 150
                ? currentFilm.description.slice(0, 150) + '...'
                : currentFilm.description}
            </p>
            <WatchButton title={currentFilm.title} />
          </div>
        </div>

        {/* Right Panel with Play Button Overlay */}
        <div className="md:w-1/2 p-6 flex items-center justify-center">
          <div className="relative w-72 h-96 rounded-xl overflow-hidden shadow-2xl group">
            <img
              src={currentFilm.image}
              alt={currentFilm.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(currentFilm.title + ' Studio Ghibli movie watch online')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
            >
              <div className=" rounded-full p-3 border-4 border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ========== COMPONENTS ========== //

const StudioBadge = () => (
  <div className="flex items-center bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-2xl py-2 px-4 backdrop-blur-sm">
    <Sparkles className="w-4 h-4 mr-2" />
    Studio Ghibli
  </div>
)

const ScoreBadge = ({ score }) => (
  <div className="flex items-center bg-black/60 backdrop-blur-sm text-white font-bold text-sm rounded-full py-2 px-4 border border-white/20">
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
    href={`https://www.google.com/search?q=${encodeURIComponent(title + ' Studio Ghibli movie watch online')}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block"
  >
    <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-3 rounded-full font-bold text-base flex items-center gap-3 shadow-lg">
      <Play className="w-5 h-5" />
      Watch Now
    </button>
  </a>
)

export default GhibliMovieBanner

