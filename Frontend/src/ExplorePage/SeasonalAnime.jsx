import React from 'react'

const SeasonalAnime = () => {
  return (
    <div>
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Calendar className="text-purple-400" /> Seasonal Anime
          </h2>
          <div className="flex gap-4 mb-6">
            {seasons.map((season) => (
              <button key={season} className="px-6 py-3 bg-gray-800 hover:bg-purple-600 rounded-xl transition-colors">
                {season}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <img src={`/images/seasonal${idx + 1}.jpg`} alt="Seasonal Anime" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2">Seasonal Anime #{idx + 1}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Eye size={12} />
                    <span>2.3M</span>
                    <ThumbsUp size={12} />
                    <span>98%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  )
}

export default SeasonalAnime
