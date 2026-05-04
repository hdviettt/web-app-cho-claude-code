"""Endpoint cho site config (tiêu đề + màu chủ đạo).

GET /config — public, frontend gọi lúc mount để render đúng tiêu đề/màu.
PUT /config — yêu cầu cookie session admin hợp lệ (xem app/sessions.py).
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import SiteConfig
from app.sessions import require_admin

router = APIRouter(tags=["config"])


class SiteConfigResponse(BaseModel):
    site_title: str
    primary_color: str


class SiteConfigUpdate(BaseModel):
    site_title: str
    primary_color: str


@router.get("/config", response_model=SiteConfigResponse)
async def get_config(db: AsyncSession = Depends(get_db)) -> SiteConfigResponse:
    """Trả về toàn bộ config hiện tại. Public — ai gọi cũng được."""
    rows = (await db.execute(select(SiteConfig))).scalars().all()
    cfg = {row.key: row.value for row in rows}
    return SiteConfigResponse(
        site_title=cfg.get("site_title", "Web App cho Claude Code"),
        primary_color=cfg.get("primary_color", "#7c3aed"),
    )


@router.put("/config", response_model=SiteConfigResponse)
async def update_config(
    payload: SiteConfigUpdate,
    db: AsyncSession = Depends(get_db),
    _admin=Depends(require_admin),
) -> SiteConfigResponse:
    """Cập nhật config. Cần login admin."""
    for key, value in payload.model_dump().items():
        existing = await db.get(SiteConfig, key)
        if existing is not None:
            existing.value = value
        else:
            db.add(SiteConfig(key=key, value=value))
    await db.commit()
    return SiteConfigResponse(**payload.model_dump())
