import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Search,   
  Star,
  Lightbulb,
  PlayCircle,
  FastForward,
  Rewind,
  BookmarkPlus,
  Calendar,
  Users,
  Maximize,
  Minimize,
} from 'lucide-react';
// import { ChevronRight, ChevronLeft } from "lucide-react";
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import SorryCard from '../utils/SorryCard';
import RecomendedAnime from '../components/RecomendedAnime';
import SkeletonLoader from '../loader/SkeletonLoader';
import HlsPlayer from './HlsPlayer'
const fetchAnime = async (animeId) => {
  if (!animeId) throw new Error('No animeId provided');
  const res = await axios.get(`http://localhost:3000/api/anime/${animeId}`);
  return res.data;
};

const VideoPlayer = ({ src, type = 'video/mp4', animeId }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Track current episode by ID, not by index
  const [currentEpisodeId, setCurrentEpisodeId] = useState(null);

  const [expandMode, setExpandMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSorry, setShowSorry] = useState(false);
  const [setshowupcomingep, setSetshowupcomingep] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const [lightsOn, setLightsOn] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [autoskipintro, setAutoskipinto] = useState(true);
  const [autoskipextro, setAutoskipextro] = useState(true);

  const [selectedSub, setSelectedSub] = useState('hd-1');
  const [selectedDub, setSelectedDub] = useState('hd-1');

  // Use TanStack Query to fetch anime data
  const {
    data: animeData,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => fetchAnime(animeId),
    enabled: !!animeId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    onSuccess: (data) => {
      // Set first episode as default if none selected
      if (data?.episodes?.length > 0 && !currentEpisodeId) {
        setCurrentEpisodeId(data.episodes[0].id);
      }
    },
  });

  // Reset video loading state when episode changes
  useEffect(() => {
    setVideoLoading(true);
    setShowSorry(false);
  }, [currentEpisodeId]);

  // Show SorryCard if the current episode has no videoUrl
  useEffect(() => {
    if (!loading && animeData && animeData.episodes?.length > 0) {
      const currentEpisode =
        animeData.episodes.find((ep) => ep.id === currentEpisodeId) || null;
      if (currentEpisode && !currentEpisode.videoUrl) {
        setShowSorry(true);
      } else {
        setShowSorry(false);
      }
    } else {
      setShowSorry(false);
    }
  }, [loading, animeData, currentEpisodeId]);

  const togglePlay = () => {
    // This function is now handled by the HlsPlayer component
    setIsPlaying(!isPlaying);
  };

  const getDisplayEpisodeNumber = (ep, idx) => {
    if (typeof ep.episode === 'number' && !isNaN(ep.episode)) {
      return ep.episode;
    }
    if (typeof ep.episode === 'string' && !isNaN(Number(ep.episode))) {
      return Number(ep.episode);
    }
    return idx + 1;
  };

  // Search only filters the display list, not the current playing ep
  const filteredEpisodes =
    animeData?.episodes?.filter(
      (ep) =>
        ep.episode?.toString().includes(searchQuery) ||
        ep.id?.toString().includes(searchQuery)
    ) || [];

  // Handle selecting episode by ID instead of index
  const handleSelect = (episodeId) => {
    setCurrentEpisodeId(episodeId);
    setIsPlaying(false);
  };

  // CurrentEpisode always from full animeData, not filtered list
  const currentEpisode =
    animeData?.episodes?.find((ep) => ep.id === currentEpisodeId) ||
    animeData?.episodes?.[0] ||
    null;

  // Find the index of the current episode in the full episode list
  const selectedEpisodeIndex = React.useMemo(() => {
    if (!animeData?.episodes || !currentEpisodeId) return 0;
    return animeData.episodes.findIndex((ep) => ep.id === currentEpisodeId);
  }, [animeData, currentEpisodeId]);

  const crossBack = () => {
    if (!animeData?.episodes) return;
    const idx = animeData.episodes.findIndex(
      (ep) => ep.id === currentEpisodeId
    );
    if (idx > 0) {
      setCurrentEpisodeId(animeData.episodes[idx - 1].id);
      setIsPlaying(false);
    }
  };

  if (loading) {
    return (
      <SkeletonLoader />
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 text-white">
        <div className="text-lg font-semibold text-red-400">
          {error?.message || 'Error fetching anime data.'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-auto min-h-screen  bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl text-white relative overflow-hidden">
      {/* SorryCard Modal */}
      {lightsOn && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-10 pointer-events-none transition-opacity duration-500" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Episodes List */}
        <div
          className={`transition-all duration-500 ease-in p-2 max-h-full backdrop-blur-md bg-black/30  h-lvh cool-scrollbar flex flex-col ${
            expandMode
              ? 'w-full lg:w-[20%]'
              : 'w-full lg:w-[22%]'
          } ${expandMode ? 'lg:min-w-[280px]' : 'lg:min-w-[300px]'}`}
        >
          <div className="flex items-center gap-3 mb-2 ml-1">
            <h2 className="text-xl font-bold    text-white">
               List of episodes
            </h2>
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
              <div className="text-gray-400 text-center py-8">
                No episodes found.
              </div>
            ) : (
              filteredEpisodes
                .filter((ep) => ep.airdate !== null)
                .map((ep, i) => (
                  <div
                    key={ep.id || i}
                    onClick={() => handleSelect(ep.id)}
                    className={`cursor-pointer p-3 rounded mb-2 ${
                      ep.id === currentEpisodeId
                        ? 'bg-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">
                      Episode {getDisplayEpisodeNumber(ep, i)}
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
        <div className="flex-1 flex  flex-col lg:flex-row">
          {/* Video Section */}
          <div
            className={`transition-all duration-500 ease-in flex-1 h-full ${
              expandMode ? 'w-full' : 'lg:pr-0'
            }`}
          >
            <div className="relative group h-[65vh] ">
              <div className="relative overflow-hidden bg-black shadow-2xl h-full">
                {!currentEpisode ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <h2 className="text-xl font-semibold text-white mb-2">
                      No episode selected
                    </h2>
                  </div>
                ) : !currentEpisode.videoUrl ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 relative">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🎬</div>
                      <h3 className="text-xl font-semibold mb-2">No Video Available</h3>
                      <p className="text-gray-400 mb-4">This episode doesn't have a video source yet.</p>
                      <button 
                        onClick={crossBack}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                      >
                        Try Previous Episode
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {videoLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
                        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {currentEpisode.videoUrl && (
                      <HlsPlayer 
                        src={currentEpisode.videoUrl} 
                        type={currentEpisode.videoUrl?.includes('.m3u8') ? 'hls' : 'mp4'}
                        onLoad={() => setVideoLoading(false)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* video player bottom */}
            <div className="p-3 flex flex-wrap items-center justify-between gap-4 ">
              {/* Left Controls */}
              <div className="w-full flex items-center flex-nowrap overflow-x-auto gap-3 text-sm pb-1">
                {/* Expand */}
                <button
                  onClick={() => setExpandMode(!expandMode)}
                  className="min-w-fit px-2 py-2 rounded cursor-pointer text-sm font-semibold text-white flex items-center gap-1"
                >
                  {expandMode ? (
                    <>
                      <Maximize size={16} />
                      Expand
                    </>
                  ) : (
                    <>
                      <Minimize size={16} />
                      Collapse
                    </>
                  )}
                </button>

                {/* Lights */}
                <button
                  onClick={() => setLightsOn(!lightsOn)}
                  className={`min-w-fit px-3 text-sm py-2 text-white rounded-xl  font-semibold flex items-center gap-1 cursor-pointer transition-all duration-300 transform ${
                    lightsOn ? 'bg-violet-500' : ''
                  }`}
                >
                  <Lightbulb size={16} />
                  <span className={lightsOn ? '' : 'text-red-500'}>
                    {' '}
                    <span className="text-white">Lights: </span>
                    {lightsOn ? 'On' : 'Off'}
                  </span>
                </button>

                {/* AutoPlay */}
                <button
                  className={`min-w-fit px-3 py-2 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer transition-all duration-300 transform ${
                    autoPlay ? 'bg-violet-500' : ''
                  }`}
                  onClick={() => setAutoPlay(!autoPlay)}
                >
                  <PlayCircle size={16} />
                  <span className={autoPlay ? '' : 'text-red-500'}>
                    <span className="text-white">AutoPlay:</span>
                    {autoPlay ? 'On' : 'Off'}
                  </span>
                </button>

                {/* Skip Intro */}
                <button
                  onClick={() => setAutoskipinto(!autoskipintro)}
                  className={`min-w-fit px-3 py-2 text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer transition-all duration-300 transform ${
                    autoskipintro ? 'bg-violet-500' : ''
                  }`}
                >
                  <FastForward size={16} />
                  <span className={autoskipintro ? '' : 'text-red-500'}>
                    <span className="text-white">
                      <span className="text-white">Skip Intro: </span>
                    </span>
                    {autoskipintro ? 'On' : 'Off'}
                  </span>
                </button>

                {/* Skip Outro */}
                <button
                  onClick={() => setAutoskipextro(!autoskipextro)}
                  className={`min-w-fit px-3 py-2 ${
                    autoskipextro ? 'bg-violet-500' : ' '
                  } text-white rounded-xl text-sm font-semibold flex items-center gap-1 cursor-pointer transition-all duration-300 transform`}
                >
                  <Rewind size={16} />
                  <span className={autoskipextro ? '' : 'text-red-500'}>
                    <span className="text-white"> Skip Outro: </span>
                    {autoskipextro ? 'On' : 'Off'}
                  </span>
                </button>

                <button className="px-3 py-2 flex items-center gap-2 bg-violet-600 text-white rounded-xl text-sm font-semibold transition-all duration-300">
                  <BookmarkPlus size={16} />
                  Add Watchlist
                </button>
              </div>

              
              {/* Right-Aligned Watchlist Button */}
            </div>  

            <div className= "h-[17vh] flex pl-4 pr-4 items-center text-white text-sm">
              {/* Left Info Box */}
              <div className=" h-full bg-slate-900  w-[65%] p-3 rounded-l-2xl flex flex-col justify-center text-center shadow-md">
                <p className="text-base font-semibold mb-1">You are watching</p>
                <span className="font-medium mb-1">
                  Episode: {currentEpisode ? getDisplayEpisodeNumber(currentEpisode, selectedEpisodeIndex) : ''}
                </span>
                <p className="text-xs px-3">
                  If the current server doesn't work, please try other servers
                  listed below.
                </p>
              </div>

              {/* Server Options */}
             
                <div className=" h-full w-full bg-black/40 rounded-r-xl p-3 text-white shadow-md flex flex-col justify-around gap-3">
                  {/* Sub Section */}
                  <div className="flex text-center gap-8">
                      <span className="block font-medium mb-1">Sub:</span>
                    <div className="flex gap-2 flex-wrap">
                      {['hd-1', 'hd-2'].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setSelectedSub(sub)}
                          className={`px-4 py-2 rounded-lg transition font-medium ${
                            selectedSub === sub
                              ? 'bg-orange-400  text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {sub.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dub Section */}
                  <div className="flex items-center justify-self-center gap-8">
                    <span className="block font-medium mb-1">Dub:</span>
                    <div className="flex gap-2 flex-wrap">
                      {['hd-1', 'hd-2'].map((dub) => (
                        <button
                          key={dub}
                          onClick={() => setSelectedDub(dub)}
                          className={`px-4 py-2 rounded-lg transition font-medium ${
                            selectedDub === dub
                              ? 'bg-violet-500 text-white'
                              : 'bg-white/20 text-white hover:bg-white/30'
                          }`}
                        >
                          {dub.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
               
            </div>
      
          </div>
            <div className='flex items-center justify-center '>
            {setshowupcomingep && (
              <div className="w-[80%] mx-auto my-4 flex items-center justify-between bg-blue-600 text-white rounded-lg shadow-lg px-4 py-3 relative animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <p className="text-sm">
                    Next episode airs on{" "}
                    <span className="font-semibold underline">
                      8/2/2025, 8:00:00 PM
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => setSetshowupcomingep(false)}
                  className="text-white hover:text-gray-200 text-lg font-bold px-2 transition-colors"
                  title="Close"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            )}
            </div>
          </div>
            
          {/* Anime Details Panel */}
          {expandMode && (
            <div className="w-full lg:w-[20%] lg:min-w-[280px] p-4 bg-transparent backdrop-blur-md border-l border-white/10">
              <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Anime Details
              </h2>
              <div className="space-y-5">
                <div className=" overflow-hidden  ">
                <div className="h-[180px] w-[120px] rounded-lg">
                  <img
                    src={
                      animeData?.posterImage?.original ||
                      'https://via.placeholder.com/300x400?text=No+Image'
                    } 
                    alt="Anime Poster"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <h3 className="font-semibold text-base mb-1">
                      {animeData?.title || 'Unknown Title'}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{animeData?.rating || '9.2'}</span>
                      <span className="text-gray-400">
                        {animeData?.reviews
                          ? `(${animeData.reviews})`
                          : '(15.7k)'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-auto text-white px-2 py-1 bg-green-400 rounded font-semibold">
                        {animeData?.status || 'Ongoing'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="text-gray-400">Episode Length:</span>
                      <span className="ml-auto px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">
                        {animeData?.episodeLength
                          ? `${animeData.episodeLength} min`
                          : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <Play className="w-3.5 h-3.5 text-purple-400" /> */}
                      <span className="text-gray-400"> Total Episodes:</span>
                      <span className="ml-auto">
                        {animeData?.episodes?.length
                          ? `${animeData.episodes.length} / ${animeData.episodes.length}`
                          : '0 / 0'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <h4 className="font-medium mb-1 text-purple-300 text-sm">
                      Synopsis
                    </h4>
                    <div className='h-40 overflow-y-auto '>
                    <p className="text-gray-300 text-xs leading-snug ">
                      {animeData?.synopsis ||
                        'Desc.. not avaliable'}
                    </p>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400">Genres:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(animeData?.genres?.length > 0
                        ? animeData.genres
                        : ['Unknown']
                      ).map((genre) => (
                        <span
                          key={genre}
                          className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[10px]"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                   

                  </div>
                
                </div>
              </div>
            </div>
          )}
          
        </div>
        
      </div>

      {/* <RecomendedAnime />/ */}
    </div>
  );
};

export default VideoPlayer;
