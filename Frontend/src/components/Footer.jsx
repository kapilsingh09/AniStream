// Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} MySite. All rights reserved.</p>

        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/privacy" className="hover:text-white text-sm">Privacy</a>
          <a href="/terms" className="hover:text-white text-sm">Terms</a>
          <a href="/contact" className="hover:text-white text-sm">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
