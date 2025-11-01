import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// Add anime to watchlist
export const addToWatchlist = asyncHandler(async (req, res) => {
    const { animeId, title, image } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!animeId || !title || !image) {
        throw new ApiError(400, "Anime ID, title, and image are required");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if anime is already in watchlist
    const existingAnime = user.watchlist.find(
        (item) => item.animeId === animeId
    );

    if (existingAnime) {
        throw new ApiError(400, "Anime is already in your watchlist");
    }

    // Add anime to watchlist
    user.watchlist.push({
        animeId,
        title,
        image,
        addedAt: new Date(),
    });

    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { watchlist: user.watchlist },
                "Anime added to watchlist successfully"
            )
        );
});

// Remove anime from watchlist
export const removeFromWatchlist = asyncHandler(async (req, res) => {
    const { animeId } = req.params;
    const userId = req.user._id;

    if (!animeId) {
        throw new ApiError(400, "Anime ID is required");
    }

    // Find user and remove anime from watchlist
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const initialLength = user.watchlist.length;
    user.watchlist = user.watchlist.filter(
        (item) => item.animeId !== animeId
    );

    if (user.watchlist.length === initialLength) {
        throw new ApiError(404, "Anime not found in watchlist");
    }

    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { watchlist: user.watchlist },
                "Anime removed from watchlist successfully"
            )
        );
});

// Get user's watchlist
export const getWatchlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("watchlist");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { watchlist: user.watchlist || [] },
                "Watchlist retrieved successfully"
            )
        );
});

// Check if anime is in watchlist
export const checkWatchlistStatus = asyncHandler(async (req, res) => {
    const { animeId } = req.params;
    const userId = req.user._id;

    if (!animeId) {
        throw new ApiError(400, "Anime ID is required");
    }

    const user = await User.findById(userId).select("watchlist");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isInWatchlist = user.watchlist.some(
        (item) => item.animeId === animeId
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isInWatchlist },
                "Watchlist status retrieved successfully"
            )
        );
});
