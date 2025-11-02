import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

// Add an anime to user's favourites
export const addToFavourites = asyncHandler(async (req, res) => {
    const { animeId, title, image } = req.body; // get anime info from body
    const userId = req.user._id; // get user id from token

    
    // check if all details are provided
    if (!animeId || !title || !image) {
        throw new ApiError(400, "Anime ID, title, and image are required");
    }

    // find the user in database
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // check if anime already in favourites
    const exists = user.favourites.find((item) => item.animeId === animeId);
    if (exists) {
        throw new ApiError(400, "Anime is already in your favourites");
    }

    // add anime to favourites
    user.favourites.push({
        animeId,
        title,
        image,
        addedAt: new Date(),
    });

    await user.save(); // save user data

    return res.status(200).json(
        new ApiResponse(
            200,
            { favourites: user.favourites },
            "Anime added to favourites"
        )
    );
});

// Remove an anime from user's favourites
export const removeFromFavourites = asyncHandler(async (req, res) => {
    const { animeId } = req.params; // get anime id from url
    const userId = req.user._id; // get user id

    if (!animeId) {
        throw new ApiError(400, "Anime ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // remove anime from list
    const before = user.favourites.length;
    user.favourites = user.favourites.filter((item) => item.animeId !== animeId);

    // if nothing removed
    if (user.favourites.length === before) {
        throw new ApiError(404, "Anime not found in favourites");
    }

    await user.save(); // save updated list

    return res.status(200).json(
        new ApiResponse(
            200,
            { favourites: user.favourites },
            "Anime removed from favourites"
        )
    );
});

// Get all favourites of the user
export const getFavourites = asyncHandler(async (req, res) => {
    const userId = req.user._id; // get user id
    const user = await User.findById(userId).select("favourites"); // only get favourites

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { favourites: user.favourites || [] },
            "Favourites fetched successfully"
        )
    );
});

// Check if an anime is in user's favourites
export const checkFavouritesStatus = asyncHandler(async (req, res) => {
    const { animeId } = req.params; // get anime id
    const userId = req.user._id; // get user id

    if (!animeId) {
        throw new ApiError(400, "Anime ID is required");
    }

    const user = await User.findById(userId).select("favourites");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // check if anime exists in favourites
    const isInFavourites = user.favourites.some(
        (item) => item.animeId === animeId
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            { isInFavourites },
            "Favourites status fetched"
        )
    );
});
