import React, { useState, useEffect } from "react";
import loginvd from "../assets/WhatsApp Video 2025-07-14 at 11.35.32_30acb6f6.mp4";
import { useNavigate } from "react-router-dom";
const Login = ({ onloginClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate();
  const animeQuotes = [
    { text: "Believe in yourself and create your own destiny!", anime: "Naruto" },
    { text: "The world is not perfect, but it's there for us trying the best we can.", anime: "Fullmetal Alchemist" },
    { text: "Even if we forget the faces of our friends, we will never forget the bonds that were carved into our souls.", anime: "Sword Art Online" },
    { text: "Power comes in response to a need, not a desire.", anime: "Dragon Ball Z" },
    { text: "I want to be the very best, like no one ever was!", anime: "Pokémon" },
    { text: "The only way to truly escape the mundane is for you to constantly be evolving.", anime: "Tokyo Ghoul" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % animeQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleNavigate = () => {
    navigate('/register');
    onloginClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Login successful!");
        setTimeout(() => {
          if (onloginClose) onloginClose(true);
        }, 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      // Fallback for demo mode
      setMessage("✅ Welcome to AniStream! (Demo mode)");
      setTimeout(() => {
        if (onloginClose) onloginClose(true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-sans">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={loginvd} type="video/mp4" />
        </video>

        {/* Animated Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        {/* Left Panel: Anime Info */}
        <div className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 text-white max-w-md w-full">
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-white/20 space-y-8 shadow-2xl">

            {/* Logo + Tagline */}
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AniStream
              </h1>
              <p className="text-base text-gray-300 leading-relaxed">
                Dive into the ultimate anime streaming experience! Watch thousands of episodes, discover new series, and connect with fellow otaku worldwide.
              </p>
            </div>

            {/* Quote Box */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm italic text-purple-200 mb-1 transition-opacity duration-500 ease-in-out">
                "{animeQuotes[currentQuote].text}"
              </p>
              <p className="text-xs text-pink-300 text-right">
                — {animeQuotes[currentQuote].anime}
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center bg-white/5 p-3 rounded-xl border border-white/10 space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
                <span className="text-sm text-white/80">HD Quality Streaming</span>
              </div>
              <div className="flex items-center bg-white/5 p-3 rounded-xl border border-white/10 space-x-3">
                <div className="w-3 h-3 bg-pink-400 rounded-full" />
                <span className="text-sm text-white/80">Subtitles & Dubbing</span>
              </div>
              <div className="flex items-center bg-white/5 p-3 rounded-xl border border-white/10 space-x-3 sm:col-span-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
                <span className="text-sm text-white/80">Exclusive Content</span>
              </div>
            </div>

            {/* Optional: Social proof / Community count */}
            <div className="text-xs text-gray-400 text-center pt-4 border-t border-white/10">
              Join 2M+ anime fans worldwide 🌏
            </div>
          </div>
        </div>


        {/* Right Panel: Login Form */}
        <div className="w-full max-w-md mx-auto lg:ml-auto lg:mr-16">
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl relative">
            {/* Close Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => onloginClose(true)}
                aria-label="Close Login"
                className="p-2 rounded-full hover:bg-red-500/70 border border-white/30 hover:border-red-500 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>

              </button>
            </div>

            {/* Form Title */}
            <h2 className="text-3xl font-bold  mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back
            </h2>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                aria-label="Email"
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 outline-none border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                aria-label="Password"
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 outline-none border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                value={formData.password}
                onChange={handleChange}
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMessage("Password reset link sent! (Demo)")}
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors duration-300"
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25"
              >
                Enter AniStream
              </button>
            </form>

            {/* Feedback Message */}
            {message && (
              <p className="text-center text-sm text-red-300 mt-4 bg-red-900/20 backdrop-blur-sm rounded-lg p-3 border border-red-500/30">
                {message}
              </p>
            )}

            {/* Registration Link */}
            <p className="mt-6 text-center text-sm text-white/80">
              New to AniStream?{" "}
              <button
                onClick={handleNavigate}
                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300"
              >
                Join the Community
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Trending Section */}
      {/* <div className="absolute bottom-8 left-8 right-8 lg:left-auto lg:right-8 lg:w-80">
        <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Now Trending</span>
          </div>
          <p className="text-white/80 text-sm">
            Attack on Titan • Demon Slayer • Jujutsu Kaisen • One Piece • Naruto
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
