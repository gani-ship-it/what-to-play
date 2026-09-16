import logging
from typing import List, Dict, Any, Optional
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.models.game import Game, GameScreenshot, GameTrailer

logger = logging.getLogger(__name__)

CURATED_PC_GAMES: List[Dict[str, Any]] = [
    {
        "slug": "cyberpunk-2077",
        "title": "Cyberpunk 2077",
        "description": "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Upgraded with next-gen in mind and featuring free additional content, customize your character and playstyle as you take on jobs, build a reputation, and unlock upgrades.",
        "release_date": "2020-12-10",
        "rating": 4.5,
        "metacritic": 86,
        "rawg_id": 41494,
        "steam_appid": 1091500,
        "cheapshark_id": "cyberpunk-2077",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        "genres": ["Action", "RPG", "Open World", "Sci-Fi"],
        "platforms": ["PC", "PlayStation 5", "Xbox Series X/S"],
        "developers": ["CD PROJEKT RED"],
        "publishers": ["CD PROJEKT RED"],
        "is_popular": True,
        "is_anticipated": False,
        "pc_requirements": {
            "minimum": "OS: 64-bit Windows 10 | Processor: Intel Core i7-6700 or AMD Ryzen 5 1600 | Memory: 12 GB RAM | Graphics: NVIDIA GeForce GTX 1060 6GB or AMD Radeon RX 580 8GB | DirectX: Version 12 | Storage: 70 GB SSD",
            "recommended": "OS: 64-bit Windows 10/11 | Processor: Intel Core i7-12700 or AMD Ryzen 7 7800X3D | Memory: 16 GB RAM | Graphics: NVIDIA GeForce RTX 2060 SUPER or AMD Radeon RX 5700 XT | DirectX: Version 12 | Storage: 70 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_e1e5509c2a688b5840d5138f2a9d7016cf736656.1920x1080.jpg",
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_752a16d507fb081a29df1432f481062b08fa176d.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "Cyberpunk 2077: Official City of Dreams Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/257081132/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"
            }
        ]
    },
    {
        "slug": "elden-ring",
        "title": "Elden Ring",
        "description": "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected.",
        "release_date": "2022-02-25",
        "rating": 4.8,
        "metacritic": 96,
        "rawg_id": 3272,
        "steam_appid": 1245620,
        "cheapshark_id": "elden-ring",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
        "genres": ["Action", "RPG", "Souls-like", "Dark Fantasy"],
        "platforms": ["PC", "PlayStation 5", "Xbox Series X/S"],
        "developers": ["FromSoftware Inc."],
        "publishers": ["Bandai Namco Entertainment"],
        "is_popular": True,
        "is_anticipated": False,
        "pc_requirements": {
            "minimum": "OS: Windows 10 | Processor: Intel Core i5-8400 or AMD Ryzen 3 3300X | Memory: 12 GB RAM | Graphics: NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB | DirectX: Version 12 | Storage: 60 GB available space",
            "recommended": "OS: Windows 10/11 | Processor: Intel Core i7-8700K or AMD Ryzen 5 3600X | Memory: 16 GB RAM | Graphics: NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX VEGA 56 8GB | DirectX: Version 12 | Storage: 60 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_4954a6efbe66d214a1c5d94711f185c8e31ef78f.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "Elden Ring Official Gameplay Reveal Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/256889456/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg"
            }
        ]
    },
    {
        "slug": "baldurs-gate-3",
        "title": "Baldur's Gate 3",
        "description": "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening inside you, drawn from a mind flayer parasite planted in your brain. Resist, and turn darkness against itself. Or embrace corruption, and become ultimate evil.",
        "release_date": "2023-08-03",
        "rating": 4.9,
        "metacritic": 96,
        "rawg_id": 3254,
        "steam_appid": 1086940,
        "cheapshark_id": "baldurs-gate-3",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
        "genres": ["RPG", "Strategy", "Turn-Based", "Fantasy"],
        "platforms": ["PC", "Mac", "PlayStation 5", "Xbox Series X/S"],
        "developers": ["Larian Studios"],
        "publishers": ["Larian Studios"],
        "is_popular": True,
        "is_anticipated": False,
        "pc_requirements": {
            "minimum": "OS: Windows 10 64-bit | Processor: Intel I5 4690 / AMD FX 8350 | Memory: 8 GB RAM | Graphics: Nvidia GTX 970 / RX 480 (4GB+ of VRAM) | DirectX: Version 11 | Storage: 150 GB available space (SSD required)",
            "recommended": "OS: Windows 10/11 64-bit | Processor: Intel i7 8700K / AMD r5 3600 | Memory: 16 GB RAM | Graphics: Nvidia 2060 Super / RX 5700 XT (8GB+ of VRAM) | DirectX: Version 11 | Storage: 150 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_50567f2b1c67d30f73f8fb7ea5a1a1f0a1c6a287.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "Baldur's Gate 3 Official Launch Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/256961600/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg"
            }
        ]
    },
    {
        "slug": "the-witcher-3-wild-hunt",
        "title": "The Witcher 3: Wild Hunt",
        "description": "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world.",
        "release_date": "2015-05-18",
        "rating": 4.9,
        "metacritic": 93,
        "rawg_id": 3328,
        "steam_appid": 292030,
        "cheapshark_id": "the-witcher-3",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
        "genres": ["RPG", "Action", "Open World", "Fantasy"],
        "platforms": ["PC", "PlayStation 5", "Xbox Series X/S"],
        "developers": ["CD PROJEKT RED"],
        "publishers": ["CD PROJEKT RED"],
        "is_popular": True,
        "is_anticipated": False,
        "pc_requirements": {
            "minimum": "OS: 64-bit Windows 7, 64-bit Windows 8 (8.1) | Processor: Intel CPU Core i5-2500K 3.3GHz / AMD A10-5800K APU (3.8GHz) | Memory: 6 GB RAM | Graphics: Nvidia GPU GeForce GTX 660 / AMD GPU Radeon HD 7870 | Storage: 50 GB available space",
            "recommended": "OS: 64-bit Windows 10/11 | Processor: Intel CPU Core i7 3770 3.4 GHz / AMD CPU AMD FX-8350 4 GHz | Memory: 8 GB RAM | Graphics: Nvidia GPU GeForce GTX 770 / AMD GPU Radeon R9 290 | Storage: 50 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_1076249339e1451f28b7e6f88ed91be1a6ae2f16.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "The Witcher 3: Wild Hunt Official Gameplay Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/256927226/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg"
            }
        ]
    },
    {
        "slug": "hollow-knight-silksong",
        "title": "Hollow Knight: Silksong",
        "description": "Discover a vast, haunted kingdom in Hollow Knight: Silksong! The sequel to the award-winning action-adventure. Explore, fight and survive as Hornet, princess-knight of Hallownest, as you ascend to the peak of a land ruled by silk and song.",
        "release_date": "2026-12-31",
        "rating": 4.9,
        "metacritic": None,
        "rawg_id": 292186,
        "steam_appid": 1030300,
        "cheapshark_id": "silksong",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg",
        "genres": ["Action", "Adventure", "Metroidvania", "Indie"],
        "platforms": ["PC", "Nintendo Switch", "PlayStation 5", "Xbox Series X/S"],
        "developers": ["Team Cherry"],
        "publishers": ["Team Cherry"],
        "is_popular": False,
        "is_anticipated": True,
        "pc_requirements": {
            "minimum": "OS: Windows 7 | Processor: Intel Core 2 Duo E5200 | Memory: 4 GB RAM | Graphics: GeForce 9800GTX+ (1GB) | DirectX: Version 10 | Storage: 9 GB available space",
            "recommended": "OS: Windows 10 | Processor: Intel Core i5 | Memory: 8 GB RAM | Graphics: GeForce GTX 560 | DirectX: Version 11 | Storage: 9 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/ss_891e4db7b8ef3a77884d5df32fa4c026e6f534ef.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "Hollow Knight: Silksong Reveal Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/257186996/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg"
            }
        ]
    },
    {
        "slug": "grand-theft-auto-vi",
        "title": "Grand Theft Auto VI",
        "description": "Grand Theft Auto VI heads to the state of Leonida, home to the neon-soaked streets of Vice City and beyond in the biggest, most immersive evolution of the Grand Theft Auto series yet.",
        "release_date": "2026-10-15",
        "rating": 5.0,
        "metacritic": None,
        "rawg_id": 999999,
        "steam_appid": None,
        "cheapshark_id": "gta-6",
        "cover_image": "https://media.rawg.io/media/games/20a/20aa2758b2913122186e0fc47307775c.jpg",
        "background_image": "https://media.rawg.io/media/games/20a/20aa2758b2913122186e0fc47307775c.jpg",
        "genres": ["Action", "Adventure", "Open World"],
        "platforms": ["PC", "PlayStation 5", "Xbox Series X/S"],
        "developers": ["Rockstar Games"],
        "publishers": ["Rockstar Games"],
        "is_popular": False,
        "is_anticipated": True,
        "pc_requirements": {
            "minimum": "OS: Windows 11 64-bit | Processor: Intel Core i7-10700K / AMD Ryzen 7 5800X | Memory: 16 GB RAM | Graphics: NVIDIA RTX 3060 12GB / AMD Radeon RX 6700 XT | DirectX: Version 12 | Storage: 150 GB NVMe SSD",
            "recommended": "OS: Windows 11 64-bit | Processor: Intel Core i7-13700K / AMD Ryzen 7 7800X3D | Memory: 32 GB RAM | Graphics: NVIDIA RTX 4080 / AMD RX 7900 XTX | DirectX: Version 12 | Storage: 150 GB NVMe SSD"
        },
        "screenshots": [
            "https://media.rawg.io/media/games/20a/20aa2758b2913122186e0fc47307775c.jpg"
        ],
        "trailers": [
            {
                "name": "Grand Theft Auto VI Official Reveal Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/256972298/movie480.mp4",
                "preview_image": "https://media.rawg.io/media/games/20a/20aa2758b2913122186e0fc47307775c.jpg"
            }
        ]
    },
    {
        "slug": "counter-strike-2",
        "title": "Counter-Strike 2",
        "description": "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. And now the next chapter in the CS story is about to begin. This is Counter-Strike 2. Free to Play.",
        "release_date": "2023-09-27",
        "rating": 4.3,
        "metacritic": 82,
        "rawg_id": 890457,
        "steam_appid": 730,
        "cheapshark_id": "cs2",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg",
        "genres": ["Shooter", "Action", "Free to Play", "Tactical"],
        "platforms": ["PC", "Linux"],
        "developers": ["Valve"],
        "publishers": ["Valve"],
        "is_popular": True,
        "is_anticipated": False,
        "pc_requirements": {
            "minimum": "OS: Windows 10 | Processor: 4 hardware CPU threads - Intel® Core™ i5 750 or higher | Memory: 8 GB RAM | Graphics: Video card must be 1 GB or more and should be a DirectX 11-compatible with support for Shader Model 5.0 | Storage: 85 GB available space",
            "recommended": "OS: Windows 10/11 | Processor: Intel® Core™ i7-9700K or AMD Ryzen 5 5600X | Memory: 16 GB RAM | Graphics: NVIDIA GeForce RTX 2060 or AMD Radeon RX 6600 | Storage: 85 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/730/ss_d196d95bc969796e62551065e0b6d2146f28e202.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "Counter-Strike 2 Official Announcement Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/256972298/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg"
            }
        ]
    },
    {
        "slug": "hades-ii",
        "title": "Hades II",
        "description": "Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler. As Melinoë, the immortal Princess of the Underworld, you'll explore a bigger, deeper mythic world.",
        "release_date": "2024-05-06",
        "rating": 4.9,
        "metacritic": 91,
        "rawg_id": 891820,
        "steam_appid": 1145350,
        "cheapshark_id": "hades-2",
        "cover_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/library_600x900.jpg",
        "background_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/header.jpg",
        "genres": ["Action", "Rogue-like", "Indie", "RPG"],
        "platforms": ["PC"],
        "developers": ["Supergiant Games"],
        "publishers": ["Supergiant Games"],
        "is_popular": True,
        "is_anticipated": False,
        "pc_requirements": {
            "minimum": "OS: Windows 10 64-bit | Processor: Dual Core 2.4 GHz | Memory: 8 GB RAM | Graphics: GeForce GTX 950, Radeon R7 360, or Intel HD Graphics 630 | Storage: 10 GB available space",
            "recommended": "OS: Windows 10/11 64-bit | Processor: Quad Core 2.4 GHz | Memory: 16 GB RAM | Graphics: GeForce RTX 2060, Radeon RX 5600 XT | Storage: 10 GB SSD"
        },
        "screenshots": [
            "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/ss_2c0d5b51b3c9bc9e5262788e0ecbe2a8aeb272a8.1920x1080.jpg"
        ],
        "trailers": [
            {
                "name": "Hades II Official Launch Trailer",
                "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/257204779/movie480.mp4",
                "preview_image": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/header.jpg"
            }
        ]
    }
]


async def seed_initial_games(db: AsyncSession) -> int:
    """Seeds the database with curated PC titles if the database is currently empty."""
    result = await db.execute(select(Game.id).limit(1))
    if result.scalars().first() is not None:
        return 0

    added_count = 0
    for g_data in CURATED_PC_GAMES:
        screenshots_data = g_data.pop("screenshots", [])
        trailers_data = g_data.pop("trailers", [])

        game = Game(**g_data)
        db.add(game)
        await db.flush()  # obtain game.id

        for idx, shot_url in enumerate(screenshots_data):
            shot = GameScreenshot(
                game_id=game.id,
                image_url=shot_url,
                is_cover=(idx == 0),
            )
            db.add(shot)

        for trailer in trailers_data:
            tr = GameTrailer(
                game_id=game.id,
                name=trailer["name"],
                video_url=trailer["video_url"],
                preview_image=trailer.get("preview_image"),
            )
            db.add(tr)

        added_count += 1

    await db.commit()
    logger.info(f"Seeded {added_count} curated PC games into database.")
    return added_count


class RAWGClient:
    """Client for querying the RAWG API and normalizing video game metadata."""

    BASE_URL = "https://api.rawg.io/api"

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.RAWG_API_KEY

    async def fetch_games(self, search: Optional[str] = None, page_size: int = 20) -> List[Dict[str, Any]]:
        """Fetch games from RAWG API if API key is provided."""
        if not self.api_key:
            return []

        params = {
            "key": self.api_key,
            "page_size": page_size,
            "platforms": "4",  # 4 = PC platform ID in RAWG
        }
        if search:
            params["search"] = search

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(f"{self.BASE_URL}/games", params=params)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("results", [])
            except Exception as e:
                logger.error(f"Failed to fetch games from RAWG: {e}")
        return []

    async def fetch_game_detail(self, rawg_id: int) -> Optional[Dict[str, Any]]:
        """Fetch specific game details from RAWG API."""
        if not self.api_key:
            return None

        params = {"key": self.api_key}
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(f"{self.BASE_URL}/games/{rawg_id}", params=params)
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                logger.error(f"Failed to fetch game details from RAWG for {rawg_id}: {e}")
        return None

    async def sync_games_from_rawg(self, db: AsyncSession, search: Optional[str] = None) -> int:
        """
        Queries RAWG API and upserts returned games into the local database.
        """
        if not self.api_key:
            return 0

        rawg_results = await self.fetch_games(search=search, page_size=20)
        if not rawg_results:
            return 0

        synced_count = 0
        for item in rawg_results:
            rawg_id = item.get("id")
            slug = item.get("slug")
            if not slug or not rawg_id:
                continue

            # Check if game already exists
            stmt = select(Game).where((Game.rawg_id == rawg_id) | (Game.slug == slug))
            existing_res = await db.execute(stmt)
            existing_game = existing_res.scalars().first()

            genres = [g.get("name") for g in item.get("genres", []) if g.get("name")]
            platforms = [p.get("platform", {}).get("name") for p in item.get("platforms", []) if p.get("platform", {}).get("name")]
            background_img = item.get("background_image")
            rating = float(item.get("rating") or 0.0)
            metacritic = item.get("metacritic")
            released = item.get("released")

            if existing_game:
                # Update existing game details
                existing_game.rating = rating or existing_game.rating
                if metacritic:
                    existing_game.metacritic = metacritic
                if background_img and not existing_game.background_image:
                    existing_game.background_image = background_img
                if genres and not existing_game.genres:
                    existing_game.genres = genres
            else:
                # Create new game from RAWG
                new_game = Game(
                    slug=slug,
                    title=item.get("name") or slug.replace("-", " ").title(),
                    description=f"{item.get('name')} - Discovered via RAWG Database.",
                    release_date=released,
                    rating=rating,
                    metacritic=metacritic,
                    rawg_id=rawg_id,
                    cover_image=background_img,
                    background_image=background_img,
                    genres=genres if genres else ["Action", "PC"],
                    platforms=platforms if platforms else ["PC"],
                    is_popular=rating >= 4.0,
                    is_anticipated=False,
                )
                db.add(new_game)
                await db.flush()

                # Add screenshots
                screenshots = item.get("short_screenshots", [])
                for idx, s in enumerate(screenshots):
                    img_url = s.get("image")
                    if img_url:
                        db.add(
                            GameScreenshot(
                                game_id=new_game.id,
                                image_url=img_url,
                                is_cover=(idx == 0),
                            )
                        )

                synced_count += 1

        await db.commit()
        if synced_count > 0:
            logger.info(f"Successfully synced {synced_count} new games from RAWG API.")
        return synced_count

