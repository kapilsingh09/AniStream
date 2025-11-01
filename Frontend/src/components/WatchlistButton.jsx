import React, { useState, useEffect } from 'react';
import { Plus, Check, Bookmark } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const WatchlistButton = ({ 
    animeId, 
    title, 
    image,
    variant = 'default', // 'default', 'compact', 'icon-only'
    className = ''
}) => {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist, checkWatchlistStatus } = useWatchlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isInList, setIsInList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    // Check initial status
    useEffect(() => {
        const checkStatus = async () => {
            if (!user) {
                setCheckingStatus(false);
                setIsInList(false);
                return;
            }

            try {
                const status = await checkWatchlistStatus(animeId);
                setIsInList(status);
            } catch (error) {
                console.error('Error checking watchlist status:', error);
                setIsInList(false);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkStatus();
    }, [animeId, user, checkWatchlistStatus]);

    // Sync with context
    useEffect(() => {
        if (user) {
            setIsInList(isInWatchlist(animeId));
        }
    }, [animeId, user, isInWatchlist]);

    const handleClick = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!animeId || !title || !image) {
            console.error('Missing anime data:', { animeId, title, image });
            return;
        }

        setIsLoading(true);

        try {
            if (isInList) {
                await removeFromWatchlist(animeId);
                setIsInList(false);
            } else {
                await addToWatchlist(animeId, title, image);
                setIsInList(true);
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
            alert(error.message || 'Failed to update watchlist');
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <button
                disabled
                className={`${className} px-4 py-2 bg-gray-800 text-gray-400 rounded-lg cursor-not-allowed flex items-center gap-2`}
            >
                <Bookmark className="h-4 w-4" />
                <span>Loading...</span>
            </button>
        );
    }

    // Icon-only variant
    if (variant === 'icon-only') {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`${className} p-2 rounded-lg transition-all duration-300 ${
                    isInList
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-sm`}
                title={isInList ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
                <Bookmark className="h-5 w-5" fill={isInList ? 'white' : 'none'} />
            </button>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading}
                className={`${className} px-3 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                    isInList
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} shadow-sm`}
            >
                {isInList ? (
                    <>
                        <Check className="h-4 w-4" />
                        <span>In Watchlist</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-4 w-4" />
                        <span>Add</span>
                    </>
                )}
            </button>
        );
    }

    // Default variant
    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`${className} px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold ${
                isInList
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
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
                    <span>Remove from Watchlist</span>
                </>
            ) : (
                <>
                    <Plus className="h-5 w-5" />
                    <span>Add to Watchlist</span>
                </>
            )}
        </button>
    );
};

export default WatchlistButton;

