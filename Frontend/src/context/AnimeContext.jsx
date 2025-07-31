// NOTE: This context is now cleared as requested, but not deleted. 
// If you need to use Jikan API data, please import and use directly from '../services/JikhanAnimeApi' where needed.

import React from 'react';

export const DataContext = React.createContext();

const AnimeContext = ({ children }) => {
  // Context is intentionally left empty as per instructions.
  // If you need Jikan API data, import and use the functions from '../services/JikhanAnimeApi' directly in your components.

  return (
    <DataContext.Provider value={{}}>
      {children}
    </DataContext.Provider>
  );
};

export default AnimeContext;
