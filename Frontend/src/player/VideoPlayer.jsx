import React, { useRef, useEffect, useState } from 'react';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      setIsPlaying(true);
    }
  }, [src]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'f') {
        toggleFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

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
          className="w-full h-[70vh] object-contain bg-black"
        >
          Your browser does not support the video tag.
        </video>

        {/* Custom Controls */}
        <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-800 text-white text-sm">
          <button onClick={togglePlayPause} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="volume">Volume</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="speed">Speed</label>
            <select
              id="speed"
              value={playbackRate}
              onChange={handleSpeedChange}
              className="bg-gray-700 rounded px-2 py-1"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>

          <button onClick={toggleFullscreen} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
            Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
