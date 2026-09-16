from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.deal import Store, GamePrice
from app.models.game import Game
from app.schemas.deal import StoreSchema, DealSummarySchema, DealListResponse
from app.services.deals import seed_stores_and_deals

router = APIRouter()


@router.get("/stores", response_model=List[StoreSchema], summary="List Authorized PC Game Stores")
async def list_stores(db: AsyncSession = Depends(get_db)):
    """Retrieve all authorized PC digital storefronts."""
    await seed_stores_and_deals(db)
    result = await db.execute(select(Store).where(Store.is_active == True).order_by(Store.name))
    return result.scalars().all()


@router.get("", response_model=DealListResponse, summary="Browse Active Deals & Discounts")
async def list_deals(
    currency: str = Query("INR", description="Currency filter (INR or USD)"),
    store_slug: Optional[str] = Query(None, description="Filter by store slug (e.g. steam, gog, epic-games)"),
    min_discount: Optional[float] = Query(None, ge=0, le=100, description="Minimum discount percentage"),
    ordering: str = Query("discount", description="Sort by: discount, price_low, price_high"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieve paginated active deals across all legitimate storefronts with regional currency awareness.
    """
    await seed_stores_and_deals(db)

    # Join GamePrice, Game, and Store
    query = (
        select(GamePrice)
        .join(Game, GamePrice.game_id == Game.id)
        .join(Store, GamePrice.store_id == Store.id)
        .where(GamePrice.currency == currency.upper())
        .options(selectinload(GamePrice.game), selectinload(GamePrice.store))
    )

    if store_slug:
        query = query.where(Store.slug == store_slug.lower())

    if min_discount is not None:
        query = query.where(GamePrice.discount_percent >= min_discount)

    # Sort
    if ordering == "price_low":
        query = query.order_by(asc(GamePrice.price))
    elif ordering == "price_high":
        query = query.order_by(desc(GamePrice.price))
    else:  # default: discount
        query = query.order_by(desc(GamePrice.discount_percent), asc(GamePrice.price))

    # Total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one_or_none() or 0

    # Paginate
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    prices = result.scalars().all()

    items = []
    for p in prices:
        items.append(
            DealSummarySchema(
                id=p.id,
                game_id=p.game.id,
                game_slug=p.game.slug,
                game_title=p.game.title,
                cover_image=p.game.cover_image or p.game.background_image,
                genres=p.game.genres or [],
                store_name=p.store.name,
                store_slug=p.store.slug,
                store_icon=p.store.icon_url,
                country=p.country,
                currency=p.currency,
                price=p.price,
                original_price=p.original_price,
                discount_percent=p.discount_percent,
                deal_url=p.deal_url,
                is_free=(p.price == 0.0),
            )
        )

    return DealListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        currency=currency.upper(),
    )
