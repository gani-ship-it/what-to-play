from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class PCRequirementsSchema(BaseModel):
    minimum: Optional[str] = None
    recommended: Optional[str] = None


class GameScreenshotSchema(BaseModel):
    id: int
    image_url: str
    width: Optional[int] = None
    height: Optional[int] = None
    is_cover: bool = False

    class Config:
        from_attributes = True


class GameTrailerSchema(BaseModel):
    id: int
    name: str
    video_url: str
    preview_image: Optional[str] = None

    class Config:
        from_attributes = True


class GameSummarySchema(BaseModel):
    id: int
    slug: str
    title: str
    release_date: Optional[str] = None
    rating: float = 0.0
    metacritic: Optional[int] = None
    steam_appid: Optional[int] = None
    cover_image: Optional[str] = None
    background_image: Optional[str] = None
    genres: List[str] = Field(default_factory=list)
    platforms: List[str] = Field(default_factory=list)
    is_popular: bool = False
    is_anticipated: bool = False

    class Config:
        from_attributes = True


class GameDetailSchema(GameSummarySchema):
    description: Optional[str] = None
    developers: List[str] = Field(default_factory=list)
    publishers: List[str] = Field(default_factory=list)
    pc_requirements: Optional[Dict[str, Any]] = None
    screenshots: List[GameScreenshotSchema] = Field(default_factory=list)
    trailers: List[GameTrailerSchema] = Field(default_factory=list)

    class Config:
        from_attributes = True


class GameListResponse(BaseModel):
    items: List[GameSummarySchema]
    total: int
    page: int
    page_size: int
    genres_available: List[str]
