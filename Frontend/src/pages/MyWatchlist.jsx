/**
 * MY WATCHLIST PAGE
 * 
 * Purpose: Displays user's watchlist anime in a grid layout
 * Refactored to use reusable AnimeCollectionGrid component
 * 
 * Features:
 * - Shows all watchlist anime
 * - Remove from watchlist
 * - Navigate to anime detail pages
 * - Empty state with explore button
 * - Loading and error states
 */

import React, { useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import AnimeCollectionGrid from '../components/AnimeCollectionGrid';

const MyWatchlist = () => {
    // Get watchlist data and functions from context
    const { watchlist, loading, error, removeFromWatchlist, fetchWatchlist } = useWatchlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    /**
     * Effect: Redirect to login if not authenticated
     * Auto-fetch watchlist when component mounts
     */
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWatchlist();
    }, [user, navigate, fetchWatchlist]);

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
            collection={watchlist}
            loading={loading}
            error={error}
            title="My Watchlist"
            icon={Bookmark}
            emptyTitle="Your Watchlist is Empty"
            emptyMessage="Start adding anime to your watchlist to keep track of what you want to watch!"
            emptyIcon={() => <span className="text-8xl">📺</span>}
            onRemove={removeFromWatchlist}
            removeButtonText="Remove"
            navigateToExplore={handleNavigateToExplore}
        />
    );
};

export default MyWatchlist;

