from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "What-To-Play API"
    APP_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Database
    # Default to SQLite for zero-friction local development without requiring local Postgres/Docker
    # Can be swapped to: postgresql+asyncpg://user:password@localhost:5432/wtp_db via .env
    DATABASE_URL: str = "sqlite+aiosqlite:///./wtp.db"

    # External APIs (Configured in subsequent phases)
    RAWG_API_KEY: str = ""
    CHEAPSHARK_BASE_URL: str = "https://www.cheapshark.com/api/1.0"
    STEAM_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""

    # Security & Auth (Phase 5)
    SECRET_KEY: str = "insecure-dev-secret-key-change-in-production-wtp-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
