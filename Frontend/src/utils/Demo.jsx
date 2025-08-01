// Demo for testing backend saveAnimeList and getAnimeList functions

import React, { useState } from 'react';
import axios from 'axios';

// Mock data to test saving anime list
const mockTrendingAnime = [
  {
    mal_id: 1,
    title: "Fullmetal Alchemist: Brotherhood",
    synopsis: "Alchemy and adventure in a world of equivalent exchange.",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
      }
    },
    url: "https://myanimelist.net/anime/5114/Fullmetal_Alchemist__Brotherhood"
  },
  {
    mal_id: 2,
    title: "Attack on Titan",
    synopsis: "Humanity fights for survival against titans.",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
      }
    },
    url: "https://myanimelist.net/anime/16498/Shingeki_no_Kyojin"
  },
  {
    mal_id: 3,
    title: "Jujutsu Kaisen",
    synopsis: "Cursed energy and sorcerers battle evil spirits.",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
      }
    },
    url: "https://myanimelist.net/anime/40748/Jujutsu_Kaisen"
  },
  {
    mal_id: 4,
    title: "Demon Slayer",
    synopsis: "A boy fights demons to save his sister.",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
      }
    },
    url: "https://myanimelist.net/anime/38000/Kimetsu_no_Yaiba"
  },
  {
    mal_id: 5,
    title: "Death Note",
    synopsis: "A notebook grants the power to kill by writing names.",
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/9/9453.jpg"
      }
    },
    url: "https://myanimelist.net/anime/1535/Death_Note"
  }
];

const Demo = () => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animeList, setAnimeList] = useState([]);
  const [error, setError] = useState(null);

  // Save mock anime list to backend
  const handleSaveAnimeList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:3000/api/save-anime-list', mockTrendingAnime);
      setSaved(true);
    } catch (err) {
      setError('Failed to save anime list.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved anime list from backend
  const handleGetAnimeList = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:3000/api/get-anime-list');
      setAnimeList(res.data);
    } catch (err) {
      setError('Failed to fetch anime list.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-20 p-4">
      <h1 className="text-3xl font-bold mb-6">Backend Anime List Demo</h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleSaveAnimeList}
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Anime List'}
        </button>
        <button
          onClick={handleGetAnimeList}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Fetching...' : 'Get Saved Anime List'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {saved && <div className="text-green-500 mb-4">Anime list saved to backend!</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {(animeList.length > 0 ? animeList : mockTrendingAnime).map(anime => (
          <div
            key={anime.mal_id || anime._id}
            className="bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={anime.images?.jpg?.image_url || anime.image_url}
              alt={anime.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 text-white">
              <h2 className="text-lg font-semibold">{anime.title}</h2>
              <p className="text-xs text-gray-300 mb-1">{anime.synopsis}</p>
              {anime.score && (
                <p className="text-sm text-gray-400">Score: {anime.score}</p>
              )}
              {anime.url && (
                <a
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-xs"
                >
                  View on MAL
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Demo;
