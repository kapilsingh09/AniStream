import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

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
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-purple-400 to-indigo-400"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out ${scrolled
        ? 'bg-white/5 backdrop-blur-sm border-b border-white/10 shadow-lg'
        : 'bg-white/15 backdrop-blur-xl border-b-2 border-white/30 shadow-2xl'
        }`}
      style={{
        background: scrolled
          ? 'linear-gradient(135deg, rgb(255 255 255 / 0.05) 0%, rgb(255 255 255 / 0.02) 100%)'
          : 'linear-gradient(135deg, rgb(255 255 255 / 0.15) 0%, rgb(255 255 255 / 0.08) 50%, rgb(147 51 234 / 0.1) 100%)',
      }}
    >
      {/**/}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-white">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-pink-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
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

          <NavLink
            to="/search"
            className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
          >
            <Search size={16} />
            Search
          </NavLink>

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
  );
}
