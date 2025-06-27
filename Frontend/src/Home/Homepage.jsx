import React, { useContext } from 'react';
import AnimeSlider from './AnimeSlider';
import AnimeSection from './AnimeSection';
import { DataContext } from '../context/AnimeContext';

const Homepage = () => {
  const { fetchTopRatedAnime } = useContext(DataContext);

  return (
    <div className='flex-1'>
      <AnimeSlider />

      <AnimeSection 
        title="Top Rated Anime" 
        fetchFunction={fetchTopRatedAnime} // Now this works perfectly!
      />
    </div>
  );
};

export default Homepage;