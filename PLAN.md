# PLAN — `web-app-cho-claude-code`

## Bối cảnh

Buổi 2 của khóa Claude Code cho SEO dạy **bức tranh tổng quan về anatomy của một web app fullstack** — frontend, backend, database, deployment, hosting, domain, authentication — cùng các khái niệm lập trình nền tảng (ngôn ngữ, hàm, biến, thư viện). Dạy lý thuyết thuần sẽ trừu tượng và khó nhớ với học viên non-tech.

Dự án này là **artifact giảng dạy sống**: chính nó vừa là nội dung bài giảng vừa là ví dụ thực tiễn. Học viên không *học về* frontend/backend — họ *nhìn thẳng* vào frontend/backend của site họ đang đứng. Repo open-source trên GitHub, deploy 2 services trên Railway, domain qua Cloudflare.

Artifact phục vụ ba mục đích:
1. **Visual aid** cho buổi 2 — tour kiến trúc qua diagram interactive.
2. **Reference template** cho buổi 5 — khi học viên tự build web app với Claude Code.
3. **Open-source teaching asset** sống ngoài khóa này — bất kỳ ai muốn hiểu anatomy web app đều đọc được.

## Kiến trúc

```
web-app-cho-claude-code/
  frontend/                      # Vite + React 19 + TypeScript — pure client SPA
    src/
      App.tsx                    # routes: /, /admin/login, /admin
      pages/
        Home.tsx                 # interactive architecture diagram
        AdminLogin.tsx
        Admin.tsx                # edit site title + primary color
      components/
        Diagram/
          Canvas.tsx             # React Flow root
          Node.tsx               # node với click-to-expand
          DetailPanel.tsx        # side panel chi tiết khi click
      data/
        diagram.ts               # 2 cluster nodes + edges + Vietnamese copy
      lib/
        api.ts                   # fetch wrapper → backend
    package.json
    vite.config.ts
    Dockerfile                   # nginx serving build/

  backend/                       # FastAPI + Python 3.11
    app/
      main.py                    # FastAPI entry, CORS, route mount
      routes/
        config.py                # GET /config, PUT /config (admin)
        auth.py                  # POST /auth/login, POST /auth/logout, GET /auth/me
        health.py                # GET /health
      db.py                      # SQLAlchemy async engine
      models.py                  # SiteConfig, AdminSession
      auth.py                    # session cookie middleware
    init.sql                     # raw SQL schema + seed (đơn giản hơn Alembic)
    requirements.txt             # fastapi, uvicorn, sqlalchemy[asyncio], asyncpg
    Dockerfile                   # uvicorn serving FastAPI

  .claude/
    agents/
      frontend-agent.md          # narrator-style, tiếng Việt
      backend-agent.md           # narrator-style, tiếng Việt
      code-cleaner.md            # format + lint pass

  CLAUDE.md                      # tiếng Việt, viết cho student-reader
  README.md                      # tiếng Việt, "đây là gì, vì sao có, ai sửa"
  PLAN.md                        # copy của file này — minh bạch quá trình thiết kế
  .env.example
  .gitignore
```

## Tech stack

| Layer | Choice | Lý do |
|---|---|---|
| Frontend | Vite + React 19 + TS | Pure client SPA, boundary frontend/backend nhìn thấy được. Không Next.js để tránh "magic" (server components, route handlers cùng folder) làm mờ ranh giới. |
| Backend | FastAPI + Python 3.11 | Bridge với phần SEO Python ở các buổi sau. Auto-gen `/docs` Swagger UI là teaching gold — học viên *thấy* được API. |
| Database | PostgreSQL 16 (Railway) | Service riêng trên Railway dashboard, học viên thấy "đây là database, không phải code". |
| ORM | SQLAlchemy 2 async + asyncpg | Match convention các project khác trong workspace (agenternal, prepbrain, mini-google-ads). |
| Diagram | React Flow | Battle-tested, click-to-expand + drag/zoom sẵn, không phải hand-roll SVG positioning. |
| Auth | Session cookie HttpOnly | Demo cho 1 admin — không cần JWT phức tạp. Password trong env var. |
| Hosting | Railway, 2 services + Postgres add-on | Tách rời để học viên thấy được kiến trúc trên dashboard. |
| Domain | Cloudflare → Railway custom domain | Viet demo trong buổi 2. |

### Trade-off cần ghi rõ trong CLAUDE.md / README.md

> *"Dự án này tách frontend và backend làm 2 services riêng. Trong production thật, nhiều dự án gộp Next.js fullstack hoặc dùng tRPC để type-safe full-stack. Việc tách đôi ở đây là **cố ý vì mục đích sư phạm** — để học viên nhìn thấy boundary giữa frontend và backend, hai service nói chuyện qua HTTP. Đây không phải best practice cho mọi dự án."*

## Diagram — nội dung

Layout horizontal, root node giữa, 2 cluster:

**Root:** "Web App với Claude Code"

**Cluster trái — Lập trình cơ bản:**
- Ngôn ngữ lập trình
  - Hàm
  - Biến
  - Thư viện

**Cluster phải — Web app anatomy:**
- Frontend
- Backend
- Database
- Deployment
- Hosting
- Domain
- Authentication

Click vào node → `DetailPanel` slide in từ phải, mỗi node có 4 trường:
1. **Đây là gì?** (1-2 câu, tiếng Việt non-tech)
2. **Trong project này nằm ở đâu?** (đường dẫn file thật, ví dụ `frontend/src/App.tsx`)
3. **Khi nào học viên cần care?** (use case khi build với Claude Code)
4. **Đọc thêm** (1 link tiếng Việt nếu có, optional)

Copy Vietnamese sẽ draft trong Phase 3, Viet review trước khi merge.

## Database schema (raw SQL — `backend/init.sql`)

```sql
CREATE TABLE site_config (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_config (key, value) VALUES
  ('site_title',    'Web App cho Claude Code'),
  ('primary_color', '#7c3aed');

CREATE TABLE admin_session (
  id         TEXT PRIMARY KEY,           -- random session token
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
```

Không có `users` table — chỉ một admin (Viet), password là env var, hash compare. Đơn giản nhất có thể, để student-reader scan được trong 30 giây.

## Phases

Mỗi major task kết thúc bằng một commit (format theo skill `git-commit-viet`: subject ≤70 chars, no emoji, body giải thích *why*, footer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`). Mỗi phase push lên GitHub ngay sau commit để repo grow công khai từng bước — học viên xem `git log` sẽ thấy được dự án được build như thế nào.

**Phase 1 — Skeleton + docs + GitHub repo**
- Tạo folder structure trên
- `CLAUDE.md`, `README.md`, `PLAN.md` (copy file này), `.gitignore`, `.env.example`
- `git init` local
- `gh repo create web-app-cho-claude-code --public --source=. --description "Anatomy của web app fullstack — buổi 2 khóa Claude Code cho SEO"` (xác nhận với Viet trước khi tạo public)
- Commit + push: `chore: scaffold project structure and docs`

**Phase 2 — Backend**
- FastAPI app: `main.py` với CORS allow frontend origin
- `init.sql` chạy lúc start nếu DB rỗng
- Routes: `GET /health`, `GET /config`, `PUT /config`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- Session middleware đọc cookie, kiểm tra `admin_session.expires_at`
- **Verify:** `uvicorn app.main:app --reload --port 8000`, mở `localhost:8000/docs` thấy Swagger UI với 6 endpoints
- Commit + push: `feat(backend): FastAPI app with config and admin auth endpoints`

**Phase 3 — Frontend (diagram + content)**
- Vite + React + TS scaffold (`npm create vite@latest`)
- React Flow setup với 2 cluster layout
- `data/diagram.ts` chứa nodes + edges + Vietnamese copy cho 11 detail panels
- `DetailPanel` component
- Apply `site_title` + `primary_color` từ `GET /config` ở root
- **Verify:** `npm run dev`, click qua từng node thấy detail panel đúng nội dung
- Commit + push: `feat(frontend): interactive architecture diagram with React Flow`

**Phase 4 — Admin**
- `/admin/login` page với form (password only)
- `/admin` page: input title + color picker → save
- Wire `PUT /config`, redirect khi unauth
- **Verify:** login đúng → đổi color → reload `/` thấy primary color đổi; sai password → 401 + message tiếng Việt
- Commit + push: `feat: admin dashboard for editing site title and color`

**Phase 5 — `.claude/agents/`**
- `frontend-agent.md` — chuyên Vite/React/TS, description tiếng Việt cho student-reader, body tiếng Anh cho Claude
- `backend-agent.md` — chuyên FastAPI/SQLAlchemy/Postgres, format tương tự
- `code-cleaner.md` — chạy formatter (ruff cho Python, prettier cho TS) + lint pass
- Commit + push: `chore: add narrator-style Claude Code agents for student-reader`

**Phase 6 — Deploy**
- `frontend/Dockerfile`: multi-stage, build → nginx serve `dist/`
- `backend/Dockerfile`: python:3.11-slim → uvicorn
- Railway: tạo project, 2 services + Postgres add-on, connect GitHub repo (auto-deploy on push)
- Env vars: `DATABASE_URL` (auto-link), `ADMIN_PASSWORD`, `FRONTEND_ORIGIN`, `VITE_API_URL`
- **Verify:** cả 2 services xanh trên Railway, backend `/docs` mở được, frontend load diagram
- Commit + push: `chore: dockerize frontend and backend for Railway deployment`

**Phase 7 — Cloudflare custom domain (Viet làm trong buổi 2 demo)**
- Cloudflare DNS → Railway custom domain
- Học viên xem demo trực tiếp, không tự config
- Share link repo cho học viên qua Lark

## Critical files (sẽ tạo)

- `C:\Users\admin\Desktop\workspace\personal\projects\web-app-cho-claude-code\` — toàn bộ project mới
- Reference (read-only) cho conventions:
  - `personal/projects/agenternal/CLAUDE.md` — CLAUDE.md style
  - `personal/projects/personal-blog/.claude/agents/*.md` — agent format
  - `personal/projects/mini-google-ads/backend/` — FastAPI + SQLAlchemy structure

## Verification (end-to-end)

**Local trước khi deploy:**

1. Backend: `uvicorn app.main:app --reload --port 8000` → `localhost:8000/docs` mở được, thấy 6 endpoints.
2. DB seeded: `curl localhost:8000/config` trả về `{"site_title": "Web App cho Claude Code", "primary_color": "#7c3aed"}`.
3. Frontend: `npm run dev` → `localhost:5173`, diagram render với root + 2 cluster + 11 child nodes.
4. Click node "Frontend" → `DetailPanel` slide in, 4 trường tiếng Việt hiện đúng.
5. Click node "Hàm" (cluster trái) → cũng có detail panel tương tự.
6. `/admin/login` nhập đúng password → redirect `/admin`.
7. Đổi color picker `#dc2626` → save → reload `/` thấy primary color đổi sang đỏ.
8. Sai password → 401 + message tiếng Việt "Sai mật khẩu".
9. Logout → cookie xóa → vào `/admin` redirect về `/admin/login`.

**Sau deploy Railway:**

10. Frontend Railway URL → diagram load OK, primary color đúng từ DB.
11. Backend Railway URL `/docs` → Swagger UI mở được.
12. Admin flow chạy được trên production URL.

**Sau Cloudflare (Viet làm trong buổi 2):**

13. Custom domain trỏ thẳng đến frontend Railway service.

## Out of scope (cố tình bỏ)

- Multi-user, registration, full CMS (chỉ 1 admin, edit title + 1 color)
- i18n (chỉ tiếng Việt)
- Analytics, monitoring
- Tests — đây là teaching artifact cho student-reader, không phải production product. Tests sẽ làm rối repo và đánh lạc hướng khỏi mục tiêu sư phạm. Nếu sau này có nhu cầu, thêm trong dự án khác.
