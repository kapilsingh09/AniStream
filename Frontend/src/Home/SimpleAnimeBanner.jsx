import { useState, useEffect } from 'react'
import { Sparkles, Play, Heart, Loader, Star } from 'lucide-react'

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
      <div className="h-96 w-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white rounded-xl">
        <div className="animate-spin">
          <Loader className="w-8 h-8 text-emerald-300" />
        </div>
        <span className="ml-3 text-lg font-medium">Loading Studio Ghibli films...</span>
      </div>
    )
  }

  if (apiError || !currentFilm) {
    return (
      <div className="h-96 w-full flex items-center justify-center bg-black text-white rounded-xl">
        <p className="text-lg">Failed to load films. Please try again later.</p>
      </div>
    )
  }

  return (
    <div 
      className="relative h-96 w-full bg-black text-white overflow-hidden rounded-xl shadow-lg transition-all duration-700 hover:shadow-2xl hover:shadow-purple-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header Badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-md text-xs font-bold">
          <Sparkles className="w-3 h-3" />
          <span>Studio Ghibli</span>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-md transition-all duration-300 ${isHovered ? 'pr-4' : ''}`}>
          <Heart className="w-3 h-3" />
          <span className={`text-xs font-bold transition-all duration-300 overflow-hidden ${isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            Recommended
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-full">
        {/* Image Side */}
        <div className="w-2/5 relative overflow-hidden">
          <img
            key={currentFilm.title}
            src={currentFilm.image}
            alt={currentFilm.title}
            className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}
            style={{
              animation: 'fadeIn 1s ease-in-out'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40"></div>
        </div>

        {/* Content Side */}
        <div className="w-3/5 p-6 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/60 to-purple-900/40"></div>
          
          <div className="relative z-10">
            <h1 
              key={`${currentFilm.title}-title`}
              className="text-2xl md:text-3xl font-bold mb-3 transition-all duration-700"
              style={{
                animation: 'slideInUp 0.8s ease-out'
              }}
            >
              {currentFilm.title}
            </h1>

            <div 
              className="flex items-center gap-3 mb-4"
              style={{
                animation: 'slideInUp 0.8s ease-out 0.2s both'
              }}
            >
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold">{currentFilm.rt_score}%</span>
              </div>
              <div className="text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                {currentFilm.release_date}
              </div>
              <div className="text-xs font-semibold bg-black/50 px-2 py-1 rounded-full text-gray-300">
                {currentFilm.director}
              </div>
            </div>

            <p 
              key={`${currentFilm.title}-desc`}
              className="text-gray-300 text-sm leading-relaxed mb-6"
              style={{
                animation: 'slideInUp 0.8s ease-out 0.4s both'
              }}
            >
              {currentFilm.description?.length > 120 
                ? `${currentFilm.description?.substring(0, 120)}...` 
                : currentFilm.description}
            </p>

            <div 
              style={{
                animation: 'slideInUp 0.8s ease-out 0.6s both'
              }}
            >
              <button className={`group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg ${isHovered ? 'scale-105 shadow-emerald-500/30' : ''}`}>
                <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default GhibliMovieBanner