import React, { useContext } from 'react'
import { ApiDataContext } from '../context/ApiContext'

const RecomendedAnime = () => {
    // Use the local API data from context
    // const { localAnimeData, loading, error } = useContext(ApiDataContext);

    // // Pick a few recommended anime (e.g., first 6)
    // const recommended = Array.isArray(localAnimeData) ? localAnimeData.slice(0, 6) : [];

    // if (loading) {
    //     return (
    //         <div className="h-[50vh] w-full flex items-center justify-center bg-zinc-800 text-white">
    //             <span className="text-xl">Loading recommendations...</span>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="h-[50vh] w-full flex items-center justify-center bg-zinc-800 text-red-400">
    //             <span className="text-xl">Failed to load recommendations.</span>
    //         </div>
    //     );
    // }

    return (
        <div className='h-full w-full'>
            <section className='h-[50vh] w-full bg-zinc-800 text-white'>
                <div className="flex gap-6 overflow-x-auto p-6 h-full">
                    {[
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
                    ].map(anime => (
                        <div
                            key={anime.id}
                            className="min-w-[180px] max-w-[200px] bg-zinc-900 rounded-xl shadow-lg flex flex-col items-center p-3"
                        >
                            <img
                                className="w-32 h-44 object-cover rounded-lg mb-2"
                                src={anime.img}
                                alt={anime.title}
                            />
                            <div className="text-center">
                                <h3 className="font-semibold text-base line-clamp-2">{anime.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default RecomendedAnime
