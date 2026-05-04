"""ORM models — mô tả 2 tables trong database.

Schema thật được tạo bởi init.sql; các class ở đây chỉ map Python ↔ SQL
để code dùng được kiểu `db.get(SiteConfig, "site_title")`.
"""

from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class SiteConfig(Base):
    """1 dòng = 1 setting (key/value) của site."""

    __tablename__ = "site_config"

    key: Mapped[str] = mapped_column(String, primary_key=True)
    value: Mapped[str] = mapped_column(String, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class AdminSession(Base):
    """1 dòng = 1 phiên đăng nhập admin (cookie token + ngày hết hạn)."""

    __tablename__ = "admin_session"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
