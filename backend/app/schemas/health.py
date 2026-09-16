from datetime import datetime
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    app_name: str = Field(..., example="What-To-Play API")
    version: str = Field(..., example="0.1.0")
    database: str = Field(..., example="connected")
    database_url_masked: str = Field(..., example="sqlite+aiosqlite:///./wtp.db")
    timestamp: datetime
