import { useState, useEffect } from 'react'
import { Sparkles,Sparkle, Play, Heart, Loader, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'


import cagliostro from '../assets/e78d6765-b044-4c06-b14c-7f255fcda4a3.jpeg'
import nausicaa from "../assets/Nausicaä of the Valley of the Wind (Hayao….jpeg"
import castleInTheSky from '../assets/castle in the sky scenery.jpeg'
import totoro from '../assets/5f34f2c5-6c41-4468-bde6-89dd886515da.jpeg'
import kiki from "../assets/Kiki's Delivery Service.jpeg"
import porcoRosso from '../assets/064af148-cd26-41a6-b70f-a3aa1ac1c81a.jpeg'
import mononoke from '../assets/☆ (1).jpeg'
import spiritedAway from '../assets/Spirited Away.jpeg'
import howl from "../assets/Howl's Moving Castle (1).jpeg"
import ponyo from '../assets/ponyo and sosuke.jpeg'
import windRises from '../assets/The Wind Rises.jpeg'
import boyAndHeron from '../assets/The Wind Rises.jpeg' // No direct match, using Wind Rises as placeholder

const fallbackFilms = [
  {
    "mal_id": 1,
    "title": "The Castle of Cagliostro",
    "release_date": "1979",
    "rt_score": "Not Available",
    "director": "Hayao Miyazaki",
    "description": "Lupin III sets out to uncover the secrets of a mysterious counterfeit operation in the country of Cagliostro.",
    "bannerImage": cagliostro,
    "trailer": "https://www.youtube.com/watch?v=3uZ1MZr1wbw"
  },
  {
    "mal_id": 2,
    "title": "Nausicaä of the Valley of the Wind",
    "release_date": "1984",
    "rt_score": "89",
    "director": "Hayao Miyazaki",
    "description": "In a post-apocalyptic world, a princess tries to understand and heal a war-torn Earth.",
    "bannerImage": nausicaa,
    "trailer": "https://www.youtube.com/watch?v=6zhLBe319KE"
  },
  {
    "mal_id": 3,
    "title": "Castle in the Sky",
    "release_date": "1986",
    "rt_score": "95",
    "director": "Hayao Miyazaki",
    "description": "An adventure in a floating city.",
    "bannerImage": castleInTheSky,
    "trailer": "https://www.youtube.com/watch?v=ug5As9S8IxU"
  },
  {
    "mal_id": 4,
    "title": "My Neighbor Totoro",
    "release_date": "1988",
    "rt_score": "94",
    "director": "Hayao Miyazaki",
    "description": "Two girls befriend forest spirits in rural Japan.",
    "bannerImage": totoro,
    "trailer": "https://www.youtube.com/watch?v=92a7Hj0ijLs"
  },
  {
    "mal_id": 5,
    "title": "Kiki's Delivery Service",
    "release_date": "1989",
    "rt_score": "96",
    "director": "Hayao Miyazaki",
    "description": "A young witch starts a flying delivery service in a new town.",
    "bannerImage": kiki,
    "trailer": "https://www.youtube.com/watch?v=4bG17OYs-GA"
  },
  {
    "mal_id": 6,
    "title": "Porco Rosso",
    "release_date": "1992",
    "rt_score": "94",
    "director": "Hayao Miyazaki",
    "description": "An ace pilot, cursed to look like a pig, protects the skies of Italy.",
    "bannerImage": porcoRosso,
    "trailer": "https://www.youtube.com/watch?v=awEC-aLDzjs"
  },
  {
    "mal_id": 7,
    "title": "Princess Mononoke",
    "release_date": "1997",
    "rt_score": "93",
    "director": "Hayao Miyazaki",
    "description": "A prince becomes entangled in a struggle between industrial civilization and nature.",
    "bannerImage": mononoke,
    "trailer": "https://www.youtube.com/watch?v=4OiMOHRDs14"
  },
  {
    "mal_id": 8,
    "title": "Spirited Away",
    "release_date": "2001",
    "rt_score": "97",
    "director": "Hayao Miyazaki",
    "description": "A young girl enters a magical world of spirits.",
    "bannerImage": spiritedAway,
    "trailer": "https://www.youtube.com/watch?v=ByXuk9QqQkk"
  },
  {
    "mal_id": 9,
    "title": "Howl's Moving Castle",
    "release_date": "2004",
    "rt_score": "87",
    "director": "Hayao Miyazaki",
    "description": "A magical moving castle, a cursed girl, and a mysterious wizard.",
    "bannerImage": howl,
    "trailer": "https://www.youtube.com/watch?v=iwROgK94zcM"
  },
  {
    "mal_id": 10,
    "title": "Ponyo",
    "release_date": "2008",
    "rt_score": "91",
    "director": "Hayao Miyazaki",
    "description": "A goldfish princess yearns to become human.",
    "bannerImage": ponyo,
    "trailer": "https://www.youtube.com/watch?v=CsR3KVgBzSM"
  },
  {
    "mal_id": 11,
    "title": "The Wind Rises",
    "release_date": "2013",
    "rt_score": "89",
    "director": "Hayao Miyazaki",
    "description": "A fictionalized biopic of aircraft engineer Jiro Horikoshi.",
    "bannerImage": windRises,
    "trailer": "https://www.youtube.com/watch?v=2QFBZgAZx7g"
  },
  {
    "mal_id": 12,
    "title": "The Boy and the Heron",
    "release_date": "2023",
    "rt_score": "90",
    "director": "Hayao Miyazaki",
    "description": "A boy finds a mysterious heron leading to a hidden world.",
    "bannerImage": boyAndHeron,
    "trailer": "https://www.youtube.com/watch?v=5wXqOZOdC2U"
  }
]


const GhibliMovieBanner = () => {
  const [currentFilm, setCurrentFilm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const pickRandomFilm = () => {
      const randomIndex = Math.floor(Math.random() * fallbackFilms.length)
      setCurrentFilm(fallbackFilms[randomIndex])
    }

    // Initial load
    pickRandomFilm()
    setLoading(false)

    // Set interval for every 5 seconds
    // const interval = setInterval(() => {
    //   pickRandomFilm()
    // }, 6000)

    // Cleanup
    return () => clearInterval(interval)
  }, [])

  if (loading || !currentFilm) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
          <Loader className="w-8 h-8 text-emerald-300" />
        </motion.div>
        <span className="ml-4 text-lg">Loading Studio Ghibli films...</span>
      </div>
    )
  }
  return (
    <div className="relative h-[70vh] w-[90%] bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFilm.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-full flex"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Content Area - 40% */}
          <div className="relative w-[35%] h-full flex flex-col justify-center px-8 md:px-12 z-20 bg-gradient-to-r from-black via-black to-transparent">
            {/* Studio Ghibli Badge */}
            <motion.div 
              className="absolute top-10 left-7   px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 shadow-lg "
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 text-sm text-white">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Studio Ghibli</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl font-bold ml-3 text-white mb-4 leading-tight drop-shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {currentFilm.title}
            </motion.h1>

            {/* Director and Year */}
            <motion.div 
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex   ">
                {/* <Star className="w-4 h-4 text-white fill-white" /> */}
                {/* <span className="text-black font-bold text-sm">{currentFilm.rt_score}%</span> */}
              </div>
              <span className="text-white text-lg font-medium"> | {currentFilm.release_date}</span>
              <span className="text-gray-300 text-lg font-semibold">
                by {currentFilm.director}</span>
            </motion.div>

            {/* Description */}
            {/* <motion.p 
              className="text-gray-200 text-lg leading-relaxed mb-8 max-w-lg drop-shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {currentFilm.description?.length > 180 
                ? `${currentFilm.description?.substring(0, 180)}...` 
                : currentFilm.description}
            </motion.p> */}

            {/* Buttons */}
            <motion.div 
              // className="flex gap-4"
              // initial={{ opacity: 0, x: -30 }}
              // animate={{ opacity: 1, x: 0 }}
              // transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button className="group absolute bottom-8 mt-20 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-[20px] font-bold text-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-emerald-500/40">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Watch Now
              </button>
              
              {/* <button className="bg-black/60 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg border border-emerald-500/50 hover:border-emerald-400 hover:bg-emerald-500/20 transition-all duration-300 transform hover:scale-105">
                More Films
              </button> */}
            </motion.div>
          </div>

          {/* Right Side Image - 60% */}
          <div className="absolute right-0 w-[65%] h-full">
            <motion.img
              src={currentFilm.bannerImage}
              alt={currentFilm.title}
              className="w-full h-full object-cover object-center"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            
            {/* Black blur gradient overlay for blending effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>

            {/* Miyazaki Signature Badge */}
   
            <motion.div className="absolute top-9 right-3 z-20 flex items-center cursor-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold text-sm rounded-full py-1 px-3 overflow-hidden">
          <Heart className="w-4 mr-1" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3 }}
                className="whitespace-nowrap"
              >
                Recommended for you
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

            {/* Floating magical elements */}
            {/* <motion.div
              className="absolute bottom-12 right-12 text-emerald-300"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-8 h-8 opacity-70" />
            </motion.div> */}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default GhibliMovieBanner