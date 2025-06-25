import React from 'react'
import HeroSlider from './AnimeSlider'
import Demo from '../utils/Demo'
import AnimeSection from '../Home/AnimeSection'
const Homepage = () => {
  return (
    <div className='flex-2 '>
      <HeroSlider />
      <AnimeSection />
      <AnimeSection />
      {/* <Demo /> */}
    </div>
  )
}
 
export default Homepage
