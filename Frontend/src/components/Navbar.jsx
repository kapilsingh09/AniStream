import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      } border-b border-white/20`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
        >
          Animex
        </NavLink>

        {/* Navigation Links */}
        <div className="flex gap-6 text-sm font-medium">
          <NavLink
            to="home"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                isActive ? 'text-indigo-300' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home size={16} />
                Home
                <motion.span
                  layout
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400"
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
          </NavLink>

          <button
            className="relative px-4 py-2 rounded-md text-white/80 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-indigo-500/20 transition-all duration-300 flex items-center gap-2"
          >
            <Search size={16} />
            Search
          </button>

          <NavLink
            to="explore"
            className={({ isActive }) =>
              `relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 ${
                isActive ? 'text-indigo-300' : 'text-white/80 hover:text-white hover:bg-white/10'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Compass size={16} />
                Explore
                <motion.span
                  layout
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400"
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
          </NavLink>
        </div>

        {/* Login Button with color and User Icon */}
        <NavLink
          to="login"
          className={({ isActive }) =>
            `px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 text-sm ${
              isActive
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/30 border-purple-400'
                : 'text-white border-white/30 hover:border-indigo-400 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-indigo-500/20'
            }`
          }
        >
          <User size={16} />
          Login
        </NavLink>
      </div>
    </motion.nav>
  );
}
