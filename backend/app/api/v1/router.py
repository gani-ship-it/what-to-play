from typing import List
from fastapi import APIRouter
from app.api.v1.endpoints import health, games, deals
from app.schemas.deal import StoreSchema

api_router = APIRouter()

# Register endpoint routers
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(games.router, prefix="/games", tags=["Games"])
api_router.include_router(deals.router, prefix="/deals", tags=["Deals"])

# Alias /stores endpoint
api_router.add_api_route(
    "/stores",
    deals.list_stores,
    methods=["GET"],
    tags=["Stores"],
    response_model=List[StoreSchema],
    summary="List Authorized PC Game Stores",
)
