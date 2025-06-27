import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from './Layout/Layout';
import HomePage from './Home/Homepage';
import ExplorePage from './pages/ExplorePage';
import AnimeCard from './routes/AnimeCard';
import KitsuAnimeCard from './routes/KitsuAnimeCard';
import SorryCard from './utils/SorryCard'; // Used for 404 fallback

const App = () => {
  return (
    <Routes>
      {/* All child routes use Layout as a wrapper */}
      <Route path="/" element={<Layout />}>

        {/* Default (index) route renders HomePage */}
        {/* <Route index element={<HomePage />} /> */}

        {/* Nested routes (relative paths) */}
        <Route path="explore" element={<ExplorePage />} />
        {/* <Route path="play/:id" element={<AnimeCard />} /> */}
        {/* <Route path="kitsu/:id" element={<KitsuAnimeCard  />} /> */}

        {/* 404 fallback route */}
        <Route path="*" element={<SorryCard />} />

      </Route>
    </Routes>
  );
};

export default App;
