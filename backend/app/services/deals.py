import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import httpx
from sqlalchemy import select, func, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.deal import Store, GamePrice, PriceHistory
from app.models.game import Game
from app.schemas.deal import (
    StoreSchema,
    GamePriceSchema,
    PriceHistoryPoint,
    HistoricalLowSchema,
    GamePriceHistoryResponse,
    DealSummarySchema,
    DealListResponse,
)

logger = logging.getLogger(__name__)

# Standard legitimate PC digital storefronts
DEFAULT_STORES: List[Dict[str, Any]] = [
    {
        "name": "Steam",
        "slug": "steam",
        "cheapshark_store_id": "1",
        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    },
    {
        "name": "Epic Games Store",
        "slug": "epic-games",
        "cheapshark_store_id": "25",
        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg",
    },
    {
        "name": "GOG",
        "slug": "gog",
        "cheapshark_store_id": "7",
        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/GOG.com_logo.svg",
    },
    {
        "name": "Humble Store",
        "slug": "humble-store",
        "cheapshark_store_id": "11",
        "icon_url": "https://upload.wikimedia.org/wikipedia/commons/3/38/Humble_Bundle_logo.svg",
    },
    {
        "name": "Fanatical",
        "slug": "fanatical",
        "cheapshark_store_id": "15",
        "icon_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80",
    },
    {
        "name": "GreenManGaming",
        "slug": "greenmangaming",
        "cheapshark_store_id": "2",
        "icon_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80",
    },
]

# Baseline price records for catalog games (INR and USD)
GAME_DEAL_BLUEPRINTS: Dict[str, Dict[str, Any]] = {
    "cyberpunk-2077": {
        "INR": {
            "original": 2999.0,
            "stores": [
                {"store_slug": "steam", "price": 1049.0, "discount": 65.0, "url": "https://store.steampowered.com/app/1091500"},
                {"store_slug": "gog", "price": 1199.0, "discount": 60.0, "url": "https://www.gog.com/game/cyberpunk_2077"},
                {"store_slug": "epic-games", "price": 1049.0, "discount": 65.0, "url": "https://store.epicgames.com/p/cyberpunk-2077"},
            ],
            "history": [
                {"months_ago": 6, "price": 2999.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 4, "price": 2099.0, "discount": 30.0, "store_slug": "steam"},
                {"months_ago": 2, "price": 1499.0, "discount": 50.0, "store_slug": "steam"},
                {"months_ago": 1, "price": 2999.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 1049.0, "discount": 65.0, "store_slug": "steam"},
            ]
        },
        "USD": {
            "original": 59.99,
            "stores": [
                {"store_slug": "steam", "price": 20.99, "discount": 65.0, "url": "https://store.steampowered.com/app/1091500"},
                {"store_slug": "gog", "price": 23.99, "discount": 60.0, "url": "https://www.gog.com/game/cyberpunk_2077"},
                {"store_slug": "epic-games", "price": 20.99, "discount": 65.0, "url": "https://store.epicgames.com/p/cyberpunk-2077"},
            ],
            "history": [
                {"months_ago": 6, "price": 59.99, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 4, "price": 41.99, "discount": 30.0, "store_slug": "steam"},
                {"months_ago": 2, "price": 29.99, "discount": 50.0, "store_slug": "steam"},
                {"months_ago": 1, "price": 59.99, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 20.99, "discount": 65.0, "store_slug": "steam"},
            ]
        }
    },
    "elden-ring": {
        "INR": {
            "original": 3599.0,
            "stores": [
                {"store_slug": "steam", "price": 2159.0, "discount": 40.0, "url": "https://store.steampowered.com/app/1245620"},
                {"store_slug": "humble-store", "price": 2399.0, "discount": 33.0, "url": "https://www.humblebundle.com/store/elden-ring"},
            ],
            "history": [
                {"months_ago": 6, "price": 3599.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 3, "price": 2399.0, "discount": 33.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 2159.0, "discount": 40.0, "store_slug": "steam"},
            ]
        },
        "USD": {
            "original": 59.99,
            "stores": [
                {"store_slug": "steam", "price": 35.99, "discount": 40.0, "url": "https://store.steampowered.com/app/1245620"},
                {"store_slug": "humble-store", "price": 39.99, "discount": 33.0, "url": "https://www.humblebundle.com/store/elden-ring"},
            ],
            "history": [
                {"months_ago": 6, "price": 59.99, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 3, "price": 39.99, "discount": 33.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 35.99, "discount": 40.0, "store_slug": "steam"},
            ]
        }
    },
    "baldurs-gate-3": {
        "INR": {
            "original": 2999.0,
            "stores": [
                {"store_slug": "steam", "price": 2399.0, "discount": 20.0, "url": "https://store.steampowered.com/app/1086940"},
                {"store_slug": "gog", "price": 2399.0, "discount": 20.0, "url": "https://www.gog.com/game/baldurs_gate_iii"},
            ],
            "history": [
                {"months_ago": 5, "price": 2999.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 2, "price": 2549.0, "discount": 15.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 2399.0, "discount": 20.0, "store_slug": "steam"},
            ]
        },
        "USD": {
            "original": 59.99,
            "stores": [
                {"store_slug": "steam", "price": 47.99, "discount": 20.0, "url": "https://store.steampowered.com/app/1086940"},
                {"store_slug": "gog", "price": 47.99, "discount": 20.0, "url": "https://www.gog.com/game/baldurs_gate_iii"},
            ],
            "history": [
                {"months_ago": 5, "price": 59.99, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 2, "price": 50.99, "discount": 15.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 47.99, "discount": 20.0, "store_slug": "steam"},
            ]
        }
    },
    "the-witcher-3-wild-hunt": {
        "INR": {
            "original": 1999.0,
            "stores": [
                {"store_slug": "steam", "price": 499.0, "discount": 75.0, "url": "https://store.steampowered.com/app/292030"},
                {"store_slug": "gog", "price": 499.0, "discount": 75.0, "url": "https://www.gog.com/game/the_witcher_3_wild_hunt"},
                {"store_slug": "epic-games", "price": 599.0, "discount": 70.0, "url": "https://store.epicgames.com/p/the-witcher-3-wild-hunt"},
            ],
            "history": [
                {"months_ago": 6, "price": 1999.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 4, "price": 799.0, "discount": 60.0, "store_slug": "steam"},
                {"months_ago": 2, "price": 399.0, "discount": 80.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 499.0, "discount": 75.0, "store_slug": "steam"},
            ]
        },
        "USD": {
            "original": 39.99,
            "stores": [
                {"store_slug": "steam", "price": 9.99, "discount": 75.0, "url": "https://store.steampowered.com/app/292030"},
                {"store_slug": "gog", "price": 9.99, "discount": 75.0, "url": "https://www.gog.com/game/the_witcher_3_wild_hunt"},
                {"store_slug": "epic-games", "price": 11.99, "discount": 70.0, "url": "https://store.epicgames.com/p/the-witcher-3-wild-hunt"},
            ],
            "history": [
                {"months_ago": 6, "price": 39.99, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 4, "price": 15.99, "discount": 60.0, "store_slug": "steam"},
                {"months_ago": 2, "price": 7.99, "discount": 80.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 9.99, "discount": 75.0, "store_slug": "steam"},
            ]
        }
    },
    "counter-strike-2": {
        "INR": {
            "original": 0.0,
            "stores": [
                {"store_slug": "steam", "price": 0.0, "discount": 0.0, "url": "https://store.steampowered.com/app/730"},
            ],
            "history": [
                {"months_ago": 12, "price": 0.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 0.0, "discount": 0.0, "store_slug": "steam"},
            ]
        },
        "USD": {
            "original": 0.0,
            "stores": [
                {"store_slug": "steam", "price": 0.0, "discount": 0.0, "url": "https://store.steampowered.com/app/730"},
            ],
            "history": [
                {"months_ago": 12, "price": 0.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 0.0, "discount": 0.0, "store_slug": "steam"},
            ]
        }
    },
    "hades-ii": {
        "INR": {
            "original": 1499.0,
            "stores": [
                {"store_slug": "steam", "price": 1349.0, "discount": 10.0, "url": "https://store.steampowered.com/app/1145350"},
                {"store_slug": "epic-games", "price": 1349.0, "discount": 10.0, "url": "https://store.epicgames.com/p/hades-ii"},
            ],
            "history": [
                {"months_ago": 4, "price": 1499.0, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 1349.0, "discount": 10.0, "store_slug": "steam"},
            ]
        },
        "USD": {
            "original": 29.99,
            "stores": [
                {"store_slug": "steam", "price": 26.99, "discount": 10.0, "url": "https://store.steampowered.com/app/1145350"},
                {"store_slug": "epic-games", "price": 26.99, "discount": 10.0, "url": "https://store.epicgames.com/p/hades-ii"},
            ],
            "history": [
                {"months_ago": 4, "price": 29.99, "discount": 0.0, "store_slug": "steam"},
                {"months_ago": 0, "price": 26.99, "discount": 10.0, "store_slug": "steam"},
            ]
        }
    }
}


async def seed_stores_and_deals(db: AsyncSession) -> None:
    """Ensure authorized stores, current prices, and historical records are seeded."""
    # 1. Seed Stores
    stores_result = await db.execute(select(Store))
    existing_stores = {s.slug: s for s in stores_result.scalars().all()}

    if not existing_stores:
        for s_data in DEFAULT_STORES:
            store = Store(**s_data)
            db.add(store)
            await db.flush()
            existing_stores[store.slug] = store
        await db.commit()

    # 2. Check if prices already exist
    prices_result = await db.execute(select(GamePrice.id).limit(1))
    if prices_result.scalars().first() is not None:
        return  # already seeded

    # 3. Seed prices & history for catalog games
    games_result = await db.execute(select(Game))
    games_by_slug = {g.slug: g for g in games_result.scalars().all()}

    now = datetime.now(timezone.utc)

    for game_slug, currencies in GAME_DEAL_BLUEPRINTS.items():
        game = games_by_slug.get(game_slug)
        if not game:
            continue

        for currency, data in currencies.items():
            country = "IN" if currency == "INR" else "US"
            original_price = data["original"]

            # Insert current store prices
            for store_deal in data["stores"]:
                store = existing_stores.get(store_deal["store_slug"])
                if not store:
                    continue

                gp = GamePrice(
                    game_id=game.id,
                    store_id=store.id,
                    country=country,
                    currency=currency,
                    price=store_deal["price"],
                    original_price=original_price,
                    discount_percent=store_deal["discount"],
                    deal_url=store_deal["url"],
                    recorded_at=now,
                )
                db.add(gp)

            # Insert historical price observations
            for h in data["history"]:
                store = existing_stores.get(h["store_slug"])
                if not store:
                    continue

                recorded_date = now - timedelta(days=h["months_ago"] * 30)
                ph = PriceHistory(
                    game_id=game.id,
                    store_id=store.id,
                    country=country,
                    currency=currency,
                    price=h["price"],
                    original_price=original_price,
                    discount_percent=h["discount"],
                    recorded_at=recorded_date,
                )
                db.add(ph)

    await db.commit()
    logger.info("Successfully seeded stores, current deal comparisons, and immutable price history.")


class CheapSharkClient:
    """Async Client for CheapShark API (Public, keyless)."""

    BASE_URL = "https://www.cheapshark.com/api/1.0"

    async def fetch_deals(self, page: int = 0, page_size: int = 20) -> List[Dict[str, Any]]:
        """Retrieve latest PC game deals from CheapShark."""
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(
                    f"{self.BASE_URL}/deals",
                    params={"pageNumber": page, "pageSize": page_size, "sortBy": "Deal Rating"}
                )
                if response.status_code == 200:
                    return response.json()
            except Exception as e:
                logger.error(f"Failed to fetch deals from CheapShark: {e}")
        return []
