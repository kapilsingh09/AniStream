import React from "react";
import AtoZsearch from "./AtoZsearch";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* A-Z Search */}
      <AtoZsearch />

      {/* Divider */}
      <div className="border-t border-white/10 my-6"></div>

      {/* About Project */}
      <div className="max-w-5xl mx-auto text-center mt-6 mb-6 px-2 sm:px-4">
        <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed">
          Disclaimer: This is a student project — I don’t host or stream anime here.
          All anime names & info come from my local API / backend.
        </p>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 pb-6 text-center md:text-left">
        {/* Left */}
        <p className="text-xs sm:text-sm text-gray-500">
          © {new Date().getFullYear()} AniStream. Crafted with ❤️ by a student.
        </p>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <a href="#" className="hover:text-white hover:underline transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white hover:underline transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white hover:underline transition-colors">
            Contact
          </a>
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/kapilsingh09"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 sm:gap-2 hover:text-white transition-colors text-xs sm:text-sm"
        >
          <Github className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
