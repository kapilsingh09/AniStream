import React, { useEffect, useState, useRef, useCallback } from 'react';
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

const FactsSlider = () => {
  const animeTitles = Object.keys(dummyFunFacts);
  const [animeImages, setAnimeImages] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const scrollRef = useRef(null);

  const fetchCovers = useCallback(async () => {
    const query = `
      query ($search: String) {
        Media(type: ANIME, search: $search) {
          coverImage {
            extraLarge
          }
        }
      }
    `;

    const results = {};
    await Promise.all(
      animeTitles.map(async (title) => {
        try {
          const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { search: title } }),
          });
          const json = await res.json();
          results[title] = json.data?.Media?.coverImage?.extraLarge || '';
        } catch (error) {
          console.error(`Error fetching cover for ${title}`, error);
        }
      })
    );
    setAnimeImages(results);
  }, [animeTitles]);

  useEffect(() => {
    fetchCovers();
  }, [fetchCovers]);

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
    const walk = (x - dragStart.current.x) * 2;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - walk;
  };

  const stopDrag = () => setIsDragging(false);

  return (
    <div className="bg-gradient-to-b from-black  to-gray-900 min-h-[50vh]">
      <section className="flex flex-col lg:flex-row h-full w-full overflow-hidden">
        
        {/* Left Image */}
        <div className="flex items-center relative justify-center w-full lg:w-[30%] p-4 bg-gradient-to-b from-black to-purple-800/30  ">
          <img 
            className="object-cover max-h-[40vh] sm:max-h-[45vh] absolute bottom-0 left-1/6"
            src={discussion}
            alt="Anime discussion illustration"
          />
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-2/3 flex flex-col pt-4 lg:mt-8">
          <h2 className="text-white/80 text-2xl sm:text-3xl md:text-4xl font-bold px-4 mb-4">
            Fun Facts About Anime
          </h2>

          <div
            ref={scrollRef}
            className={`scroll-container flex gap-4 sm:gap-6 px-4 py-4 sm:py-6 overflow-x-auto items-start relative transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                className="min-w-[260px] sm:min-w-[300px] max-w-[320px] h-[28vh] sm:h-[32vh] rounded-2xl p-4 sm:p-5 shadow-xl flex-shrink-0 border border-white/10 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-300/20 relative"
                style={{
                  background: 'rgba(40, 20, 60, 0.35)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                  backdropFilter: 'blur(18px) saturate(160%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(160%)',
                  border: '1px solid rgba(255,255,255,0.13)',
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-purple-300/10 rounded-full blur-lg animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 sm:w-6 sm:h-6 bg-purple-200/5 rounded-full blur-md animate-pulse delay-500"></div>
                <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                {/* Card Content */}
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-3 text-purple-200">
                    {animeImages[title] && (
                      <img
                        src={animeImages[title]}
                        alt={`${title} cover`}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-purple-300/30"
                      />
                    )}
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
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #a78bfa, #f472b6);
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default FactsSlider;
