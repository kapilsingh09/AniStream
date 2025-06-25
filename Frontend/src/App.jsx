import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'
import ExplorePage from './pages/ExplorePage'
import HomePage from './Home/Homepage'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/explore' element={<ExplorePage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
