import React, { useEffect, useState } from "react";
import { Home, Search, Compass, User, Bookmark } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Searchbar from "./Searchbar";
import { useAuth } from "../../context/AuthContext";
import Profilebanner from "../User/Profilebanner";

// Fixed: Remove erroneous scrolled usage; make NavLink a simple link, styling passed as className prop
const NavLink = ({ to, children, className = "", noSlider }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        ${className} 
        ${
          isActive
            ? "text-white font-semibold"
            : "text-gray-300 hover:text-white"
        } 
        relative transition-all duration-300 rounded-md px-3 py-1.5
      `}
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchItemClick = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/20 backdrop-blur-md border-white/20 text-white shadow-lg"
            : "bg-gradient-to-r from-black  via-[#0f0e0ed4] to-black border-b border-black   text-white  shadow-2xl"
        }`}
        style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}
      >
        <div className="max-w-7xl mx-auto sm:px-4 lg:px-6 px-9">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center font-bold transition-transform duration-300 hover:scale-105"
              style={{
                fontFamily:
                  'Poppins, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
              }}
            >
              <img
                src="/Neco-animelogo.png"
                alt="Neco-Me"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-md mr-2 sm:mr-3"
              />
              <span className="text-lg text-[16px] sm:text-xl md:text-2xl ">
                neco-me
              </span>
            </Link>

            {/* Nav Links */}
            <div
              className="
                flex items-center justify-center
                gap-2 xs:gap-3 sm:gap-5 md:gap-6
                text-[11px] xs:text-xs sm:text-sm md:text-base font-medium
              "
            >
              <NavLink
                to="/"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-all duration-300"
              >
                <Home size={14} className="hidden sm:inline-block sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Home</span>
              </NavLink>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-all duration-300 text-white/80 hover:text-cyan-200 hover:bg-cyan-700/20"
                type="button"
              >
                <Search size={14} className="hidden sm:inline-block sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Search</span>
              </button>

              <NavLink
                to="/explore"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-all duration-300"
              >
                <Compass size={14} className="hidden sm:inline-block sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>Explore</span>
              </NavLink>

              {user && (
                <NavLink
                  to="/watchlist"
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-all duration-300"
                >
                  <Bookmark size={14} className="hidden sm:inline-block sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span>Watchlist</span>
                </NavLink>
              )}
            </div>

            {/* User / Auth Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <div className="relative">
                  <div
                    onClick={() => setShowProfilebanner(!showProfilebanner)}
                    className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-purple-900 text-white font-semibold text-sm sm:text-lg cursor-pointer shadow-lg border border-white/10 transition-all duration-300 hover:bg-purple-700 hover:scale-105 hover:border-cyan-400"
                  >
                    {Array.isArray(user) ? (
                      user.map((u, i) => (
                        <span key={i}>{u?.username?.[0]?.toUpperCase() || "?"}</span>
                      ))
                    ) : (
                      <>{user?.username?.[0]?.toUpperCase() || "?"}</>
                    )}
                  </div>
                  {showProfilebanner && (
                    <div className="absolute right-0 mt-3 z-50">
                      <Profilebanner user={user} logout={logout} />
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="px-3 sm:px-3 md:px-4 py-2 sm:py-2 rounded-full border border-cyan-400/30 hover:border-cyan-400 hover:bg-gradient-to-r hover:from-cyan-700/20 hover:to-blue-700/20 transition-all duration-300 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-white/80 hover:text-white"
                  noSlider={true}
                >
                  <User size={14} className="sm:w-4 hidden sm:inline-block sm:h-4 md:w-5 md:h-5" />
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
