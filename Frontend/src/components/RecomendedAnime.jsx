import React from 'react'

const RecomendedAnime = () => {
    const recommended = [
        {
            id: 1,
            title: "Attack on Titan",
            img: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
        },
        {
            id: 2,
            title: "Demon Slayer: Kimetsu no Yaiba",
            img: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
        },
        {
            id: 3,
            title: "Jujutsu Kaisen",
            img: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
        },
        {
            id: 4,
            title: "My Hero Academia",
            img: "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
        },
        {
            id: 5,
            title: "One Piece",
            img: "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
        },
        {
            id: 6,
            title: "Fullmetal Alchemist: Brotherhood",
            img: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
        }
    ];

    return (
        <div className='w-full px-4 py-6 bg-zinc-800 text-white'>
            <h2 className="text-2xl font-bold mb-4">Recommended Anime</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {recommended.map(anime => (
                    <div
                        key={anime.id}
                        className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                    >
                        <img
                            className="w-full h-48 object-cover"
                            src={anime.img}
                            alt={anime.title}
                        />
                        <div className="p-3 text-center">
                            <h3 className="font-semibold text-sm line-clamp-2">{anime.title}</h3>
                        </div>

                        {/* Hover Details */}
                        <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm text-white transition-opacity duration-300 p-4 text-center">
                            <p>Click for more details or add to your watchlist.</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecomendedAnime;
