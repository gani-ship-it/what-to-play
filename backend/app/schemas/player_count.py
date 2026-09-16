from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class PlayerCountPoint(BaseModel):
    recorded_at: datetime
    player_count: int

    class Config:
        from_attributes = True


class GamePlayerStatsResponse(BaseModel):
    game_id: int
    slug: str
    title: str
    steam_appid: Optional[int] = None
    current_players: int = 0
    peak_24h: int = 0
    all_time_peak: int = 0
    last_updated: datetime
    history: List[PlayerCountPoint] = Field(default_factory=list)

    class Config:
        from_attributes = True
