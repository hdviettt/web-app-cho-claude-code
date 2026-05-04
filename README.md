# Web App cho Claude Code

Tài liệu giảng dạy sống cho **buổi 2** khóa *Claude Code cho SEO* — chính website này là ví dụ về anatomy của một web app fullstack.

## Đây là gì?

Một web app nhỏ, được thiết kế **để học, không phải để dùng**. Học viên không *học về* frontend, backend, database — họ *nhìn thẳng* vào chính frontend, backend, database của site họ đang đứng. Mỗi node trên diagram có một panel chi tiết chỉ ra "đây là gì, nằm ở đâu trong repo, và khi nào mình cần care".

Repo này là open-source. Bất kỳ ai muốn hiểu một web app fullstack được lắp ghép như thế nào đều đọc được.

## Tại sao có nó?

Học khái niệm tách rời khỏi sản phẩm thì trừu tượng và khó nhớ. Cách tốt nhất để hiểu "frontend là gì" là mở thư mục `frontend/`, đọc một file, rồi xem nó hiển thị thế nào trên trình duyệt. Cách tốt nhất để hiểu "backend nói chuyện với database thế nào" là chạy một endpoint, xem dữ liệu chạy qua đâu.

Dự án này là phương tiện cho việc đó.

## Cấu trúc thư mục

```
.
├── frontend/        # Vite + React + TypeScript — phần người dùng nhìn thấy
├── backend/         # FastAPI + Python — phần xử lý dữ liệu phía sau
├── .claude/agents/  # Các "trợ lý AI" hỗ trợ phát triển dự án này
├── CLAUDE.md        # Hướng dẫn cho Claude Code khi làm việc trong repo
├── PLAN.md          # Bản kế hoạch thiết kế ban đầu — minh bạch quá trình
└── README.md        # File này
```

`frontend/` và `backend/` là **2 services độc lập**, deploy thành 2 service riêng trên Railway. Đọc thêm phần *"Tại sao tách 2 services"* bên dưới.

## Cách chạy local

Cần: Node 20+, Python 3.11+, Postgres 16 chạy local (hoặc dùng Railway).

```bash
# 1) Copy env mẫu
cp .env.example .env
# Sửa DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET trong .env

# 2) Backend (terminal 1)
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → mở http://localhost:8000/docs để xem Swagger UI

# 3) Frontend (terminal 2)
cd frontend
npm install
npm run dev
# → mở http://localhost:5173
```

## Deploy lên Railway

Dự án thiết kế để deploy thành **2 services riêng + 1 Postgres add-on** trên Railway.

1. **Tạo project Railway**, connect repo GitHub này.
2. **Service `backend`**:
   - Root directory: `/backend`
   - Railway tự đọc `backend/Dockerfile`.
   - Env vars cần set:
     - `DATABASE_URL` — link từ Postgres add-on (Railway tự generate).
     - `ADMIN_PASSWORD` — chuỗi khó đoán.
     - `FRONTEND_ORIGIN` — URL public của service frontend (sau khi service frontend đã có URL).
3. **Service `frontend`**:
   - Root directory: `/frontend`
   - Railway tự đọc `frontend/Dockerfile`.
   - **Build arg** (không phải env var): `VITE_API_URL` = URL public của backend service. Vite inline biến này lúc build, nên phải set ở Build Args trên Railway, không phải Variables.
4. **Postgres add-on**: thêm vào project, link với service `backend` để `DATABASE_URL` auto-populate.
5. Mỗi commit push lên `main` → Railway tự build + redeploy 2 services.

## Tại sao tách 2 services (frontend / backend)?

Trong thực tế production, nhiều dự án gộp Next.js fullstack hoặc dùng tRPC để có type-safe full-stack — gọn hơn về engineering.

Dự án này **cố ý tách đôi vì mục đích sư phạm**: để học viên nhìn thấy được boundary giữa frontend và backend, và thấy hai service nói chuyện với nhau qua HTTP. Trên Railway dashboard, anh sẽ thấy 2 service riêng — không phải 1 service. Đó là điều đáng để học viên *thấy*, không chỉ *nghe*.

Khi tự build dự án thật, hãy chọn cấu trúc phù hợp với nhu cầu của mình — không phải bê nguyên cấu trúc của repo này.

## Cho học viên

Trước buổi 2 nên đọc:
1. File này (`README.md`) — hiểu ý đồ tổng thể
2. `frontend/src/App.tsx` — entry point của phần frontend
3. `backend/app/main.py` — entry point của phần backend
4. `backend/init.sql` — schema database

Trong buổi 2, mỗi node trên diagram trỏ thẳng đến một file cụ thể trong repo. Mở repo song song khi xem demo.

## License

MIT — học viên được phép fork, sửa, và sử dụng cho dự án của mình.

## Liên hệ

Hoàng Đức Việt — agentic@seongon.com
