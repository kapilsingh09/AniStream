import React from 'react'

const SectionPage = () => {
  return (
    <div>
        <section className="space-y-6">
          <h2 className="text-4xl font-bold flex items-center gap-3">
            <Grid className="text-blue-400" /> Explore by Genre
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {genres.map((genre, idx) => (
              <div
                key={idx}
                className={`${genre.color} rounded-3xl p-6 hover:scale-105 transition-transform cursor-pointer relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">{genre.name}</h3>
                  <p className="text-white/80">{genre.count} titles</p>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  )
}

export default Section
