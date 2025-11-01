import express from "express";
import {
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    checkWatchlistStatus,
} from "../controllers/watchlist.controller.js";
import { verify_JWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// All routes require authentication
router.use(verify_JWT);

// Add anime to watchlist
router.post("/add", addToWatchlist);

// Remove anime from watchlist
router.delete("/remove/:animeId", removeFromWatchlist);

// Get user's watchlist
router.get("/", getWatchlist);

// Check if anime is in watchlist
router.get("/check/:animeId", checkWatchlistStatus);

export default router;

