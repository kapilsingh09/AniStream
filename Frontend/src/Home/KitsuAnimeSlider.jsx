import React, { useState, useEffect } from 'react';
import { Play, Bookmark, Star, Calendar, Tv, Users, Clock, ArrowLeft, ExternalLink, Heart, Share2, Eye, Award, Globe, List, ChevronRight, TrendingUp } from 'lucide-react';

/**
 * KitsuAnimeCard Component
 * 
 * Professional anime details component using Kitsu API
 * Features optimized error handling and clean data presentation
 */
const KitsuAnimeCard = ({ animeId = "1" }) => {
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

            const response = await fetch(`https://kitsu.io/api/edge/anime/${animeId}`);
            
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
    }, [animeId]);

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
                return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            case 'current':
                return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
            case 'upcoming':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
            case 'tba':
                return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
            default:
                return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
        }
    };

    const renderStars = (rating) => {
        // Kitsu uses average rating out of 100, convert to 5-star scale
        const starRating = Math.round((rating || 0) / 20);
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < starRating ? 'text-amber-400' : 'text-slate-600'}`}
                fill={i < starRating ? 'currentColor' : 'none'}
            />
        ));
    };

    const getBannerImage = () => {
        return anime?.attributes?.coverImage?.large ||
               anime?.attributes?.coverImage?.original ||
               anime?.attributes?.posterImage?.large ||
               'https://via.placeholder.com/1200x600/0f172a/64748b?text=Kitsu+API+-+No+Banner';
    };

    const getPosterImage = () => {
        return anime?.attributes?.posterImage?.large ||
               anime?.attributes?.posterImage?.medium ||
               anime?.attributes?.posterImage?.small ||
               'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Poster';
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const formatStatus = (status) => {
        const statusMap = {
            'finished': 'Finished Airing',
            'current': 'Currently Airing',
            'upcoming': 'Not Yet Aired',
            'tba': 'To Be Announced'
        };
        return statusMap[status?.toLowerCase()] || status || 'Unknown Status';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
                    <div className="text-white text-xl font-medium">Loading from Kitsu API...</div>
                    <div className="text-slate-300 text-sm">Fetching anime database</div>
                </div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Kitsu API Error</h2>
                    <p className="text-red-300 mb-6">{error || 'Anime not found in Kitsu database'}</p>
                    <button
                        onClick={fetchAnimeDetails}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const attrs = anime.attributes;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* API Source Indicator */}
                <div className="mb-4 flex items-center gap-2 text-sm">
                    <div className="bg-orange-600 text-white px-3 py-1 rounded-full font-medium">Kitsu API</div>
                    <span className="text-slate-400">Anime Database</span>
                </div>

                {/* Main Container */}
                <div className="bg-slate-800/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
                    
                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white hover:text-orange-300 transition-colors duration-200 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-black/50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Hero Banner Section */}
                    <div className="h-[50vh] w-full relative overflow-hidden">
                        <img
                            src={getBannerImage()}
                            alt={attrs.canonicalTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/1200x600/0f172a/64748b?text=Kitsu+API+-+No+Banner';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-800/98 via-slate-800/40 to-transparent"></div>

                        {/* Play Button */}
                        {attrs.youtubeVideoId && (
                            <button
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${attrs.youtubeVideoId}`, '_blank')}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600/90 hover:bg-orange-600 hover:scale-110 transition-all duration-300 rounded-full p-6 shadow-2xl border-2 border-white/20"
                            >
                                <Play className="h-8 w-8 text-white ml-1" fill="white" />
                            </button>
                        )}

                        {/* Production Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/95 to-transparent">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="text-lg font-bold mb-2 text-orange-300">Production Details</h3>
                                    <p className="text-slate-300 text-sm">From Kitsu Database</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                        <span><strong>Type:</strong> {attrs.showType || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span><strong>Year:</strong> {attrs.startDate ? new Date(attrs.startDate).getFullYear() : 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                        <span><strong>Age Rating:</strong> {attrs.ageRating || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span><strong>Subtype:</strong> {attrs.subtype || 'Unknown'}</span>
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
                                <img
                                    src={getPosterImage()}
                                    alt={attrs.canonicalTitle}
                                    className="w-full max-w-sm h-96 object-cover rounded-2xl shadow-2xl border-2 border-orange-500/30 group-hover:border-orange-400/50 transition-all duration-300"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Poster';
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {/* Watch Trailer */}
                                {attrs.youtubeVideoId ? (
                                    <button
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${attrs.youtubeVideoId}`, '_blank')}
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg font-semibold text-lg"
                                    >
                                        <Play className="h-5 w-5" fill="white" />
                                        Watch Trailer
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-slate-600 text-slate-300 py-4 px-6 rounded-xl flex items-center justify-center gap-3 opacity-50 cursor-not-allowed font-semibold"
                                    >
                                        <Play className="h-5 w-5" />
                                        No Trailer Available
                                    </button>
                                )}

                                {/* Secondary Actions */}
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className={`${isBookmarked ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-700 hover:bg-slate-600'} text-white py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2`}
                                    >
                                        <Bookmark className="h-5 w-5" fill={isBookmarked ? "white" : "none"} />
                                        <span className="text-xs font-medium">Bookmark</span>
                                    </button>

                                    <button
                                        onClick={() => setIsFavorited(!isFavorited)}
                                        className={`${isFavorited ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} text-white py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2`}
                                    >
                                        <Heart className="h-5 w-5" fill={isFavorited ? "white" : "none"} />
                                        <span className="text-xs font-medium">Favorite</span>
                                    </button>

                                    <button
                                        onClick={() => setIsWatched(!isWatched)}
                                        className={`${isWatched ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-slate-700 hover:bg-slate-600'} text-white py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2`}
                                    >
                                        <Eye className="h-5 w-5" />
                                        <span className="text-xs font-medium">Watched</span>
                                    </button>
                                </div>
                            </div>

                            {/* Rating Display */}
                            <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-6 rounded-2xl border border-orange-500/30">
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="h-6 w-6 text-amber-400" />
                                    <span className="text-lg font-bold text-white">Kitsu Score</span>
                                </div>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1">
                                        {renderStars(attrs.averageRating)}
                                    </div>
                                    <span className="text-white font-bold text-2xl">
                                        {attrs.averageRating ? `${attrs.averageRating}/100` : 'Not Rated'}
                                    </span>
                                </div>
                                <div className="text-slate-300 text-sm">
                                    {attrs.userCount ? `${attrs.userCount.toLocaleString()} users` : 'No ratings yet'}
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-300">Popularity</span>
                                    </div>
                                    <div className="text-white font-bold text-lg">#{attrs.popularityRank || 'N/A'}</div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-4 rounded-xl border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-5 w-5 text-blue-400" />
                                        <span className="text-sm text-slate-300">Rating Rank</span>
                                    </div>
                                    <div className="text-white font-bold text-lg">#{attrs.ratingRank || 'N/A'}</div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 p-4 rounded-xl border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-5 w-5 text-emerald-400" />
                                        <span className="text-sm text-slate-300">Users</span>
                                    </div>
                                    <div className="text-white font-bold text-lg">{attrs.userCount ? attrs.userCount.toLocaleString() : 'N/A'}</div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-xl border border-orange-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart className="h-5 w-5 text-orange-400" />
                                        <span className="text-sm text-slate-300">Favorites</span>
                                    </div>
                                    <div className="text-white font-bold text-lg">{attrs.favoritesCount ? attrs.favoritesCount.toLocaleString() : 'N/A'}</div>
                                </div>
                            </div>

                            {/* External Link */}
                            <button
                                onClick={() => window.open(`https://kitsu.io/anime/${anime.id}`, '_blank')}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg font-semibold"
                            >
                                <ExternalLink className="h-5 w-5" />
                                View on Kitsu
                            </button>
                        </div>

                        {/* Right Content */}
                        <div className="lg:w-2/3 text-white space-y-8">
                            
                            {/* Title Section */}
                            <div>
                                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                    {attrs.canonicalTitle || attrs.titles?.en || attrs.titles?.ja_jp || 'Unknown Title'}
                                </h1>
                                {attrs.titles?.en && attrs.titles.en !== attrs.canonicalTitle && (
                                    <h2 className="text-2xl text-slate-300 mb-6">
                                        {attrs.titles.en}
                                    </h2>
                                )}

                                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold border ${getStatusColor(attrs.status)} mb-6`}>
                                    <div className="w-3 h-3 rounded-full bg-current animate-pulse"></div>
                                    {formatStatus(attrs.status)}
                                </div>

                                <p className="text-slate-300 text-lg leading-relaxed">
                                    {attrs.synopsis || attrs.description || 'No synopsis available for this anime.'}
                                </p>
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-slate-700/60 p-6 rounded-2xl border border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Tv className="h-6 w-6 text-orange-400" />
                                        <span className="text-slate-400 font-medium">Format</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {attrs.showType || attrs.subtype || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/60 p-6 rounded-2xl border border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="h-6 w-6 text-orange-400" />
                                        <span className="text-slate-400 font-medium">Start Date</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {attrs.startDate ? formatDate(attrs.startDate) : 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/60 p-6 rounded-2xl border border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <List className="h-6 w-6 text-orange-400" />
                                        <span className="text-slate-400 font-medium">Episodes</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {attrs.episodeCount || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/60 p-6 rounded-2xl border border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Clock className="h-6 w-6 text-orange-400" />
                                        <span className="text-slate-400 font-medium">Episode Length</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {attrs.episodeLength ? `${attrs.episodeLength} min` : 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/60 p-6 rounded-2xl border border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Star className="h-6 w-6 text-orange-400" />
                                        <span className="text-slate-400 font-medium">Age Rating</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {attrs.ageRating || 'Not Rated'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/60 p-6 rounded-2xl border border-slate-600/50 hover:bg-slate-700/80 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar className="h-6 w-6 text-orange-400" />
                                        <span className="text-slate-400 font-medium">End Date</span>
                                    </div>
                                    <span className="font-bold text-white text-lg">
                                        {attrs.endDate ? formatDate(attrs.endDate) : 'Ongoing'}
                                    </span>
                                </div>
                            </div>

                            {/* Additional Info */}
                            {attrs.abbreviatedTitles && attrs.abbreviatedTitles.length > 0 && (
                                <div>
                                    <h3 className="text-2xl font-bold mb-6 text-slate-200">Alternative Titles</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {attrs.abbreviatedTitles.map((title, index) => (
                                            <span
                                                key={index}
                                                className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 cursor-pointer transform hover:scale-105"
                                            >
                                                {title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Episodes Button */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={() => console.log('View episodes for:', attrs.canonicalTitle)}
                            className="group w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-2xl"
                        >
                            <div className="flex items-center justify-center gap-4">
                                <List className="h-6 w-6" />
                                <span className="text-xl">View All Episodes</span>
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