/**
 * FAVOURITES ROUTES
 * 
 * Purpose: Defines all API endpoints for favourites functionality
 * All routes require JWT authentication (user must be logged in)
 * 
 * Routes:
 * - POST /api/favourites/add - Add anime to favourites
 * - DELETE /api/favourites/remove/:animeId - Remove anime from favourites
 * - GET /api/favourites - Get user's favourites list
 * - GET /api/favourites/check/:animeId - Check if anime is in favourites
 */

import express from "express";
import {
    addToFavourites,
    removeFromFavourites,
    getFavourites,
    checkFavouritesStatus,
} from "../controllers/favourites.controller.js";
// JWT authentication middleware - verifies user is logged in
import { verify_JWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// Apply JWT authentication to all routes in this router
// This ensures only logged-in users can access favourites endpoints
router.use(verify_JWT);

// POST /api/favourites/add
// Adds anime to user's favourites list
router.post("/add", addToFavourites);

// DELETE /api/favourites/remove/:animeId
// Removes anime from user's favourites list
// :animeId is a URL parameter (e.g., /api/favourites/remove/123)
router.delete("/remove/:animeId", removeFromFavourites);

// GET /api/favourites
// Retrieves user's complete favourites list
router.get("/", getFavourites);

// GET /api/favourites/check/:animeId
// Checks if anime exists in user's favourites
// Useful for checking status before showing UI
router.get("/check/:animeId", checkFavouritesStatus);

export default router;

