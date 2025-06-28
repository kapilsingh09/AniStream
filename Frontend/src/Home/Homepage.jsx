import React from 'react';
import AnimeSlider from './AnimeSlider'
import AnimeSection from './AnimeSection'
import AnimeBanner from './AnimeBanner';
import SectionComponentKitsu from './SectionComponentKitsu'
import SimpleAnimeBanner from './SimpleAnimeBanner'
import{ 
  FetchUpcomingAnime,
  FetchTopRatedAnime,
  FetchTopAnime,
  FetchCurrentSeasonAnime,
  FetchSeasonalAnime,
  FetchTrendingRomanceComedyAnime
} from '../services/JikhanAnimeApi'

import{ 
  fetchTrendingAnime,//working
  fetchRomanceAnime,//wroking not ferquientyl
  fetchActionAnime,//wroking
  fetchHorrorAnime,//working

} from '../services/kitsuAnimeApi'


const Homepage = () => {
  return (
    <div className="min-h-screen mt-15 bg-zinc-900">
      {/* Main Banner */}

      <AnimeSlider />

      <AnimeSection  title='TOP anime 2025' fetchFunction={FetchTopAnime} />
      
      
      <AnimeSection  title='Top-Upcoming - 2025' fetchFunction={FetchUpcomingAnime} />
      
      <SectionComponentKitsu fetchFunction={fetchTrendingAnime} title='Trending ! This Year' />

       
      <div className='flex items-center justify-center'>
      <AnimeBanner />
      </div>
      

      <AnimeSection  title='Top-RatedAnime' fetchFunction={FetchTopRatedAnime} />   

      
      <SectionComponentKitsu fetchFunction={fetchRomanceAnime} title='Darma ' subtitle='Suggested by Anime-X' />

      <div className='flex items-center justify-center'>
      <SimpleAnimeBanner />
      </div>

      <SectionComponentKitsu fetchFunction={fetchHorrorAnime} title='Horror Darma' />
   
      <AnimeSection  title='Top-RatedAnime' fetchFunction={FetchCurrentSeasonAnime} />   
      <AnimeSection  title='romance' fetchFunction={FetchTrendingRomanceComedyAnime} />   

      <SectionComponentKitsu fetchFunction={fetchActionAnime} title='Adventure and Comedy ' />
      

      {/* <SectionComponentKitsu fetchFunction={fetchSchoolAnime} title='School anime ' /> */}



      <div className='flex items-center justify-center'>
      <AnimeBanner />
      </div>


      
    </div>
  );
};

export default Homepage; 