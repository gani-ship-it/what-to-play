from datetime import datetime
from sqlalchemy import Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class PlayerHistory(Base):
    """
    Immutable observation of concurrent active players on Steam at a specific point in time.
    Used to plot 24h/7d activity trend curves and calculate peak concurrent players.
    """
    __tablename__ = "player_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    game_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("games.id", ondelete="CASCADE"), nullable=False, index=True
    )
    player_count: Mapped[int] = mapped_column(Integer, nullable=False)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=func.now(), server_default=func.now(), nullable=False, index=True
    )

    game: Mapped["app.models.game.Game"] = relationship("app.models.game.Game", back_populates="player_history")
