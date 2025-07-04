import React, { useState, useEffect } from 'react';
import { Calendar, Eye, ThumbsUp, Flower,
  Sun,
  Leaf,
  Snowflake, } from 'lucide-react';
import { FetchSeasonalAnime } from '../services/JikhanAnimeApi';
import { data } from 'react-router-dom';

const seasons = [
  { label: 'Spring', value: 'spring', icon: Flower },
  { label: 'Summer', value: 'summer', icon: Sun },
  { label: 'Fall', value: 'fall', icon: Leaf },
  { label: 'Winter', value: 'winter', icon: Snowflake },
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
  console.log(data);
  
        const uniqueAnimeMap = new Map();
        data.forEach((anime) => {
          if (!uniqueAnimeMap.has(anime.mal_id)) {
            uniqueAnimeMap.set(anime.mal_id, anime);
          }
        });
        const uniqueAnime = Array.from(uniqueAnimeMap.values());
    
        setAnimeList(uniqueAnime);
      } catch (err) {
        setError('Failed to load seasonal anime.');
      } finally {
       
        setLoading(false);
        console.log(uniqueAnime);
        
      }
    };
    loadAnime();
  }, [selectedSeason]);

  return (
    <div className="w-full mx-auto py-12 bg-slate-900  border-2 border-slate-800 rounded-2xl p-7">
      <section className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-4xl font-bold flex items-center gap-3 text-white">
            <Calendar className="text-purple-400" />
            Seasonal Anime   {currentYear - 1} - {currentYear }
          {/* <p className="text-lg text-purple-300 text-center font-semibold">
            <span className="text-white">{currentYear}</span>
          </p> */}
          </h2>
        </div>

        {/* Season Buttons */}
        <div className="flex gap-4 flex-wrap cursor-pointer mb-6">
          {seasons.map((season) => (
            <button
              key={season.value}
              className={`px-6 py-3 cursor-pointer rounded-xl transition-colors font-semibold ${
                selectedSeason === season.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 hover:bg-purple-600 text-gray-200'
              }`}
              onClick={() => setSelectedSeason(season.value)}
            >
              <div className='flex items-center justify-between gap-2'>
                <season.icon className='' /> 
                
              {season.label}
                </div>

            </button>
          ))}
        </div>

        {/* Anime Cards or Error */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded-2xl animate-pulse overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="h-[200px] bg-gray-700 w-full"></div>
                
                {/* Info Skeleton */}
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-3 w-10 bg-gray-600 rounded"></div>
                    <div className="h-3 w-10 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <>
            <div className="text-center text-red-400 py-10">{error}
              <h1>Try Another season</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-2xl animate-pulse overflow-hidden"
                >
                  {/* Image Skeleton */}
                  <div className="h-[200px] bg-gray-700 w-full"></div>
                  
                  {/* Info Skeleton */}
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    <div className="flex gap-2 mt-2">
                      <div className="h-3 w-10 bg-gray-600 rounded"></div>
                      <div className="h-3 w-10 bg-gray-600 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4  lg:grid-cols-6 gap-6">
            {animeList.map((anime) => (
              <div
                key={anime.mal_id}
                className="bg-gray-900 rounded-2xl cursor-pointer overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
      
                <div className="h-[90%] overflow-hidden">
                  <img
                    src={
                      anime.images?.jpg?.large_image_url ||
                      anime.images?.jpg?.image_url ||
                      '/images/seasonal1.jpg'
                    }
                    alt={anime.title_english}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <h3 className="font-bold text-sm mb-2 text-white line-clamp-2">{anime.title_english || anime.title}</h3>

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
