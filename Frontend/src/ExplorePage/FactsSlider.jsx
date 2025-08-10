import React, { useEffect, useState, useRef } from 'react';
import discussion from '../assets/discussion.png';

const dummyFunFacts = {
  'One Piece': [
    'Oda can draw with both hands at the same time! That\'s some next-level multitasking! 😊',
    'Over 500 million copies sold—record-shattering! Fans just can\'t get enough! 🤩',
  ],
  'Naruto': [
    'Naruto was almost named "Kumomaru"! Imagine that timeline! 😮',
    'Ichiraku Ramen is a real place! Bet it\'s as delicious as it looks 😋',
  ],
  'Attack on Titan': [
    'Titan movements are modeled after drunk people. Creepy... yet fascinating. 😰',
    '"Eren" means "saint" in Turkish. A name with weight! 🤔',
  ],
  'My Hero Academia': [
    'All Might = Japanese Superman! Truly the Symbol of Peace. 😄',
    'The author wanted to make horror manga first. Talk about plot twist! 😱',
  ],
  'Demon Slayer': [
    'Zenitsu\'s bird is a sparrow, not a crow. So tiny and brave! 🥰',
    'The whole manga was hand-drawn. That\'s dedication! 😤',
  ],
  'Death Note': [
    'L crouches to conserve energy. Weird? Genius? Maybe both. 🤨',
    'Light\'s name isn\'t the Japanese word for "light"—clever detail! 😏',
  ],
  'Dragon Ball': [
    'Goku\'s voice is done by an 80+ year-old woman. Legendary! 🤯',
    'Inspired by "Journey to the West"—an epic story reborn. 😌',
  ],
};

// No need for cardColors array, we'll use inline style for the gradient

const FactsSlider = () => {
  const animeTitles = Object.keys(dummyFunFacts);
  const [animeImages, setAnimeImages] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCovers = async () => {
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

      for (const title of animeTitles) {
        try {
          const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { search: title } }),
          });
          const json = await res.json();
          results[title] = json.data.Media.coverImage.extraLarge;
        } catch (error) {
          console.error('Error fetching cover for', title);
        }
      }
      setAnimeImages(results);
    };

    fetchCovers();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 2;
    scrollRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 2;
    scrollRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Card style for the linear gradient background
  const cardStyle = {
    background: 'linear-gradient(180deg,rgba(255,255,255,.10126057258841037) 0,rgba(255,255,255,0) 100%)',
    color: '#222',
  };

  return (
    <div className="bg-black h-[60vh]">
      <section className="flex h-full w-full overflow-hidden">
        {/* Left Side Image */}
        <div className="flex items-end justify-center w-[33%] relative overflow-hidden bg-gradient-to-t from-purple-900/30 to-transparent">
          <img className="object-cover h-[45vh] w-fit" src={discussion} alt="Discussion" />
        </div>

        {/* Right Side (Title + Scroll Cards) */}
        <div className="w-[67%] flex flex-col pt-4 mt-8">
          <h2 className="text-white/60 text-4xl font-bold ml-6">Fun Facts About Anime </h2>

          <div
            ref={scrollRef}
            className={`scroll-container w-full bg-gradient-to-t from-purple-900/30 to-transparent overflow-x-auto flex gap-6 px-6 py-6 items-start relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} mt-15 `}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {animeTitles.map((title, i) => (
              <div
                key={title}
                className={`min-w-[300px] max-w-[320px] h-[32vh] rounded-3xl p-5 shadow-xl backdrop-blur-xl flex-shrink-0 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/20 relative overflow-hidden`}
                style={cardStyle}
              >
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>

                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/20 to-transparent z-0 pointer-events-none" />

                <div className="relative z-44">
                  <h2 className="text-xl font-bold mb-3 mr-6 flex items-center justify-between gap-3 text-white/60">
                    {animeImages[title] && (
                      <img
                        src={animeImages[title]}
                        alt={title}
                        className="w-15 h-15 rounded-full object-cover ring-2 ring-white/20"
                      />
                    )}
                    {title}
                  </h2>
                  <div className="space-y-2 text-sm font-medium leading-snug">
                    {dummyFunFacts[title].map((fact, index) => (
                      <p key={index} className="drop-shadow-sm text-white/60">
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

      {/* Stylish Scrollbar */}
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .scroll-container::-webkit-scrollbar-thumb {
          background: #a78bfa;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
};

export default FactsSlider;