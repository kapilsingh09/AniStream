import React, { useRef, useEffect, useState, useCallback } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Maximize2, 
  Minimize2, 
  Settings,
  SkipBack,
  SkipForward
} from "lucide-react";

/**
 * HLSVideoPlayer
 * 
 * Custom video player with custom controls, keyboard shortcuts, and smooth seeking.
 * 
 * --- Seeking Lag Fix Explanation ---
 * 
 * The original implementation used a debounced seek (setTimeout) and a local isSeeking state,
 * which caused lag and a "rubber band" effect when dragging the progress bar.
 * 
 * This rewrite uses two new states:
 *   - isUserSeeking: true while the user is dragging the progress bar (onMouseDown to onMouseUp)
 *   - seekPreviewTime: the time shown on the progress bar while dragging (not yet committed to the video)
 * 
 * While dragging, the progress bar and time display update instantly (no lag).
 * The video only seeks (video.currentTime is set) when the user releases the mouse (onMouseUp/onTouchEnd).
 * 
 * This is the standard approach for smooth, lag-free seeking in custom video players.
 * 
 * All other controls and features are unchanged.
 */
export default function HLSVideoPlayer({ src, type = "mp4", onLoad }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Seeking states for smooth progress bar interaction ---
  const [isUserSeeking, setIsUserSeeking] = useState(false); // true while dragging
  const [seekPreviewTime, setSeekPreviewTime] = useState(0); // preview time while dragging

  const controlsTimeoutRef = useRef(null);

  // Prevent video reload on resize/collapse by only setting src once
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Only set src if it is different
    if (video.src !== src) {
      setLoading(true);
      setError(null);
      video.src = src;
    }

    const handleLoadedMetadata = () => {
      setLoading(false);
      setDuration(video.duration);
      if (onLoad) onLoad();
    };

    const handleError = () => {
      setError("Failed to load video");
      setLoading(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("error", handleError);
    };
  }, [src, onLoad]);

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 1500);
      }
    };

    const handleMouseMove = () => {
      if (isPlaying) resetControlsTimeout();
    };
    
    if (isPlaying) {
      resetControlsTimeout();
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      setShowControls(true);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekVideo(Math.max(0, video.currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekVideo(Math.min(video.duration, video.currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(Math.min(1, video.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(Math.max(0, video.volume - 0.1));
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Seeking logic for smooth progress bar interaction ---

  // Called when user clicks or drags the progress bar
  const handleSeekBarChange = (e) => {
    const value = parseFloat(e.target.value);
    setSeekPreviewTime(value);
    setIsUserSeeking(true);
  };

  // Called when user releases the mouse or touch on the progress bar
  const handleSeekBarCommit = (e) => {
    const value = parseFloat(e.target.value);
    seekVideo(value);
    setIsUserSeeking(false);
  };

  // Called when user starts dragging the progress bar
  const handleSeekBarStart = () => {
    setIsUserSeeking(true);
  };

  // Called when user stops dragging the progress bar (mouse up or touch end)
  const handleSeekBarEnd = (e) => {
    // Only commit if we were seeking
    if (isUserSeeking) {
      const value = parseFloat(e.target.value);
      seekVideo(value);
      setIsUserSeeking(false);
    }
  };

  // Seek the video to a specific time
  const seekVideo = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
    setSeekPreviewTime(time);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(console.error);
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const changeVolume = useCallback((newVolume) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(console.error);
      setIsFullscreen(false);
    }
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.5) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  // Keep seekPreviewTime in sync with currentTime when not seeking
  useEffect(() => {
    if (!isUserSeeking) {
      setSeekPreviewTime(currentTime);
    }
  }, [currentTime, isUserSeeking]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-lg group">
      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center bg-transparent justify-center bg-opacity-80 z-20">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-3"></div>
            {/* <div className="text-white text-sm">Loading...</div> */}
          </div>
        </div>
      )}

      {/* Error */}
      {/* {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
          <div className="text-center text-white">
            <div className="text-red-400 text-xl mb-2">⚠️</div>
            <div className="text-sm">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )} */}

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
        controls={false}
        preload="metadata"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setError("Video playback error");
          setLoading(false);
        }}
        onTimeUpdate={() => {
          // Only update currentTime if not seeking
          if (!isUserSeeking && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          const videoDuration = videoRef.current.duration;
          setDuration(videoDuration);
        }}
        onVolumeChange={() => {
          if (videoRef.current) {
            setVolume(videoRef.current.volume);
            setIsMuted(videoRef.current.muted);
          }
        }}
      />

      {/* Play button overlay */}
      {!isPlaying && !loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-white/30 bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-200 hover:scale-110"
          >
            <Play size={32} fill="white" />
          </button>
        </div>
      )}

      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        {/* Progress Bar */}
        <div className="w-full px-4 pb-2">
          <div className="relative">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={isUserSeeking ? seekPreviewTime : currentTime}
              onChange={handleSeekBarChange}
              onMouseDown={handleSeekBarStart}
              onMouseUp={handleSeekBarCommit}
              onTouchStart={handleSeekBarStart}
              onTouchEnd={handleSeekBarCommit}
              className="progress-bar"
            />
            <div 
              className="progress-fill"
              style={{ 
                width: `${duration && !isNaN(duration) && duration > 0 ? ((isUserSeeking ? seekPreviewTime : currentTime) / duration) * 100 : 0}%`,
                minWidth: '0%',
                maxWidth: '100%',
                opacity: duration && duration > 0 ? 1 : 0.5
              }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between px-4 pb-3">
          {/* Left side controls */}
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="control-btn bg-transparent">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Skip Backward/Forward */}
            <button
              onClick={() => seekVideo(Math.max(0, (isUserSeeking ? seekPreviewTime : currentTime) - 10))}
              className="control-btn"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={() => seekVideo(Math.min(duration, (isUserSeeking ? seekPreviewTime : currentTime) + 10))}
              className="control-btn"
            >
              <SkipForward size={18} />
            </button>

            {/* Volume */}
            <div className="volume-container">
              <button onClick={toggleMute} className="control-btn">
                {getVolumeIcon()}
              </button>
              <div className="volume-slider">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="volume-bar"
                />
              </div>
            </div>

            {/* Time Display */}
            <div className="text-white text-sm font-mono ml-3">
              {formatTime(isUserSeeking ? seekPreviewTime : currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Quality selector (placeholder for HLS) */}
            {type === "hls" && levels.length > 0 && (
              <div className="relative group">
                <button className="control-btn">
                  <Settings size={18} />
                </button>
                <div className="absolute bottom-full right-0 mb-2 bg-white/40 bg-opacity-90 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <select
                    className="bg-transparent text-white text-sm border-none outline-none cursor-pointer"
                    value={currentLevel}
                    onChange={(e) => console.log('Quality changed:', e.target.value)}
                  >
                    <option value={-1} className="bg-black">Auto</option>
                    {levels.map((level, i) => (
                      <option key={i} value={i} className="bg-black">
                        {level.height}p
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="control-btn">
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * --- Developer Notes ---
 * 
 * - The progress bar is now fully responsive and lag-free when seeking.
 * - While dragging, the UI updates instantly, but the video only seeks when the user releases the drag.
 * - This avoids the "lag" or "rubber band" effect from the previous debounce-based approach.
 * - All other controls (volume, play/pause, fullscreen, keyboard shortcuts) are unchanged.
 * - If you want to support touch events more robustly, consider using onPointerDown/onPointerUp for cross-device support.
 */