import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout/Layout';
import HomePage from './Home/Homepage';
import ExplorePage from './pages/ExplorePage';
import JikhanAnimeCard from './routes/JikhanAnimeCard';
import KitsuAnimeCard from './routes/KitsuAnimeCard';
import SorryCard from './utils/SorryCard';
import Demo from './utils/Demo'
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>


        <Route index element={<HomePage />} />

        {/* Nested routes (relative paths) */}
         <Route path="/explore" element={<ExplorePage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path="play/:id" element={<JikhanAnimeCard />} />
        <Route path="kitsu/:id" element={<KitsuAnimeCard />} />
        <Route path="genres/:id" element={<Demo />} />

        <Route path="/login" element={<LoginPage />} />

        {/* 404 fallback route */}
        {/* <Route path="*" element={<SorryCard />} /> */} 

      </Route>
    </Routes>
  );
};

export default App;
