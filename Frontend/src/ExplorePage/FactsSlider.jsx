import React, { useEffect, useState, useRef } from 'react';
import discussion from '../assets/discussion.png';

const dummyFunFacts = {
  'One Piece': [
    '🧠 Oda can draw with both hands at the same time! That’s some next-level multitasking!',
    '📚 Over 500 million copies sold—record-shattering! Fans just can’t get enough!',
  ],
  'Naruto': [
    '😲 Naruto was almost named "Kumomaru"! Imagine that timeline!',
    '🍜 Ichiraku Ramen is a real place! Bet it’s as delicious as it looks 😋',
  ],
  'Attack on Titan': [
    '🍻 Titan movements are modeled after drunk people. Creepy... yet fascinating.',
    '🙏 "Eren" means "saint" in Turkish. A name with weight!',
  ],
  'My Hero Academia': [
    '🦸‍♂️ All Might = Japanese Superman! Truly the Symbol of Peace.',
    '👻 The author wanted to make horror manga first. Talk about plot twist!',
  ],
  'Demon Slayer': [
    '🐤 Zenitsu’s bird is a sparrow, not a crow. Aww! So tiny and brave!',
    '✍️ The whole manga was hand-drawn. That’s dedication!',
  ],
  'Death Note': [
    '🪑 L crouches to conserve energy. Weird? Genius? Maybe both.',
    '💡 Light’s name isn’t the Japanese word for "light"—clever detail!',
  ],
  'Dragon Ball': [
    '👵 Goku’s voice is done by an 80+ year-old woman. Legendary!',
    '🐒 Inspired by "Journey to the West"—an epic story reborn.',
  ],
};

const cardColors = [
  'bg-gradient-to-br from-pink-500/40 via-purple-600/40 to-indigo-500/40',
  'bg-gradient-to-br from-red-400/40 via-pink-500/40 to-orange-400/40',
  'bg-gradient-to-br from-emerald-400/40 via-green-600/40 to-cyan-500/40',
  'bg-gradient-to-br from-yellow-400/40 via-orange-500/40 to-red-500/40',
  'bg-gradient-to-br from-blue-400/40 via-indigo-500/40 to-purple-500/40',
  'bg-gradient-to-br from-cyan-400/40 via-sky-500/40 to-blue-500/40',
  'bg-gradient-to-br from-fuchsia-400/40 via-pink-500/40 to-rose-500/40',
];

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

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-zinc-900 via-gray-900 to-black h-full">
      <section className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-3xl flex h-full w-full overflow-hidden shadow-2xl border border-zinc-700/50">
        {/* Left Side Image */}
        <div className="flex items-end justify-center w-[33%] relative overflow-hidden rounded-l-3xl bg-gradient-to-t from-purple-900/30 to-transparent">
          <img className="object-cover h-fit w-fit" src={discussion} alt="Discussion" />
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className={`scroll-container w-[67%] mt-15  bg-gradient-to-t from-purple-900/30 to-transparent overflow-x-auto flex gap-6 px-6 py-6 items-start relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
              className={`min-w-[300px] max-w-[320px] h-[38vh] ${cardColors[i % cardColors.length]} rounded-3xl p-5 text-white shadow-xl backdrop-blur-xl flex-shrink-0 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/20 relative overflow-hidden`}
            >
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>

              <div className="relative  z-10">
                <h2 className="text-xl  font-bold mb-3 mr-6 flex items-center justify-between gap-3">
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
                    <p key={index} className="text-white drop-shadow-sm">
                      {fact}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stylish Scrollbar on Top */}
      <style jsx>{`
        .scroll-container {
          scrollbar-width: thin;
          scrollbar-color: #a78bfa rgba(255, 255, 255, 0.05);
        }

        .scroll-container::-webkit-scrollbar {
          height: 6px;
          position: absolute;
          top: 0;
        }

        .scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #a78bfa, #ec4899, #8b5cf6);
          border-radius: 10px;
          border: 1px solid transparent;
          background-clip: padding-box;
        }

        .scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #8b5cf6, #ec4899, #a78bfa);
        }

        .scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default FactsSlider;
