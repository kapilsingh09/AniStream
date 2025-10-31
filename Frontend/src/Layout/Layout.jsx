import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import { ArrowUp } from "lucide-react"; // install with: npm i lucide-react

const Layout = () => {
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top
  const handleUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen  text-white text-2xl">
      <Navbar />
      <main className="flex-1 relative">
        <Outlet />

        {/* Floating "Up" Button */}
        {scrolled && (
          <button
            onClick={handleUp}
            className="
              fixed bottom-8 right-8 z-50
              bg-white text-black font-semibold 
               rounded-full p-3 shadow-lg 
              hover:shadow-xl hover:scale-110 transition-all duration-300
              border border-white/20
              "
              // animate-bounce
            aria-label="Scroll to top"
          >

            <ArrowUp size={24}/>
          
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
