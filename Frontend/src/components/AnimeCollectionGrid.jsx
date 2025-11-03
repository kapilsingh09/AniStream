/**
 * REUSABLE COMPONENT: AnimeCollectionGrid
 * 
 * Purpose: Displays a collection of anime (watchlist, favourites, etc.) in a responsive grid layout
 * This component is designed to be reusable across different collection types to avoid code duplication
 * 
 * Props:
 * - collection: Array of anime items { animeId, title, image, addedAt }
 * - loading: Boolean indicating loading state
 * - error: Error message string or null
 * - title: Page title (e.g., "My Watchlist", "Favourites")
 * - icon: React icon component to display
 * - emptyTitle: Title for empty state
 * - emptyMessage: Message for empty state
 * - emptyIcon: Icon component for empty state
 * - onRemove: Function to handle removing an item from collection
 * - removeButtonText: Text for remove button
 * - navigateToExplore: Function to navigate to explore page
 */

import React from 'react';
import { Trash2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimeCollectionGrid = ({
  collection = [],
  loading = false,
  error = null,
  title = "My Collection",
  icon: Icon,
  emptyTitle = "Your Collection is Empty",
  emptyMessage = "Start adding anime to your collection!",
  emptyIcon: EmptyIcon,
  onRemove,
  removeButtonText = "Remove",
  navigateToExplore,
}) => {
  const navigate = useNavigate();

  /**
   * Handle clicking on an anime card
   * Navigates to the anime detail page (tries Kitsu first, then Jikan)
   */
  const handleAnimeClick = (animeId) => {
    navigate(`/kitsu/${animeId}`);
  };

  /**
   * Handle removing an anime from collection
   * Shows confirmation dialog before removing
   */
  const handleRemove = async (animeId) => {
    if (window.confirm(`Are you sure you want to remove this anime from your collection?`)) {
      try {
        await onRemove(animeId);
      } catch (error) {
        console.error('Error removing anime:', error);
      }
    }
  };

  // Loading state: Shows spinner while fetching data
  if (loading && collection.length === 0) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-800 border-t-amber-400"></div>
              <div className="text-gray-400 text-lg">Loading your collection...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state: Shows error message with retry option
  if (error && collection.length === 0) {
    return (
      <div className="min-h-screen bg-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800">
              <div className="text-6xl mb-4">😔</div>
              <h2 className="text-2xl font-bold text-gray-200 mb-2">Oops! Something went wrong</h2>
              <p className="text-red-400 mb-6">{error}</p>
              {navigateToExplore && (
                <button
                  onClick={navigateToExplore}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {Icon && <Icon className="h-8 w-8 text-amber-400" />}
            <h1 className="text-4xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-gray-400 text-lg">
            {collection.length === 0
              ? `No anime in your collection yet`
              : `You have ${collection.length} ${collection.length === 1 ? 'anime' : 'anime'} saved`}
          </p>
        </div>

        {/* Empty State: Shows when collection is empty */}
        {collection.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center max-w-md">
              {EmptyIcon && <div className="text-8xl mb-6"><EmptyIcon className="h-20 w-20 mx-auto text-gray-600" /></div>}
              <h2 className="text-2xl font-bold text-gray-200 mb-4">{emptyTitle}</h2>
              <p className="text-gray-400 mb-8">{emptyMessage}</p>
              {navigateToExplore && (
                <button
                  onClick={navigateToExplore}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
                >
                  Explore Anime
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Collection Grid: Responsive grid layout */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {collection.map((anime) => (
              <div
                key={anime.animeId}
                className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:scale-105"
              >
                {/* Poster Image Section */}
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
                  
                  {/* Hover Overlay: Shows "View Details" button on hover */}
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

                {/* Content Section: Title and actions */}
                <div className="p-4">
                  {/* Anime Title */}
                  <h3
                    className="text-white font-semibold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-amber-400 transition-colors"
                    onClick={() => handleAnimeClick(anime.animeId)}
                    title={anime.title}
                  >
                    {anime.title}
                  </h3>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(anime.animeId);
                      }}
                      className="flex-1 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                      title={`${removeButtonText} from collection`}
                    >
                      <Trash2 className="h-4 w-4" />
                      {removeButtonText}
                    </button>
                  </div>

                  {/* Added Date: Shows when anime was added to collection */}
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

export default AnimeCollectionGrid;

