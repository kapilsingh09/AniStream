import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Lazy load components for better performance
const AnimeSection = lazy(() => import('./components/AnimeSection'));
const ResponsiveAnimeGrid = lazy(() => import('./components/ResponsiveAnimeGrid'));
const AnimeCard = lazy(() => import('./components/AnimeCard'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
    <div className="text-red-400 text-6xl mb-4">⚠️</div>
    <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      {error.message || 'An unexpected error occurred'}
    </p>
    <button
      onClick={resetErrorBoundary}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

// Main App component
const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-black text-white">
          <Suspense fallback={<LoadingSpinner />}>
            {/* Example usage of the new unified components */}
            <div className="space-y-8 py-8">
              
              {/* Trending Anime Section */}
              <AnimeSection
                title="Trending Anime"
                queryKey="trending-anime"
                queryFn={async (limit) => {
                  const response = await fetch(`http://localhost:3000/api/unified/trending?limit=${limit}`);
                  return response.json();
                }}
                variant="default"
                showActions={true}
                showRating={true}
                showStatus={true}
                enableHorizontalScroll={true}
                autoRefresh={true}
                refreshInterval={300000}
              />

              {/* Top Rated Anime Section */}
              <AnimeSection
                title="Top Rated Anime"
                queryKey="top-rated-anime"
                queryFn={async (limit) => {
                  const response = await fetch(`http://localhost:3000/api/unified/top-rated?limit=${limit}`);
                  return response.json();
                }}
                variant="detailed"
                showActions={true}
                showRating={true}
                showStatus={true}
                showGenres={true}
              />

              {/* New Arrivals Section */}
              <AnimeSection
                title="New Arrivals"
                queryKey="new-arrivals"
                queryFn={async (limit) => {
                  const response = await fetch(`http://localhost:3000/api/unified/new-arrivals?limit=${limit}`);
                  return response.json();
                }}
                variant="compact"
                showActions={false}
                showRating={true}
                showStatus={true}
              />

              {/* Genre-based Section */}
              <AnimeSection
                title="Romance Anime"
                queryKey="romance-anime"
                queryFn={async (limit) => {
                  const response = await fetch(`http://localhost:3000/api/unified/genre/romance?limit=${limit}`);
                  return response.json();
                }}
                variant="default"
                showActions={true}
                showRating={true}
                showStatus={true}
              />

            </div>
          </Suspense>
        </div>
        
        {/* React Query Devtools (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
