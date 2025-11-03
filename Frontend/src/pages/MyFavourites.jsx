/**
 * MY FAVOURITES PAGE
 * 
 * Purpose: Displays user's favourite anime in a grid layout
 * Uses reusable AnimeCollectionGrid component to avoid code duplication
 * 
 * Features:
 * - Shows all favourite anime
 * - Remove from favourites
 * - Navigate to anime detail pages
 * - Empty state with explore button
 * - Loading and error states
 */

import React, { useEffect } from 'react';
import { useFavourites } from '../context/FavouritesContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AnimeCollectionGrid from '../components/AnimeCollectionGrid';

const MyFavourites = () => {
    // Get favourites data and functions from context
    const { favourites, loading, error, removeFromFavourites, fetchFavourites } = useFavourites();
    const { user } = useAuth(); // Get current user
    const navigate = useNavigate();

    /**
     * Effect: Redirect to login if user is not authenticated
     * Auto-fetch favourites when component mounts
     */
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Fetch favourites when component loads
        fetchFavourites();
    }, [user, navigate, fetchFavourites]);

    /**
     * Handle navigating to explore page
     * Used in empty state
     */
    const handleNavigateToExplore = () => {
        navigate('/explore');
    };

    // Don't render if user is not logged in
    if (!user) {
        return null;
    }

    // Use reusable component - passes all necessary props
    return (
        <AnimeCollectionGrid
            collection={favourites}
            loading={loading}
            error={error}
            title="My Favourites"
            icon={Heart}
            emptyTitle="Your Favourites is Empty"
            emptyMessage="Start adding anime to your favourites to keep track of what you love!"
            emptyIcon={Heart}
            onRemove={removeFromFavourites}
            removeButtonText="Remove"
            navigateToExplore={handleNavigateToExplore}
        />
    );
};

export default MyFavourites;

