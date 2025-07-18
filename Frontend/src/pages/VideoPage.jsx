import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VideoPage() {
  const [animeData, setAnimeData] = useState(null);
  const slug = 'the-fragrant-flower-blooms-with-dignity';

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/anime/${slug}`);
        setAnimeData(res.data);
        console.log(res.data);
        
        // Log each episode's video URL
        res.data.episodes.forEach((ep, index) => {
          console.log(`Episode ${index + 1} videoUrl:`, ep.videoUrl);
        });
        
      } catch (error) {
        console.error('⚠️ Error fetching anime:', error.message);
      }
    };

    fetchAnime();
  }, []);

  if (!animeData) return <h2>Loading anime...</h2>;

  return (
    <div className="container">
      <h1>{animeData.title}</h1>
      <img src={animeData.thumbnail} alt="Anime Thumbnail" className="main-thumb" />

      <div className="episodes">
        {animeData.episodes.map((ep) => (
          <div key={ep.episode} className="episode-card">
            <h3>Episode {ep.episode}: {ep.title}</h3>
            <p>{ep.description}</p>
            
            {ep.videoUrl ? (
              <div>
                <p>Video URL: {ep.videoUrl}</p>
                <video controls width="70%" height="100%" preload="metadata">
                  <source src={ep.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p className="not-available">⚠️ Video not available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoPage;