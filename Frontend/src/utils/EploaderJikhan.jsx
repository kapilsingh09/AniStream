import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Timer } from 'lucide-react';

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
          const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes?page=${page}`);
          if (!res.ok) throw new Error('Failed to fetch episodes');
          const data = await res.json();
          if (!data.data || data.data.length === 0) break;
          allEpisodes = [...allEpisodes, ...data.data];
          if (!data.pagination?.has_next_page) break;
          page++;
        }
        setEpisodes(allEpisodes);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    })();
  }, [animeId]);

  const Skeleton = () => (
    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-purple-500/20 animate-pulse" />
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen py-6 px-4 sm:px-6 rounded-xl mt-6 border border-gray-700 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {animeTitle ? `${animeTitle} Episodes` : 'Episodes'}
        </h1>
        <p className="text-sm text-slate-400 mt-1">Powered by Jikan API</p>
      </div>

      {loading ? (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 min-h-[40vh]">
          {Array.from({ length: 20 }).map((_, idx) => (
            <Skeleton key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-2">
          <AlertTriangle className="text-3xl text-red-400" />
          <h2 className="text-lg font-semibold text-red-300">Error Loading Episodes</h2>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {episodes.map((ep) => (
              <div key={ep.mal_id} className="relative group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 rounded-xl flex items-center justify-center text-xs font-bold border-2 border-purple-400 hover:scale-105 transition-transform">
                  {ep.mal_id}
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 sm:w-72 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-50">
                  <div className="bg-gray-950 p-3 rounded-lg text-xs shadow-lg border border-purple-500/30 text-white backdrop-blur">
                    <h3 className="font-semibold text-center">{ep.title || `Episode ${ep.mal_id}`}</h3>
                    <div className="flex justify-between mt-1 text-slate-400 text-[10px]">
                      {ep.aired && <span><Calendar className="inline w-3 h-3 mr-1" />{new Date(ep.aired).toLocaleDateString()}</span>}
                      {ep.duration && <span><Timer className="inline w-3 h-3 mr-1" />{ep.duration}</span>}
                    </div>
                    {ep.synopsis && (
                      <p className="mt-1 text-slate-500 line-clamp-2">
                        {ep.synopsis.substring(0, 90)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6 text-xs text-slate-400">
             {episodes.length} Episodes Loaded via Jikan API
          </div>
        </div>
      )}
    </div>
  );
};

export default Eploader;
