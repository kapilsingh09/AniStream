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
      let offset = 0;
      const limit = 20;
      try {
        while (true) {
          const res = await fetch(
            `https://kitsu.io/api/edge/anime/${animeId}/episodes?page[limit]=${limit}&page[offset]=${offset}`
          );
          if (!res.ok) throw new Error('Failed to fetch episodes');
          const data = await res.json();
          allEpisodes = allEpisodes.concat(data.data);
          if (!data.links.next || data.data.length < limit) break;
          offset += limit;
        }
        setEpisodes(allEpisodes);
      } catch (err) {
        setError(err.message || 'Failed to load episodes');
      } finally {
        setLoading(false);
      }
    })();
  }, [animeId]);

  const SkeletonCard = () => (
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-500/20 animate-pulse rounded-lg" />
  );

  return (
    <div className="bg-gray-900 rounded-2xl border mt-10 border-gray-700 p-4 sm:p-6 text-white">
      <div className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {animeTitle ? `${animeTitle} Episodes` : 'Episode List'}
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {loading ? (
          // Skeleton placeholders (simulate structure)
          Array.from({ length: 12 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))
        ) : error ? (
          <div className="text-center text-red-400 text-sm sm:text-base mt-4">{error}</div>
        ) : (
          episodes.map((ep) => {
            const title =
              ep.attributes.titles?.en_us ||
              ep.attributes.titles?.en ||
              `Episode ${ep.attributes.number}`;
            return (
              <div key={ep.id} className="relative group">
                <div className="w-12 h-12 sm:w-14 sm:h-14  bg-purple-600 border-2 border-gray-500 rounded-lg flex items-center justify-center text-xl text-white/100 cursor-pointer font-bold hover:scale-105 transition-transform">
                  {ep.attributes.number}
                </div>
                {/* Tooltip */}
                <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl border border-purple-500/30">
                    <h3 className="font-semibold text-center mb-1">{title}</h3>
                    <div className="flex justify-between text-slate-400 text-[12px]">
                      {ep.attributes.airdate && (
                        <span>📅 {new Date(ep.attributes.airdate).toLocaleDateString()}</span>
                      )}
                      {ep.attributes.length && (
                        <span>⏱️ {ep.attributes.length} min</span>
                      )}
                    </div>
                    {ep.attributes.synopsis && (
                      <p className="text-slate-500 mt-1 line-clamp-2">
                        {ep.attributes.synopsis.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* {!loading && !error && (
        <div className="mt-4 text-center text-xs text-slate-400">
          All {episodes.length} episodes loaded ✅
        </div>
      )} */}
    </div>
  );
};

export default Eploader;
