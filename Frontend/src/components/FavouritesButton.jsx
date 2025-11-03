/**
 * FAVOURITES BUTTON COMPONENT
 * 
 * Purpose: Reusable button to add/remove anime from favourites
 * Similar structure to WatchlistButton for consistency
 * 
 * Props:
 * - animeId: Unique identifier for anime
 * - title: Anime title
 * - image: Anime poster image URL
 * - variant: 'default', 'compact', or 'icon-only'
 * - className: Additional CSS classes
 * 
 * Features:
 * - Shows "Add to Favourites" or "Remove from Favourites" based on state
 * - Handles authentication (redirects to login if not logged in)
 * - Loading states during API calls
 * - Error handling
 */

import React, { useState, useEffect } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavouritesButton = ({ 
    animeId, 
    title, 
    image,
    variant = 'default', // 'default', 'compact', 'icon-only'
    className = ''
}) => {
    // Get favourites state and functions from context
    const { isInFavourites, addToFavourites, removeFromFavourites, checkFavouritesStatus } = useFavourites();
    const { user } = useAuth(); // Get current user
    const navigate = useNavigate();
    
    // Local state for button
    const [isInList, setIsInList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    /**
     * Check initial favourites status when component mounts
     * Calls API to verify if anime is in favourites
     */
    useEffect(() => {
        const checkStatus = async () => {
            if (!user) {
                setCheckingStatus(false);
                setIsInList(false);
                return;
            }

            try {
                // Check server-side status (more reliable)
                const status = await checkFavouritesStatus(animeId);
                setIsInList(status);
            } catch (error) {
                console.error('Error checking favourites status:', error);
                setIsInList(false);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkStatus();
    }, [animeId, user, checkFavouritesStatus]);

    /**
     * Sync with context state
     * Updates local state when favourites context changes
     */
    useEffect(() => {
        if (user) {
            setIsInList(isInFavourites(animeId));
        }
    }, [animeId, user, isInFavourites]);

    /**
     * Handle button click
     * Adds or removes anime from favourites based on current state
     */
    const handleClick = async () => {
        // Redirect to login if user is not authenticated
        if (!user) {
            navigate('/login');
            return;
        }

        // Validate required data
        if (!animeId || !title || !image) {
            console.error('Missing anime data:', { animeId, title, image });
            return;
        }

        setIsLoading(true);

        try {
            if (isInList) {
                // Remove from favourites
                await removeFromFavourites(animeId);
                setIsInList(false);
            } else {
                // Add to favourites
                await addToFavourites(animeId, title, image);
                setIsInList(true);
            }
        } catch (error) {
            console.error('Error toggling favourites:', error);
            alert(error.message || 'Failed to update favourites');
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while checking status
    if (checkingStatus) {
        return (
            <button
                disabled
                className={`${className} px-4 py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2`}
            >
                <Heart className="h-4 w-4" />
                <span>Loading...</span>
            </button>
        );
    }

    // Icon-only variant: Just shows heart icon
    if (variant === 'icon-only') {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`${className} p-2 rounded-lg transition-all duration-300 ${
                    isInList
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-sm`}
                title={isInList ? 'Remove from Favourites' : 'Add to Favourites'}
            >
                <Heart className="h-5 w-5" fill={isInList ? 'white' : 'none'} />
            </button>
        );
    }

    // Compact variant: Smaller button with icon and text
    if (variant === 'compact') {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`${className} px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                    isInList
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-sm`}
            >
                {isInList ? (
                    <>
                        <Check className="h-4 w-4" />
                        <span>Favourited</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" />
                        <span>Favourite</span>
                    </>
                )}
            </button>
        );
    }

    // Default variant: Full button with icon and text
    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`${className} px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold ${
                isInList
                    ? 'bg-pink-600 text-white hover:bg-pink-700'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-lg hover:shadow-xl`}
        >
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    <span>{isInList ? 'Removing...' : 'Adding...'}</span>
                </>
            ) : isInList ? (
                <>
                    <Check className="h-5 w-5" />
                    <span>Remove from Favourites</span>
                </>
            ) : (
                <>
                    <Heart className="h-5 w-5" />
                    <span>Add to Favourites</span>
                </>
            )}
        </button>
    );
};

export default FavouritesButton;

