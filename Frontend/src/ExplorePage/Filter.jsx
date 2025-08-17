import React, { useState } from "react";

const genreOptions = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
];

const sourceOptions = [
  "Original",
  "Manga",
  "Light Novel",
  "Visual Novel",
  "Game",
  "Web Manga",
  "Other",
];

const ratingOptions = [
  { value: "", label: "All" },
  { value: "g", label: "G - All Ages" },
  { value: "pg", label: "PG - Children" },
  { value: "pg13", label: "PG-13 - Teens 13 or older" },
  { value: "r17", label: "R - 17+ (violence & profanity)" },
  { value: "r", label: "R+ - Mild Nudity" },
  { value: "rx", label: "Rx - Hentai" },
];

const AnimeFilter = () => {
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    year: "",
    sort: "",
    genre: "",
    source: "",
    rating: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    console.log("Applied Filters:", filters);
    // You can call API or pass filters to parent component
  };

  return (
    <div className="w-full min-h-[44vh] flex items-center justify-center bg-gradient-to-br from-black/40 via-slate-900/30 to-black/20 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 relative shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl text-white relative z-10">
        {/* Anime Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <option value="">All</option>
            <option value="TV">TV</option>
            <option value="Movie">Movie</option>
            <option value="OVA">OVA</option>
            <option value="Special">Special</option>
            <option value="ONA">ONA</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <option value="">All</option>
            <option value="current">Currently Airing</option>
            <option value="finished">Finished</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {/* Release Year */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Release Year</label>
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
            min="1960"
            max={new Date().getFullYear() + 1}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner placeholder:text-white/40"
            style={{ backdropFilter: "blur(8px)" }}
          />
        </div>

        {/* Sort By */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <option value="">Default</option>
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
            <option value="releaseDate">Release Date</option>
            <option value="alphabetical">A-Z</option>
            <option value="episodes">Episodes</option>
          </select>
        </div>

        {/* Genre */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Genre</label>
          <select
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <option value="">All</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre.toLowerCase()}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Source</label>
          <select
            name="source"
            value={filters.source}
            onChange={handleChange}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            style={{ backdropFilter: "blur(8px)" }}
          >
            <option value="">All</option>
            {sourceOptions.map((source) => (
              <option key={source} value={source.toLowerCase().replace(/\s/g, "-")}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Rating</label>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            className="bg-white/5 text-white/90 border border-white/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 shadow-inner"
            style={{ backdropFilter: "blur(8px)" }}
          >
            {ratingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apply Button */}
      <div className="absolute bottom-6 flex justify-center w-full z-20">
        <button
          onClick={handleApply}
          className="px-8 py-2 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-semibold transition-all shadow-xl border border-white/10 backdrop-blur-md"
        >
          <span className="flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block text-white/80">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Apply Filters
          </span>
        </button>
      </div>
      {/* Decorative Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AnimeFilter;
