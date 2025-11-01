 import React, { useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, Play, ArrowRight, Film } from 'lucide-react';

const MyWatchlist = () => {
    const { watchlist, loading, error, removeFromWatchlist, fetchWatchlist } = useWatchlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWatchlist();
    }, [user, navigate, fetchWatchlist]);

    const handleRemove = async (animeId) => {
        if (window.confirm('Are you sure you want to remove this anime from your watchlist?')) {
            try {
                await removeFromWatchlist(animeId);
            } catch (error) {
                console.error('Error removing from watchlist:', error);
            }
        }
    };

    const handleAnimeClick = (animeId) => {
        // Try to navigate to Kitsu first, fallback to Jikan
        navigate(`/kitsu/${animeId}`);
    };

    if (!user) {
        return null;
    }

    if (loading && watchlist.length === 0) {
        return (
            <div className="min-h-screen bg-black py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-amber-400"></div>
                            <div className="text-gray-400 text-lg">Loading your watchlist...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error && watchlist.length === 0) {
        return (
            <div className="min-h-screen bg-black py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
                            <div className="text-6xl mb-4">😔</div>
                            <h2 className="text-2xl font-bold text-gray-200 mb-2">Oops! Something went wrong</h2>
                            <p className="text-red-400 mb-6">{error}</p>
                            <button
                                onClick={fetchWatchlist}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Bookmark className="h-8 w-8 text-amber-400" />
                        <h1 className="text-4xl font-bold text-white">My Watchlist</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        {watchlist.length === 0
                            ? 'No anime in your watchlist yet'
                            : `You have ${watchlist.length} ${watchlist.length === 1 ? 'anime' : 'anime'} saved`}
                    </p>
                </div>

                {/* Empty State */}
                {watchlist.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <div className="text-center max-w-md">
                            <div className="text-8xl mb-6">📺</div>
                            <h2 className="text-2xl font-bold text-gray-200 mb-4">Your Watchlist is Empty</h2>
                            <p className="text-gray-400 mb-8">
                                Start adding anime to your watchlist to keep track of what you want to watch!
                            </p>
                            <button
                                onClick={() => navigate('/explore')}
                                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
                            >
                                <ArrowRight className="h-5 w-5" />
                                Explore Anime
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Watchlist Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {watchlist.map((anime) => (
                            <div
                                key={anime.animeId}
                                className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105"
                            >
                                {/* Poster Image */}
                                <div
                                    className="relative aspect-[2/3] overflow-hidden cursor-pointer"
                                    onClick={() => handleAnimeClick(anime.animeId)}
                                >
                                    <img
                                        src={anime.image || 'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Image'}
                                        alt={anime.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Image';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAnimeClick(anime.animeId);
                                                }}
                                                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                                            >
                                                <Play className="h-4 w-4" fill="white" />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3
                                        className="text-white font-semibold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-amber-400 transition-colors"
                                        onClick={() => handleAnimeClick(anime.animeId)}
                                        title={anime.title}
                                    >
                                        {anime.title}
                                    </h3>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(anime.animeId);
                                            }}
                                            className="flex-1 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                                            title="Remove from Watchlist"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>

                                    {/* Added Date */}
                                    {anime.addedAt && (
                                        <p className="text-gray-500 text-xs mt-2">
                                            Added {new Date(anime.addedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWatchlist;

