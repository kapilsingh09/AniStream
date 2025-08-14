
const available_data =  [
    {
        "id": "kaoru-hana-wa-rin-to-saku",
        "title": "The Fragrant Flower Blooms with Dignity",
        "original_title": "薫る花は凛と咲く",
        "synopsis": "When the intimidating Rintaro meets the open‑minded Kaoruko, the unlikely duo grows closer despite their rival high schools.",
        "type": "TV Anime",
        "status": "Ongoing",
        "episodes_aired": 2,
        "total_episodes": null,
        "start_date": "2025-07-06",
        "img": "https://media.kitsu.app/anime/49205/poster_image/2f9c5da04cea44def6cf75be21e894c2.jpg",
        "genres": [
            "Romantic Comedy",
            "Drama",
            "Shōnen",
            "High School"
        ],
        "studios": [
            "CloverWorks"
        ],
        "licensor": "Netflix",
        "cast": [
            {
                "character": "Rintaro Tsumugi",
                "voice_actor": "Yoshinori Nakayama"
            },
            {
                "character": "Kaoruko Waguri",
                "voice_actor": "Honoka Inoue"
            },
            {
                "character": "Shohei Usami",
                "voice_actor": "Kikunosuke Toya"
            },
            {
                "character": "Saku Natsusawa",
                "voice_actor": "Koki Uchiyama"
            },
            {
                "character": "Ayato Yorita",
                "voice_actor": "Hiiro Ishibashi"
            },
            {
                "character": "Subaru Hoshina",
                "voice_actor": "Aya Yamane"
            }
        ],
        "staff": {
            "director": [
                "Miyuki Kuroki",
                "Haruka Tsuzuki"
            ],
            "writer": "Rino Yamazaki",
            "character_design": [
                "Kohei Tokuoka",
                "Manami Umeshita"
            ],
            "music": "Moeki Harada"
        },
        "themes": {
            "opening": {
                "title": "Manazashi wa Hikari",
                "artist": "Tatsuya Kitani"
            },
            "ending": {
                "title": "Hare no Hi ni",
                "artist": "Reira Ushio"
            }
        },
        "streaming": {
            "netflix": {
                "release_pattern": "weekly",
                "us_start": "2025-07-06",
                "global": true
            }
        },
        "external": {
            "netflix_id": "82024665",
            "imdb_id": "tt36592690",
            "kitsu_id": "49661"
        },
        "manga": {
            "author": "Saka Mikami",
            "publisher": "Kodansha",
            "serialization": "Magazine Pocket",
            "volumes": 17,
            "status": "ongoing",
            "start_year": 2021,
            "copies_sold": "5.6 million+",
            "awards": [
                "Next Manga Award Nominee",
                "TSUTAYA Top Rank",
                "Manga Academy Recognition"
            ]
        },
        "reception": {
            "early_buzz": [
                "2.4M+ trailer views on YouTube",
                "Highly positive Reddit reactions",
                "Fanbase praises voice acting and romantic pacing"
            ],
            "ratings": {
                "kitsu_average": 82,
                "kitsu_rank": "Popular"
            }
        }
    },
    {
        "id": "tokopi-no-genzai",
        "title": "Tokopi's Original Sin",
        "original_title": "トコピの原罪",
        "synopsis": "A heartwarming yet dark story about Tokopi, a cheerful alien from the planet Happy, who comes to Earth to spread happiness. Tokopi befriends a troubled girl named Shizuka, but soon discovers the complexities and pain of human emotions as he tries to help her.",
        "type": "Manga",
        "status": "Finished", // status intentionally omitted
        "episodes_aired": null,
        "total_episodes": null,
        "start_date": "2021-12-20",
        "img":  "https://cdn.myanimelist.net/images/anime/1182/149879.jpg",
        "genres": [
            "Drama",
            "Psychological",
            "Sci-Fi"
        ],
        "studios": [],
        "licensor": "",
        "cast": [
            {
                "character": "Tokopi",
                "voice_actor": "N/A"
            },
            {
                "character": "Shizuka",
                "voice_actor": "N/A"
            }
        ],
        "staff": {
            "director": [],
            "writer": "Taiyo Matsumoto",
            "character_design": [],
            "music": ""
        },
        "themes": {
            "opening": null,
            "ending": null
        },
        "streaming": {},
        "external": {
            "kitsu_id": "148857",
            "mal_id": "145964",
            "anilist_id": "143282"
        },
        "manga": {
            "author": "Taiyo Matsumoto",
            "publisher": "Shueisha",
            "serialization": "Shonen Jump+",
            "volumes": 2,
            "status": "finished",
            "start_year": 2021,
            "copies_sold": "1.2 million+",
            "awards": [
                "Manga Taisho 2023 Nominee",
                "Next Manga Award 2022 Winner",
                "Kono Manga ga Sugoi! 2023 Top 10"
            ]
        },
        "reception": {
            "early_buzz": [
                "Praised for emotional depth and unique premise",
                "Viral on Twitter and manga forums",
                "Critically acclaimed for tackling heavy themes"
            ],
            "ratings": {
                "kitsu_average": 87,
                "kitsu_rank": "Highly Rated"
            }
        }
    }
];

// Example function to fetch and send Kitsu anime data
// async function fetchAndSendKitsuAnime(res) {
//     const response = await fetch('https://kitsu.io/api/edge/anime?page[limit]=5&sort=-popularityRank');
//     const data = await response.json();
//     const animeList = data.data.map(anime => ({
//         key: anime.id,
//         title: anime.attributes.titles.en_jp,
//         original_title: anime.attributes.titles.ja_jp,
//         synopsis: anime.attributes.synopsis,
//         type: anime.attributes.showType,
//         status: anime.attributes.status,
//         episodes_aired: anime.attributes.episodeCount,
//         start_date: anime.attributes.startDate,
//         img: anime.attributes.posterImage?.original,
//         studios: [],
//         licensor: "",
//         cast: []
//     }));
//     res.json(animeList);
// }

// app.get('/api/kitsu-anime', (req, res) => fetchAndSendKitsuAnime(res));


export default available_data;