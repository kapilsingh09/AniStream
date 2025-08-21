import React from 'react'
import {motion} from 'framer-motion'

const RecomendedAnime = () => {
  
    const recommended = [
        {
            id: 1,
            title: "Attack on Titan",
            img: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
        },
        {
            id: 2,
            title: "Demon Slayer: Kimetsu no Yaiba",
            img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
        },
        {
            id: 3,
            title: "Jujutsu Kaisen",
            img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
        },
        {
            id: 4,
            title: "My Hero Academia",
            img: "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
        },
        {
            id: 5,
            title: "One Piece",
            img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
        },
        {
            id: 6,
            title: "Fullmetal Alchemist: Brotherhood",
            img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
        }
    ];

    return (
        <div className='w-full h-[60vh] py-6 px-8  bg-black text-white'>
          <div className='h-full w-full'>
          <h2 className="text-2xl font-bold mb-4">Recommended Anime   </h2>
            <div
        //   ref={sliderRef}
          className="w-full h-[50vh] grid grid-cols-2  lg:grid-cols-6 overflow-x-auto gap-6 scroll-smooth py-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* maincard component  parent of cards*/}
          {recommended.map((anime, index) => {
            // const attr = anime.attributes;
            return (
              <motion.div
              // key={index}
                key={anime.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="min-w-[14vw] max-w-[12vw] rounded-xl overflow-hidden text-white flex flex-col hover:scale-[1.03] transition-transform duration-300 cursor-pointer group"
              >
                <div className="relative h-[40vh] w-full">
                  <img
                  src={anime.img}
                    // src={attr?.posterImage?.large || attr?.posterImage?.medium}
                    // alt={attr?.titles?.en_jp || attr?.titles?.en || 'Anime'}
                    // onError={handleImageError}
                    className="w-full h-full object-cover rounded group-hover:brightness-110 transition-all duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded"></div>

                  {/* {attr?.averageRating && ( */}
                    <motion.div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded backdrop-blur-sm">
                      ⭐NAN
                    </motion.div>
                {/* //   )} */}

                  {/* {attr?.popularityRank && ( */}
                    <div className="absolute top-2 left-2 bg-purple-600 text-xs px-3 py-1 rounded backdrop-blur-sm">
                      #NAN
                    </div>
                {/* //   )} */}
                </div>

                <div className="py-2 ml-1 text-sm font-medium leading-tight h-[4.5vh]">
                  <div className="line-clamp-2 group-hover:text-blue-300 transition-colors" >
                    {anime.title}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
          </div>
           
        <span className='text-yellow-300 text-sm text-right italic'>-It will be done soon when I learn ML</span>
        </div>
    );
};

export default RecomendedAnime;
