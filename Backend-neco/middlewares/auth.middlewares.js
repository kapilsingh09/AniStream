import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

// Middleware to verify JWT
export const verify_JWT = asyncHandler(async (req, res, next) => {
    try {
        // Try getting token from Authorization header ("Bearer ...") or from cookies
        const authHeader = req.header("Authorization") || "";
        // Extract the token if it starts with "Bearer "
        const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.replace(/^Bearer\s+/i, "") : "";
        // Prioritize accessToken from cookies if available, else use bearerToken
        const token = req.cookies?.accessToken || bearerToken;
    
        // If no token found, throw error
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        // Decode and verify token with ACCESS_TOKEN_SECRET
        // This can throw if the token is invalid or expired
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        // Fetch the user by ID from the decoded token, excluding sensitive fields
        // (Excludes password and refreshToken from result)
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
    
        // If user not found, possibly token is for non-existent/deleted user
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        // Attach user information to the request for next middlewares/routes
        req.user = user;
        next();
    } catch (error) {
        // Check if token is expired specifically
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Access token expired");
        }
        // Check if token is invalid
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid access token");
        }
        // For any other error (including user not found), return 401
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});