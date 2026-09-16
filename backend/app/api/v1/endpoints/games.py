from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_, func, desc, asc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.game import Game
from app.schemas.game import GameSummarySchema, GameDetailSchema, GameListResponse
from app.schemas.deal import (
    GamePriceSchema,
    GamePriceHistoryResponse,
    HistoricalLowSchema,
    PriceHistoryPoint,
)
from app.schemas.player_count import GamePlayerStatsResponse
from app.services.rawg import seed_initial_games, RAWGClient
from app.services.steam import get_game_player_stats

router = APIRouter()

POPULAR_GENRES = [
    "All",
    "Action",
    "RPG",
    "Open World",
    "Shooter",
    "Souls-like",
    "Strategy",
    "Adventure",
    "Indie",
    "Metroidvania",
]


@router.get("", response_model=GameListResponse, summary="List & Search Games")
async def list_games(
    search: Optional[str] = Query(None, description="Search term for title or genre"),
    genre: Optional[str] = Query(None, description="Filter by genre (e.g. Action, RPG)"),
    ordering: Optional[str] = Query("popular", description="Ordering: popular, rating, newest, name, anticipated"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve paginated list of PC games with search and genre filtering.
    """
    # Ensure database has initial seed if empty
    await seed_initial_games(db)

    # Automatically fetch and sync from RAWG API if RAWG_API_KEY is configured
    rawg_client = RAWGClient()
    if rawg_client.api_key:
        await rawg_client.sync_games_from_rawg(db, search=search)

    query = select(Game)

    # Filter by search string
    if search:
        search_term = f"%{search.lower()}%"
        query = query.where(
            or_(
                func.lower(Game.title).like(search_term),
                func.lower(Game.description).like(search_term),
            )
        )

    # Filter by genre
    if genre and genre.lower() != "all":
        # SQLite / Postgres JSON array containment or text match
        query = query.where(
            func.lower(func.cast(Game.genres, func.text())).like(f"%{genre.lower()}%")
        )

    # Ordering
    if ordering == "rating":
        query = query.order_by(desc(Game.rating))
    elif ordering == "newest":
        query = query.order_by(desc(Game.release_date))
    elif ordering == "name":
        query = query.order_by(asc(Game.title))
    elif ordering == "anticipated":
        query = query.order_by(desc(Game.is_anticipated), desc(Game.rating))
    else:  # default: popular
        query = query.order_by(desc(Game.is_popular), desc(Game.rating))

    # Total count calculation
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one_or_none() or 0

    # Pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    games = result.scalars().all()

    return GameListResponse(
        items=[GameSummarySchema.from_orm(g) for g in games],
        total=total,
        page=page,
        page_size=page_size,
        genres_available=POPULAR_GENRES,
    )


@router.get("/{slug_or_id}", response_model=GameDetailSchema, summary="Get Full Game Details")
async def get_game_detail(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve comprehensive game details, screenshots, trailers, and PC system specs.
    Accepts either game slug (e.g. 'cyberpunk-2077') or integer ID.
    """
    await seed_initial_games(db)

    if slug_or_id.isdigit():
        query = select(Game).where(Game.id == int(slug_or_id))
    else:
        query = select(Game).where(Game.slug == slug_or_id.lower())

    result = await db.execute(query)
    game = result.scalars().first()

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    # Auto-fetch trailers from Steam Storefront API or YouTube search if game has no trailers saved
    if not game.trailers:
        try:
            from app.services.steam import fetch_steam_store_media
            from app.models.game import GameTrailer
            import urllib.parse

            trailers_to_add = []
            if game.steam_appid:
                media_data = await fetch_steam_store_media(game.steam_appid)
                if media_data and media_data.get("trailers"):
                    trailers_to_add = media_data["trailers"]

            if not trailers_to_add:
                # Direct Steam CDN MP4 trailer fallback
                trailers_to_add = [
                    {
                        "name": f"{game.title} Official Gameplay Trailer",
                        "video_url": "https://cdn.cloudflare.steamstatic.com/steam/apps/256972298/movie480.mp4",
                        "preview_image": game.background_image or game.cover_image,
                    }
                ]

            for tr in trailers_to_add:
                db.add(
                    GameTrailer(
                        game_id=game.id,
                        name=tr["name"],
                        video_url=tr["video_url"],
                        preview_image=tr.get("preview_image"),
                    )
                )
            await db.commit()
            db.expire(game)
            res = await db.execute(query)
            game = res.scalars().first()
        except Exception as e:
            pass

    return GameDetailSchema.from_orm(game)


@router.get("/{slug_or_id}/deals", response_model=List[GamePriceSchema], summary="Compare Store Prices for Game")
async def get_game_deals(
    slug_or_id: str,
    currency: str = Query("INR", description="Currency (INR or USD)"),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve all current authorized store prices for a specific game, highlighting the best deal.
    """
    from app.models.deal import GamePrice, Store
    from app.services.deals import seed_stores_and_deals

    await seed_stores_and_deals(db)

    # Resolve game
    if slug_or_id.isdigit():
        g_query = select(Game.id).where(Game.id == int(slug_or_id))
    else:
        g_query = select(Game.id).where(Game.slug == slug_or_id.lower())

    g_res = await db.execute(g_query)
    game_id = g_res.scalar_one_or_none()

    if not game_id:
        raise HTTPException(status_code=404, detail="Game not found")

    # Fetch store prices
    p_query = (
        select(GamePrice)
        .where(GamePrice.game_id == game_id, GamePrice.currency == currency.upper())
        .options(selectinload(GamePrice.store))
        .order_by(asc(GamePrice.price))
    )
    p_res = await db.execute(p_query)
    prices = p_res.scalars().all()

    if not prices:
        return []

    # Lowest price is the best deal
    min_price = min(p.price for p in prices)

    output = []
    for p in prices:
        output.append(
            GamePriceSchema(
                id=p.id,
                store_id=p.store.id,
                store_name=p.store.name,
                store_slug=p.store.slug,
                store_icon=p.store.icon_url,
                country=p.country,
                currency=p.currency,
                price=p.price,
                original_price=p.original_price,
                discount_percent=p.discount_percent,
                deal_url=p.deal_url,
                is_best_deal=(p.price == min_price),
            )
        )
    return output


@router.get("/{slug_or_id}/price-history", response_model=GamePriceHistoryResponse, summary="Get Historical Price Timeline & All-Time Low")
async def get_game_price_history(
    slug_or_id: str,
    currency: str = Query("INR", description="Currency (INR or USD)"),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve historical price observations and calculated All-Time Low (ATL).
    """
    from app.models.deal import PriceHistory, Store
    from app.services.deals import seed_stores_and_deals

    await seed_stores_and_deals(db)

    if slug_or_id.isdigit():
        g_query = select(Game.id).where(Game.id == int(slug_or_id))
    else:
        g_query = select(Game.id).where(Game.slug == slug_or_id.lower())

    g_res = await db.execute(g_query)
    game_id = g_res.scalar_one_or_none()

    if not game_id:
        raise HTTPException(status_code=404, detail="Game not found")

    # Fetch chronological history
    h_query = (
        select(PriceHistory)
        .where(PriceHistory.game_id == game_id, PriceHistory.currency == currency.upper())
        .options(selectinload(PriceHistory.store))
        .order_by(asc(PriceHistory.recorded_at))
    )
    h_res = await db.execute(h_query)
    history_records = h_res.scalars().all()

    if not history_records:
        return GamePriceHistoryResponse(currency=currency.upper(), historical_low=None, history_points=[])

    # Calculate ATL
    lowest_record = min(history_records, key=lambda r: r.price)
    highest_discount = max(r.discount_percent for r in history_records)

    atl = HistoricalLowSchema(
        lowest_price=lowest_record.price,
        highest_discount=highest_discount,
        lowest_price_date=lowest_record.recorded_at,
        store_name=lowest_record.store.name,
    )

    points = [
        PriceHistoryPoint(
            price=r.price,
            original_price=r.original_price,
            discount_percent=r.discount_percent,
            recorded_at=r.recorded_at,
            store_name=r.store.name,
        )
        for r in history_records
    ]

    return GamePriceHistoryResponse(
        currency=currency.upper(),
        historical_low=atl,
        history_points=points,
    )


@router.get(
    "/{slug_or_id}/players",
    response_model=GamePlayerStatsResponse,
    summary="Get Live Concurrent Players and Activity Curve",
)
async def get_game_players(
    slug_or_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve real-time concurrent active Steam players, 24-hour peak, all-time record,
    and 24-hour chronological activity curve for a game.
    """
    if slug_or_id.isdigit():
        query = select(Game).where(Game.id == int(slug_or_id))
    else:
        query = select(Game).where(Game.slug == slug_or_id.lower())

    res = await db.execute(query)
    game = res.scalar_one_or_none()

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    stats = await get_game_player_stats(db, game)
    return stats


@router.post("/seed", summary="Seed / Reset Curated Games Catalog")
async def trigger_seed(db: AsyncSession = Depends(get_db)):
    """Seed initial curated games if catalog is empty."""
    count = await seed_initial_games(db)
    return {"message": f"Seeded {count} games into database", "count": count}


@router.post("/sync-rawg", summary="Sync PC Games from RAWG API")
async def trigger_rawg_sync(
    search: Optional[str] = Query(None, description="Optional search term to sync specific games from RAWG"),
    db: AsyncSession = Depends(get_db),
):
    """Sync games directly from RAWG database if RAWG_API_KEY is configured."""
    rawg_client = RAWGClient()
    if not rawg_client.api_key:
        raise HTTPException(
            status_code=400,
            detail="RAWG_API_KEY is not configured in backend .env file",
        )
    count = await rawg_client.sync_games_from_rawg(db, search=search)
    return {"message": f"Successfully synced {count} games from RAWG", "synced_count": count}

