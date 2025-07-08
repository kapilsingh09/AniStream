// components/TrendingManga.jsx
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import {fetchTrendingManga} from '../services/anilistApi'
const TrendingManga = () => {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchTrendingManga(20);
      setManga(data);
      setLoading(false);
    })();
  }, []);
  


  return (
    <section className="space-y-6 mx-auto pt-4 min-h-screen bg-slate-900">
      <div className="flex items-center justify-between pl-9 pr-9">
        <h2 className="text-4xl font-bold">
          Manga Corner
        </h2>
        <NavLink className='flex items-center gap-2 cursor-pointer hover:underline text-white rounded-lg border border-gray-700 transition-all duration-300 text-sm px-4 py-2 transform hover:scale-105 shadow-lg' to='/manga/all'>View all</NavLink>
      </div>
      <div className=" min-h-screen overflow-hidden flex flex-nowrap rounded-3xl pl-10 pr-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-full  gap-6">
          {loading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-32 border-2 w-40 border-gray-800  bg-purple-500/10 rounded-2xl animate-pulse"
              />
            ))
          ) : (
            manga.map((item) => {
              const title = item.title.english || item.title.romaji;
              const image = item.coverImage.large;

              return (
                <div key={item.id}>
                  <Link
                    to={`/manga/${item.id}`}
                    className="text-left group cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-[35vh] object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform"
                    />
                    <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingManga;
