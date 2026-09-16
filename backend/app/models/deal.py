from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import (
    String,
    Float,
    Integer,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Store(Base, TimestampMixin):
    """
    Authorized PC storefronts (Steam, Epic Games, GOG, Humble Store, etc.)
    Strictly legitimate stores only (Rule #42).
    """
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    cheapshark_store_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    icon_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    prices: Mapped[list["GamePrice"]] = relationship("GamePrice", back_populates="store", cascade="all, delete-orphan")
    price_history: Mapped[list["PriceHistory"]] = relationship("PriceHistory", back_populates="store", cascade="all, delete-orphan")


class GamePrice(Base, TimestampMixin):
    """
    Current price observation for a game at a specific store and country/currency (Section 11).
    """
    __tablename__ = "game_prices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), index=True, nullable=False)
    store_id: Mapped[int] = mapped_column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), index=True, nullable=False)

    country: Mapped[str] = mapped_column(String(10), default="IN", index=True)
    currency: Mapped[str] = mapped_column(String(10), default="INR", index=True)

    price: Mapped[float] = mapped_column(Float, nullable=False)
    original_price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_percent: Mapped[float] = mapped_column(Float, default=0.0)

    deal_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    offer_ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    game = relationship("app.models.game.Game", back_populates="prices")
    store: Mapped["Store"] = relationship("Store", back_populates="prices", lazy="selectin")


class PriceHistory(Base):
    """
    Immutable historical price observations (Section 13).
    Old price records are NEVER overwritten.
    """
    __tablename__ = "price_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id: Mapped[int] = mapped_column(Integer, ForeignKey("games.id", ondelete="CASCADE"), index=True, nullable=False)
    store_id: Mapped[int] = mapped_column(Integer, ForeignKey("stores.id", ondelete="CASCADE"), index=True, nullable=False)

    country: Mapped[str] = mapped_column(String(10), default="IN", index=True)
    currency: Mapped[str] = mapped_column(String(10), default="INR", index=True)

    price: Mapped[float] = mapped_column(Float, nullable=False)
    original_price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_percent: Mapped[float] = mapped_column(Float, default=0.0)

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    game = relationship("app.models.game.Game", back_populates="price_history")
    store: Mapped["Store"] = relationship("Store", back_populates="price_history", lazy="selectin")
