import React, { useState, useEffect } from 'react';
import { Calendar, Eye, ThumbsUp } from 'lucide-react';

const seasons = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
  { label: 'Winter', value: 'winter' },
];

const currentYear = new Date().getFullYear();

const fetchSeasonalAnime = async (season, year) => {
  const res = await fetch(
    `https://kitsu.io/api/edge/anime?filter[season]=${season}&filter[seasonYear]=${year}&page[limit]=12&sort=-popularityRank`
  );
  if (!res.ok) throw new Error('Failed to fetch seasonal anime');
  const data = await res.json();
  return data.data;
};

const SeasonalAnime = () => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0].value);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchSeasonalAnime(selectedSeason, currentYear)
      .then(setAnimeList)
      .catch(() => setError('Failed to load seasonal anime.'))
      .finally(() => setLoading(false));
  }, [selectedSeason]);

  return (
    <div>
      <section className="space-y-6">
        <h2 className="text-4xl font-bold flex items-center gap-3">
          <Calendar className="text-purple-400" /> Seasonal Anime
        </h2>
        <div className="flex gap-4 mb-6">
          {seasons.map((season) => (
            <button
              key={season.value}
              className={`px-6 py-3 rounded-xl transition-colors font-semibold ${selectedSeason === season.value ? 'bg-purple-600 text-white' : 'bg-gray-800 hover:bg-purple-600 text-gray-200'}`}
              onClick={() => setSelectedSeason(season.value)}
            >
              {season.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center text-purple-400 py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {animeList.map((anime, idx) => (
              <div key={anime.id} className="bg-gray-900 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <img src={anime.attributes.posterImage?.medium || '/images/seasonal1.jpg'} alt={anime.attributes.canonicalTitle} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2">{anime.attributes.canonicalTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Eye size={12} />
                    <span>{anime.attributes.userCount ? (anime.attributes.userCount / 1000).toFixed(1) + 'k' : '?'}</span>
                    <ThumbsUp size={12} />
                    <span>{anime.attributes.averageRating ? anime.attributes.averageRating + '%' : '?'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SeasonalAnime;
