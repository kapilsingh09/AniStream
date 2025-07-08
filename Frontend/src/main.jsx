import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AnimeContext from './context/AnimeContext.jsx'
import ApiContextProvider from './context/ApiContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <ApiContextProvider>
      <AnimeContext>
        <App />
      </AnimeContext>
    </ApiContextProvider>
    </BrowserRouter>
)
