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
        "cover_image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": [
            {
                "name": "Cyberpunk 2077: Phantom Liberty Official Cinematic Trailer",
                "video_url": "https://www.youtube.com/embed/s_x05hL39y8",
                "preview_image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
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
        "cover_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": [
            {
                "name": "Elden Ring Shadow of the Erdtree Official Gameplay Reveal Trailer",
                "video_url": "https://www.youtube.com/embed/qLZenOn7WUo",
                "preview_image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
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
        "cover_image": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": [
            {
                "name": "Baldur's Gate 3 Launch Trailer",
                "video_url": "https://www.youtube.com/embed/1T22wN1BIzU",
                "preview_image": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80"
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
        "cover_image": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": []
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
        "cover_image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": [
            {
                "name": "Hollow Knight: Silksong Reveal Trailer",
                "video_url": "https://www.youtube.com/embed/pFAknD_9U7c",
                "preview_image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
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
        "cover_image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": [
            {
                "name": "Grand Theft Auto VI Trailer 1",
                "video_url": "https://www.youtube.com/embed/QdBZY2fkU-0",
                "preview_image": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
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
        "cover_image": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": []
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
        "cover_image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
        "background_image": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80",
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
            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80"
        ],
        "trailers": []
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
