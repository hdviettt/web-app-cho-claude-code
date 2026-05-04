"""Endpoints đăng nhập / đăng xuất / kiểm tra session admin.

Lưu ý sư phạm: password admin được so sánh PLAINTEXT với env var.
Trong production thật nên hash bằng bcrypt/argon2 — nhưng cho buổi học
này, giữ đơn giản để student-reader đọc được trong 30 giây.
"""

import secrets

from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import AdminSession
from app.sessions import (
    SESSION_COOKIE_NAME,
    SESSION_TTL,
    admin_password,
    create_session,
    delete_session,
    require_admin,
)

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    password: str


class OkResponse(BaseModel):
    ok: bool


class MeResponse(BaseModel):
    session_id: str
    expires_at: str


@router.post("/auth/login", response_model=OkResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db),
) -> OkResponse:
    """Đúng password → tạo session + set cookie. Sai → 401."""
    if not secrets.compare_digest(payload.password, admin_password()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai mật khẩu"
        )
    token, _ = await create_session(db)
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=int(SESSION_TTL.total_seconds()),
    )
    return OkResponse(ok=True)


@router.post("/auth/logout", response_model=OkResponse)
async def logout(
    response: Response,
    db: AsyncSession = Depends(get_db),
    admin: AdminSession = Depends(require_admin),
) -> OkResponse:
    """Xóa session khỏi DB + clear cookie."""
    await delete_session(db, admin.id)
    response.delete_cookie(SESSION_COOKIE_NAME)
    return OkResponse(ok=True)


@router.get("/auth/me", response_model=MeResponse)
async def me(admin: AdminSession = Depends(require_admin)) -> MeResponse:
    """Frontend gọi cái này để biết "tôi đã đăng nhập chưa"."""
    return MeResponse(
        session_id=admin.id,
        expires_at=admin.expires_at.isoformat(),
    )
