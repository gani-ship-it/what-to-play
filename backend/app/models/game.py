from typing import List, Optional, Dict, Any
from sqlalchemy import (
    String,
    Text,
    Float,
    Integer,
    Boolean,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Game(Base, TimestampMixin):
    """
    Primary Game Entity storing core normalized metadata across storefronts and APIs.
    """
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    release_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    metacritic: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Cross-platform foreign mapping IDs
    rawg_id: Mapped[Optional[int]] = mapped_column(Integer, unique=True, index=True, nullable=True)
    steam_appid: Mapped[Optional[int]] = mapped_column(Integer, unique=True, index=True, nullable=True)
    cheapshark_id: Mapped[Optional[str]] = mapped_column(String(64), unique=True, index=True, nullable=True)

    # Media assets
    cover_image: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    background_image: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    # Metadata collections (stored as JSON arrays for flexible querying and normalization)
    genres: Mapped[List[str]] = mapped_column(JSON, default=list)
    platforms: Mapped[List[str]] = mapped_column(JSON, default=list)
    developers: Mapped[List[str]] = mapped_column(JSON, default=list)
    publishers: Mapped[List[str]] = mapped_column(JSON, default=list)

    # System specs { "minimum": "...", "recommended": "..." }
    pc_requirements: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, default=dict)

    # Anticipation & Popularity indicators
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_anticipated: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # Relationships
    screenshots: Mapped[List["GameScreenshot"]] = relationship(
        "GameScreenshot",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    trailers: Mapped[List["GameTrailer"]] = relationship(
        "GameTrailer",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    prices: Mapped[List["app.models.deal.GamePrice"]] = relationship(
        "app.models.deal.GamePrice",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    price_history: Mapped[List["app.models.deal.PriceHistory"]] = relationship(
        "app.models.deal.PriceHistory",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    player_history: Mapped[List["app.models.player_count.PlayerHistory"]] = relationship(
        "app.models.player_count.PlayerHistory",
        back_populates="game",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class GameScreenshot(Base, TimestampMixin):
    """Screenshots associated with a game."""
    __tablename__ = "game_screenshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    image_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    width: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    height: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_cover: Mapped[bool] = mapped_column(Boolean, default=False)

    game: Mapped["Game"] = relationship("Game", back_populates="screenshots")


class GameTrailer(Base, TimestampMixin):
    """Official trailer or gameplay preview videos."""
    __tablename__ = "game_trailers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), default="Official Trailer")
    video_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    preview_image: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    game: Mapped["Game"] = relationship("Game", back_populates="trailers")
