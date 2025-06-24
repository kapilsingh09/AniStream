import React, { useEffect, useState } from 'react';

export default function Navbar() {
  // State to track if user has scrolled down
  const [scrolled, setScrolled] = useState(false);
  // State to track active page for demo purposes
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    // Handle scroll event to trigger glassmorphism effect
    const handleScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate NavLink behavior for demo
  const NavLink = ({ to, children, className, ...props }) => {
    const isActive = activePage === to;
    return (
      <button
        {...props}
        onClick={() => setActivePage(to)}
        className={typeof className === 'function' ? className({ isActive }) : className}
      >
        {typeof children === 'function' ? children({ isActive }) : children}
      </button>
    );
  };

  return (
    <div className="h-[10vh] border-b-2 border-white/60 bg-gradient-to-br  from-gray-900/50 via-purple-900 to-indigo-900">
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? 'bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 backdrop-blur-xl shadow-xl border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6  py-4 flex  items-center justify-between text-white">
          
          {/* Left Section - Brand Logo */}
          <NavLink 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            Animex
          </NavLink>

          {/* Center Section - Navigation Links */}
          <div className="flex gap-8 text-sm font-medium">
            
            {/* Home Navigation Link */}
            <NavLink
              to="home"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-indigo-300' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Home
                  {/* Active indicator line for navigation items */}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>

            {/* Search Button (not a navigation link) */}
            <button
              className="relative px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Search
            </button>

            {/* Explore Navigation Link */}
            <NavLink
              to="explore"
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'text-indigo-300' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  Explore
                  {/* Active indicator line for navigation items */}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          </div>

          {/* Right Section - Login Link */}
          <NavLink
            to="login"
            className={({ isActive }) =>
              `px-6 py-2 rounded-full border transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 border-purple-400'
                  : 'text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-indigo-500/20 hover:border-indigo-400 border-white/30'
              }`
            }
          >
            Login
          </NavLink>
        </div>
      </nav>
    </div>
  );
}