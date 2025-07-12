import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const genreColors = [
  "bg-pink-500", "bg-purple-500", "bg-blue-500", "bg-green-500",
  "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-teal-500",
  "bg-indigo-500", "bg-rose-500", "bg-amber-500", "bg-lime-500",
  "bg-cyan-500", "bg-fuchsia-500", "bg-violet-500", "bg-emerald-500",
];

const getRandomColor = () => {
  return genreColors[Math.floor(Math.random() * genreColors.length)];
};

const KeywordPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword) return;

    setLoading(true);
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(keyword)}&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [keyword]);

  if (!keyword) {
    return <p className="text-center mt-10 text-gray-500">No keyword provided.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Search Results for <span className="text-blue-600">"{keyword}"</span>
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500">No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((anime) => (
            <div key={anime.mal_id} className="bg-slate-900 shadow rounded-lg overflow-hidden transition hover:shadow-md">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-52 object-cover"
              />
              <div className="p-4">
                <h3 className="text-md font-semibold mb-2">{anime.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{anime.synopsis || "No synopsis available."}</p>
                <div className="flex flex-wrap gap-2">
                  {anime.genres?.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className={`text-white text-xs px-2 py-1 rounded-full ${getRandomColor()}`}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordPage;
