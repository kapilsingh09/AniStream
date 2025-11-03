/**
 * FAVOURITES CONTEXT
 * 
 * Purpose: Manages favourites state and operations across the application
 * Similar structure to WatchlistContext for consistency
 * 
 * Provides:
 * - favourites: Array of favourite anime
 * - loading: Loading state
 * - error: Error state
 * - Functions to add/remove/check favourites
 * 
 * Auto-fetches favourites when user logs in
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavouritesContext = createContext();

export const FavouritesProvider = ({ children }) => {
    // State management for favourites
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth(); // Get current user from auth context

    /**
     * Get authentication token from localStorage
     * Token is stored when user logs in
     */
    const getAuthToken = () => {
        return localStorage.getItem('token') || '';
    };

    /**
     * FETCH FAVOURITES
     * Fetches user's favourites from backend API
     * Called automatically when user logs in or changes
     */
    const fetchFavourites = useCallback(async () => {
        // Don't fetch if user is not logged in
        if (!user) {
            setFavourites([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get auth token for API request
            const token = getAuthToken();
            
            // Make API request to get favourites
            const response = await fetch('http://localhost:3000/api/favourites/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send token for authentication
                },
                credentials: 'include', // Include cookies if using cookie-based auth
            });

            const result = await response.json();

            // Handle API errors
            if (!response.ok) {
                throw new Error(result?.message || 'Failed to fetch favourites');
            }

            // Update favourites state with data from API
            const favouritesData = result?.data?.favourites || [];
            setFavourites(favouritesData);
        } catch (err) {
            console.error('Error fetching favourites:', err);
            setError(err.message);
            setFavourites([]); // Clear favourites on error
        } finally {
            setLoading(false);
        }
    }, [user]); // Re-fetch when user changes

    /**
     * ADD TO FAVOURITES
     * Adds an anime to user's favourites list
     * 
     * @param {string} animeId - Unique identifier for anime
     * @param {string} title - Anime title
     * @param {string} image - Anime poster image URL
     */
    const addToFavourites = async (animeId, title, image) => {
        // Check if user is logged in
        if (!user) {
            throw new Error('Please log in to add to favourites');
        }

        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            
            // Send POST request to add anime to favourites
            const response = await fetch('http://localhost:3000/api/favourites/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ animeId, title, image }), // Send anime data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || 'Failed to add to favourites');
            }

            // Update favourites state with new data from server
            const updatedFavourites = result?.data?.favourites || [];
            setFavourites(updatedFavourites);
            return true;
        } catch (err) {
            console.error('Error adding to favourites:', err);
            setError(err.message);
            throw err; // Re-throw for component error handling
        } finally {
            setLoading(false);
        }
    };

    /**
     * REMOVE FROM FAVOURITES
     * Removes an anime from user's favourites list
     * 
     * @param {string} animeId - Unique identifier for anime to remove
     */
    const removeFromFavourites = async (animeId) => {
        if (!user) {
            throw new Error('Please log in to remove from favourites');
        }

        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            
            // Send DELETE request to remove anime
            const response = await fetch(
                `http://localhost:3000/api/favourites/remove/${animeId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || 'Failed to remove from favourites');
            }

            // Update favourites state
            const updatedFavourites = result?.data?.favourites || [];
            setFavourites(updatedFavourites);
            return true;
        } catch (err) {
            console.error('Error removing from favourites:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * CHECK IF IN FAVOURITES
     * Checks if an anime is already in favourites (client-side check)
     * 
     * @param {string} animeId - Anime ID to check
     * @returns {boolean} - True if anime is in favourites
     */
    const isInFavourites = useCallback((animeId) => {
        return favourites.some((item) => item.animeId === animeId);
    }, [favourites]);

    /**
     * CHECK FAVOURITES STATUS (SERVER-SIDE)
     * Checks favourites status from server (more reliable)
     * Useful when component first loads
     * 
     * @param {string} animeId - Anime ID to check
     * @returns {boolean} - True if anime is in favourites
     */
    const checkFavouritesStatus = async (animeId) => {
        if (!user) {
            return false;
        }

        try {
            const token = getAuthToken();
            
            const response = await fetch(
                `http://localhost:3000/api/favourites/check/${animeId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                return false;
            }

            return result?.data?.isInFavourites || false;
        } catch (err) {
            console.error('Error checking favourites status:', err);
            return false;
        }
    };

    // Auto-fetch favourites when user logs in or changes
    useEffect(() => {
        if (user) {
            fetchFavourites();
        } else {
            setFavourites([]); // Clear favourites when user logs out
        }
    }, [user, fetchFavourites]);

    // Context value - what components can access
    const value = {
        favourites,
        loading,
        error,
        addToFavourites,
        removeFromFavourites,
        isInFavourites,
        checkFavouritesStatus,
        fetchFavourites,
    };

    return (
        <FavouritesContext.Provider value={value}>
            {children}
        </FavouritesContext.Provider>
    );
};

/**
 * useFavourites Hook
 * 
 * Usage in components:
 * const { favourites, addToFavourites, removeFromFavourites } = useFavourites();
 */
export const useFavourites = () => {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error('useFavourites must be used within a FavouritesProvider');
    }
    return context;
};

