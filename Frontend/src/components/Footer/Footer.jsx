// Footer.jsx
import React from "react";
import AtoZsearch from "./AtoZsearch";
import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-8 border-t border-white/10">
      {/* A-Z Search */}
      
      <AtoZsearch />

      {/* About Project */}

      <div className="border-t border-white/10 my-6"></div>

      <div className="max-w-5xl mx-auto text-center mt-8 mb-6 px-4">
        <p className="text-sm text-gray-400 leading-relaxed">
        Disclaimer: This is a student project — I don’t host or stream anime here.
          All anime names & info come from my local API / backend.  
        </p>
      </div>
      {/* Footer Bottom */}
      <div className="container  flex flex-col md:flex-row justify-between items-center gap-4 pb-6">
        {/* Left */}
        <p className="text-xs text-gray-500">
          
          © {new Date().getFullYear()} MySite. Crafted with ❤️ by a student.
        </p>

        {/* Center Links */}
        <div className="flex gap-4 text-sm group">
          <a href="/privacy" className="hover:text-white hover:underline transition-colors">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white transition-colors hover:underline">
            Terms
          </a>
          <a href="/contact" className="hover:text-white transition-colors hover:underline">
            Contact
          </a>
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/kapilsingh09"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
          <span className="text-sm">GitHub</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
