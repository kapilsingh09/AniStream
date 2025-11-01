import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('token') || '';
    };

    // Fetch user's watchlist
    const fetchWatchlist = useCallback(async () => {
        if (!user) {
            setWatchlist([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            const response = await fetch('http://localhost:3000/api/watchlist/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || 'Failed to fetch watchlist');
            }

            const watchlistData = result?.data?.watchlist || [];
            setWatchlist(watchlistData);
        } catch (err) {
            console.error('Error fetching watchlist:', err);
            setError(err.message);
            setWatchlist([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Add anime to watchlist
    const addToWatchlist = async (animeId, title, image) => {
        if (!user) {
            throw new Error('Please log in to add to watchlist');
        }

        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            const response = await fetch('http://localhost:3000/api/watchlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ animeId, title, image }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result?.message || 'Failed to add to watchlist');
            }

            const updatedWatchlist = result?.data?.watchlist || [];
            setWatchlist(updatedWatchlist);
            return true;
        } catch (err) {
            console.error('Error adding to watchlist:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Remove anime from watchlist
    const removeFromWatchlist = async (animeId) => {
        if (!user) {
            throw new Error('Please log in to remove from watchlist');
        }

        setLoading(true);
        setError(null);

        try {
            const token = getAuthToken();
            const response = await fetch(
                `http://localhost:3000/api/watchlist/remove/${animeId}`,
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
                throw new Error(result?.message || 'Failed to remove from watchlist');
            }

            const updatedWatchlist = result?.data?.watchlist || [];
            setWatchlist(updatedWatchlist);
            return true;
        } catch (err) {
            console.error('Error removing from watchlist:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Check if anime is in watchlist
    const isInWatchlist = useCallback((animeId) => {
        return watchlist.some((item) => item.animeId === animeId);
    }, [watchlist]);

    // Check watchlist status from server
    const checkWatchlistStatus = async (animeId) => {
        if (!user) {
            return false;
        }

        try {
            const token = getAuthToken();
            const response = await fetch(
                `http://localhost:3000/api/watchlist/check/${animeId}`,
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

            return result?.data?.isInWatchlist || false;
        } catch (err) {
            console.error('Error checking watchlist status:', err);
            return false;
        }
    };

    // Fetch watchlist when user changes
    useEffect(() => {
        if (user) {
            fetchWatchlist();
        } else {
            setWatchlist([]);
        }
    }, [user, fetchWatchlist]);

    const value = {
        watchlist,
        loading,
        error,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        checkWatchlistStatus,
        fetchWatchlist,
    };

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};

