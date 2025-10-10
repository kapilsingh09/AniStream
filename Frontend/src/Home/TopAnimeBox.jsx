import React, { useEffect, useState } from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

// TopAnimeBox.jsx (clean version with Lucide icons & full image cards)
// Props:
// - limit: number of anime to fetch (default 10)
// - title: heading title (default 'Top Anime')
// - orientation: 'left' or 'right' (image position)
// - className: optional custom Tailwind classes

export default function TopAnimeBox({
  className = '',
  // limit = 10,
  title = 'Top Anime',
  orientation = 'left',
  fetchFunction, // <-- take a function as a prop
}) {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof fetchFunction !== 'function') {
      setError('No fetch function provided');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await fetchFunction();
        if (!cancelled) {
          setAnime(data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ fetchFunction]);

  function starsFromScore(score) {
    if (score == null) return 0;
    return Math.round((Number(score) / 10) * 5 * 2) / 2; // 0–5 scale, half steps
  }

  return (
    <aside className={`h-full overflow-auto ${className}`.trim()}  aria-label="Top anime list">
      <div className="max-w-3xl mx-auto p-3">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-28 flex items-center p-3 shadow-sm"
              >
                <div className="bg-gray-300 w-24 h-24 rounded-md mr-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="text-sm text-red-600">Error fetching top anime: {error}</div>}

        {!loading && !error && (
          <div className="space-y-4">
            {anime.map((a) => (
              <article
                key={a.mal_id}
                className="flex items-stretch rounded-xl shadow-md overflow-hidden bg-white/30 dark:bg-gray-800 hover:shadow-lg transition"
              >
                {orientation === 'left' && (
                  <div className="w-32 md:w-40 flex-shrink-0 relative">
                    <img
                      src={a.images?.jpg?.large_image_url || a.images?.jpg?.image_url}
                      alt={`${a.title} cover`}
                      className="absolute inset-0 object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm md:text-base font-medium leading-tight line-clamp-2">
                      {a.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1">
                      {a.episodes ? `${a.episodes} ep` : 'EP ?'} • {a.type || 'Type ?'} • {a.year || ''}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(a.genres || []).slice(0, 4).map((g) => (
                        <span
                          key={g.mal_id}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <StarRating score={starsFromScore(a.score)} />
                      <span className="text-xs text-gray-500">
                        {a.score ? a.score.toFixed(2) : '—'}/10
                      </span>
                    </div>

                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline hover:text-blue-600"
                    >
                      Details
                    </a>
                  </div>
                </div>

                {orientation === 'right' && (
                  <div className="w-32 md:w-40 flex-shrink-0 relative">
                    <img
                      src={a.images?.jpg?.large_image_url || a.images?.jpg?.image_url}
                      alt={`${a.title} cover`}
                      className="absolute inset-0 object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// Lucide-based star rating (supports half-stars)
function StarRating({ score = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (score >= i) stars.push('full');
    else if (score >= i - 0.5) stars.push('half');
    else stars.push('empty');
  }

  return (
    <div className="flex items-center gap-0.5 text-yellow-500" aria-hidden>
      {stars.map((s, i) => (
        <span key={i}>
          {s === 'full' && <Star className="w-4 h-4 fill-current" />}
          {s === 'half' && <StarHalf className="w-4 h-4 fill-current" />}
          {s === 'empty' && <StarOff className="w-4 h-4" />}
        </span>
      ))}
    </div>
  );
}
