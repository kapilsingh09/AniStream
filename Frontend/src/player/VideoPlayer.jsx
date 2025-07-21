import React, { useRef, useState } from 'react';

const VideoPlayer = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isselected, setIsselected] = useState(false)
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      // video.pause(); 
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto mt-20 flex gap-1  min-h-screen overflow-hidden shadow-lg bg-black/30 backdrop-blur-md text-white">
      
      {/* Left Panel: Episodes */}
      {/* Left Panel: Episodes */}
        <div className="w-[20%] min-w-[200px] bg-black/40 rounded-xl p-4 border h-[70vh] border-white/10 flex flex-col">
    <h2 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">Episodes</h2>

    {/* Search */}
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search episode..."
        className="w-full bg-white/10 text-white text-sm px-3 py-2 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
    </div>

    {/* Responsive Grid List */}
    <div className="grid grid-cols-1 gap-3 overflow-y-auto pr-1 flex-1 cool-scrollbar custom-scroll">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`bg-white/10 hover:bg-purple-500/30 ${isselected ? `bg-purple-500/30` :`bg-white/10`} transition rounded-lg px-4 py-3 cursor-pointer flex justify-between items-center`}
        >
          <span className="font-semibold text-sm whitespace-nowrap">Ep {i + 1}</span>
          <span className="text-xs text-gray-300 truncate max-w-[60%] hidden sm:inline">
            Episode Title That May Be Long
          </span>
        </div>
      ))}
    </div>
  </div>




      {/* Middle Panel: Video */}
      <div className="flex-1">
        <video
          ref={videoRef}
          onClick={togglePlay}
          controls
          className="w-full max-w-4xl h-auto cursor-pointer rounded-xl"
          preload="metadata"
        >
          <source src={src} type={type} />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Right Panel: Anime Details */}
      <div className="w-[25%] min-w-[220px] bg-black/40 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Anime Details</h2>
        <p className="text-sm text-gray-300">
          <strong>Title:</strong> Your Anime Title<br />
          <strong>Genre:</strong> Action, Fantasy<br />
          <strong>Episodes:</strong> 12<br />
          <strong>Status:</strong> Ongoing
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
