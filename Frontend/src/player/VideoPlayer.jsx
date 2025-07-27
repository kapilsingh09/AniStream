  import React, { useRef, useState, useEffect } from 'react';
  import { Play, Pause, Search, Star, Calendar, Users } from 'lucide-react';
  import axios from 'axios';
import SorryCard from '../utils/SorryCard';

  const VideoPlayer = ({ src, type = 'video/mp4' }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
    const [expandMode, setExpandMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [animeData, setAnimeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch anime data on mount
    useEffect(() => {
      const fetchAnime = async () => {
        setLoading(true);
        setFetchError(null);
        try {
          const res = await axios.get('http://localhost:3000/api/anime/the%20flower%20blooms%20with%20dignity');
          setAnimeData(res.data);
        } catch (error) {
          setFetchError('Error fetching anime data.');
        } finally {
          setLoading(false);
        }
      };
      fetchAnime();
    }, []);

    // When selectedEpisodeIndex changes, load and play the new episode
    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        video.load(); // Just load, don't play automatically
      }
    }, [selectedEpisodeIndex]);

    // Play/pause toggle for video
    const togglePlay = () => {
      const video = videoRef.current;
      if (video?.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video?.pause();
        setIsPlaying(false);
      }
    };

    // Filter episodes by search query
    const filteredEpisodes = animeData?.episodes?.filter((ep) =>
      // ep.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.id?.toString().includes(searchQuery) ||      // Search by episode number
      ep.episode?.toString().includes(searchQuery)    // Fallback if your API uses "episode"
    ) || [];
    // When an episode is clicked, select and play it
    const handleSelect = (idx) => {
      setSelectedEpisodeIndex(idx); 
      setIsPlaying(false);         
      setCurrentTime(0);
      setDuration(0);
    };

    const currentEpisode = filteredEpisodes[selectedEpisodeIndex] ||  null
    
// console.log(currentEpisode);


    if (loading) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 text-white">
          <div className="text-lg font-semibold animate-pulse">Loading...</div>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 text-white">
          <div className="text-lg font-semibold text-red-400">{fetchError}</div>
        </div>
      );
    }

   
    return (
      <div className="w-full mx-auto min-h-screen bg-gradient-to-br mt-14 from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
          {/* Episodes List */}
          <div className={`
              transition-all duration-500 border border-white ease-in-out p-2
              max-h-full
              backdrop-blur-md bg-black/30 border-r h-lvh cool-scrollbar
              flex flex-col
              ${expandMode ? 'w-full lg:w-[20%]' : 'w-full lg:w-[23%]'}
              ${expandMode ? 'lg:min-w-[280px]' : 'lg:min-w-[300px]'}
            `}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Episodes</h2>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search episodes..."
                className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              />
            </div>

            {/* Episode List Items */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-2 h-[100vh] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
              {filteredEpisodes.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No episodes found.</div>
              ) : 
              //episodes render here filter or then map
              (filteredEpisodes
                .filter((ep) => ep.airdate !== null)
                .map((ep, i) => (
                  <div
                    key={ep.id || i}
                    onClick={() => handleSelect(i)} 
                    className={`cursor-pointer p-3 rounded mb-2 ${
                      selectedEpisodeIndex === i ? 'bg-purple-500/30' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">
                      Episode {ep.id || ep.episode}
                    </div>
                    <div className="text-xs text-white/60">
                      {ep.title || 'Untitled'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Video Panel */}
            <div className={`transition-all duration-500 ease-in-out flex-1 h-full  ${expandMode ? '' : 'lg:pr-0'}`}>
              <div className="relative group">
                <div className="relative overflow-hidden bg-black shadow-2xl">
                 {!currentEpisode.videoUrl ?  (
                 <div className="flex items-center justify-center h-[360px] bg-black/40">
                 <SorryCard />
               </div>
                 ):(
                   <video
                   ref={videoRef}
                   onClick={togglePlay}
                   controls
                   className="w-full h-auto cursor-pointer"
                   preload="metadata"
                 >
                   <source src={currentEpisode?.videoUrl || src} type={type} />
                   Your browser does not support the video tag.
                 </video>
                 )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpandMode(!expandMode)}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {expandMode ? '← Collapse' : 'Expand →'}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Servers:</span>
                    {[1, 2, 3].map(server => (
                      <button
                        key={server}
                        className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                      >
                        Server {server}
                      </button>
                    ))}
                  </div>
                </div>

                {/* <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>1.2k watching</span>
                </div> */}
              </div>

              <div className="mt-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      {currentEpisode ? `Episode ${currentEpisode.id || currentEpisode.episode}: ${currentEpisode.title || ''}` : 'No episode selected'}
                    </h1>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {currentEpisode?.description || "No description available for this episode."}
                    </p>
                  </div>
                  <div className="ml-6 flex items-center gap-2 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">{animeData?.rating || '9.2'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Anime Details Panel */}
            {expandMode && (
              <div className="w-full lg:w-[20%] lg:min-w-[240px] p-4 bg-black/20 backdrop-blur-md border-l border-white/10">
                <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Anime Details
                </h2>
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md">
                    <img
                      src={animeData?.thumbnail || "sorry dev"}
                      alt="Anime Poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h3 className="font-semibold text-base mb-1">{animeData?.title || "Unknown Title"}</h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{animeData?.rating || "9.2"}</span>
                        <span className="text-gray-400">{animeData?.reviews ? `(${animeData.reviews})` : "(15.7k)"}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-gray-400">Status:</span>
                        <span className="ml-auto text-green-400 font-semibold">
                          {animeData?.status || "Ongoing"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-gray-400">Episodes:</span>
                        <span className="ml-auto">
                          {animeData?.episodes?.length
                            ? `${animeData.episodes.length} / ${animeData.episodes.length}`
                            : "0 / 0"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400">Genres:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(animeData?.genres?.length > 0 ? animeData.genres : ['sorry for geners']).map((genre) => (
                          <span key={genre} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px]">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <h4 className="font-medium mb-1 text-purple-300 text-sm">Synopsis</h4>
                      <p className="text-gray-300 text-xs leading-snug line-clamp-5">
                        {animeData?.synopsis || "A young warrior discovers magical powers and must unite with allies to stop an ancient evil. Epic fantasy adventure awaits."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  };

  export default VideoPlayer;
