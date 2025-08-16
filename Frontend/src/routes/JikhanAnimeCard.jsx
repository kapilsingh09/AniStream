import React, { useState } from 'react';
import { Play, Bookmark, Star, Calendar, Tv, Users, Clock, ArrowLeft, Heart, Share2, Eye, Award, Globe, List, ChevronRight, Film, ChevronDown, Info } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import EploaderJikhan from '../utils/EploaderJikhan';
import { useQuery } from '@tanstack/react-query';
import GenreList from '../utils/Geners';
import AnimeGrid from '../Home/AnimeGrid';
import { flushKeyframeResolvers } from 'framer-motion';
import SectionComponent from '../Home/JikhanAnimeComponent';
import { fetchActionAnime, fetchComedyAnime, fetchFantasyAnime, fetchNewArrivals, fetchSliceOfLifeAnime } from '../services/kitsuAnimeApi';
import SectionComponentKitsu from '../Home/SectionComponentKitsu';
import { fetchNewlyAddedAnime } from '../services/anilistApi';

const fetchAnimeDetails = async ({ queryKey }) => {
    const [_key, { id, keyword }] = queryKey;
    let url = '';
    if (id) {
        url = `https://api.jikan.moe/v4/anime/${id}`;
    } else if (keyword) {
        url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(keyword)}&limit=1`;
    } else {
        throw new Error("No anime ID or search keyword provided.");
    }
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`API failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data || !data.data) {
        throw new Error("No anime data found.");
    }
    return Array.isArray(data.data) ? data.data[0] : data.data;
};

const JikanAnimeCard = ({ onNavigate }) => {  
    const [searchres] = useSearchParams();
    const keyword = searchres.get("keyword");
    const { id } = useParams();       
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(true);
    const [isEpOpen, setIsEpOpen] = useState(false);

    const { data: anime, isLoading: loading, error, refetch } = useQuery({
        queryKey: ['animeDetails', { id, keyword }],
        queryFn: fetchAnimeDetails,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

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
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'currently airing':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'not yet aired':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const renderStars = (score) => {
        const rating = Math.round((score || 0) / 2);
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-amber-400' : 'text-gray-300'}`}
                fill={i < rating ? 'currentColor' : 'none'}
            />
        ));
    };

    const getBannerImage = () => {
        return anime?.trailer?.images?.large_image_url ||
               anime?.images?.jpg?.large_image_url ||
               anime?.images?.jpg?.image_url ||
               'https://via.placeholder.com/1200x600/0f172a/64748b?text=Jikan+API+-+No+Banner';
    };

    const getPosterImage = () => {
        return anime?.images?.jpg?.large_image_url ||
               anime?.images?.jpg?.image_url ||
               'https://via.placeholder.com/300x400/0f172a/64748b?text=No+Poster';
    };

    const handleWatchClick = () => {
        window.open('https://www.crunchyroll.com', '_blank');
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: anime?.title,
                    text: `Check out ${anime?.title} on MyAnimeList!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-[70%] mx-auto animate-pulse">
                    <div className="h-64 md:h-80 lg:h-96 w-full bg-gray-800 rounded-3xl mb-8" />
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        <div className="lg:w-1/3 space-y-6">
                            <div className="w-full max-w-sm h-80 md:h-96 bg-gray-800 rounded-2xl mx-auto" />
                            <div className="h-12 bg-gray-800 rounded-2xl" />
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-800 rounded-xl" />
                                ))}
                            </div>
                            <div className="h-24 bg-gray-800 rounded-2xl" />
                            <div className="grid grid-cols-2 gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-16 bg-gray-800 rounded-xl" />
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-2/3 space-y-8">
                            <div className="h-12 bg-gray-800 rounded w-2/3 mb-4" />
                            <div className="h-8 bg-gray-800 rounded w-1/3 mb-6" />
                            <div className="h-16 bg-gray-800 rounded-2xl mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="h-20 bg-gray-800 rounded-2xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-10 h-14 bg-gray-800 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black">
                <div className="text-center max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-2">Oops! Something went wrong</h2>
                    <p className="text-red-400 mb-6">{error?.message || error || 'Anime not found in MyAnimeList database'}</p>
                    <button
                        onClick={refetch}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const truncatedDescription = anime?.synopsis?.substring(0, 300) + '...';

    return (
        <div className="min-h-screen  bg-slate-900 mt-14 px-4 py-4">
            <div className="max-w-none w-[80%] mx-auto">
                <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="h-64 md:h-80 lg:h-96 w-full relative overflow-hidden">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 w-fit text-gray-400 hover:text-white transition-colors duration-200 bg-gray-900 absolute top-2 left-2 hover:underline cursor-pointer z-99  px-4 py-2 rounded-xl border border-gray-800 hover:bg-gray-800 shadow-sm"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm font-medium">Back</span>
                        </button>
                        <img
                            src={getBannerImage()}
                            alt={anime?.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <button
                            onClick={handleWatchClick}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md hover:bg-black/60 hover:scale-110 transition-all duration-300 rounded-full p-6 shadow-2xl border border-gray-800 group"
                        >
                            <Play className="h-8 w-8 text-white ml-1 group-hover:text-gray-300" fill="white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-white">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                                    <span>{anime?.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span>{anime?.episodes} Episodes</span>
                                </div>
                                <div className="flex items-center gap-2"> 
                                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                    <span>{anime?.score ? `${anime.score}/10` : 'No Rating'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:p-8 lg:p-10">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            <div className="lg:w-1/3 space-y-6">
                                <div className="relative group">
                                    <img
                                        src={getPosterImage()}
                                        alt={anime?.title}
                                        className="w-full max-w-sm mx-auto lg:mx-0 h-80 md:h-96 object-cover rounded-2xl shadow-lg border-2 border-gray-800 group-hover:shadow-2xl transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="space-y-4">
                                    <button
                                        onClick={handleWatchClick}
                                        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl font-semibold text-lg transform hover:scale-105"
                                    >
                                        <Play className="h-5 w-5" fill="white" />
                                        Watch Now
                                    </button>
                                    <div className="grid grid-cols-4 gap-3">
                                        <button
                                            onClick={() => setIsBookmarked(!isBookmarked)}
                                            className={`${isBookmarked ? 'bg-amber-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'} py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 shadow-sm`}
                                        >
                                            <Bookmark className="h-4 w-4" fill={isBookmarked ? "white" : "none"} />
                                            <span className="text-xs font-medium">Save</span>
                                        </button>
                                        <button
                                            onClick={() => setIsFavorited(!isFavorited)}
                                            className={`${isFavorited ? 'bg-pink-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'} py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 shadow-sm`}
                                        >
                                            <Heart className="h-4 w-4" fill={isFavorited ? "white" : "none"} />
                                            <span className="text-xs font-medium">Love</span>
                                        </button>
                                        <button
                                            onClick={() => setIsWatched(!isWatched)}
                                            className={`${isWatched ? 'bg-emerald-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'} py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 shadow-sm`}
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="text-xs font-medium">Seen</span>
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 shadow-sm"
                                        >
                                            <Share2 className="h-4 w-4" />
                                            <span className="text-xs font-medium">Share</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Award className="h-6 w-6 text-amber-400" />
                                        <span className="text-lg font-bold text-gray-200">MyAnimeList Score</span>
                                    </div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center gap-1">
                                            {renderStars(anime?.score)}
                                        </div>
                                        <span className="text-gray-200 font-bold text-2xl">
                                            {anime?.score ? `${anime.score}/10` : 'No Rating'}
                                        </span>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {anime?.scored_by ? `${anime.scored_by.toLocaleString()} users rated` : 'No ratings yet'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="h-4 w-4 text-purple-400" />
                                            <span className="text-xs text-gray-400">Popularity</span>
                                        </div>
                                        <div className="text-gray-200 font-bold text-lg">#{anime?.popularity}</div>
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 text-blue-400" />
                                            <span className="text-xs text-gray-400">Rank</span>
                                        </div>
                                        <div className="text-gray-200 font-bold text-lg">#{anime?.rank}</div>
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Heart className="h-4 w-4 text-emerald-400" />
                                            <span className="text-xs text-gray-400">Favorites</span>
                                        </div>
                                        <div className="text-gray-200 font-bold text-sm">{anime?.favorites?.toLocaleString()}</div>
                                    </div>
                                    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Globe className="h-4 w-4 text-rose-400" />
                                            <span className="text-xs text-gray-400">Members</span>
                                        </div>
                                        <div className="text-gray-200 font-bold text-sm">{anime?.members ? Math.floor(anime.members / 1000) + 'K' : 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-2/3 space-y-8">
                                <div>
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-200 mb-4 leading-tight">
                                        {anime?.title}
                                    </h1>
                                    {anime?.title_english && anime?.title_english !== anime?.title && (
                                        <h2 className="text-xl md:text-2xl text-gray-400 mb-6">
                                            {anime.title_english}
                                        </h2>
                                    )}
                                    <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(anime?.status)} mb-6`}>
                                        <div className="w-2 h-2 rounded-full bg-current"></div>
                                        {anime?.status}
                                    </div>
                                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                                        <p className="text-gray-300 text-base leading-relaxed">
                                            {showFullDescription ? anime?.synopsis : truncatedDescription}
                                        </p>
                                        {anime?.synopsis?.length > 300 && (
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="mt-3 text-pink-400 hover:text-pink-300 font-medium text-sm flex items-center gap-1 transition-colors"
                                            >
                                                {showFullDescription ? 'Show Less' : 'Read More'}
                                                <ChevronDown className={`h-4 w-4 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Tv className="h-5 w-5 text-rose-400" />
                                            <span className="text-gray-400 font-medium text-sm">Format</span>
                                        </div>
                                        <span className="font-bold text-gray-200 text-lg">{anime?.type}</span>
                                    </div>
                                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Calendar className="h-5 w-5 text-blue-400" />
                                            <span className="text-gray-400 font-medium text-sm">Aired</span>
                                        </div>
                                        <span className="font-bold text-gray-200 text-sm">
                                            {formatDate(anime?.aired?.from)}
                                        </span>
                                    </div>
                                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <List className="h-5 w-5 text-purple-400" />
                                            <span className="text-gray-400 font-medium text-sm">Episodes</span>
                                        </div>
                                        <span className="font-bold text-gray-200 text-lg">{anime?.episodes}</span>
                                    </div>
                                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Clock className="h-5 w-5 text-emerald-400" />
                                            <span className="text-gray-400 font-medium text-sm">Duration</span>
                                        </div>
                                        <span className="font-bold text-gray-200 text-lg">{anime?.duration}</span>
                                    </div>
                                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Info className="h-5 w-5 text-amber-400" />
                                            <span className="text-gray-400 font-medium text-sm">Rating</span>
                                        </div>
                                        <span className="font-bold text-gray-200 text-lg">{anime?.rating}</span>
                                    </div>
                                    <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Globe className="h-5 w-5 text-indigo-400" />
                                            <span className="text-gray-400 font-medium text-sm">Source</span>
                                        </div>
                                        <span className="font-bold text-gray-200 text-lg capitalize">{anime?.source}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex sm:flex-row gap-4">
                            <button
                                onClick={() => setIsEpOpen(!isEpOpen)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <Film className="h-5 w-5" />
                                    <span>{isEpOpen ? 'Hide Episodes' : 'Browse Episodes'}</span>
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                {isEpOpen && (
                    <EploaderJikhan
                        animeId={id}
                        onClose={() => setIsEpOpen(false)}
                        animeTitle={anime?.title}
                    />
                )}
            </div>
            {/* <GenreList /> */}
            {/* <SectionComponentKitsu title="Romantic Drama" subtitle="Suggested by Anime-X" fetchFunction={fetchDramaAnime} /> */}
            {/* <SectionComponentKitsu fetchFunction={fetchSliceOfLifeAnime} title="Romantic Drama" /> */}
        </div>
    );
};

export default JikanAnimeCard 