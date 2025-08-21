import React, { useState, useRef } from 'react';
import discussion from '../assets/discussion.png';

// Girls images
import img1 from '../assets/Grls_f/6c9c6b5c-39fb-48ed-a942-6561bd98dc90.jpg';
import img2 from '../assets/Grls_f/56cbb7dc-7b6a-439a-a60e-0eb7163dc2a8.jpg';
import img3 from '../assets/Grls_f/ba8ccae9-8d39-4752-913c-d9d70034ec22.jpg';
import img4 from '../assets/Grls_f/Alisa Mikhailovna kujou ( Alya ).jpg';
import img5 from '../assets/Grls_f/Tokidoki Bosotto Russia-go de Dereru Tonari no Alya-san.jpg';
import img6 from '../assets/Grls_f/Frieren .jpg';
// Add more imports as needed for all images you want to use

const dummyFunFacts = {
  'One Piece': [
    'Eiichiro Oda can draw with both hands at the same time! 😊',
    'Over 500 million copies sold—record-shattering! 🤩',
  ],
  'Naruto': [
    'Naruto was almost named "Kumomaru"! 😮 (Masashi Kishimoto)',
    'Ichiraku Ramen is a real place! 😋 (Masashi Kishimoto)',
  ],
  'Attack on Titan': [
    'Titan movements are modeled after drunk people. 😰 (Hajime Isayama)',
    '"Eren" means "saint" in Turkish. 🤔 (Hajime Isayama)',
  ],
  'My Hero Academia': [
    'All Might = Japanese Superman! 😄 (Kōhei Horikoshi)',
    'The author wanted to make horror manga first. 😱 (Kōhei Horikoshi)',
  ],
  'Demon Slayer': [
    'Zenitsu\'s bird is a sparrow, not a crow. 🥰 (Koyoharu Gotouge)',
    'The whole manga was hand-drawn. 😤 (Koyoharu Gotouge)',
  ],
  'Death Note': [
    'L crouches to conserve energy. 🤨 (Takeshi Obata & Tsugumi Ohba)',
    'Light\'s name isn\'t the Japanese word for "light". 😏 (Takeshi Obata & Tsugumi Ohba)',
  ],
  'Dragon Ball': [
    'Goku\'s voice is done by an 80+ year-old woman (Masako Nozawa). 🤯 (Akira Toriyama)',
    'Inspired by "Journey to the West". 😌 (Akira Toriyama)',
  ],
};

// Returns an array of random (fictional) people names
function getRandomNames(count = 5) {
  const names = [
    "Yuki Tanaka",
    "Haruto Sato",
    "Aiko Nakamura",
    "Sora Yamamoto",
    "Rin Suzuki",
    "Kenta Kobayashi",
    "Mio Takahashi",
    "Daichi Watanabe",
    "Hana Ito",
    "Shin Fujimoto",
    "Emi Sasaki",
    "Ren Matsumoto",
    "Yui Kondo",
    "Taro Kimura",
    "Aya Shimizu",
    "Kaito Mori",
    "Saki Abe",
    "Naoki Okada",
    "Mei Nakajima",
    "Shohei Ishikawa"
  ];
  // Shuffle and return the requested number of names
  const shuffled = names.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const girlsImages = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
];

const FactsSlider = () => {
  const animeTitles = Object.keys(dummyFunFacts);
  // Assign a random person name to each anime title (memoized for stable display)
  const [personNames] = useState(() => {
    const randomNames = getRandomNames(animeTitles.length);
    const mapping = {};
    animeTitles.forEach((title, idx) => {
      mapping[title] = randomNames[idx];
    });
    return mapping;
  });

  // Assign a girl image to each anime title (by index, loop if not enough images)
  const getGirlImageForTitle = (idx) => {
    return girlsImages[idx % girlsImages.length];
  };

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
    <div className="rm-selection bg-gradient-to-b from-black to-slate-900 min-h-[55vh]">
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
            {animeTitles.map((title, idx) => (
              <div
                key={title}
                className="min-w-[260px] sm:min-w-[300px] max-w-[340px] h-[28vh] sm:h-[35vh] rounded-2xl p-4 sm:p-5 flex-shrink-0 border border-white/10 relative bg-black/20"
              >
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 flex items-center gap-3 text-purple-200">
                    {!loaded[title] && (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-300/20 animate-pulse"></div>
                    )}
                    <img
                      src={getGirlImageForTitle(idx)}
                      alt={`girl-${idx + 1} cover`}
                      className={`w-20 h-20 sm:w-19 sm:h-19 rounded-full object-cover ring-2 ring-purple-300/30 transition-opacity duration-300 ${
                        loaded[title] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setLoaded((prev) => ({ ...prev, [title]: true }))}
                    />
                    <span className="text-white/90 ">{personNames[title]}</span>
                  </h3>
                  <div className="text-xl text-purple-300 font-semibold mb-2  ">
                    {title}
                  </div>
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
