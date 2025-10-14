import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from './Searchbar';
import { useAuth } from '../../context/AuthContext';
import Profilebanner from '../User/Profilebanner';

// NavLink with color scheme and active detection
const NavLink = ({ to, children, className, noSlider }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${className} ${
        isActive
          ? 'text-cyan-400'
          : 'text-white/80 hover:text-cyan-200 hover:bg-cyan-700/20'
      } relative`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showProfilebanner, setShowProfilebanner] = useState(false);
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
        className={`fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'w-full bg-white/20 backdrop-blur-md  border-white/20 text-white shadow-lg bg-clip-padding bg-opacity-70 backdrop-saturate-150'
            : 'w-full bg-white/20 backdrop-blur-2xl border-b-2 border-white/10 text-white shadow-2xl bg-clip-padding bg-opacity-70 backdrop-saturate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9">
          <div className="flex items-center justify-between h-15">
            {/* Brand Logo */}
            <Link
  to="/"
  className="flex items-center text-2xl font-bold hover:scale-105 transition-transform duration-300"
>
  <img
    className="h-10 w-10 rounded-md mr-3" // increased width from w-10 → w-14
    src="/Neco-animelogo.png"
    alt="Neco-Me"
  />
  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
    neco-me
  </span>
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
                <div className="relative ">
                  {/* Profile Icon */}
                  <div
                      onClick={() => setShowProfilebanner(!showProfilebanner)}
                      className="h-11 w-11 flex items-center justify-center 
                                rounded-full bg-purple-900
                                text-white font-semibold text-lg cursor-pointer
                                shadow-lg 
                                border border-white/10
                                transition-all duration-300
                                hover:bg-purple-700 hover:scale-105 hover:border-cyan-400"

                    >
                      <span className="select-none text-xl font-base mb-0.5  text-white">
                        {/* Example of using "map" on an array of users */}
                        <>
                          {Array.isArray(user) ? (
                            user.map((u, idx) => (
                              <span key={idx}>
                                {u?.username?.[0]?.toUpperCase() || "?"}
                              </span>
                            ))
                          ) : (
                            <>{user?.username?.[0]?.toUpperCase() || "?"}</>
                          )}
                        </>
                        {/* {user?.username?.[0]?.toUpperCase() || "?"} */}
                      </span>
                    </div>


                  {/* Profile Banner Dropdown */}
                  {showProfilebanner && (
                    <div className="absolute right-0 mt-3 z-50">
                      <Profilebanner user={user} logout={logout} />
                    </div>
                  )}
                </div>
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
