// src/utils/SorryCard.jsx

import React from 'react';

const SorryCard = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent overflow-x-hidden bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-zinc-800 text-white rounded-2xl p-6 w-[90%] max-w-md shadow-2xl">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-white text-xl hover:text-red-400"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">We're sorry!</h2>
        <p className="text-sm mb-6 text-center">
          This anime is currently unavailable due to licensing restrictions or content issues.
          We apologize for the inconvenience and appreciate your understanding.
        </p>

        <div className="flex justify-center">
          <button
            className="bg-white text-zinc-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-300"
            onClick={onClose}
          >
            Dismiss
          </button>
        </div>
      </div>
    </>
  );
};

export default SorryCard;
