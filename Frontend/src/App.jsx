import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout'


const App = () => {
  return (
    <>
    <Routes>
      <Route path='' element={<Layout />} / >
    </Routes>
    </>
  )
}

export default App
