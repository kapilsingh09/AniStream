import { useState, useEffect } from 'react'
import { Sparkles, Play, Heart, Loader, Star } from 'lucide-react'

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
    const interval = setInterval(rotate, 6000)
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
      className="relative h-96 w-full rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 pl-30 pr-30 via-black to-gray-800 text-white shadow-lg transition duration-700 hover:shadow-2xl hover:shadow-purple-500/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header badges */}
      <div className="absolute top-4 left-36 right-4 z-20 flex justify-between items-center">
        <Badge icon={<Sparkles className="w-3 h-3" />} text="Studio Ghibli" />
        <Badge
          icon={<Heart className="w-3 h-3" />}
          text="Recommended"
          show={isHovered}
        />
      </div>

      {/* Main layout: Text on left, Image on right */}
      <div className="flex h-full">
        {/* Textual Content Section */}
        <div className="w-3/5 p-6 flex flex-col justify-center z-10">
          <h1 className="text-3xl font-bold mb-3 animate-slideInUp">{currentFilm.title}</h1>
          <div className="flex gap-3 text-xs mb-4 animate-slideInUp delay-200">
            <Tag icon={<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />} text={`${currentFilm.score}%`} />
            <Tag text={currentFilm.release} />
            <Tag text={currentFilm.director} className="text-gray-300 font-semibold" />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6 animate-slideInUp delay-400">
            {currentFilm.description.length > 120
              ? currentFilm.description.slice(0, 120) + '...'
              : currentFilm.description}
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(currentFilm.title + ' Studio Ghibli movie watch online')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-slideInUp delay-600"
          >
            <button
              className={`group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg ${isHovered ? 'scale-105 shadow-emerald-500/30' : ''}`}
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Watch Now
            </button>
          </a>
        </div>

        {/* === Image Section with Enhancements === */}
        <div className="w-2/5 relative overflow-hidden px-[30px]"> {/* Added 30px horizontal padding */}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(currentFilm.title + ' Studio Ghibli movie')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <img
                src={currentFilm.image}
                alt={currentFilm.title}
                className={`w-full h-full object-cover rounded-lg transition-all duration-1000 blur-sm`} // Added blur
              />
              {/* Left-side black gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent rounded-lg"></div>

              {/* Play button always visible */}
              <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </a>
        </div>
        {/* === End Image Section === */}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// === Badge Component ===
const Badge = ({ icon, text, show = true }) => (
  <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-md text-xs font-bold transition-all duration-300 ${show ? 'pr-4' : ''}`}>
    {icon}
    <span className={`transition-all duration-300 ${show ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
      {text}
    </span>
  </div>
)

// === Tag Component ===
const Tag = ({ icon, text, className = '' }) => (
  <div className={`flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full ${className}`}>
    {icon}
    <span>{text}</span>
  </div>
)

export default GhibliMovieBanner
