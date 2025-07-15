import mongoose from "mongoose";

const AnimeSchema = new mongoose.Schema({
  kitsu_id: {
    type: String,
    unique: true,
    sparse: true, // prevents duplicate key error when null
  },
  mal_id: {
    type: Number,
    unique: true,
    sparse: true, // same reason as above
  },
  canonical_title: {
    type: String,
    required: true,
  },
  synopsis: String,
  images: {
    banner: String,
    cover: String,
    poster: String,
  },
  year: Number,
  rating: String,
  episode_count: Number,
  status: String,
  genres: [String],
  duration: { type: String, default: "" }, // changed from Number to String to match API
  members: Number,
  access_count: {
    type: Number,
  
    default: 0,
  },
  last_accessed: Date,
}, {
  timestamps: true, 
});


// AnimeSchema.index({ access_count: -1 });
// AnimeSchema.index({ year: -1 });

export default mongoose.model("Anime", AnimeSchema);
