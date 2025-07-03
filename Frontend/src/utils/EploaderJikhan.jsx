import { useState, useEffect } from 'react';

const Eploader = ({ animeId, animeTitle }) => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!animeId) return;
    setLoading(true);
    setError(null);
    setEpisodes([]);
    (async () => {
      let allEpisodes = [];
      let page = 1;
      try {
        while (true) {
          const res = await fetch(
            `https://api.jikan.moe/v4/anime/${animeId}/episodes?page=${page}`
          );
          if (!res.ok) throw new Error('Failed to fetch episodes');
          const data = await res.json();
          if (!data.data || data.data.length === 0) break;
          allEpisodes = allEpisodes.concat(data.data);
          if (!data.pagination?.has_next_page) break;
          page++;
        }
        setEpisodes(allEpisodes);
      } catch (err) {
        setError(err.message || 'Failed to load episodes');
      } finally {
        setLoading(false);
      }
    })();
  }, [animeId]);

  const SkeletonBubble = () => (
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 rounded-xl animate-pulse" />
  );

  return (
    <div className="min-h-screen bg-gray-900 mt-8 text-white px-4 sm:px-6 py-6 rounded-2xl shadow-lg border border-gray-700">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {animeTitle ? `${animeTitle} Episodes` : 'Episode Browser'}
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          Dive into the journey — all episodes listed below
        </p>
      </div>

      {loading ? (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 min-h-[40vh]">
          {Array.from({ length: 18 }).map((_, idx) => (
            <SkeletonBubble key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3 text-center">
          <div className="text-4xl text-red-400">😔</div>
          <p className="text-lg font-bold text-red-400">Error Loading Episodes</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:p-6 border border-white/10 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {episodes.length} Episodes Available
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {episodes.map((ep) => {
              const title = ep.title || `Episode ${ep.mal_id}`;
              return (
                <div key={ep.mal_id} className="relative group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 border-2 border-purple-400 rounded-xl flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform">
                    {ep.mal_id}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-slate-900 p-3 rounded-xl text-xs shadow-xl border border-purple-500/40 text-white backdrop-blur">
                      <h3 className="font-semibold text-center">{title}</h3>
                      <div className="flex justify-between mt-1 text-slate-400 text-[10px]">
                        {ep.aired && (
                          <span>📅 {new Date(ep.aired).toLocaleDateString()}</span>
                        )}
                        {ep.duration && (
                          <span>⏱️ {ep.duration}</span>
                        )}
                      </div>
                      {ep.synopsis && (
                        <p className="text-slate-500 mt-1 line-clamp-2">
                          {ep.synopsis.substring(0, 90)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            ✅ All {episodes.length} episodes loaded
          </div>
        </div>
      )}
    </div>
  );
};

export default Eploader;
