import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from './Searchbar';
import { useAuth } from '../../context/AuthContext';

// NavLink with new color scheme, no before/after
const NavLink = ({ to, children, className, noSlider }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${className} ${
        isActive
          ? "text-cyan-400"
          : "text-white/80 hover:text-cyan-200 hover:bg-cyan-700/20"
      } relative`}
    >
      {children}
      {/* No before/after slider */}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleSearchItemClick = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gradient-to-br from-cyan-900/80 via-blue-900/80 to-indigo-900/80 backdrop-blur-sm border-b border-cyan-700/30 text-white shadow-lg'
            : 'bg-gradient-to-r from-cyan-800/90 via-blue-800/90 to-indigo-800/90 backdrop-blur-xl border-b-2 border-cyan-700/20 text-white shadow-2xl'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center text-xl font-bold bg-white bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              <img
                className="h-10 w-10 rounded-xl"
                src="/AnimeXlogo.jpg"
                alt="Anime-X"
              />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-6 text-sm font-medium">
              <NavLink
                to="/"
                className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
              >
                <Home size={16} />
                Home
              </NavLink>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative px-4 py-2 rounded-md transition-all cursor-pointer duration-300 flex items-center gap-2 text-white/80 hover:text-cyan-200 hover:bg-cyan-700/20"
              >
                <Search size={16} />
                Search
              </button>

              <NavLink
                to="/explore"
                className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
              >
                <Compass size={16} />
                Explore
              </NavLink>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-white/80 text-sm">👋 {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-full border border-cyan-400/30 hover:border-red-400 hover:bg-red-500/20 transition-all duration-300 text-sm text-white/80 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-full border border-cyan-400/30 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-700/20 hover:to-blue-700/20 transition-all duration-300 flex items-center gap-2 text-sm text-white/80 hover:text-white"
                  noSlider={true}
                >
                  <User size={16} />
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl mx-4 px-4">
            <Searchbar 
              onClose={() => setIsSearchOpen(false)}
              onItemClick={handleSearchItemClick}
            />
          </div>
        </div>
      )}
    </>
  );
}
