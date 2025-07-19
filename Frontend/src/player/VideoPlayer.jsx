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
    <div className="max-w-5xl mx-auto mt-10 rounded-lg shadow-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        controls
        autoPlay
        preload="auto"
        className="w-full bg-black"
        style={{ aspectRatio: '16 / 9' }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
