/**
 * Toàn bộ data của diagram trên trang chủ.
 *
 * - 1 root node (không click được, chỉ hiển thị tiêu đề)
 * - 4 node cluster trái: Lập trình cơ bản
 * - 7 node cluster phải: Web app anatomy
 *
 * Mỗi node có 4 trường text tiếng Việt cho DetailPanel.
 * Đổi nội dung dạy → sửa file này.
 */

export interface DiagramNode {
  id: string
  label: string
  position: { x: number; y: number }
  whatIs: string
  whereInProject: string
  whenToCare: string
  readMore?: string
}

export interface DiagramEdge {
  source: string
  target: string
}

export const diagramNodes: DiagramNode[] = [
  {
    id: 'root',
    label: 'Web App với Claude Code',
    position: { x: 0, y: 0 },
    whatIs: '',
    whereInProject: '',
    whenToCare: '',
  },

  // ─── Cluster trái — Lập trình cơ bản ───
  {
    id: 'language',
    label: 'Ngôn ngữ lập trình',
    position: { x: -340, y: 0 },
    whatIs:
      'Ngôn ngữ lập trình là cách mình ra lệnh cho máy tính. Mỗi ngôn ngữ có cú pháp riêng — Python, JavaScript, TypeScript, Go, Rust... Mục đích đều giống nhau: viết ra một file mà máy hiểu và chạy được.',
    whereInProject:
      'Project này dùng 2 ngôn ngữ. Backend viết bằng Python (xem `backend/app/`). Frontend viết bằng TypeScript (xem `frontend/src/`).',
    whenToCare:
      'Khi build với Claude Code, mình không cần biết tự viết ngôn ngữ — Claude viết hộ. Nhưng cần biết đang dùng ngôn ngữ gì để Claude tạo file đúng định dạng (`.py` hay `.ts`) và để mình đọc hiểu được code Claude generate ra.',
  },
  {
    id: 'function',
    label: 'Hàm',
    position: { x: -680, y: -110 },
    whatIs:
      'Hàm là một khối code làm 1 việc cụ thể. Đặt tên cho khối đó, gọi tên là chạy. Ví dụ `hello("Việt")` — `hello` là tên hàm, `"Việt"` là dữ liệu đưa vào.',
    whereInProject:
      'Mở `backend/app/routes/config.py`. `get_config` và `update_config` là 2 hàm. Mỗi endpoint API là 1 hàm.',
    whenToCare:
      'Khi nói với Claude Code "thêm chức năng X", Claude thường tạo 1 hàm mới. Đọc tên hàm là biết nó làm gì — đặt tên rõ ràng quan trọng hơn viết code phức tạp.',
  },
  {
    id: 'variable',
    label: 'Biến',
    position: { x: -680, y: 0 },
    whatIs:
      'Biến là một cái tên gắn với một giá trị. Ví dụ `password = "abc123"` — `password` là tên, `"abc123"` là giá trị. Sau đó dùng `password` ở chỗ khác thay vì gõ lại `"abc123"`.',
    whereInProject:
      'Mở `backend/app/db.py` — `DATABASE_URL` là biến đọc từ file `.env`. Hoặc `frontend/src/data/diagram.ts` — `diagramNodes` là biến chứa danh sách các node trên diagram này.',
    whenToCare:
      'Khi đổi cấu hình (đổi password admin, đổi địa chỉ database), thường mình chỉ đổi giá trị của biến — không sửa logic code.',
  },
  {
    id: 'library',
    label: 'Thư viện',
    position: { x: -680, y: 110 },
    whatIs:
      'Thư viện là code do người khác đã viết sẵn, mình import vào dùng. Đỡ thời gian, đỡ bug. Ví dụ FastAPI là thư viện viết sẵn cho mình kiểu "tạo API rất nhanh".',
    whereInProject:
      '`backend/requirements.txt` là danh sách thư viện Python project dùng (fastapi, uvicorn, sqlalchemy, asyncpg). `frontend/package.json` là danh sách thư viện JS/TS (react, @xyflow/react, react-router-dom).',
    whenToCare:
      'Khi Claude Code đề xuất "mình cần cài thư viện X" — đó là Claude muốn không phải tự viết lại. Thường nên đồng ý, trừ khi thư viện quá lạ hoặc lâu không có update.',
  },

  // ─── Cluster phải — Web app anatomy ───
  {
    id: 'frontend',
    label: 'Frontend',
    position: { x: 340, y: -360 },
    whatIs:
      'Frontend là phần website mà người dùng nhìn thấy và bấm vào trong trình duyệt. Là HTML, CSS, và JavaScript chạy trên trình duyệt của user.',
    whereInProject:
      'Toàn bộ folder `frontend/`. Entry point là `frontend/src/App.tsx`. `pages/Home.tsx` chính là trang đang render diagram này.',
    whenToCare:
      'Khi đổi giao diện (màu sắc, layout, text trên màn hình) — sửa file trong `frontend/`. Frontend chạy trên trình duyệt của user, không phải trên server của mình.',
  },
  {
    id: 'backend',
    label: 'Backend',
    position: { x: 340, y: -240 },
    whatIs:
      'Backend là server xử lý dữ liệu phía sau. User không thấy trực tiếp — frontend gọi qua HTTP, backend trả lời. Lưu data, xử lý logic phức tạp, gọi API ngoài... đều ở backend.',
    whereInProject:
      'Toàn bộ folder `backend/`. Entry point là `backend/app/main.py`. Mỗi endpoint (URL như `/config`, `/auth/login`) là 1 file trong `backend/app/routes/`.',
    whenToCare:
      'Khi cần lưu/đọc data, gọi API ngoài, làm logic không nên để user thấy được (như compare password) — viết ở backend. Nếu cố nhét vào frontend, ai mở DevTools cũng đọc được code mình.',
  },
  {
    id: 'database',
    label: 'Database',
    position: { x: 340, y: -120 },
    whatIs:
      'Database là nơi lưu data lâu dài. Khi server tắt rồi mở lại, data vẫn còn. Project này dùng PostgreSQL — một database quan hệ phổ biến.',
    whereInProject:
      'Schema (cấu trúc các bảng) ở `backend/init.sql`. Models (Python class map sang bảng) ở `backend/app/models.py`. Database thật chạy trên Railway như một service riêng.',
    whenToCare:
      'Khi cần lưu thông tin để dùng lại (user info, settings, posts...) — vào database. Mọi thay đổi cấu trúc bảng phải migration cẩn thận; đừng xóa bảng đang có data thật.',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    position: { x: 340, y: 0 },
    whatIs:
      'Deployment = đẩy code từ máy mình lên server để cả thế giới truy cập được. Trước đó code chỉ chạy trên `localhost` — chỉ máy mình mở được.',
    whereInProject:
      '`frontend/Dockerfile` và `backend/Dockerfile` là cấu hình cách package code thành "image" để Railway hiểu. Push code lên GitHub → Railway tự deploy.',
    whenToCare:
      'Mỗi lần đổi code muốn cho user thấy, phải deploy lại. Với Railway connect GitHub, chỉ cần push commit là Railway tự build + deploy.',
    readMore: 'https://docs.railway.com/guides/dockerfiles',
  },
  {
    id: 'hosting',
    label: 'Hosting',
    position: { x: 340, y: 120 },
    whatIs:
      'Hosting là server thật mà code chạy trên đó. Server bật 24/7, có địa chỉ IP, ai gọi đến cũng nhận được. Project này host trên Railway.',
    whereInProject:
      'Không có file cụ thể trong repo — Railway dashboard (https://railway.com) là nơi xem 2 service (frontend + backend) và database đang chạy ra sao, log, env vars.',
    whenToCare:
      'Khi server lỗi, vào Railway xem log để biết lỗi gì. Khi muốn đổi env var (như password admin), vào Railway settings.',
    readMore: 'https://railway.com',
  },
  {
    id: 'domain',
    label: 'Domain',
    position: { x: 340, y: 240 },
    whatIs:
      'Domain là tên dễ nhớ trỏ đến server. Thay vì gõ IP `123.45.67.89`, gõ `myapp.com`. Cloudflare quản lý DNS — bảng tra "domain → IP" của Internet.',
    whereInProject:
      'Không có file — config trên Cloudflare dashboard. Trỏ DNS record của domain về địa chỉ Railway service.',
    whenToCare:
      'Khi muốn user truy cập qua tên đẹp thay vì URL Railway tự sinh (như `xyz123.up.railway.app`). Cần mua domain và config DNS.',
  },
  {
    id: 'auth',
    label: 'Authentication',
    position: { x: 340, y: 360 },
    whatIs:
      'Authentication = "mày là ai". Cách phổ biến: user gõ password, server kiểm tra đúng → cấp 1 "vé" (session token) lưu trong cookie. Mỗi request sau gửi vé, server check vé.',
    whereInProject:
      'Logic chính ở `backend/app/sessions.py`. Endpoints login/logout ở `backend/app/routes/auth.py`. Trang `/admin/login` cho user nhập password.',
    whenToCare:
      'Bất cứ khi nào có chức năng "chỉ user X mới được làm". Đừng tự nghĩ ra cơ chế auth riêng — dùng pattern chuẩn (session cookie, JWT, OAuth) tùy use case.',
  },
]

export const diagramEdges: DiagramEdge[] = [
  // Root → 2 cluster
  { source: 'root', target: 'language' },

  // Cluster trái: language → 3 con
  { source: 'language', target: 'function' },
  { source: 'language', target: 'variable' },
  { source: 'language', target: 'library' },

  // Root → 7 node anatomy
  { source: 'root', target: 'frontend' },
  { source: 'root', target: 'backend' },
  { source: 'root', target: 'database' },
  { source: 'root', target: 'deployment' },
  { source: 'root', target: 'hosting' },
  { source: 'root', target: 'domain' },
  { source: 'root', target: 'auth' },
]
