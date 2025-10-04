import React, { useState } from "react";
import { useAnimeData } from '../hooks/useAnimeData';

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

const labelClass =
  "block text-zinc-200 font-semibold mb-1 tracking-wide";
const selectClass =
  "w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";
const inputClass =
  "w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-zinc-400";

const AnimeFilter = ({ onFiltersApplied }) => {
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    year: "",
    sort: "",
    genre: "",
    source: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);

  const { getAnimeByGenre, searchAnime } = useAnimeData();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = async () => {
    setLoading(true);
    try {
      let results = [];
      
      // Apply genre filter if selected
      if (filters.genre) {
        const genreResults = await getAnimeByGenre(filters.genre.toLowerCase(), 20);
        results = genreResults.data || genreResults;
      }
      
      // Apply search if no genre filter
      if (!filters.genre && filters.sort) {
        const searchResults = await searchAnime(filters.sort, 20);
        results = searchResults.data || searchResults;
      }
      
      // Pass results to parent component
      if (onFiltersApplied) {
        onFiltersApplied(results, filters);
      }
      
      console.log("Applied Filters:", filters, "Results:", results.length);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/80 rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mb-8 border border-zinc-800">
      <h2 className="text-2xl font-bold text-zinc-100 mb-6 text-center tracking-wide">
        Anime Filters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type */}
        <div>
          <label className={labelClass}>Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className={selectClass}
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
        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">All</option>
            <option value="current">Currently Airing</option>
            <option value="finished">Finished</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className={labelClass}>Release Year</label>
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
            min="1960"
            max={new Date().getFullYear() + 1}
            className={inputClass}
          />
        </div>

        {/* Sort */}
        <div>
          <label className={labelClass}>Sort By</label>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            className={selectClass}
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
        <div>
          <label className={labelClass}>Genre</label>
          <select
            name="genre"
            value={filters.genre}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">All</option>
            {genreOptions.map((g) => (
              <option key={g} value={g.toLowerCase()}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className={labelClass}>Source</label>
          <select
            name="source"
            value={filters.source}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="">All</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s.toLowerCase().replace(/\s/g, "-")}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className={labelClass}>Rating</label>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            className={selectClass}
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
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleApply}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 via-zinc-700 to-purple-700 hover:from-blue-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-2 rounded-lg shadow-md transition-all duration-200 border border-zinc-700"
        >
          {loading ? 'Applying...' : 'Apply Filters'}
        </button>
      </div>
    </div>
  );
};

export default AnimeFilter;
