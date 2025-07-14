import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AnimeContext from './context/AnimeContext.jsx'
import ApiContextProvider from './context/ApiContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
    <AuthProvider >
    <ApiContextProvider>
      <AnimeContext>
        <App />

      </AnimeContext>
    </ApiContextProvider>
    </AuthProvider>
    </BrowserRouter>
    
  </StrictMode>
)
