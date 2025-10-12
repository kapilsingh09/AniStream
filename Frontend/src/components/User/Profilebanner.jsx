import React from "react";
import {
  Heart,
  Film,
  Clock,
  Settings,
  LogOut,
  Mail,
  ListTodo,
  Bell,
  User as UserIcon,
} from "lucide-react";

// ✅ Default avatar fallback with gradient
const DefaultNameBanner = ({ user }) => {
  const initial =
    user && user.name && user.name.trim() !== ""
      ? user.name.charAt(0).toUpperCase()
      : "?";

  return (
    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-2 border-white/30 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl">
      {initial}
    </div>
  );
};

// ✅ Main Profile Banner Component
const Profilebanner = ({ user }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-gray-100 rounded-3xl shadow-2xl border border-white/10 p-5 sm:p-6 flex flex-col items-center gap-4 sm:gap-5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-cyan-500/10">
      
      {/* 🔔 Top row buttons (Notifications + Profile) */}
      <div className="w-full flex justify-end gap-3 mb-2">
        <button
          className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 border border-transparent hover:border-cyan-400/30 transition-all duration-300 text-gray-300 hover:text-cyan-300"
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <button
          className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 border border-transparent hover:border-purple-400/30 transition-all duration-300 text-gray-300 hover:text-purple-300"
          title="Profile"
        >
          <UserIcon size={18} />
        </button>
      </div>

      {/* 🖼 Avatar or Default Initial */}
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user?.name || "User avatar"}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-cyan-400 shadow-xl"
        />
      ) : (
        <DefaultNameBanner user={user} />
      )}

      {/* 👤 User Info */}
      <div className="text-center w-full px-2">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {user?.name?.trim() || "Unknown User"}
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">
          <Mail size={14} className="text-cyan-400" />
          <span className="truncate max-w-[200px]">
            {user?.email || "xyz@gmail.com"}
          </span>
        </div>
      </div>

      {/* 🔘 Action Buttons */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <button className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-cyan-400/30">
          <Heart size={18} className="group-hover:text-pink-400 transition-all" />
          <span className="text-sm sm:text-base">Favourites</span>
        </button>

        <button className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-purple-400/30">
          <ListTodo size={18} className="group-hover:text-purple-400 transition-all" />
          <span className="text-sm sm:text-base">Watchlist</span>
        </button>

        <button className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-blue-400/30">
          <Clock size={18} className="group-hover:text-blue-400 transition-all" />
          <span className="text-sm sm:text-base">Continue Watching</span>
        </button>

        <button className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-gray-500/20 transition-all duration-300 text-gray-300 hover:text-white border border-transparent hover:border-gray-400/30">
          <Settings size={18} className="group-hover:text-gray-300 transition-all" />
          <span className="text-sm sm:text-base">Settings</span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent my-1" />

      {/* 🚪 Logout Button */}
      <button className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold hover:from-red-500 hover:to-pink-500 hover:shadow-lg transition-all duration-300">
        <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
        <span className="text-sm sm:text-base">Logout</span>
      </button>
    </div>
  );
};

export default Profilebanner;
