import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AnimeContext from './context/AnimeContext.jsx'
import ApiContextProvider from './context/ApiContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import App1 from './App.example.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
    <AuthProvider >
    <WatchlistProvider>
    <ApiContextProvider>
      <AnimeContext>
        <App />

      </AnimeContext>
    </ApiContextProvider>
    </WatchlistProvider>
    </AuthProvider>
    </BrowserRouter>
    
  </StrictMode>
)
