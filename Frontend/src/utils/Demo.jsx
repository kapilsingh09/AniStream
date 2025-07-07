// AnimeSlider.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
// Mock data
const mockTrendingAnime = [
  {
    mal_id: 1,
    title: "Fullmetal Alchemist: Brotherhood",
    score: 9.2,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
      }
    }
  },
  {
    mal_id: 2,
    title: "Attack on Titan",
    score: 8.9,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
      }
    }
  },
  {
    mal_id: 3,
    title: "Jujutsu Kaisen",
    score: 8.6,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
      }
    }
  },
  {
    mal_id: 4,
    title: "Demon Slayer",
    score: 8.5,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
      }
    }
  },
  {
    mal_id: 5,
    title: "Death Note",
    score: 8.7,
    images: {
      jpg: {
        image_url: "https://cdn.myanimelist.net/images/anime/9/9453.jpg"
      }
    }
  }
];

// console.log(id);

const AnimeSlider = () => {
  const { id } = useParams();
  return (
    <div className="w-full overflow-x-auto mt-20 whitespace-nowrap py-4 px-2">
     <h1 className='text-4xl  font-semibold'>Generes animewill be soon comming {id}</h1>
     
      {mockTrendingAnime.map(anime => (
        <div
          key={anime.mal_id}
          className="inline-block w-64 m-2 bg-gray-800 rounded-xl shadow-md"
        >
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="w-full h-40 object-cover rounded-t-xl"
          />
          <div className="p-2 text-white">
            <h2 className="text-lg font-semibold">{anime.title}</h2>
            <p className="text-sm text-gray-300">Score: {anime.score}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeSlider;
