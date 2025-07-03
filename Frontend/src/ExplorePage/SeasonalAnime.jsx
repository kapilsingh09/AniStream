import React, { useState, useEffect } from 'react';
import { Calendar, Eye, ThumbsUp } from 'lucide-react';
import { FetchSeasonalAnime } from '../services/JikhanAnimeApi';

const seasons = [
  { label: 'Spring', value: 'spring' },
  { label: 'Summer', value: 'summer' },
  { label: 'Fall', value: 'fall' },
  { label: 'Winter', value: 'winter' },
];

const currentYear = new Date().getFullYear();

const SeasonalAnime = () => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0].value);
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await FetchSeasonalAnime(currentYear, selectedSeason, 12);
        setAnimeList(data);
      } catch (err) {
        setError('Failed to load seasonal anime.');
      } finally {
        setLoading(false);
      }
    };
    loadAnime();
  }, [selectedSeason]);

  return (
    <div className="w-[90%] mx-auto py-12">
      <section className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-4xl font-bold flex items-center gap-3 text-white">
            <Calendar className="text-purple-400" />
            Seasonal Anime
          </h2>
          <p className="text-lg text-purple-300 font-semibold">
            Year: <span className="text-white">{currentYear}</span>
          </p>
        </div>

        {/* Season Buttons */}
        <div className="flex gap-4 flex-wrap mb-6">
          {seasons.map((season) => (
            <button
              key={season.value}
              className={`px-6 py-3 rounded-xl transition-colors font-semibold ${
                selectedSeason === season.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 hover:bg-purple-600 text-gray-200'
              }`}
              onClick={() => setSelectedSeason(season.value)}
            >
              {season.label}
            </button>
          ))}
        </div>

        {/* Anime Cards */}
        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-2xl p-4 animate-pulse space-y-3"
                >
                  <div className="w-full h-40 bg-gray-700 rounded-xl" />
                  <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto" />
                  <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {animeList.map((anime) => (
              <div
                key={anime.mal_id}
                className="bg-gray-900 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* 90% Height Image */}
                <div className="h-[90%] overflow-hidden">
                  <img
                    src={
                      anime.images?.jpg?.large_image_url ||
                      anime.images?.jpg?.image_url ||
                      '/images/seasonal1.jpg'
                    }
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="font-bold text-sm mb-2 text-white line-clamp-2">{anime.title}</h3>

                  <div className="text-xs text-gray-400 mb-2 flex flex-wrap gap-2">
                    {anime.year && (
                      <span>
                        Year: <span className="text-gray-200">{anime.year}</span>
                      </span>
                    )}
                    {anime.type && (
                      <span>
                        Type: <span className="text-gray-200">{anime.type}</span>
                      </span>
                    )}
                    {anime.status && (
                      <span>
                        Status: <span className="text-gray-200">{anime.status}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {anime.members ? (anime.members / 1000).toFixed(1) + 'k' : '?'}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={12} />
                      {anime.score ? `${anime.score}/10` : '?'}
                    </span>
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
