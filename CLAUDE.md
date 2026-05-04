# Web App cho Claude Code

Teaching artifact cho buổi 2 khóa *Claude Code cho SEO* — anatomy của một web app fullstack qua chính một web app fullstack.

## Đây là gì

Một web app nhỏ với 2 services tách rời (frontend Vite+React, backend FastAPI+Postgres) deploy trên Railway. Mục đích duy nhất: làm visual aid sống cho buổi giảng. Trang chính (`/`) hiển thị một interactive diagram về kiến trúc web app, click vào mỗi node sẽ ra chi tiết. Trang `/admin` cho phép admin đổi tiêu đề + màu chủ đạo của site.

Đối tượng đọc repo này: **học viên non-tech** đang học Claude Code. Mọi quyết định kỹ thuật đều ưu tiên *student-readability* hơn engineering best-practice.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | Vite + React 19 + TypeScript strict, layout HTML/CSS thuần (không React Flow) |
| Backend | FastAPI (Python 3.11), SQLAlchemy 2 async + asyncpg |
| Database | PostgreSQL 16 (Railway add-on) |
| Auth | Session cookie HttpOnly, password trong env var |
| Hosting | Railway, 2 services riêng + Postgres |
| Domain | Cloudflare DNS → Railway custom domain |

## Project Structure

```
frontend/          # Vite SPA, pure client
  src/
    pages/         # Home (roadmap), AdminLogin, Admin
    components/Roadmap/   # Roadmap, ClusterColumn, ItemCard, DetailPanel
    data/diagram.ts       # 3 clusters + 11 nodes + Vietnamese copy
    lib/api.ts            # fetch wrapper
backend/           # FastAPI server
  app/
    main.py        # entry, CORS, route mount
    routes/        # config.py, auth.py, health.py
    db.py          # async engine + session
    models.py      # SiteConfig, AdminSession
    auth.py        # session middleware
  init.sql         # raw SQL schema + seed
.claude/agents/    # frontend-agent, backend-agent, code-cleaner
```

## Running

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Swagger UI: http://localhost:8000/docs

# Frontend
cd frontend
npm install
npm run dev
# http://localhost:5173
```

Cần `.env` ở root (copy từ `.env.example`). DATABASE_URL trỏ đến Postgres local hoặc Railway.

## Conventions

- **Python**: async-first, snake_case, type hints. Format bằng `ruff format`. Lint bằng `ruff check`.
- **TypeScript**: functional components + hooks, camelCase. Format bằng `prettier`. Lint bằng `eslint`.
- **DB**: chỉ 2 tables (`site_config`, `admin_session`). Schema viết raw SQL trong `backend/init.sql` để student-reader scan trong 30 giây.
- **Tiếng Việt**: copy hiển thị trên UI, comment giải thích cho student, README, agent descriptions — tiếng Việt. Code identifier (tên hàm, biến, route) — tiếng Anh chuẩn.
- **Commit**: format theo skill `git-commit-viet`. Subject ≤70 chars, no emoji, body giải thích *why*. Footer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- **Push**: mỗi major task = 1 commit + push lên GitHub. Repo grow công khai từng bước.

## Trade-off cố ý cần biết khi đọc repo

**Frontend và backend tách 2 services riêng**. Nhiều dự án production gộp Next.js fullstack hoặc dùng tRPC — gọn hơn. Repo này **cố tình tách đôi vì mục đích sư phạm**: để học viên thấy được boundary frontend/backend qua HTTP, và 2 service riêng trên Railway dashboard. Đây không phải best practice cho mọi dự án.

**Password admin so sánh plaintext** trong env var, không hash bcrypt. Đối với một site teaching demo có một admin, thay vì dạy passlib + hash + salt cùng lúc với 7 khái niệm khác sẽ làm vỡ buổi học. Code có comment giải thích "production thì nên hash". Đừng "fix" cái này nếu không thay đổi context dạy.

**Không có tests**. Đây là teaching artifact, không phải production product. Tests sẽ làm rối repo cho student-reader. Nếu cần verify, dùng manual checklist trong `PLAN.md` mục Verification.

## Don't

- Đừng commit `.env` (đã có trong `.gitignore`).
- Đừng push lên `main` mà không xác nhận với Viet.
- Đừng gộp frontend + backend thành Next.js để "đơn giản hóa" — sẽ phá hỏng mục tiêu sư phạm. Nếu thấy duplicate config, để vậy và viết comment "duplicate cố ý".
- Đừng thêm Tailwind, framer-motion, hoặc UI library lớn vào frontend trừ khi cần — repo phải đọc được trong 30 phút.
- Đừng tạo file mới ngoài plan trong `PLAN.md` mà không cập nhật plan trước.
- Đừng skip `git-commit-viet` style — học viên sẽ đọc git log như tài liệu học.

## Architecture Notes

- **Roadmap component**: layout 3-column HTML/CSS (CSS Grid), không React Flow. 3 cluster: Lập trình cơ bản (sky blue, Ngôn ngữ + 3 children), Web app anatomy (purple, FE/BE/DB/Auth), Triển khai (emerald, Deploy/Hosting/Domain). Click vào card → DetailPanel slide từ phải. Mỗi node có 7 trường: whatIs, whereInProject, whenToCare, vidu, loiThuongGap, code (+ codeLang), readMore.
- **Config system**: `site_config` là key/value table đơn giản. Frontend fetch `GET /config` lúc mount, apply CSS variable `--primary` từ `primary_color`.
- **Auth flow**: POST `/auth/login` → tạo random session token, lưu vào `admin_session` table, set HttpOnly cookie. Middleware đọc cookie → check token + expires_at. Logout = xóa row + clear cookie.
- **Init**: `backend/app/main.py` chạy `init.sql` lúc startup nếu `site_config` rỗng. Idempotent.
