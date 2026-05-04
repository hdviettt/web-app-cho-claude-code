"""Kết nối database (PostgreSQL async).

Đọc DATABASE_URL từ env, tạo engine + session factory.
"""

import os

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = os.environ["DATABASE_URL"]

# Railway gửi URL kiểu `postgres://...` — chuyển sang `postgresql+asyncpg://...`
# để asyncpg driver nhận diện được.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://") and "+asyncpg" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    """Lớp gốc cho tất cả ORM models. Xem app/models.py."""


async def get_db():
    """FastAPI dependency: cấp 1 async DB session, tự đóng sau request."""
    async with SessionLocal() as session:
        yield session
