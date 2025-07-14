import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-gray-900 to-black text-white text-2xl">
    {/* <Navbar /> */}
    <main className="flex-1">
      <Outlet />
    </main>
    {/* <Footer /> */}
  </div>
  )
}
export default Layout
