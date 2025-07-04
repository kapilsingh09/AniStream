// components/TrendingManga.jsx
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const TrendingManga = () => {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`https://kitsu.io/api/edge/trending/manga`);
        const data = await res.json();
        setManga(data.data || []);
      } catch (err) {
        console.error("Failed to fetch trending manga from Kitsu:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="space-y-6 mt-10">
      <h2 className="text-4xl font-bold flex items-center gap-3">
        <BookOpen className="text-purple-400" /> Manga Corner
      </h2>
      <div className="
      h-[90vh] overflow-hidden  flex flex-nowrap 
      bg-gradient-to-r  from-purple-900/30 to-pink-900/30 rounded-3xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {loading ? (
            Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="h-32  border-2 border-pink-500 w-full bg-purple-500/10 rounded-2xl animate-pulse" />
            ))
          ) : (
            manga.map((mangaItem) => {
              const title = mangaItem.attributes.titles.en_jp || mangaItem.attributes.slug;
              const image = mangaItem.attributes.posterImage?.small;

              return (
                <div className="">
                <Link
                  to={`/manga/${mangaItem.id}`}
                  key={mangaItem.id}
                  className="text-center group cursor-pointer"
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-[35vh]  object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-bold text-sm line-clamp-2">{title}</h3>
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
