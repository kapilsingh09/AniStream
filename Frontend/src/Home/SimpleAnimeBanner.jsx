import { useState, useEffect } from 'react'
import { Sparkles, Play, Heart, Loader, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Fallback images (keeping your original imports structure)
const fallbackImages = {
  "The Castle of Cagliostro": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
  "Nausicaä of the Valley of the Wind": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "Castle in the Sky": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "My Neighbor Totoro": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "Kiki's Delivery Service": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  "Porco Rosso": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
  "Princess Mononoke": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "Spirited Away": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
  "Howl's Moving Castle": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop",
  "Ponyo": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
  "The Wind Rises": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  "The Boy and the Heron": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
}

const fallbackFilms = [
  {
    "id": "1",
    "title": "The Castle of Cagliostro",
    "release_date": "1979",
    "rt_score": "95",
    "director": "Hayao Miyazaki",
    "description": "Lupin III sets out to uncover the secrets of a mysterious counterfeit operation in the country of Cagliostro, encountering romance and adventure.",
    "image": fallbackImages["The Castle of Cagliostro"]
  },
  {
    "id": "2",
    "title": "Nausicaä of the Valley of the Wind",
    "release_date": "1984",
    "rt_score": "89",
    "director": "Hayao Miyazaki",
    "description": "In a post-apocalyptic world filled with toxic forests, a princess tries to understand and heal a war-torn Earth while protecting her people.",
    "image": fallbackImages["Nausicaä of the Valley of the Wind"]
  },
  {
    "id": "3",
    "title": "Castle in the Sky",
    "release_date": "1986",
    "rt_score": "95",
    "director": "Hayao Miyazaki",
    "description": "A young boy and girl search for a legendary floating castle while being pursued by pirates and government agents.",
    "image": fallbackImages["Castle in the Sky"]
  },
  {
    "id": "4",
    "title": "My Neighbor Totoro",
    "release_date": "1988",
    "rt_score": "94",
    "director": "Hayao Miyazaki",
    "description": "Two young sisters discover magical forest spirits while adapting to life in the Japanese countryside with their father.",
    "image": fallbackImages["My Neighbor Totoro"]
  },
  {
    "id": "5",
    "title": "Kiki's Delivery Service",
    "release_date": "1989",
    "rt_score": "96",
    "director": "Hayao Miyazaki",
    "description": "A young witch starts an independent life in a new town, using her flying abilities to run a delivery service.",
    "image": fallbackImages["Kiki's Delivery Service"]
  },
  {
    "id": "6",
    "title": "Porco Rosso",
    "release_date": "1992",
    "rt_score": "94",
    "director": "Hayao Miyazaki",
    "description": "An ace World War I fighter pilot, cursed to look like a pig, protects the skies over the Adriatic Sea from air pirates.",
    "image": fallbackImages["Porco Rosso"]
  },
  {
    "id": "7",
    "title": "Princess Mononoke",
    "release_date": "1997",
    "rt_score": "93",
    "director": "Hayao Miyazaki",
    "description": "A young prince becomes entangled in a struggle between the supernatural guardians of a forest and human civilization.",
    "image": fallbackImages["Princess Mononoke"]
  },
  {
    "id": "8",
    "title": "Spirited Away",
    "release_date": "2001",
    "rt_score": "97",
    "director": "Hayao Miyazaki",
    "description": "A ten-year-old girl enters a magical world of spirits and must work to save her parents and return to the human world.",
    "image": fallbackImages["Spirited Away"]
  },
  {
    "id": "9",
    "title": "Howl's Moving Castle",
    "release_date": "2004",
    "rt_score": "87",
    "director": "Hayao Miyazaki",
    "description": "A young woman is cursed with old age and seeks the help of a mysterious wizard and his magical moving castle.",
    "image": fallbackImages["Howl's Moving Castle"]
  },
  {
    "id": "10",
    "title": "Ponyo",
    "release_date": "2008",
    "rt_score": "91",
    "director": "Hayao Miyazaki",
    "description": "A magical goldfish princess forms a friendship with a five-year-old boy and yearns to become human.",
    "image": fallbackImages["Ponyo"]
  },
  {
    "id": "11",
    "title": "The Wind Rises",
    "release_date": "2013",
    "rt_score": "89",
    "director": "Hayao Miyazaki",
    "description": "A fictionalized biopic of aircraft engineer Jiro Horikoshi, focusing on his dreams of creating beautiful aircraft.",
    "image": fallbackImages["The Wind Rises"]
  },
  {
    "id": "12",
    "title": "The Boy and the Heron",
    "release_date": "2023",
    "rt_score": "90",
    "director": "Hayao Miyazaki",
    "description": "A boy grieving his mother's death finds a mysterious heron that leads him to a hidden magical world.",
    "image": fallbackImages["The Boy and the Heron"]
  }
]

const GhibliMovieBanner = () => {
  const [currentFilm, setCurrentFilm] = useState(null)
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [apiError, setApiError] = useState(false)

  // Fetch films from Ghibli API
  const fetchGhibliFilms = async () => {
    try {
      const response = await fetch('https://ghibliapi.herokuapp.com/films')
      if (!response.ok) throw new Error('API Error')
      
      const data = await response.json()
      const formattedFilms = data.map(film => ({
        id: film.id,
        title: film.title,
        release_date: film.release_date,
        rt_score: film.rt_score,
        director: film.director,
        description: film.description,
        image: fallbackImages[film.title] || fallbackImages["Spirited Away"]
      }))
      
      setFilms(formattedFilms)
      setApiError(false)
    } catch (error) {
      console.log('API failed, using fallback data')
      setFilms(fallbackFilms)
      setApiError(true)
    }
  }

  useEffect(() => {
    const initializeFilms = async () => {
      await fetchGhibliFilms()
      setLoading(false)
    }

    initializeFilms()
  }, [])

  useEffect(() => {
    if (films.length === 0) return

    const pickRandomFilm = () => {
      const randomIndex = Math.floor(Math.random() * films.length)
      setCurrentFilm(films[randomIndex])
    }

    // Initial film selection
    pickRandomFilm()

    // Change film every 6 seconds
    const interval = setInterval(pickRandomFilm, 6000)
    return () => clearInterval(interval)
  }, [films])

  if (loading || !currentFilm) {
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
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
            />
            {/* Enhanced gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/60"></div>
          </div>

          {/* Top Header with Badges */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-8 z-30">
            {/* Studio Ghibli Badge */}
            <motion.div 
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-xl backdrop-blur-sm"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-lg">Studio Ghibli</span>
            </motion.div>

            {/* Recommended Badge */}
            <motion.div 
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-xl backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Heart className="w-5 h-5 text-white" />
              <AnimatePresence>
                {isHovered ? (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-nowrap font-bold text-white text-lg"
                  >
                    Recommended for you
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-nowrap font-bold text-white text-lg"
                  >
                    Recommended
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="relative w-full h-full flex items-center justify-center px-8 z-20">
            <div className="max-w-4xl w-full">
              {/* Title */}
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {currentFilm.title}
              </motion.h1>

              {/* Movie Info */}
              <motion.div 
                className="flex items-center justify-center gap-6 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold text-lg">{currentFilm.rt_score}%</span>
                </div>
                <div className="text-white text-xl font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                  {currentFilm.release_date}
                </div>
                <div className="text-gray-200 text-xl font-semibold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                  {currentFilm.director}
                </div>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-gray-200 text-xl leading-relaxed mb-12 max-w-3xl mx-auto text-center drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {currentFilm.description?.length > 200 
                  ? `${currentFilm.description?.substring(0, 200)}...` 
                  : currentFilm.description}
              </motion.p>

              {/* Watch Button */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <button className="group bg-gradient-to-r from-purple-500 to-pink-600 hover:from-emerald-600 hover:to-teal-700 text-white px-12 py-4 rounded-full font-bold text-xl flex items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-500/50">
                  <Play className="w-7 h-7 group-hover:scale-110 transition-transform" />
                  Watch Now
                </button>
              </motion.div>
            </div>
          </div>

          {/* Floating Animation Elements */}
          <motion.div
            className="absolute bottom-10 right-10 text-purple-400 opacity-70"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 5,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4 text-pink-400 opacity-50"
            animate={{ 
              y: [0, -10, 0],
              x: [0, 5, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>

          {/* API Status Indicator (subtle) */}
          {apiError && (
            <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
              Using cached data
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default GhibliMovieBanner