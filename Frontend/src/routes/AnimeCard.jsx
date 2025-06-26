import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Play, Bookmark, Star, Calendar, Tv, Users, Clock, ArrowLeft, ExternalLink, Heart, Share2, Eye, Award, Globe, List, ChevronRight } from 'lucide-react';

/* *
 * AnimeCard Component
 * 
 * This component displays detailed information about a specific anime.
 * It fetches data from the Jikan API based on the anime ID from the URL parameters.
 * 
*/
const AnimeCard = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false); // Tracks if anime is bookmarked by user
    const [isFavorited, setIsFavorited] = useState(false); // Tracks if anime is favorited by user
    const [isWatched, setIsWatched] = useState(false); // Tracks if anime is marked as watched by user

    const fetchAnimeDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
            const data = await response.json();

            // Checking for Data
            if (!data || !data.data) {
                throw new Error('No anime data found');
            }

            // Store the anime data in state
            setAnime(data.data);
            // console.log('Anime data loaded:', data.data);
        } catch (error) {
            // Handle any errors that occur during the API call
            // console.error("Error fetching anime:", error);
            setError(error.message || 'Failed to load anime details');
        } finally {
            // Always set loading to false, regardless of success or failure
            setLoading(false);
        }
    };

 const Ephandler = () =>{
        console.log("hi");
        
    }

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
            case 'finished airing':
                return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'currently airing':
                return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
            case 'not yet aired':
                return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            default:
                return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
        }
    };

    const renderStars = (score) => {
        const rating = Math.round((score || 0) / 2);
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
                fill={i < rating ? 'currentColor' : 'none'}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-4"></div>
                    <div className="text-white text-xl">Loading anime details...</div>
                </div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-500 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <p className="text-xl mb-4">{error || 'Anime not found.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen m-10    relative">
            {/* Back Button - Smaller and positioned on the left */}

            <div className="w-full mx-auto p-6 pt-10">
                {/* Main Container with better spacing */}
                <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 max-w-7xl mx-auto">
                    {/* Backbutton here */}
                    <button
                        onClick={() => window.history.back()}
                        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white hover:text-purple-300 transition-colors duration-200 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20 hover:bg-black/40"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    {/* Hero Banner Section */}
                    <div className="h-[45vh] w-full relative overflow-hidden">
                        <div className="w-full h-full relative group">
                            <img
                                src={
                                    anime.trailer?.images?.jpg?.large_image_url ||
                                    anime.images?.jpg?.large_image_url ||
                                    anime.images?.jpg?.image_url ||
                                    'https://via.placeholder.com/1200x600/1e293b/94a3b8?text=No+Banner+Available'
                                }
                                alt={anime.title}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/1200x600/1e293b/94a3b8?text=No+Banner+Available';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/95 via-slate-800/30 to-transparent"></div>

                            {/* Simple Play Button - No complex animations */}
                            {anime.trailer?.url && (
                                <button
                                    onClick={() => window.open(anime.trailer.url, '_blank')}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent hover:scale-110 cursor-pointer border-4 border-white/80 hover:border-white transition-all duration-200 rounded-full p-4 shadow-xl"
                                >
                                    <Play className="h-8 w-8 text-white ml-1" fill="white" />
                                </button>
                            )}

                            {/* Production Details Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/90 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold mb-1 text-purple-300">Production Details</h3>
                                        <p className="text-slate-300 text-sm">Studios and creators behind this anime</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                        {anime.studios?.[0] && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                                <span><strong>Studio:</strong> {anime.studios[0].name}</span>
                                            </div>
                                        )}
                                        {anime.producers?.[0] && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span><strong>Producer:</strong> {anime.producers[0].name}</span>
                                            </div>
                                        )}
                                        {anime.licensors?.[0] && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <span><strong>Licensor:</strong> {anime.licensors[0].name}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                                            <span><strong>Type:</strong> {anime.type || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section with improved spacing */}
                    <div className="flex flex-col lg:flex-row relative z-10 p-8  gap-8">

                        {/* Left Sidebar - Poster and Actions */}
                        <div className="lg:w-1/3 flex flex-col 2 space-y-6">

                            {/* Poster Image */}
                            <div className="relative group">
                                <img
                                    src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x400/1e293b/94a3b8?text=No+Poster'}
                                    alt={anime.title}
                                    className="max-w-4xl h-96 object-cover rounded-xl shadow-2xl border-2 border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x400/1e293b/94a3b8?text=No+Poster';
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-4">
                                {/* Primary Watch Trailer Button */}
                                {anime.trailer?.url ? (
                                    <button
                                        onClick={() => window.open(anime.trailer.url, '_blank')}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg font-semibold"
                                    >
                                        <Play className="h-5 w-5" fill="white" />
                                        Watch Trailer
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg opacity-50 cursor-not-allowed font-semibold"
                                    >
                                        <Play className="h-5 w-5" />
                                        No Trailer Available
                                    </button>
                                )}

                                {/* Secondary Action Buttons */}
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className={`${isBookmarked ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-700 hover:bg-slate-600'} text-white py-3 px-3 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-1`}
                                    >
                                        <Bookmark className="h-4 w-4" fill={isBookmarked ? "white" : "none"} />
                                        <span className="text-xs font-medium">Save</span>
                                    </button>

                                    <button
                                        onClick={() => setIsFavorited(!isFavorited)}
                                        className={`${isFavorited ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'} text-white py-3 px-3 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-1`}
                                    >
                                        <Heart className="h-4 w-4" fill={isFavorited ? "white" : "none"} />
                                        <span className="text-xs font-medium">Like</span>
                                    </button>

                                    <button
                                        onClick={() => setIsWatched(!isWatched)}
                                        className={`${isWatched ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-700 hover:bg-slate-600'} text-white py-3 px-3 rounded-lg transition-all duration-300 flex flex-col items-center justify-center gap-1`}
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="text-xs font-medium">Seen</span>
                                    </button>
                                </div>
                            </div>

                            {/* Rating Display */}
                            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Award className="h-5 w-5 text-yellow-400" />
                                    <span className="text-sm text-slate-400 font-medium">User Rating</span>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex items-center gap-1">
                                        {renderStars(anime.score)}
                                    </div>
                                    <span className="text-white font-bold text-lg">
                                        {anime.score ? `${anime.score}/10` : 'Not Rated'}
                                    </span>
                                </div>
                                <div className="text-slate-400 text-sm">
                                    {anime.scored_by ? `${anime.scored_by.toLocaleString()} votes` : 'No votes yet'}
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-2  gap-3">
                                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-3 rounded-lg border border-purple-500/30">
                                    <div className="flex items-center  gap-2 mb-1">
                                        <Users className="h-4 w-4 text-purple-400" />
                                        <span className="text-xs text-slate-300">Popularity</span>
                                    </div>
                                    <div className="text-white font-bold text-sm">#{anime.popularity || 'N/A'}</div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-3 rounded-lg border border-blue-500/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="h-4 w-4 text-blue-400" />
                                        <span className="text-xs text-slate-300">Rank</span>
                                    </div>
                                    <div className="text-white font-bold text-sm">#{anime.rank || 'N/A'}</div>
                                </div>

                                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-3 rounded-lg border border-green-500/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star className="h-4 w-4 text-green-400" />
                                        <span className="text-xs text-slate-300">Members</span>
                                    </div>
                                    <div className="text-white font-bold text-sm">{anime.members ? anime.members.toLocaleString() : 'N/A'}</div>
                                </div>

                                <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-3 rounded-lg border border-orange-500/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Heart className="h-4 w-4 text-orange-400" />
                                        <span className="text-xs text-slate-300">Favorites</span>
                                    </div>
                                    <div className="text-white font-bold text-sm">{anime.favorites ? anime.favorites.toLocaleString() : 'N/A'}</div>
                                </div>
                            </div>

                            {/* External Link */}
                            {anime.url && (
                                <button
                                    onClick={() => window.open(anime.url, '_blank')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-xl shadow-lg font-semibold"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    View on MyAnimeList
                                </button>
                            )}
                        </div>

                        {/* Right Content - Main Information */}
                        <div className="lg:w-2/3 text-white space-y-6">

                            {/* Title Section */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                                    {anime.title}
                                </h1>
                                {anime.title_english && anime.title_english !== anime.title && (
                                    <h2 className="text-xl text-slate-300 mb-4">
                                        {anime.title_english}
                                    </h2>
                                )}

                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(anime.status)} mb-4`}>
                                    <div className="w-2 h-2 rounded-full bg-current"></div>
                                    {anime.status || 'Unknown Status'}
                                </div>

                                <p className="text-slate-300 text-lg leading-relaxed">
                                    {anime.synopsis || 'No synopsis available for this anime.'}
                                </p>
                            </div>

                            {/* Information Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Tv className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-400">Format</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                        {anime.type || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-400">Release Date</span>
                                    </div>
                                    <span className="font-semibold text-white text-sm">
                                        {anime.aired?.from ? formatDate(anime.aired.from) : 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-400">Episodes</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                        {anime.episodes || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-400">Duration</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                        {anime.duration || 'Unknown'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-400">Age Rating</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                        {anime.rating || 'Not Rated'}
                                    </span>
                                </div>

                                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-5 w-5 text-purple-400" />
                                        <span className="text-sm text-slate-400">Source</span>
                                    </div>
                                    <span className="font-semibold text-white">
                                        {anime.source || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Genres */}
                            {anime.genres && anime.genres.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-slate-200">Genres</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {anime.genres.map((genre, index) => (
                                            <span
                                                key={genre.mal_id || index}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 cursor-pointer"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-colors">
                                    <h3 className="font-bold text-lg mb-4 text-purple-300">Score & Rankings</h3>
                                    <div className="space-y-3 text-sm text-slate-300">
                                        <div className="flex justify-between">
                                            <span>MyAnimeList Score:</span>
                                            <span className="font-semibold text-white">{anime.score || 'Not rated'}/10</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Votes:</span>
                                            <span className="font-semibold text-white">{anime.scored_by?.toLocaleString() || 'No votes'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Global Rank:</span>
                                            <span className="font-semibold text-white">#{anime.rank || 'Unranked'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Popularity Rank:</span>
                                            <span className="font-semibold text-white">#{anime.popularity || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-6 rounded-2xl border border-blue-500/30 hover:border-blue-500/50 transition-colors">
                                    <h3 className="font-bold text-lg mb-4 text-blue-300">Broadcast Details</h3>
                                    <div className="space-y-3 text-sm text-slate-300">
                                        <div className="flex justify-between">
                                            <span>Original Source:</span>
                                            <span className="font-semibold text-white">{anime.source || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Season:</span>
                                            <span className="font-semibold text-white">{anime.season ? `${anime.season} ${anime.year}` : 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Broadcast Day:</span>
                                            <span className="font-semibold text-white">{anime.broadcast?.string || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Studio:</span>
                                            <span className="font-semibold text-white">{anime.studios?.[0]?.name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Episodes Button - Full width at bottom */}
                    <div className='px-8 pb-8'>
                        <button
                        onClick={()=> {Ephandler(anime)}}
                        className="group cursor-pointer relative bg-gradient-to-br from-purple-700/40 to-violet-700/40 hover:from-purple-800/50 hover:to-violet-800/50 text-white font-medium py-4 px-8 rounded-xl w-full transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl border border-purple-600/40 hover:border-purple-600/60">
                            <div className="flex items-center justify-center gap-3">
                                <List className="h-6 w-6 text-white" />
                                <span className="text-lg font-bold tracking-wide">View All Episodes</span>
                                <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimeCard;