import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Search, Star, Calendar, Users } from 'lucide-react';

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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full mx-auto min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl text-white relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel: Episodes */}
        <div
          className={`
            transition-all duration-500 ease-in-out p-6
            h-full max-h-full
            backdrop-blur-md bg-black/30 border-r border-white/10
            flex flex-col
            ${expandMode ? 'w-full lg:w-[20%]' : 'w-full lg:w-[28%]'}
            ${expandMode ? 'lg:min-w-[280px]' : 'lg:min-w-[350px]'}
          `}
          style={{
            height: '100%',
            maxHeight: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            {/* <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              {/* <Play className="w-4 h-4" /> */}
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
              className="w-full bg-white/5 border border-white/10 text-white text-sm pl-10 pr-4 py-3 rounded-xl
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50
                backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            />
          </div>

          {/* Episodes List */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30"
            style={{ maxHeight: '100%' }}
          >
            {filteredEpisodes.length === 0 ? (
              <div className="text-gray-400 text-center py-8">No episodes found.</div>
            ) : (
              filteredEpisodes.map((ep, i) => {
                const isSelected = selectedEpisodeIndex === episodes.findIndex(e => e.id === ep.id);
                const handleSelect = () => setSelectedEpisodeIndex(episodes.findIndex(e => e.id === ep.id));

                return (
                  <div
                    key={ep.id}
                    onClick={handleSelect}
                    className={`
            group flex items-center gap-3 p-3 relative overflow-hidden rounded-xl cursor-pointer transition-all
            ${isSelected ? 'bg-purple-500/30' : 'bg-white/5 hover:bg-white/10'}
          `}
                  >
                    {/* Thumbnail Preview */}
                    {/* <div className="relative w-16 h-10 rounded overflow-hidden bg-black/20 shrink-0"> */}
                      {/* <img
                        src={ep.thumbnail}
                        alt={`Ep ${ep.id}`}
                        className="w-full h-full object-cover"
                      /> */}
                    {/* </div> */}

                    {/* Episode Info */}
                    <div className="flex-1  min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-semibold text-white">Episode {ep.id}</span>
                        <span className="text-xs text-gray-400">{ep.duration}</span>
                      {ep.watched && (
                        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-green-400"></div>
                      )}
                      </div>
                      <p className="text-xs text-gray-300 truncate">{ep.title}</p>
                    </div>
                  </div>
                );
              })
            )}
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
                    Episode {episodes[selectedEpisodeIndex]?.id}: {episodes[selectedEpisodeIndex]?.title}
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