/**
 * PROFILE PAGE
 * 
 * Purpose: Displays user profile information and navigation to user collections
 * Shows user stats, favourites count, watchlist count, etc.
 * 
 * Features:
 * - User information display
 * - Quick links to favourites and watchlist
 * - User statistics
 * - Account settings link (future)
 */

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useFavourites } from '../context/FavouritesContext';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Bookmark, Settings, ArrowRight, Clock } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const { watchlist, fetchWatchlist } = useWatchlist();
    const { favourites, fetchFavourites } = useFavourites();
    const navigate = useNavigate();

    /**
     * Effect: Redirect to login if not authenticated
     * Fetch user collections when component mounts
     */
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Fetch collections to get counts
        fetchWatchlist();
        fetchFavourites();
    }, [user, navigate, fetchWatchlist, fetchFavourites]);

    // Don't render if user is not logged in
    if (!user) {
        return null;
    }

    /**
     * Get user initial for avatar
     * Uses name or email first letter
     */
    const getUserInitial = () => {
        if (user?.name?.trim()) {
            return user.name.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return '?';
    };

    return (
        <div className="min-h-screen bg-black py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-gray-900 rounded-2xl p-8 mb-6 border border-gray-800">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Avatar */}
                        <div className="h-24 w-24 rounded-full bg-orange-950 flex items-center justify-center text-yellow-500 text-4xl font-bold shadow-lg border-4 border-gray-700">
                            {getUserInitial()}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {user?.name || user?.email || 'User'}
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">{user?.email}</p>
                            
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bookmark className="h-5 w-5 text-amber-400" />
                                        <span className="text-gray-400 text-sm">Watchlist</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{watchlist.length}</p>
                                </div>
                                
                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart className="h-5 w-5 text-pink-400" />
                                        <span className="text-gray-400 text-sm">Favourites</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{favourites.length}</p>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 col-span-2 md:col-span-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-5 w-5 text-blue-400" />
                                        <span className="text-gray-400 text-sm">Member Since</span>
                                    </div>
                                    <p className="text-lg font-bold text-white">
                                        {user?.createdAt 
                                            ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                            : 'Recently'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Watchlist Card */}
                    <div 
                        onClick={() => navigate('/watchlist')}
                        className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-amber-500/50 cursor-pointer transition-all duration-300 hover:scale-105 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-amber-600/20 rounded-lg">
                                    <Bookmark className="h-6 w-6 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">My Watchlist</h3>
                                    <p className="text-gray-400 text-sm">{watchlist.length} anime saved</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            View all anime you've saved to watch later
                        </p>
                    </div>

                    {/* Favourites Card */}
                    <div 
                        onClick={() => navigate('/favourites')}
                        className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-pink-500/50 cursor-pointer transition-all duration-300 hover:scale-105 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-pink-600/20 rounded-lg">
                                    <Heart className="h-6 w-6 text-pink-400" fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">My Favourites</h3>
                                    <p className="text-gray-400 text-sm">{favourites.length} anime saved</p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            View all anime you've marked as favourites
                        </p>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Account Settings
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Account settings and preferences (Coming soon)
                    </p>
                    <button 
                        disabled
                        className="px-4 py-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                    >
                        Settings (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

