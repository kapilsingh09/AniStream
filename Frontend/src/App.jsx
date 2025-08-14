// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// queryClient
import Layout from './Layout/Layout';
import HomePage from './Home/Homepage';
import ExplorePage from './pages/ExplorePage';
import JikhanAnimeCard from './routes/JikhanAnimeCard';
import KitsuAnimeCard from './routes/KitsuAnimeCard';
import SorryCard from './utils/SorryCard';
import Demo from './utils/Demo';
import Login from './routes/Login';
import Register from './routes/Register';
import SearchPage from './pages/SearchPage';
import KeywordPage from './pages/KeywordPage';
import VideoPage from './pages/VideoPage';
import Player from './player/Player';
import { Pizza } from 'lucide-react';

const rizz = new QueryClient()
const App = () => {
  return (
    <>
    <QueryClientProvider client={rizz} >
      {/* <ScrollToTop /> ✅ Add this here */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Pages */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/play/:id" element={<JikhanAnimeCard />} />
          <Route path="/find" element={<JikhanAnimeCard />} />
          <Route path="/kitsu/:id" element={<KitsuAnimeCard />} />
          {/* To visit this route, go to: http://localhost:3000/genres/your-id-here */}
          <Route path="/genres/:id" element={<Demo />} />
            <Route path="/watch/:id" element={<Player animeName="Naruto"  />}  />
          {/* 404 */}
          <Route path="*" element={<SorryCard />} />
        </Route>
      </Routes>
      </QueryClientProvider>
    </>
  );
};

export default App;
