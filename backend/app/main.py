"""Entry point của backend.

Chạy: `uvicorn app.main:app --reload --port 8000`
Sau đó mở http://localhost:8000/docs để xem Swagger UI.

Trong lifespan startup, chạy init.sql để tạo tables + seed config nếu DB trống.
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db import SessionLocal
from app.routes import auth, config, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Tạo schema + seed config từ init.sql lúc start."""
    init_sql_path = Path(__file__).parent.parent / "init.sql"
    init_sql = init_sql_path.read_text(encoding="utf-8")

    async with SessionLocal() as db:
        # asyncpg không nhận multi-statement raw, phải split.
        for stmt in init_sql.split(";"):
            stmt = stmt.strip()
            if stmt:
                await db.execute(text(stmt))
        await db.commit()
    yield


app = FastAPI(
    title="Web App cho Claude Code — Backend",
    description=(
        "API cho buổi 2 khóa Claude Code cho SEO. "
        "Mở `/docs` để thấy tất cả endpoints kèm input/output schema."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# CORS: cho phép frontend (Vite dev server hoặc production URL) gọi backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(config.router)
app.include_router(auth.router)
