import React from 'react'

const UpcomingReleases = () => {
  return (
    <div>
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Clock className="text-cyan-400" /> Upcoming Releases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingAnime.map((anime, idx) => (
              <div key={idx} className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 border border-cyan-500/30">
                <h3 className="text-xl font-bold mb-3">{anime.title}</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2">
                    <Calendar size={16} className="text-cyan-400" />
                    {anime.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <Award size={16} className="text-cyan-400" />
                    {anime.studio}
                  </p>
                </div>
                <button className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl font-semibold transition-colors">
                  Add to Watchlist
                </button>
              </div>
            ))}
          </div>
        </section>
    </div>
  )
}

export default UpcomingReleases
