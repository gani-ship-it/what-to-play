from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class StoreSchema(BaseModel):
    id: int
    name: str
    slug: str
    icon_url: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True


class GamePriceSchema(BaseModel):
    id: int
    store_id: int
    store_name: str
    store_slug: str
    store_icon: Optional[str] = None
    country: str
    currency: str
    price: float
    original_price: float
    discount_percent: float
    deal_url: str
    is_best_deal: bool = False

    class Config:
        from_attributes = True


class PriceHistoryPoint(BaseModel):
    price: float
    original_price: float
    discount_percent: float
    recorded_at: datetime
    store_name: str

    class Config:
        from_attributes = True


class HistoricalLowSchema(BaseModel):
    lowest_price: float
    highest_discount: float
    lowest_price_date: datetime
    store_name: str


class GamePriceHistoryResponse(BaseModel):
    currency: str
    historical_low: Optional[HistoricalLowSchema] = None
    history_points: List[PriceHistoryPoint] = Field(default_factory=list)


class DealSummarySchema(BaseModel):
    id: int
    game_id: int
    game_slug: str
    game_title: str
    cover_image: Optional[str] = None
    genres: List[str] = Field(default_factory=list)
    store_name: str
    store_slug: str
    store_icon: Optional[str] = None
    country: str
    currency: str
    price: float
    original_price: float
    discount_percent: float
    deal_url: str
    is_free: bool = False

    class Config:
        from_attributes = True


class DealListResponse(BaseModel):
    items: List[DealSummarySchema]
    total: int
    page: int
    page_size: int
    currency: str
