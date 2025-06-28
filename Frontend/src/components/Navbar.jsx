import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from '../utils/Searchbar';

const NavLink = ({ to, children, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${className} ${isActive ? "text-indigo-300" : "text-white/80 hover:text-white hover:bg-white/10"}`}
    >
      {children}
      {isActive && (
        <motion.span
          layout
          className="absolute bottom-0 left-0 h-0.5 w-full rounded-2xl  bg-white "
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default function Navbar() {
  const [isOpen, setisOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.search-container')) {
        setisOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${scrolled
          ? 'bg-gradient-to-br from-violet-500/25 via-purple-500/25 to-pink-500/25 backdrop-blur-sm border-b text-white border-white/12 shadow-lg'
          
          : 'bg-gradient-to-r from-violet-400/80 via-purple-400/80 to-pink-400/80 backdrop-blur-xl border-b-2 border-white/15 shadow-2xl'
          }`}
        
      >
        {/**/}
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-xl font-bold bg-white bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
          >
            Animex
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
            >
              <Home size={16} />
              Home
            </NavLink>

            <div className="search-container relative">
              <button
                onClick={() => setisOpen(!isOpen)}
                className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                <Search size={16} />
                Search
              </button>
            </div>

            <NavLink
              to="/explore"
              className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
            >
              <Compass size={16} />
              Explore
            </NavLink>
          </div>

          {/* Login Button */}
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-full border border-white/30 hover:border-violet-400 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-violet-500/20 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <User size={16} />
            Login
          </NavLink>
        </div>
      </motion.nav>

      {/* Search Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setisOpen(false)}
          />
          
          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative w-full max-w-2xl mx-4"
          >
            <Searchbar onClose={() => setisOpen(false)} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
