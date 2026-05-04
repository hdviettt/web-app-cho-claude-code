"""Endpoint kiểm tra server còn sống — Railway ping cái này để biết khi nào restart."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
