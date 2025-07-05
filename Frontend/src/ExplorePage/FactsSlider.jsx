import React, { useEffect, useState, useRef } from 'react';
import discussion from '../assets/discussion.png';

const dummyFunFacts = {
  'One Piece': [
    'Eiichiro Oda can draw with both hands at the same time. (Impressive!)',
    'The manga has sold over 500 million copies worldwide. (Record-breaking!)',
  ],
  'Naruto': [
    'Naruto was almost called "Kumomaru" in early drafts. (Surprising!)',
    'Ichiraku Ramen is a real restaurant in Japan. (Yummy and real!)',
  ],
  'Attack on Titan': [
    'The Titans\' movements are based on drunk people. (Disturbing!)',
    'Eren\'s name means "saint" in Turkish. (Interesting!)',
  ],
  'My Hero Academia': [
    'All Might is inspired by Superman. (Heroic!)',
    'The author originally wanted to be a horror mangaka. (Unexpected!)',
  ],
  'Demon Slayer': [
    'Zenitsu\'s bird is actually a sparrow, not a crow. (Cute!)',
    'The manga was drawn entirely on paper. (Traditional!)',
  ],
  'Death Note': [
    'L always sits crouched to conserve energy. (Weirdly smart!)',
    'Light\'s name is written differently than the Japanese word for "light." (Clever!)',
  ],
  'Dragon Ball': [
    'Goku\'s voice is done by an 80+ year-old woman! (Amazing!)',
    'Dragon Ball was inspired by "Journey to the West." (Classic!)',
  ],
};

const cardColors = [
  'bg-purple-900/50',
  'bg-violet-800/50',
  'bg-indigo-800/50',
  'bg-fuchsia-900/50',
  'bg-purple-700/50',
  'bg-violet-700/50',
  'bg-indigo-700/50',
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
    <div className="py-12 px-6 bg-gradient-to-br from-zinc-900 via-gray-900 to-black min-h-screen">
      <section className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-3xl flex h-[70vh] w-full overflow-hidden shadow-2xl border border-zinc-700/50">
        {/* Left Side Image */}
        <div className="flex items-end justify-center w-[33%] relative overflow-hidden rounded-l-3xl bg-gradient-to-t from-purple-900/30 to-transparent">
          <img className="object-cover h-fit w-fit" src={discussion} alt="" />
        </div>

        {/* Scrollable Cards */}
        {/* <div className=''> */}
        <div
          ref={scrollRef}
          className={`w-[67%] overflow-x-auto flex gap-6 px-6 py-6 items-center scroll-container ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
              className={`min-w-[260px] max-w-[280px] h-[45vh] bg-gradient-to-br ${cardColors[i % cardColors.length]} rounded-3xl p-5 text-white shadow-xl backdrop-blur-xl flex-shrink-0 border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white/20 relative overflow-hidden`}
            >
              {/* Glowing orbs */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-6 h-6 bg-white/5 rounded-full blur-lg animate-pulse delay-500"></div>

              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-3">
                  {animeImages[title] && (
                    <img
                      src={animeImages[title]}
                      alt={title}
                      className="w-15 h-15 rounded-full object-cover ring-2 ring-white/20"
                    />
                  )}
                  {title}
                </h2>
                <div className="space-y-2 text-sm">
                  {dummyFunFacts[title].map((fact, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/5"
                    >
                      <p className="leading-snug">{fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* </div> */}
       
      </section>

      {/* Stylish Scrollbar */}
      <style jsx>{`
        .scroll-container::-webkit-scrollbar {
          height: 6px;
           position:absolute;
           top:0px;
           left:0px;
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
        .scroll-container {
          // scrollbar-width: thin;
         
          scrollbar-color: #a78bfa rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default FactsSlider;
