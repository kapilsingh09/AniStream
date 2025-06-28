import { useState } from "react";
import { Flame, Star, Compass, PlayCircle, Heart, Search, Users, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  const featuredAnime = [
    {
      title: "Demon Slayer: Hashira Training Arc",
      image: "/images/demonslayer.jpg",
    },
    {
      title: "My Hero Academia Season 7",
      image: "/images/mha7.jpg",
    },
    {
      title: "Solo Leveling",
      image: "/images/sololeveling.jpg",
    },
  ];

  const genres = ["Action", "Romance", "Comedy", "Horror", "Isekai", "Slice of Life", "Fantasy"];

  return (
    <div className="p-6 space-y-10 bg-gradient-to-b from-gray-950 to-black min-h-screen text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-white flex items-center gap-2">
          <Compass className="text-pink-500" /> Explore Anime
        </h1>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search anime..."
            className="w-full bg-gray-800 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Flame className="text-orange-500" /> Featured This Week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredAnime.map((anime, idx) => (
            <Card key={idx} className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
              <img src={anime.image} alt={anime.title} className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="text-lg font-bold">{anime.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Compass className="text-blue-400" /> Browse by Genre
        </h2>
        <div className="flex flex-wrap gap-4">
          {genres.map((genre, idx) => (
            <Button
              key={idx}
              className="rounded-2xl px-4 py-2 bg-gray-800 hover:bg-pink-600 transition-colors"
            >
              {genre}
            </Button>
          ))}
        </div>
      </section>

      {/* Top Charts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Star className="text-yellow-400" /> Top Rated
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx} className="bg-gray-900 rounded-2xl overflow-hidden shadow">
              <img src={`/images/top${idx + 1}.jpg`} alt="Top Anime" className="w-full h-40 object-cover" />
              <CardContent className="p-3">
                <h3 className="font-bold text-base">Top Anime #{idx + 1}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Heart className="text-pink-400" /> Fan Favorites
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {[...Array(5)].map((_, idx) => (
            <Card key={idx} className="min-w-[200px] bg-gray-900 rounded-2xl overflow-hidden">
              <img src={`/images/fan${idx + 1}.jpg`} alt="Fan Favorite" className="w-full h-32 object-cover" />
              <CardContent className="p-2">
                <h3 className="text-sm font-bold">Fan Favorite #{idx + 1}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trailers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <PlayCircle className="text-green-400" /> Watch Trailers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="aspect-video bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400"
            >
              Trailer Player Placeholder #{idx + 1}
            </div>
          ))}
        </div>
      </section>

      {/* Light Novels & Manga */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BookOpen className="text-purple-400" /> Read the Source
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {["Jujutsu Kaisen", "Chainsaw Man", "Attack on Titan"].map((title, idx) => (
            <Card key={idx} className="bg-gray-900 rounded-2xl overflow-hidden shadow">
              <img src={`/images/manga${idx + 1}.jpg`} alt={title} className="w-full h-40 object-cover" />
              <CardContent className="p-3">
                <h3 className="font-bold text-base">{title} (Manga)</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Polls */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="text-cyan-400" /> Community Polls
        </h2>
        <div className="bg-gray-900 p-4 rounded-2xl shadow">
          <h3 className="text-lg font-bold mb-2">Who's the Best Girl this Season?</h3>
          <ul className="space-y-2">
            {["Nezuko", "Power", "Ochaco", "Yor Forger"].map((name, idx) => (
              <li
                key={idx}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 cursor-pointer"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
