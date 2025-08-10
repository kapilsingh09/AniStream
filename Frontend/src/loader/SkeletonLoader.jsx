import React from 'react';

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl text-white relative overflow-hidden animate-pulse">
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Episodes List */}
        <div className="p-2 w-full lg:w-[20%] lg:min-w-[280px] bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-32 bg-white/10 rounded"></div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="h-10 bg-white/10 rounded-xl"></div>
          </div>

          {/* Episode List Items */}
          <div className="space-y-3 overflow-y-auto pr-2 h-[80vh]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 p-3 rounded space-y-2"
              >
                <div className="h-3 w-24 bg-white/10 rounded"></div>
                <div className="h-2 w-36 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Video Section */}
          <div className="flex-1 h-full">
            <div className="relative group h-[65vh]">
              <div className="bg-black h-full w-full flex items-center justify-center">
                <div className="h-[60vh] w-full bg-white/10 rounded"></div>
              </div>
            </div>

            {/* Player Bottom Controls */}
            <div className="p-3 flex flex-wrap items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-28 bg-white/10 rounded-xl"
                ></div>
              ))}
            </div>

            {/* Info and Server Options */}
            <div className="h-[17vh] flex pl-4 pr-4 items-center">
              <div className="h-full bg-slate-900 w-[65%] p-3 rounded-l-2xl flex flex-col justify-center">
                <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-24 bg-white/10 rounded mb-1"></div>
                <div className="h-2 w-48 bg-white/10 rounded"></div>
              </div>
              <div className="h-full w-full bg-black/40 rounded-r-xl p-3 flex flex-col justify-around">
                <div className="flex gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-16 bg-white/10 rounded"
                    ></div>
                  ))}
                </div>
                <div className="flex gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-16 bg-white/10 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Anime Details Panel */}
          <div className="w-full lg:w-[20%] lg:min-w-[280px] p-4 bg-slate-900 border-l border-white/10 space-y-5">
            <div className="h-[180px] w-[120px] bg-white/10 rounded-lg"></div>
            <div className="space-y-3 text-sm">
              <div className="h-4 w-40 bg-white/10 rounded"></div>
              <div className="flex gap-2">
                <div className="h-3 w-8 bg-white/10 rounded"></div>
                <div className="h-3 w-12 bg-white/10 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                  <div className="h-3 w-12 bg-white/10 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-20 bg-white/10 rounded"></div>
                  <div className="h-3 w-8 bg-white/10 rounded"></div>
                </div>
              </div>
              <div>
                <div className="h-3 w-16 bg-white/10 rounded mb-2"></div>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-12 bg-white/10 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-3 w-20 bg-white/10 rounded mb-2"></div>
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-full bg-white/10 rounded"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default SkeletonLoader;
