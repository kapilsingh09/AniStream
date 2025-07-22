import React, { useRef, useState } from 'react';

const VideoPlayer = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(null);
  const [expandMode, setExpandMode] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-14 flex flex-col lg:flex-row min-h-screen overflow-hidden bg-black/30 backdrop-blur-md text-white">

      {/* Left Panel: Episodes */}
      <div
        className={`
          transition-all duration-300 p-4 bg-black/40 border-white/10 border-b lg:border-b-0 lg:border-r flex flex-col
          ${expandMode ? 'w-full lg:w-[23%] h-[90vh]' : 'w-full lg:w-[26%] h[100vh]'} 
        `}
      >
        <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Episodes</h2>

        <input
          type="text"
          placeholder="Search episode..."
          className="w-full bg-white/10 text-white text-sm px-3 py-2 rounded-lg mb-4 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1 flex-1 cool-scrollbar custom-scroll">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              onClick={() => setSelectedEpisodeIndex(i)}
              className={`transition rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center
                ${selectedEpisodeIndex === i ? 'bg-purple-500/30' : 'bg-white/10 hover:bg-purple-500/20'}`}
            >
              <span className="font-semibold text-sm whitespace-nowrap">Ep {i + 1}</span>
              <span className="text-xs text-gray-300 truncate max-w-[60%] hidden sm:inline">
                Episode Title {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle + Right Panel */}
      <div className="flex flex-grow flex-col lg:flex-row min-w-0 transition-all duration-300">

        {/* Video Panel */}
        <div
          className={`transition-all duration-300  flex-grow
          ${expandMode ? 'w-full lg:w-[60%]' : 'w-full'}
        `}
        >
          <div className="w-full max-w-full mx-auto">
            <video
              ref={videoRef}
              onClick={togglePlay}
              controls
              className="w-full h-auto  cursor-pointer"
              preload="metadata"
            >
              <source src={src} type={type} />
              Your browser does not support the video tag.
            </video>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setExpandMode(!expandMode)}
                className="border rounded-2xl text-sm px-4 py-2 hover:bg-white/10 transition"
              >
                {expandMode ? 'Collapse' : 'Expand'}
              </button>

              <div className="flex gap-2">
                <button className="bg-white/10 px-3 py-1 rounded hover:bg-purple-500/30">Server 1</button>
                <button className="bg-white/10 px-3 py-1 rounded hover:bg-purple-500/30">Server 2</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Anime Details */}
        {expandMode && (
          <div className="w-full lg:w-[22%] min-w-[220px] bg-black/40 p-4 border-t lg:border-t-0 lg:border-l border-white/10 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-3">Anime Details</h2>
            <p className="text-sm text-gray-300">
              <strong>Title:</strong> Your Anime Title<br />
              <strong>Genre:</strong> Action, Fantasy<br />
              <strong>Episodes:</strong> 12<br />
              <strong>Status:</strong> Ongoing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
