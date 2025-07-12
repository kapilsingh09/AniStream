import React, { useEffect, useRef } from 'react';
import videojs from 'video.js'; // Make sure you have video.js installed
import 'video.js/dist/video-js.css'; // Optional: include default Video.js styling
// import VideoSrc from '../assets/AnimePahe_Kaoru_Hana_wa_Rin_to_Saku_-_01_1080p_KawaSubs.mp4';

const Player = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    // Check if the player is already initialized
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      const player = videojs(videoElement, options, () => {
        console.log('player is ready');
        playerRef.current = player;
        if (onReady) onReady(player);
      });
    }

    // Clean up
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        controls
        preload="auto"
      >
        <source src={VideoSrc} type="video/mp4" />
      </video>
    </div>
  );
};

export default Player;
