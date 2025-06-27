import React, { useState, useEffect } from 'react';
import { Play, Bookmark, Star, Calendar, Tv, Users, Clock, ArrowLeft, ExternalLink, Heart, Share2, Eye, Award, Globe, List, ChevronRight, Film, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';

/**
 * KitsuAnimeCard Component
 * 
 * Beautiful anime details component using Kitsu API
 * Features soft colors, minimalist design, and clean data presentation
 * Now with clickable routing functionality
 */
const KitsuAnimeCard = ({ onNavigate }) => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isWatched, setIsWatched] = useState(false);

    // Fetch anime details from Kitsu API
    const fetchAnimeDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://kitsu.io/api/edge/anime/${id}`);
            // console.log(id);
            
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data || !data.data) {
                throw new Error('No anime data found');
            }

            setAnime(data.data);
        } catch (error) {
            console.error('Kitsu API Error:', error);
            setError(error.message || 'Failed to load anime details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimeDetails();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'finished':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'current':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'upcoming':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'tba':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const renderStars = (rating) => {
        const score = Math.round((rating || 0) / 20); // Kitsu uses 0-100 scale
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < score ? 'text-yellow-400' : 'text-gray-300'}`}
                fill={i < score ? 'currentColor' : 'none'}
            />
        ));
    };

    const getBannerImage = () => {
        return anime?.attributes?.coverImage?.large ||
               anime?.attributes?.coverImage?.original ||
               anime?.attributes?.posterImage?.large 
    };

    const getPosterImage = () => {
        return anime?.attributes?.posterImage?.large ||
               anime?.attributes?.posterImage?.medium ||
               anime?.attributes?.posterImage?.small 
    };

    // Handle card click to navigate to detailed view
    const handleCardClick = (e) => {
        // Prevent navigation if clicking on interactive elements
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        
        if (onNavigate) {
            onNavigate(`/kitsu/${id}`);
        } else {
            // Fallback: use window.location for direct navigation
            window.location.href = `/kitsu/${id}`;
        }
    };

    // Handle watch button click
    const handleWatchClick = (e) => {
        e.stopPropagation();
        if (onNavigate) {
            onNavigate(`/kitsu/${id}/watch`);
        } else {
            window.location.href = `/kitsu/${id}/watch`;
        }
    };

    // Handle episodes button click
    const handleEpisodesClick = (e) => {
        e.stopPropagation();
        if (onNavigate) {
            onNavigate(`/kitsu/${id}/episodes`);
        } else {
            window.location.href = `/kitsu/${id}/episodes`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50">
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200"></div>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 absolute top-0"></div>
                    </div>
                    <div className="text-gray-800 text-xl font-medium">Loading from Kitsu...</div>
                    <div className="text-gray-500 text-sm">Fetching anime details</div>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
                <div className="text-center max-w-md bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-red-100 shadow-xl">
                    <div className="text-6xl mb-4">🌸</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-red-600 mb-6">{error || 'Anime not found in Kitsu database'}</p>
                    <button
                        onClick={fetchAnimeDetails}
                        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl transition-all duration-300 font-medium shadow-lg transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const attributes = anime.attributes;

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* API Source Indicator */}
                <div className="mb-6 flex items-center gap-3 text-sm">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                        <Sparkles className="inline h-4 w-4 mr-2" />
                        Kitsu API
                    </div>
                    <span className="text-gray-600">Beautiful Anime Database</span>
                </div>

                {/* Main Container - Now Clickable */}
                <div 
                    className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/50 cursor-pointer transition-all duration-300 hover:shadow-3xl hover:scale-[1.01] group"
                    onClick={handleCardClick}
                >
                    
                    {/* Back Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.history.back();
                        }}
                        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:text-pink-200 transition-all duration-300 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30 hover:bg-white/30 shadow-lg"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Click to View Indicator */}
                    <div className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                        Click to view details
                    </div>

                    {/* Hero Banner Section */}
                    <div className="h-[55vh] w-full relative overflow-hidden">
                        <img
                            src={getBannerImage()}
                            alt={attributes?.canonicalTitle || attributes?.titles?.en}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/1200x600/f8fafc/64748b?text=Kitsu+API+-+No+Banner';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent group-hover:from-white/90 transition-all duration-300"></div>

                        {/* Floating Info Cards */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-lg group-hover:bg-white/95 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="h-5 w-5 text-yellow-500" />
                                        <span className="text-sm font-medium text-gray-700">Rating</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">
                                        {attributes?.averageRating ? `${Math.round(attributes.averageRating)}%` : 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-lg group-hover:bg-white/95 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">Popularity</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">
                                        #{attributes?.popularityRank || 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-lg group-hover:bg-white/95 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-5 w-5 text-purple-500" />
                                        <span className="text-sm font-medium text-gray-700">Rank</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">
                                        #{attributes?.ratingRank || 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-lg group-hover:bg-white/95 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart className="h-5 w-5 text-pink-500" />
                                        <span className="text-sm font-medium text-gray-700">Favorites</span>
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">
                                        {attributes?.favoritesCount || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col lg:flex-row p-8 gap-8">

                        {/* Left Sidebar */}
                        <div className="lg:w-1/3 space-y-6">
                            
                            {/* Poster */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                                <img
                                    src={getPosterImage()}
                                    alt={attributes?.canonicalTitle}
                                    className="relative w-full max-w-sm h-96 object-cover rounded-3xl shadow-2xl border-4 border-white group-hover:shadow-3xl transition-all duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x400/f8fafc/64748b?text=No+Poster';
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {/* Watch Button */}
                                <button
                                    onClick={handleWatchClick}
                                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg font-semibold text-lg transform hover:scale-105"
                                >
                                    <Play className="h-5 w-5" fill="white" />
                                    Start Watching
                                </button>

                                {/* Secondary Actions */}
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsBookmarked(!isBookmarked);
                                        }}
                                        className={`${isBookmarked ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} py-3 px-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 shadow-md transform hover:scale-105`}
                                    >
                                        <Bookmark className="h-5 w-5" fill={isBookmarked ? "white" : "none"} />
                                        <span className="text-xs font-medium">Save</span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsFavorited(!isFavorited);
                                        }}
                                        className={`${isFavorited ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} py-3 px-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 shadow-md transform hover:scale-105`}
                                    >
                                        <Heart className="h-5 w-5" fill={isFavorited ? "white" : "none"} />
                                        <span className="text-xs font-medium">Love</span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsWatched(!isWatched);
                                        }}
                                        className={`${isWatched ? 'bg-gradient-to-r from-emerald-400 to-green-400 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} py-3 px-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-2 shadow-md transform hover:scale-105`}
                                    >
                                        <Eye className="h-5 w-5" />
                                        <span className="text-xs font-medium">Seen</span>
                                    </button>
                                </div>
                            </div>

                            {/* Rating Display */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl border border-yellow-200 shadow-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-yellow-100 rounded-xl">
                                        <Award className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">Community Rating</span>
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1">
                                        {renderStars(attributes?.averageRating)}
                                    </div>
                                    <span className="text-gray-800 font-bold text-2xl">
                                        {attributes?.averageRating ? `${Math.round(attributes.averageRating)}%` : 'Not Rated'}
                                    </span>
                                </div>
                                <div className="text-gray-600 text-sm">
                                    {attributes?.userCount ? `${attributes.userCount.toLocaleString()} users` : 'No ratings yet'}
                                </div>
                            </div>

                            {/* External Link */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://kitsu.io/anime/${id}`, '_blank');
                                }}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg font-semibold transform hover:scale-105"
                            >
                                <ExternalLink className="h-5 w-5" />
                                View on Kitsu
                            </button>
                        </div>

                        {/* Right Content */}
                        <div className="lg:w-2/3 text-gray-800 space-y-8">
                            
                            {/* Title Section */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                    {attributes?.canonicalTitle || attributes?.titles?.en || 'Unknown Title'}
                                </h1>
                                {attributes?.titles?.ja_jp && (
                                    <h2 className="text-xl text-gray-600 mb-6 font-medium">
                                        {attributes.titles.ja_jp}
                                    </h2>
                                )}

                                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold border ${getStatusColor(attributes?.status)} mb-6 shadow-md`}>
                                    <div className="w-3 h-3 rounded-full bg-current animate-pulse"></div>
                                    {attributes?.status?.charAt(0).toUpperCase() + attributes?.status?.slice(1) || 'Unknown Status'}
                                </div>

                                <p className="text-gray-700 text-lg leading-relaxed line-clamp-4">
                                    {attributes?.synopsis || 'No description available for this anime.'}
                                </p>
                            </div>

                            {/* Information Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-100 rounded-xl">
                                            <Tv className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Format</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {attributes?.showType?.charAt(0).toUpperCase() + attributes?.showType?.slice(1) || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-green-100 rounded-xl">
                                            <Calendar className="h-6 w-6 text-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Start Date</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {attributes?.startDate ? formatDate(attributes.startDate) : 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-3xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-100 rounded-xl">
                                            <List className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Episodes</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {attributes?.episodeCount || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-3xl border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-orange-100 rounded-xl">
                                            <Clock className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Duration</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {attributes?.episodeLength ? `${attributes.episodeLength} min` : 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-3xl border border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-pink-100 rounded-xl">
                                            <Star className="h-6 w-6 text-pink-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Age Rating</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {attributes?.ageRating || 'Not Rated'}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-3xl border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-teal-100 rounded-xl">
                                            <Globe className="h-6 w-6 text-teal-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium">Status</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {attributes?.status ? attributes.status.charAt(0).toUpperCase() + attributes.status.slice(1) : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Episodes Button */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={handleEpisodesClick}
                            className="group w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-6 px-8 rounded-3xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <Film className="h-6 w-6" />
                                <span className="text-xl">Explore Episodes</span>
                                <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KitsuAnimeCard;