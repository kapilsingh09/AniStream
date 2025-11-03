import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AnimeContext from './context/AnimeContext.jsx'
import ApiContextProvider from './context/ApiContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import { FavouritesProvider } from './context/FavouritesContext.jsx'
import App1 from './App.example.jsx'

/**
 * MAIN APP ENTRY POINT
 * 
 * Wraps app with all necessary context providers:
 * - AuthProvider: User authentication state
 * - WatchlistProvider: Watchlist functionality
 * - FavouritesProvider: Favourites functionality
 * - ApiContextProvider: API configuration
 * - AnimeContext: Anime data context
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
    <AuthProvider >
    <WatchlistProvider>
    <FavouritesProvider>
    <ApiContextProvider>
      <AnimeContext>
        <App />

      </AnimeContext>
    </ApiContextProvider>
    </FavouritesProvider>
    </WatchlistProvider>
    </AuthProvider>
    </BrowserRouter>
    
  </StrictMode>
)
