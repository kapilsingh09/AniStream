import React from "react";
import {
  Heart,
  Clock,
  Settings,
  LogOut,
  ListTodo,
  Bell,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Default avatar fallback with gradient
const DefaultNameBanner = ({ user }) => {
  const initial =
    user && user.name && user.name.trim() !== ""
      ? user.name.charAt(0).toUpperCase()
      : "?";

  return (
    <div className="h-16 w-16 rounded-full bg-orange-950  flex items-center justify-center text-yellow-500 text-2xl font-bold shadow-lg">
      {initial}
    </div>
  );
};

const Profilebanner = ({ user, logout }) => {
  const navigate = useNavigate();

  /**
   * Navigation Handlers
   * These functions handle clicking buttons in the profile dropdown
   */
  
  // Navigate to watchlist page
  const handleWatchlistClick = () => {
    navigate('/watchlist');
  };

  // Navigate to favourites page
  const handleFavouritesClick = () => {
    navigate('/favourites');
  };

  // Navigate to profile page
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div
      className="w-[40vh] text-gray-100 bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 p-5 flex flex-col gap-4 transition-all duration-300 hover:shadow-cyan-500/10"
    //   style={{
    //     background: "rgba(23, 24, 35, 0.83)", // deep glass bg for effect (zinc-900/90)
    //     backdropFilter: "blur(32px) saturate(190%)", // ultra high blur
    //     WebkitBackdropFilter: "blur(32px) saturate(190%)", // safari support
    //     border: "1px solid rgba(255,255,255,0.06)",
    //     boxShadow: "0 8px 36px 0 rgba(36,151,233, 0.06)"
    //   }}
    >
      {/* Top Row: Avatar+Info and notifications+logout (in corner) */}
      <div className="flex justify-between items-start mt-2">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name || "User avatar"}
              className="w-14 h-14 rounded-full object-cover border border-cyan-400 shadow-lg"
            />
          ) : (
            <DefaultNameBanner user={user} />
          )}
          <div className="flex flex-col justify-center">
            <div className="flex items-start flex-col gap-1 text-xs text-gray-400 ml-1">
              <h2 className="text-lg font-base  text-white">
                {user?.username?.trim() + " " + user?.name?.trim() || "Unknown User"}
                
                {""}
                {/* {) || "Unknown User"} */}
              </h2>
              <span>{user?.email || "xyz@gmail.com"}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/30 transition-all duration-300 text-gray-300 hover:text-cyan-300 cursor-pointer "
            title="Notifications"
            type="button"
          >
            <div className="hover:animate-bounce h-full w-full">

            <Bell size={17} />
            </div>
          </button>
          {/* Logout button: minimal (icon only), no styling, very compact */}
        
        </div>
      </div>

      {/* 🔘 Action Buttons */}
      <div className="flex flex-col gap-2">
        {/* Profile Button - Navigate to profile page */}
        <button 
          onClick={handleProfileClick}
          className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-white/5 hover:bg-cyan-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-cyan-400/30 text-sm cursor-pointer" 
          type="button"
        >
          <User size={16} className="group-hover:text-pink-400 transition-all" />
          Profile
        </button>
        
        {/* Favourites Button - Navigate to favourites page */}
        <button 
          onClick={handleFavouritesClick}
          className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-white/5 hover:bg-cyan-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-cyan-400/30 text-sm cursor-pointer" 
          type="button"
        >
          <Heart size={16} className="group-hover:text-pink-400 transition-all" />
          Favourites
        </button>
        <button 
          onClick={handleWatchlistClick}
          className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-white/5 hover:bg-purple-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-purple-400/30 text-sm cursor-pointer" 
          type="button"
        >
          <ListTodo size={16} className="group-hover:text-purple-400 transition-all" />
          Watchlist
        </button>
        <button 
          className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-white/5 hover:bg-blue-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-blue-400/30 text-sm opacity-60 disabled:cursor-not-allowed" 
          type="button" 
          disabled
        >
          <Clock size={16} className="group-hover:text-blue-400 transition-all" />
          Continue
        </button>
        <button className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-white/5 hover:bg-gray-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-gray-400/30 text-sm cursor-pointer" type="button">
          <Settings size={16} className="group-hover:text-gray-300 transition-all" />
          Settings
        </button>
        {/* Designed Logout button */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mt-1 backdrop-blur-md" />
        <button
          onClick={logout}
          className="group w-full flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-red-600/10 hover:bg-red-600/30 transition-all duration-300 text-red-400 hover:text-white border border-transparent hover:border-red-500/40 text-sm cursor-pointer font-semibold shadow-sm mt-2"
          title="Logout"
          type="button"
        >
          <LogOut size={18} className="group-hover:animate-pulse transition-all" />
          Logout
        </button>
      </div>

      
      {/* Divider */}
    </div>
  );
};

export default Profilebanner;
