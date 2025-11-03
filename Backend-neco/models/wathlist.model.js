import mongoose from "mongoose";

// Define the schema for the watchlist collection
const watchlistSchema = new mongoose.Schema({
  animeId: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  
});

// Add a compound index to prevent the same user from adding the same anime multiple times
watchlistSchema.index({ animeId: 1, addedBy: 1 }, { unique: true });

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);
