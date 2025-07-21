import React, { useRef, useState } from 'react';

const VideoPlayer = ({ src, type = 'video/mp4' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto mt-20 flex gap-4 p-4 rounded-2xl overflow-hidden shadow-lg bg-black/30 backdrop-blur-md text-white">
      
      {/* Left Panel: Episodes */}
      <div className="w-[20%] min-w-[180px] bg-black/40 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Episodes</h2>
        <ul className="space-y-2 text-sm">
          <li className="hover:underline cursor-pointer">Episode 1</li>
          <li className="hover:underline cursor-pointer">Episode 2</li>
          <li className="hover:underline cursor-pointer">Episode 3</li>
        </ul>
      </div>

      {/* Middle Panel: Video */}
      <div className="flex-1 flex justify-center">
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
