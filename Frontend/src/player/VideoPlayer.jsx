import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Search, ChevronDown, Star, Calendar, Clock, Users } from 'lucide-react';

const VideoPlayer = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [expandMode, setExpandMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Mock episode data
  const episodes = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: `The ${['Awakening', 'Journey Begins', 'Hidden Power', 'Dark Secrets', 'Final Battle', 'New Dawn', 'Lost Memories', 'Ancient Magic'][i % 8]}`,
    duration: `${Math.floor(Math.random() * 5) + 20}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    watched: i < 3,
    thumbnail: `https://picsum.photos/160/90?random=${i}`
  }));

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

  const filteredEpisodes = episodes.filter(ep => 
    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.id.toString().includes(searchQuery)
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full mx-auto min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl text-white relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Panel: Episodes */}
        <div className={`
          transition-all duration-500 ease-in-out p-6 backdrop-blur-md bg-black/30 border-r border-white/10
          ${expandMode ? 'w-full lg:w-[20%]' : 'w-full lg:w-[28%]'}
          ${expandMode ? 'lg:min-w-[280px]' : 'lg:min-w-[350px]'}
        `}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Episodes</h2>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search episodes..."
              className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
                backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            />
          </div>

          {/* Episodes List */}
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
            {filteredEpisodes.map((episode, i) => (
              <div
                key={episode.id}
                onClick={() => setSelectedEpisodeIndex(i)}
                className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                  ${selectedEpisodeIndex === i 
                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg shadow-purple-500/25' 
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
              >
                <div className="flex items-center p-4">
                  <div className="relative">
                    <img 
                      src={episode.thumbnail} 
                      alt={`Episode ${episode.id}`}
                      className="w-16 h-9 rounded-lg object-cover"
                    />
                    {episode.watched && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-300">EP {episode.id}</span>
                      {selectedEpisodeIndex === i && <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>}
                    </div>
                    <p className="font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">
                      {episode.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{episode.duration}</span>
                    </div>
                  </div>

                  {selectedEpisodeIndex === i && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent pointer-events-none"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          
          {/* Video Panel */}
          <div className={`transition-all duration-500 ease-in-out flex-1 p-6 ${expandMode ? '' : 'lg:pr-0'}`}>
            
            {/* Video Container */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl bg-black shadow-2xl">
                <video
                  ref={videoRef}
                  onClick={togglePlay}
                  controls
                  className="w-full h-auto cursor-pointer"
                  preload="metadata"
                  poster="https://picsum.photos/1280/720?random=video"
                >
                  <source src={src} type={type} />
                  Your browser does not support the video tag.
                </video>
                
                {/* Custom play overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors pointer-events-auto"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </button>
                        <div className="text-sm font-medium">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpandMode(!expandMode)}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-sm font-semibold
                    hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {expandMode ? '← Collapse' : 'Expand →'}
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Servers:</span>
                  {[1, 2, 3].map(server => (
                    <button 
                      key={server}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs
                        hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
                    >
                      Server {server}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Users className="w-4 h-4" />
                <span>1.2k watching</span>
              </div>
            </div>

            {/* Episode Info */}
            <div className="mt-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Episode {selectedEpisodeIndex + 1}: {episodes[selectedEpisodeIndex]?.title}
                  </h1>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    In this thrilling episode, our heroes face their greatest challenge yet. With the fate of the world hanging in the balance, 
                    ancient powers awaken and alliances are tested. Don't miss this action-packed adventure that will leave you on the edge of your seat.
                  </p>
                </div>
                <div className="ml-6 flex items-center gap-2 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">9.2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Anime Details */}
          {expandMode && (
            <div className="w-full lg:w-[25%] lg:min-w-[300px] p-6 bg-black/20 backdrop-blur-md border-l border-white/10">
              <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Anime Details
              </h2>
              
              <div className="space-y-6">
                {/* Poster */}
                <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="https://picsum.photos/300/400?random=poster" 
                    alt="Anime Poster"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Mystic Warriors</h3>
                    <div className="flex items-center gap-2 text-yellow-400 mb-3">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">9.2</span>
                      <span className="text-gray-400 text-sm">(15.7k reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className="ml-2 text-green-400 font-semibold">Ongoing</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-gray-400">Episodes:</span>
                        <span className="ml-2">24 / 24</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-gray-400">Genres:</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {['Action', 'Fantasy', 'Adventure', 'Magic'].map(genre => (
                          <span key={genre} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-xs">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Synopsis */}
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="font-semibold mb-2 text-purple-300">Synopsis</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A young warrior discovers ancient magical powers and must unite with unlikely allies to prevent 
                      an ancient evil from consuming the world. With stunning animation and epic battles, this series 
                      redefines the fantasy genre.
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