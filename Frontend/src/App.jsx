import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import ExplorePage from './pages/ExplorePage'


const App = () => {
  return (
    <>
    <Routes>
      <Route path='' element={<Layout />} / >
      <Route path='/explore' element={<ExplorePage />} />
    </Routes>
    </>
  )
}

export default App
