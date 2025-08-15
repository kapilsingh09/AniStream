import React, { useState, useRef } from 'react';
import discussion from '../assets/discussion.png';

const dummyFunFacts = {
  'One Piece': [
    'Oda can draw with both hands at the same time! 😊',
    'Over 500 million copies sold—record-shattering! 🤩',
  ],
  'Naruto': [
    'Naruto was almost named "Kumomaru"! 😮',
    'Ichiraku Ramen is a real place! 😋',
  ],
  'Attack on Titan': [
    'Titan movements are modeled after drunk people. 😰',
    '"Eren" means "saint" in Turkish. 🤔',
  ],
  'My Hero Academia': [
    'All Might = Japanese Superman! 😄',
    'The author wanted to make horror manga first. 😱',
  ],
  'Demon Slayer': [
    'Zenitsu\'s bird is a sparrow, not a crow. 🥰',
    'The whole manga was hand-drawn. 😤',
  ],
  'Death Note': [
    'L crouches to conserve energy. 🤨',
    'Light\'s name isn\'t the Japanese word for "light". 😏',
  ],
  'Dragon Ball': [
    'Goku\'s voice is done by an 80+ year-old woman. 🤯',
    'Inspired by "Journey to the West". 😌',
  ],
};

// Temporary placeholder images from Unsplash (replace with your own later)
const animeImages = {
  'One Piece': 'https://via.placeholder.com/100x100.png?text=One+Piece',
  'Naruto': 'https://via.placeholder.com/100x100.png?text=Naruto',
  'Attack on Titan': 'https://via.placeholder.com/100x100.png?text=AoT',
  'My Hero Academia': 'https://via.placeholder.com/100x100.png?text=MHA',
  'Demon Slayer': 'https://via.placeholder.com/100x100.png?text=DS',
  'Death Note': 'https://via.placeholder.com/100x100.png?text=Death+Note',
  'Dragon Ball': 'https://via.placeholder.com/100x100.png?text=DB',
};

const FactsSlider = () => {
  const animeTitles = Object.keys(dummyFunFacts);
  const [loaded, setLoaded] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const scrollRef = useRef(null);

  const startDrag = (clientX) => {
    setIsDragging(true);
    dragStart.current = {
      x: clientX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    };
  };

  const onDrag = (clientX) => {
    if (!isDragging) return;
    const x = clientX - scrollRef.current.offsetLeft;
    const walk = x - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - walk;
  };

  const stopDrag = () => setIsDragging(false);

  return (
    <div className="rm-selection bg-gradient-to-b from-black to-slate-900 min-h-[50vh]">
      <section className="flex flex-col lg:flex-row h-full w-full v overflow-hidden scroll-container  ">
        
        {/* Left Image */}  
        <div className="flex items-center relative justify-center w-full lg:w-[30%] p-4">
          <img 
            className="object-cover max-h-[40vh] sm:max-h-[45vh] absolute bottom-0 left-1/6"
            src={discussion}
            alt="Anime discussion illustration"
          />
        </div>

        {/* Right Content */} 
        <div className="w-full lg:w-2/3 flex flex-col pt-4 lg:mt-8">
        <div className=' flex items-center justify-between'>
        <h2 className="text-white/80 text-2xl sm:text-3xl md:text-4xl font-bold px-4 mb-4">
            Fun Facts About Anime
          </h2>

          <button className="flex items-center gap-2 cursor-pointer hover:underline text-white rounded-lg border border-gray-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg">
          View All
        </button>
        </div>

          <div
            ref={scrollRef}
            className={`scroll-container flex gap-4 sm:gap-6 px-4 py-4 sm:py-6 overflow-x-auto items-start relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={(e) => startDrag(e.pageX)}
            onMouseMove={(e) => onDrag(e.pageX)}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchStart={(e) => startDrag(e.touches[0].pageX)}
            onTouchMove={(e) => onDrag(e.touches[0].pageX)}
            onTouchEnd={stopDrag}
          >
            {animeTitles.map((title) => (
              <div
                key={title}
                className="min-w-[260px] sm:min-w-[300px] max-w-[320px] h-[28vh] sm:h-[32vh] rounded-2xl p-4 sm:p-5 flex-shrink-0 border border-white/10 relative bg-black/20"
              >
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-3 text-purple-200">
                    {!loaded[title] && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-300/20 animate-pulse"></div>
                    )}
                    <img
                      src={animeImages[title]}
                      alt={`${title} cover`}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-purple-300/30 transition-opacity duration-300 ${loaded[title] ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setLoaded((prev) => ({ ...prev, [title]: true }))}
                    />
                    {title}
                  </h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm font-medium leading-snug">
                    {dummyFunFacts[title].map((fact, idx) => (
                      <p key={idx} className="text-white/70">
                        {fact}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom scrollbar */}
      {/* <style jsx>{`
  
      `}</style> */}
    </div>
  );
};

export default FactsSlider;
