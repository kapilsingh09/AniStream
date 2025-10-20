import mongoose from "mongoose";

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


watchlistSchema.index({ animeId: 1, addedBy: 1 }, { unique: true });

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);
