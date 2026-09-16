from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Service & Database Health Status")
async def check_health(db: AsyncSession = Depends(get_db)):
    """
    Check the operational status of the What-To-Play API service and its database connection.
    Executes a SELECT 1 ping against the database.
    """
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"error: {str(exc)}"

    # Mask database URL to not leak credentials if using PostgreSQL with passwords
    raw_url = settings.DATABASE_URL
    if "@" in raw_url:
        protocol_and_creds, host_part = raw_url.split("@", 1)
        masked_url = f"{protocol_and_creds.split('://')[0]}://***:***@{host_part}"
    else:
        masked_url = raw_url

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        database=db_status,
        database_url_masked=masked_url,
        timestamp=datetime.now(timezone.utc),
    )
