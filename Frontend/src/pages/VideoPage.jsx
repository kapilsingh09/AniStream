import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const VideoPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);

  useEffect(() => {
    if (!id) return;
    const fetchAnime = async () => {
      const res = await fetch("http://localhost:3000/api/available_data");
      const data = await res.json();
      const found = data.find((a) => a.id === id);
      setAnime(found);
    };
    fetchAnime();
  }, [id]);

  if (!anime) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );

  const handleEpisodeSelect = (episodeNumber) => {
    setCurrentEpisode(episodeNumber);
  };

  const currentEpisodeData = anime.episodes?.find(ep => ep.number === currentEpisode);

  return (
    <div className="min-h-screen bg-gray-900 text-white mt-14">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 mb-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{anime.title}</h1>
        <p className="text-gray-400 text-sm">{anime.original_title}</p>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Episodes List */}
        <div className="w-1/4 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Episodes ({anime.episodes_aired || anime.episodes?.length || 0})</h2>
            <div className="space-y-2">
              {anime.episodes?.map((episode) => (
                <button
                  key={episode.number}
                  onClick={() => handleEpisodeSelect(episode.number)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentEpisode === episode.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${!episode.video_url ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!episode.video_url}
                >
                  <div className="font-medium">Episode {episode.number}</div>
                  {episode.air_date && !episode.video_url && (
                    <div className="text-xs text-gray-400">Airs: {episode.air_date}</div>
                  )}
                  {!episode.video_url && (
                    <div className="text-xs text-red-400">Not Available</div>
                  )}
                </button>
              ))}
              
            </div>
          </div>
        </div>

        {/* Middle - Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {currentEpisodeData?.video_url ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <video
                key={currentEpisode}
                controls
                autoPlay
                
                className="w-full h-full max-h-[80vh] rounded-lg"
                src={`http://localhost:3000${currentEpisodeData.video_url}`}
                poster="/api/placeholder/800/450"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📺</div>
              <h3 className="text-xl mb-2">Episode {currentEpisode} Not Available</h3>
              <p>This episode hasn't been released yet or is not available for streaming.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Anime Info */}
        <div className="w-1/3 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Anime Information</h2>
            
            {/* Synopsis */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">SYNOPSIS</h3>
              <p className="text-sm leading-relaxed">{anime.synopsis}</p>
            </div>

            {/* Basic Info */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">DETAILS</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-400">Status:</span> {anime.status}</div>
                <div><span className="text-gray-400">Type:</span> {anime.type}</div>
                <div><span className="text-gray-400">Episodes:</span> {anime.episodes_aired || '?'} / {anime.total_episodes || '?'}</div>
                <div><span className="text-gray-400">Start Date:</span> {anime.start_date}</div>
                <div><span className="text-gray-400">Studio:</span> {anime.studios?.join(', ')}</div>
                <div><span className="text-gray-400">Licensor:</span> {anime.licensor}</div>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">GENRES</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres?.map((genre, index) => (
                  <span key={index} className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Cast */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">MAIN CAST</h3>
              <div className="space-y-2">
                {anime.cast?.slice(0, 6).map((castMember, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{castMember.character}</div>
                    <div className="text-gray-400 text-xs">{castMember.voice_actor}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff */}
            {anime.staff && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">STAFF</h3>
                <div className="space-y-1 text-sm">
                  {anime.staff.director && (
                    <div><span className="text-gray-400">Director:</span> {anime.staff.director.join(', ')}</div>
                  )}
                  {anime.staff.writer && (
                    <div><span className="text-gray-400">Writer:</span> {anime.staff.writer}</div>
                  )}
                  {anime.staff.character_design && (
                    <div><span className="text-gray-400">Character Design:</span> {anime.staff.character_design.join(', ')}</div>
                  )}
                  {anime.staff.music && (
                    <div><span className="text-gray-400">Music:</span> {anime.staff.music}</div>
                  )}
                </div>
              </div>
            )}

            {/* Themes */}
            {anime.themes && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">THEME SONGS</h3>
                <div className="space-y-2 text-sm">
                  {anime.themes.opening && (
                    <div>
                      <div className="font-medium">Opening</div>
                      <div className="text-gray-400">"{anime.themes.opening.title}" by {anime.themes.opening.artist}</div>
                    </div>
                  )}
                  {anime.themes.ending && (
                    <div>
                      <div className="font-medium">Ending</div>
                      <div className="text-gray-400">"{anime.themes.ending.title}" by {anime.themes.ending.artist}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manga Info */}
            {anime.manga && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2">MANGA</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-400">Author:</span> {anime.manga.author}</div>
                  <div><span className="text-gray-400">Publisher:</span> {anime.manga.publisher}</div>
                  <div><span className="text-gray-400">Volumes:</span> {anime.manga.volumes}</div>
                  <div><span className="text-gray-400">Copies Sold:</span> {anime.manga.copies_sold}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;