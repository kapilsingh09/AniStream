import React from 'react'

const Community = () => {
  return (
    <div>
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Users className="text-pink-400" /> Community Hub
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Polls */}
            <div className="bg-gray-900 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="text-pink-400" />
                Weekly Poll
              </h3>
              <h4 className="text-xl font-semibold mb-4">Best Anime Opening of 2024?</h4>
              <div className="space-y-3">
                {["Demon Slayer OP", "Frieren OP", "Solo Leveling OP", "JJK OP"].map((option, idx) => (
                  <div key={idx} className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 cursor-pointer transition-colors">
                    <div className="flex justify-between items-center">
                      <span>{option}</span>
                      <span className="text-pink-400 font-bold">{35 - idx * 8}%</span>
                    </div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2">
                      <div className={`bg-pink-500 h-2 rounded-full`} style={{width: `${35 - idx * 8}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-gray-900 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="text-yellow-400" />
                Recent Reviews
              </h3>
              <div className="space-y-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                      <span className="font-semibold">User{idx + 1}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">Amazing animation and story! Definitely recommend...</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default Community
