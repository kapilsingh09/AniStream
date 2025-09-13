import { useState, useEffect } from 'react';
import { Calendar, Timer, X as LucideX } from 'lucide-react';

const EploaderJikhan = ({ animeId, animeTitle, onClose }) => {
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

          allEpisodes = allEpisodes.concat(data.data);
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

  const SkeletonCard = () => (
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 animate-pulse rounded-lg" />
  );

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-gray-900 to-black rounded-2xl border mt-10 border-gray-700 p-4 sm:p-6 text-white relative">
      <button
        className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full shadow z-10"
        onClick={onClose}
        type="button"
        aria-label="Close episode list"
      >
        <LucideX className="w-5 h-5 text-gray-300 hover:text-red-400 transition-colors" />
      </button>

      <div className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold bg-white bg-clip-text text-transparent">
          {animeTitle ? `${animeTitle} Episodes` : 'Episode List'}
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-start">
        {loading ? (
          Array.from({ length: 12 }).map((_, idx) => <SkeletonCard key={idx} />)
        ) : error ? (
          <div className="text-center text-red-400 text-sm sm:text-base mt-4">{error}</div>
        ) : (
          episodes.map((ep) => {
            const title = ep.title || `Episode ${ep.mal_id}`;
            return (
              <div key={ep.mal_id} className="relative group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 border-2 border-gray-500 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-105 transition-transform">
                  {ep.mal_id}
                </div>
                {/* Tooltip */}
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl border border-purple-500/30 relative">
                    <h3 className="font-semibold text-center mb-1">{title}</h3>
                    <div className="flex justify-between text-slate-400 text-[12px]">
                      {ep.aired?.string && (
                        <span>
                          <Calendar className="inline w-3 h-3 mr-1" />
                          {new Date(ep.aired.string).toLocaleDateString()}
                        </span>
                      )}
                      {ep.duration && (
                        <span>
                          <Timer className="inline w-3 h-3 mr-1" />
                          {ep.duration}
                        </span>
                      )}
                    </div>
                    {ep.synopsis && (
                      <p className="text-slate-500 mt-1 line-clamp-2">
                        {ep.synopsis.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
      </div>
    </div>
  );

};



export default EploaderJikhan;
