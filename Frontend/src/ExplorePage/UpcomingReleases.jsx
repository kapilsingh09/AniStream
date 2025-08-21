import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Award } from 'lucide-react';

const UpcomingReleases = () => {
  const [upcomingAnime, setUpcomingAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example API: Jikan (MyAnimeList) - Upcoming anime
  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.jikan.moe/v4/seasons/upcoming?limit=9');
        const data = await res.json();
        if (data && data.data) {
          setUpcomingAnime(data.data);
        } else {
          setUpcomingAnime([]);
        }
      } catch (err) {
        setError('Failed to fetch upcoming anime.');
        setUpcomingAnime([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div>
      <section className="space-x-6  p-9">
        <h2 className="text-4xl font-bold flex items-center gap-3 ">
          <Clock className="text-cyan-400" /> Upcoming Releases
        </h2>
        {loading ? (
          <div className="text-cyan-400 text-lg py-8">Loading upcoming anime...</div>
        ) : error ? (
          <div className="text-red-400 text-lg py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingAnime.map((anime, idx) => (
              <div
                key={anime.mal_id || idx}
                className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 border border-cyan-500/30 flex flex-col"
              >
                <h3 className="text-xl font-bold mb-3">{anime.title}</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-400" />
                    {anime.aired && anime.aired.from
                      ? new Date(anime.aired.from).toLocaleDateString()
                      : 'TBA'}
                  </p>
                  <p className="flex items-center gap-2">
                    <Award size={16} className="text-cyan-400" />
                    {anime.studios && anime.studios.length > 0
                      ? anime.studios.map((studio) => studio.name).join(', ')
                      : 'Unknown Studio'}
                  </p>
                </div>
                <button className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl font-semibold transition-colors">
                  Add to Watchlist
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UpcomingReleases;
