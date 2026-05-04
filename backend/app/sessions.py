"""Session helpers + dependency `require_admin` để bảo vệ endpoints admin.

Cách hoạt động:
1. Login đúng → tạo random token, lưu vào bảng `admin_session` cùng `expires_at`.
2. Set cookie HttpOnly tên `admin_session` chứa token đó.
3. Request sau gửi cookie → `require_admin` đọc token, tra DB, check hết hạn.
4. Logout → xóa row trong DB + clear cookie.
"""

import os
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import AdminSession

SESSION_COOKIE_NAME = "admin_session"
SESSION_TTL = timedelta(days=7)


async def create_session(db: AsyncSession) -> tuple[str, datetime]:
    """Tạo session mới, lưu DB, trả về (token, expires_at)."""
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + SESSION_TTL
    db.add(AdminSession(id=token, expires_at=expires_at))
    await db.commit()
    return token, expires_at


async def delete_session(db: AsyncSession, token: str) -> None:
    """Xóa session (logout)."""
    session = await db.get(AdminSession, token)
    if session is not None:
        await db.delete(session)
        await db.commit()


async def require_admin(
    db: AsyncSession = Depends(get_db),
    admin_session: str | None = Cookie(default=None),
) -> AdminSession:
    """Dependency: chỉ cho qua nếu cookie hợp lệ + chưa hết hạn."""
    if not admin_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Chưa đăng nhập"
        )
    session = await db.get(AdminSession, admin_session)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session không tồn tại"
        )
    if session.expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session đã hết hạn"
        )
    return session


def admin_password() -> str:
    """Đọc password admin từ env. Lười đọc để dễ test/override."""
    pw = os.environ.get("ADMIN_PASSWORD")
    if not pw:
        raise RuntimeError("ADMIN_PASSWORD chưa set trong .env")
    return pw
