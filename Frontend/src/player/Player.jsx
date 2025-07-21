// src/App.js
import React from 'react';
import VideoPlayer from '../player/VideoPlayer';

function App() {
  return (
    <VideoPlayer src="http://localhost:3000/videos/anime-49205-ep1.mp4" />
  );
}

export default App;
