import { useState, useEffect } from 'react';

const Eploader = () => {
  const [isShown, setIsShown] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async ()=>{
        setIsShown(!isShown);
        if (!isShown && episodes.length === 0) {
          setLoading(true);
          let allEpisodes = [];
          let offset = 0;
          const limit = 20;
    
          try {
            while (true) {
              const res = await fetch(
                `https://kitsu.io/api/edge/anime/1/episodes?page[limit]=${limit}&page[offset]=${offset}`
              );
              const data = await res.json();
              allEpisodes = allEpisodes.concat(data.data);
              if (!data.links.next || data.data.length < limit) break;
              offset += limit;
            }
            setEpisodes(allEpisodes);
          } catch (error) {
            console.error("Failed to fetch episodes:", error);
          } finally {
            setLoading(false);
          }
        }
    })()

  }, [])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="relative z-10 px-4 py-8 sm:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Episode Browser
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-8">Discover your favorite anime episodes</p>
         
        </div>


          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-7xl">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-purple-300 mb-2">Loading Episodes...</p>
                    <p className="text-slate-400">Fetching the best content for you</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl    sm:p-8 border border-white/10 shadow-2xl">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {episodes.length} Episodes Available
                    </h2>
                    {/* <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div> */}
                  </div>

                  {/* Flex-based Episode List */}
                  <div className="flex flex-wrap  gap-3 sm:gap-4 border-red-300 ">
                    {episodes.map((ep) => {
                      const title =
                        ep.attributes.titles?.en_us ||
                        ep.attributes.titles?.en ||
                        `Episode ${ep.attributes.number}`;

                      return (
                        <div key={ep.id} className="relative group ">
                          {/* Box */}
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base transition-transform transform group-hover:scale-105">
                            {ep.attributes.number}
                          </div>

                          {/* Tooltip */}
                          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 sm:w-72 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-purple-500/50 backdrop-blur-xl text-sm">
                              <h3 className="font-semibold text-center mb-2">{title}</h3>
                              <div className="flex justify-center gap-4 text-slate-400 text-xs">
                                {ep.attributes.airdate && (
                                  <div className="flex items-center gap-1">
                                    📅 <span>{new Date(ep.attributes.airdate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {ep.attributes.length && (
                                  <div className="flex items-center gap-1">
                                    ⏱️ <span>{ep.attributes.length} min</span>
                                  </div>
                                )}
                              </div>
                              {ep.attributes.synopsis && (
                                <p className="text-slate-400 mt-2 line-clamp-3">
                                  {ep.attributes.synopsis.substring(0, 120)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-slate-300">All Episodes Loaded</span>
                      </div>
                      <div className="w-px h-4 bg-slate-600"></div>
                      <span className="text-slate-300">{episodes.length} Total Episodes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
       
      </div>
    </div>
  );
};

export default Eploader;
