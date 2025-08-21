import React, { useEffect, useState } from 'react';
import { Home, Search, Compass, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Searchbar from './Searchbar';
import Login from '../../routes/Login';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavLink = ({ to, children, className, onClick, noSlider }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${className} ${
        isActive 
          ? "text-indigo-300" 
          : "text-white/80 hover:text-white hover:bg-white/10"
      } relative`}
    >
      
      {/* Shhh... let the children play by themselves! */}
      {children}


      {isActive && !noSlider && (
        <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-2xl bg-white" />
      )}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // console.log(user);
  
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    // navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Close search when clicking outside or on search results
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (isSearchOpen && !event.target.closest('.search-container')) {
  //       setIsSearchOpen(false);
  //     }
  //   };

  //   if (isSearchOpen) {
  //     document.addEventListener('mousedown', handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isSearchOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearchItemClick = () => {
    setIsSearchOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gradient-to-br from-violet-500/25 via-purple-500/25 to-pink-500/25 backdrop-blur-sm border-b text-white border-white/12 shadow-lg'
            : 'bg-gradient-to-r from-violet-400/80 via-purple-400/80 to-pink-400/80 backdrop-blur-xl border-b-2 border-white/15 shadow-2xl'
        }`}
      >
        <div className="max-w-7xl mx-auto search-container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center text-xl font-bold bg-white bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
              onClick={closeMobileMenu}
            >
              <img
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl"
                src="/AnimeXlogo.jpg"
                alt="Anime-X"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink
                to="/"
                className="relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2"
              >
                <Home size={16} />
                Home
              </NavLink>

              <div className=" relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="relative px-4 py-2 rounded-md transition-all cursor-pointer duration-300 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
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

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white/80 text-sm">👋{user.name}</span>
{/* {console.log(user)} */}
                  
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 rounded-full border border-white/30 hover:border-red-400 hover:bg-red-500/20 transition-all duration-300 text-sm text-white/80 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-full border border-white/30 hover:border-violet-400 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-violet-500/20 transition-all duration-300 flex items-center gap-2 text-sm text-white/80 hover:text-white"
                  noSlider={true}
                >
                  <User size={16} />
                  Login
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X size={24} />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-b from-violet-500/30 to-purple-500/30 backdrop-blur-lg border-t border-white/10">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className=" px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
              >
                <Home size={18} />
                Home
              </NavLink>

              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  closeMobileMenu();
                }}
                className="w-full text-left  px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 text-white/80 hover:text-white hover:bg-white/10"
              >
                <Search size={18} />
                Search
              </button>

              <NavLink
                to="/explore"
                onClick={closeMobileMenu}
                className=" px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
              >
                <Compass size={18} />
                Explore
              </NavLink>

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  <div className="px-3 py-2">
                    <div className="text-white/80 text-sm mb-2">👋 {user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className=" px-3 py-2 rounded-md text-base font-medium flex items-center gap-3"
                    noSlider={true}
                  >
                    <User size={18} />
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Future login modal */}
        {isLoginOpen && (
          <div className="absolute z-[999999] w-full">
            <Login onloginClose={() => setIsLoginOpen(false)} />
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Search Container */}
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