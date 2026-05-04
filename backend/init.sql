-- ─────────────────────────────────────────────────────────────
-- Schema cho web-app-cho-claude-code
-- Chạy tự động lúc backend khởi động (xem app/main.py, hàm lifespan).
-- File này CỐ Ý viết bằng SQL thuần (không Alembic) để student-reader
-- nhìn 1 phát thấy hết database có gì.
-- ─────────────────────────────────────────────────────────────

-- Bảng site_config: lưu các setting kiểu key/value.
-- Admin đổi 'site_title' và 'primary_color' qua trang /admin.
CREATE TABLE IF NOT EXISTS site_config (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Giá trị mặc định lần đầu chạy.
INSERT INTO site_config (key, value) VALUES
    ('site_title',    'Web App cho Claude Code'),
    ('primary_color', '#7c3aed')
ON CONFLICT (key) DO NOTHING;

-- Bảng admin_session: lưu các phiên đăng nhập admin.
-- 1 dòng = 1 cookie token đang sống.
CREATE TABLE IF NOT EXISTS admin_session (
    id         TEXT PRIMARY KEY,        -- session token (random 32 bytes URL-safe)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL     -- thời điểm hết hạn (login + 7 ngày)
);
