import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// Add an anime to user's watchlist
export const addToWatchlist = asyncHandler(async (req, res) => {
    const { animeId, title, image } = req.body; // get anime info from request
    const userId = req.user._id; // get logged-in user's id

    // Check if all required info is provided
    if (!animeId || !title || !image) {
        throw new ApiError(400, "Anime ID, title, and image are required");
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if this anime is already in the user's watchlist
    const exists = user.watchlist.find((item) => item.animeId === animeId);
    if (exists) {
        throw new ApiError(400, "Anime is already in your watchlist");
    }

    // Add new anime to the user's watchlist
    user.watchlist.push({
        animeId,
        title,
        image,
        addedAt: new Date(), // store when it was added
    });

    await user.save(); // save changes to database

    // Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            { watchlist: user.watchlist },
            "Anime added to watchlist"
        )
    );
});

// Remove an anime from user's watchlist
export const removeFromWatchlist = asyncHandler(async (req, res) => {
    const { animeId } = req.params; // get anime id from URL
    const userId = req.user._id; // get user id

    // Check if anime ID is provided
    if (!animeId) {
        throw new ApiError(400, "Anime ID is required");
    }

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Remove anime from watchlist
    const before = user.watchlist.length;
    user.watchlist = user.watchlist.filter((item) => item.animeId !== animeId);

    // If anime wasn't in watchlist
    if (user.watchlist.length === before) {
        throw new ApiError(404, "Anime not found in watchlist");
    }

    await user.save(); // save updated list

    // Send success response
    return res.status(200).json(
        new ApiResponse(
            200,
            { watchlist: user.watchlist },
            "Anime removed from watchlist"
        )
    );
});

// Get all animes in user's watchlist
export const getWatchlist = asyncHandler(async (req, res) => {
    const userId = req.user._id; // get user id
    const user = await User.findById(userId).select("watchlist"); // only get watchlist field

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Send user's watchlist (empty array if none)
    return res.status(200).json(
        new ApiResponse(
            200,
            { watchlist: user.watchlist || [] },
            "Watchlist fetched successfully"
        )
    );
});

// Check if a specific anime is in user's watchlist
export const checkWatchlistStatus = asyncHandler(async (req, res) => {
    const { animeId } = req.params; // get anime id
    const userId = req.user._id; // get user id

    if (!animeId) {
        throw new ApiError(400, "Anime ID is required");
    }

    // Find user and only get watchlist field
    const user = await User.findById(userId).select("watchlist");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if anime exists in the list
    const isInWatchlist = user.watchlist.some(
        (item) => item.animeId === animeId
    );

    // Send true/false result
    return res.status(200).json(
        new ApiResponse(
            200,
            { isInWatchlist },
            "Watchlist status fetched"
        )
    );
});
