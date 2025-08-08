  import React, { useRef, useState } from 'react';
  import { useQuery } from '@tanstack/react-query';
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

  const cardColors = [
    'bg-gradient-to-br from-purple-400/50 via-violet-500/40 to-purple-600/30',
    'bg-gradient-to-br from-indigo-400/50 via-purple-500/40 to-pink-500/30',
    'bg-gradient-to-br from-purple-300/50 via-purple-500/40 to-purple-700/30',
    'bg-gradient-to-br from-violet-400/50 via-purple-600/40 to-indigo-600/30',
    'bg-gradient-to-br from-purple-500/50 via-violet-600/40 to-purple-800/30',
    'bg-gradient-to-br from-fuchsia-400/50 via-purple-500/40 to-violet-600/30',
    'bg-gradient-to-br from-purple-400/50 via-indigo-500/40 to-purple-700/30',
  ];

  // Helper function to fetch cover images for all anime titles
  const fetchAnimeCovers = async (animeTitles) => {
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
        results[title] = json?.data?.Media?.coverImage?.extraLarge || null;
      } catch (error) {
        console.error('Error fetching cover for', title);
        results[title] = null;
      }
    }
    return results;
  };

  const FactsSlider = () => {
    const animeTitles = Object.keys(dummyFunFacts);
    // Remove unused state: animeImages, setAnimeImages, useEffect
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
    const scrollRef = useRef(null);

    // Use TanStack Query to fetch all covers
    const { data: animeImages = {}, isLoading, isError } = useQuery({
      queryKey: ['animeCovers', animeTitles],
      queryFn: () => fetchAnimeCovers(animeTitles),
      staleTime: 1000 * 60 * 60, // 1 hour
    });

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
        <div className="py-12 bg-black h-[60vh]">
          <section className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 flex h-full w-full overflow-hidden ">
            {/* Left Side Image */}
            <div className="flex items-end justify-center w-[33%] relative overflow-hidden rounded-l-3xl bg-gradient-to-t from-purple-900/30 to-transparent">
              <img className="object-cover h-[45vh] w-fit" src={discussion} alt="Discussion" />
            </div>

            {/* Right Side (Title + Scroll Cards) */}
            <div className="w-[67%] flex flex-col pt-4">
              <h2 className="text-white text-3xl font-semibold ml-6">Fun Facts About Anime</h2>

              <div
                ref={scrollRef}
                className={`scroll-container w-full bg-gradient-to-t from-purple-900/30 to-transparent overflow-x-auto flex gap-6 px-6 py-6 items-start relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {isLoading ? (
                  <div className="text-white text-lg">Loading covers...</div>
                ) : isError ? (
                  <div className="text-red-400 text-lg">Failed to load covers.</div>
                ) : (
                  animeTitles.map((title, i) => (
                    <div
                      key={title}
                      className="min-w-[320px] max-w-[340px] h-[34vh] rounded-3xl p-6 text-zinc-700 flex-shrink-0 border border-zinc-200 relative overflow-hidden"
                      style={{
                        background: 'rgba(243,244,246,0.85)', // zinc-100/85
                        filter: 'grayscale(0.18) brightness(0.96) contrast(0.93) blur(0.5px)',
                        boxShadow: 'none',
                        transition: 'none',
                      }}
                    >
                      {/* Dull, minimal, no hover, no shadow, very muted, duffly effect on card bg */}
                      <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-3 mr-6 flex items-center justify-between gap-3 text-zinc-800">
                          {animeImages[title] && (
                            <img
                              src={animeImages[title]}
                              alt={title}
                              className="w-14 h-14 rounded-full object-cover ring-1 ring-zinc-200 opacity-70"
                              
                            />
                          )}
                          {title}
                        </h2>
                        <div className="space-y-2 text-sm font-medium leading-snug">
                          {dummyFunFacts[title].map((fact, index) => (
                            <p key={index} className="text-zinc-500">
                              {fact}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
