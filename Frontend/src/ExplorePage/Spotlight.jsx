import React from 'react';
import { Star, Calendar, Film } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const fetchSpotlightAnime = async () => {
  const res = await fetch('https://kitsu.io/api/edge/trending/anime?limit=12');
  if (!res.ok) throw new Error('Failed to fetch spotlight anime');
  const data = await res.json();
  return data.data;
};

// Transform Kitsu API data to match component expectations
const transformKitsuData = (kitsuData) => {
  return kitsuData.map((anime) => {
    const attributes = anime.attributes;
    return {
      id: anime.id,
      title: attributes.canonicalTitle || attributes.titles?.en || attributes.titles?.en_jp || 'Unknown Title',
      image: attributes.posterImage?.medium || attributes.posterImage?.small || 'https://via.placeholder.com/200x300/1f2937/9ca3af?text=No+Image',
      status: attributes.status,
      rating: attributes.averageRating ? Math.round(attributes.averageRating / 10) : 'N/A',
      studio: attributes.studios?.data?.[0]?.attributes?.name || 'Studio Unknown',
      year: attributes.startDate ? new Date(attributes.startDate).getFullYear() : 'N/A',
      episodes: attributes.episodeCount || attributes.episodeLength || 'N/A',
      genres: attributes.categories?.data?.map(cat => cat.attributes.name) || []
    };
  });
};

const Spotlight = () => {
  // Use TanStack Query for fetching spotlight anime
  const {
    data: kitsuData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['spotlight-anime'],
    queryFn: fetchSpotlightAnime,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Transform the data
  const featuredAnime = React.useMemo(() => transformKitsuData(kitsuData), [kitsuData]);

  // Status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'from-green-400 to-emerald-500';
      case 'not_yet_released':
        return 'from-sky-300 to-blue-400';
      case 'finished':
        return 'from-fuchsia-400 to-violet-500';
      case 'cancelled':
        return 'from-red-400 to-rose-500';
      case 'hiatus':
        return 'from-yellow-300 to-amber-400';
      default:
        return 'from-slate-400 to-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'releasing':
        return 'Airing Now';
      case 'not_yet_released':
        return 'Coming Soon';
      case 'finished':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'hiatus':
        return 'On Hiatus';
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
    }
  };

  const genreColors = [
    'bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500',
    'bg-yellow-500', 'bg-orange-500', 'bg-red-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-lime-500',
    'bg-cyan-500', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-500',
  ];

  const getGenreColor = (genre, idx) => genreColors[idx % genreColors.length];

  // Error state with retry button
  if (error) {
    return (
      <section className="space-y-6 px-6 min-h-screen border-b-2 w-full  p-6 bg-black">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold text-white flex items-center pl-3">
            Spotlight
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-red-400 text-lg mb-4">
            Failed to load spotlight anime
          </div>
          <button
            onClick={fetchData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 px-6 min-h-screen border-b-2 w-full border-gray-700 p-6 bg-black">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white flex items-center pl-3">
          Spotlight
        </h2>
        <div className="flex justify-end px-6 mt-4">
          <NavLink 
            className='flex items-center gap-2 cursor-pointer hover:underline text-white rounded-lg border border-gray-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg' 
            to='/manga/all'
          >
            View More
          </NavLink>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-[16rem] bg-gray-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 pl-3 min-h-screen pr-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
          {featuredAnime.map((anime, index) => (
            <div
              key={anime.id}
              className="group relative border border-gray-700 hover:cursor-pointer  h-[47vh] backdrop-blur-md rounded-xl overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Spotlight Badge */}
              <div className="absolute top-2 left-2 z-20 bg-purple-600/90 text-white px-2 py-1 rounded-full text-[11px] font-semibold text-center flex items-center justify-center shadow-md">
                #Spotlight {index + 1}
              </div>

              {/* Rating Badge */}
              {anime.rating && anime.rating !== 'N/A' && (
                <div className="absolute top-2 right-2 z-20 bg-white/20 backdrop-blur-md
                border-white/20 rounded-xl
                text-white px-2 py-0.5  shadow-lg  text-[11px] font-bold flex items-center gap-1 ">
                  <Star size={10} fill="#FFD700" className='text-yellow-400' />
                  {anime.rating}
                </div>
              )}

              {/* Image */}
              <div className="relative h-61 overflow-hidden">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300/1f2937/9ca3af?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
                <div
                  className={`absolute bottom-2 left-2 text-[9px] font-medium text-white px-1.5 py-0.5 rounded-md bg-gradient-to-r ${getStatusColor(
                    anime.status
                  )} shadow-sm`}
                >
                  {getStatusText(anime.status)}
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-1">
                <h3 className="text-white text-xs font-semibold line-clamp-1 group-hover:text-purple-300 transition leading-tight">
                  {anime.title}
                </h3>
                <div className="text-[10px] text-gray-400 italic truncate">
                  {anime.studio}
                </div>
                <div className="flex justify-between text-[11px] items-center text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    {anime.year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Film size={10} />
                    {anime.episodes} eps
                  </div>
                </div>

                {/* Genres */}
                {anime.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {anime.genres.slice(0, 1).map((genre, idx) => (
                      <span
                        key={idx}
                        className={`${getGenreColor(genre, idx)} text-white px-1.5 py-1 text-[10px] rounded-full`}
                      >
                        {genre}
                      </span>
                    ))}
                    {anime.genres.length > 1 && (
                      <span className="bg-gray-500 text-white px-1.5 py-1.5 text-center text-[8px] rounded-full">
                        +{anime.genres.length - 1}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Spotlight;