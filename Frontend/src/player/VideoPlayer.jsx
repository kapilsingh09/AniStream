import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load(); // Reload video when src changes
    }
  }, [src]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-black border border-gray-700">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          preload="auto"
          controls
          playsInline
          className="w-full h-[70vh]  object-contain pl-5 pr-5 bg-black"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
