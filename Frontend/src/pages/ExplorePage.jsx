import React from 'react'

const fakeAnimeList = [
  {
    id: 1,
    title: 'Naruto',
    image: 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg',
  },
  {
    id: 2,
    title: 'One Piece',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/2c/OnePiece62Cover.png',
  },
  {
    id: 3,
    title: 'Attack on Titan',
    image: 'https://upload.wikimedia.org/wikipedia/en/7/70/Attack_on_Titan_volume_1_cover.jpg',
  },
  {
    id: 4,
    title: 'Jujutsu Kaisen',
    image: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Jujutsu_kaisen.jpg',
  },
  {
    id: 5,
    title: 'Demon Slayer',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Kimetsu_no_Yaiba_vol_1_cover.jpg',
  },
]

const ExplorePage = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Anime</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {fakeAnimeList.map(anime => (
          <div
            key={anime.id}
            className="bg-zinc-800 rounded-lg overflow-hidden shadow hover:shadow-xl transition duration-300"
          >
            <img
              src={anime.image}
              alt={anime.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-3 text-center">
              <h2 className="text-lg font-semibold">{anime.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExplorePage
