import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function KeywordPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;
    // console.log(keyword);
    
    setLoading(true);
    fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(keyword)}&limit=12`)
      .then(res => res.json())
      .then(data => {
        setResults(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [keyword]);

  if (!keyword) return <p className="text-center mt-10 text-gray-500">Please enter a search keyword.</p>;
  if (loading) return <p className="text-center mt-10">Loading results for <strong>{keyword}</strong>...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Results for: <span className="text-blue-600">"{keyword}"</span></h2>

      {results.length === 0 ? (
        <p className="text-gray-600">No results found for "{keyword}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((anime) => (
            <div key={anime.mal_id} className="border rounded-lg p-2 shadow-sm hover:shadow-md transition">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                className="w-full h-52 object-cover rounded-md"
              />
              <h3 className="text-sm font-semibold mt-2">{anime.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-3">{anime.synopsis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default KeywordPage;
