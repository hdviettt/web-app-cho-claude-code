/**
 * Toàn bộ data của roadmap trên trang chủ.
 *
 * 3 cluster:
 *  1. Lập trình cơ bản — khái niệm nền (Ngôn ngữ lập trình + 3 con: Hàm, Biến, Thư viện)
 *  2. Web app anatomy — các thành phần làm nên app (Frontend, Backend, Database, Auth)
 *  3. Triển khai & vận hành — đưa app lên server (Deployment, Hosting, Domain)
 *
 * Mỗi node có 7 trường tiếng Việt:
 *   whatIs, whereInProject, whenToCare, vidu, loiThuongGap, code, readMore
 *
 * Đổi nội dung dạy → sửa file này. Đây là single source of truth.
 */

export type ClusterId = 'foundations' | 'anatomy' | 'infra'

export interface Cluster {
  id: ClusterId
  title: string
  subtitle: string
  accent: string
}

export const clusters: Cluster[] = [
  {
    id: 'foundations',
    title: 'Lập trình cơ bản',
    subtitle: 'Biết để đọc hiểu code Claude tạo ra',
    accent: '#0ea5e9',
  },
  {
    id: 'anatomy',
    title: 'Web app anatomy',
    subtitle: 'Các thành phần làm nên một web app',
    accent: '#7c3aed',
  },
  {
    id: 'infra',
    title: 'Triển khai & vận hành',
    subtitle: 'Đưa code lên server cho cả thế giới truy cập',
    accent: '#10b981',
  },
]

export type CodeLang = 'python' | 'typescript' | 'sql' | 'bash'

export interface DiagramNode {
  id: string
  cluster: ClusterId
  parent?: string
  label: string
  whatIs: string
  whereInProject: string
  whenToCare: string
  vidu?: string
  loiThuongGap?: string
  code?: string
  codeLang?: CodeLang
  readMore?: string
}

export const diagramNodes: DiagramNode[] = [
  // ═══════════════════════════════════════════════════════════════
  // CLUSTER 1 — Lập trình cơ bản
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'language',
    cluster: 'foundations',
    label: 'Ngôn ngữ lập trình',
    whatIs:
      'Cách mình ra lệnh cho máy. Mỗi ngôn ngữ là một bộ cú pháp riêng, nhưng mục đích đều giống nhau: tạo file mà máy chạy được. Ngôn ngữ phổ biến hiện nay: Python, JavaScript/TypeScript, Go, Rust, Java.',
    whereInProject:
      'Project này dùng 2 ngôn ngữ: Python cho backend (`backend/app/`) và TypeScript cho frontend (`frontend/src/`). Mỗi ngôn ngữ phù hợp với một loại bài toán khác nhau.',
    whenToCare:
      'Khi build với Claude Code, mình không cần biết tự viết. Nhưng cần biết đang dùng ngôn ngữ gì để Claude tạo file đúng định dạng (`.py` hay `.ts`) và để mình đọc hiểu được khi reviewer code.',
    vidu:
      'Project này: backend cần xử lý dữ liệu nặng và nói chuyện với database → chọn Python. Frontend cần render UI tương tác → chọn TypeScript (chuẩn của React). Mỗi ngôn ngữ cho một việc.',
    loiThuongGap:
      'Cố gắng học nhiều ngôn ngữ trước khi build. Sai. Chọn 1 ngôn ngữ, build 1 thứ, rồi mới mở rộng. Một ngôn ngữ làm được 80% mọi nhu cầu.',
  },
  {
    id: 'function',
    cluster: 'foundations',
    parent: 'language',
    label: 'Hàm',
    whatIs:
      'Một khối code làm 1 việc cụ thể. Đặt tên cho khối đó, gọi tên là chạy. Hàm nhận tham số (đầu vào) và trả về kết quả (đầu ra).',
    whereInProject:
      'Mở `backend/app/routes/config.py`. `get_config(db)` là 1 hàm — tham số `db` là database session, trả về `SiteConfigResponse`. Mỗi endpoint API trong project này là 1 hàm.',
    whenToCare:
      'Khi nói với Claude "thêm chức năng X", Claude tạo 1 hàm mới. Đặt tên hàm rõ ràng quan trọng hơn viết code phức tạp — đọc tên là biết nó làm gì.',
    vidu:
      'Đặt tên `tinh_tien(so_luong, don_gia)`. Đọc tên + tham số → biết ngay nó tính tiền dựa trên số lượng và đơn giá. Không cần đọc bên trong hàm.',
    loiThuongGap:
      'Đặt tên kiểu `process()`, `do_thing()`, `helper()`. 6 tháng sau quay lại không hiểu hàm làm gì. Quy tắc: tên hàm = động từ + danh từ cụ thể (`tinh_tien`, `gui_email`, `kiem_tra_login`).',
    code: `def tinh_tien(so_luong: int, don_gia: float) -> float:
    """Trả về số tiền cần trả."""
    return so_luong * don_gia

print(tinh_tien(3, 50000))  # 150000`,
    codeLang: 'python',
  },
  {
    id: 'variable',
    cluster: 'foundations',
    parent: 'language',
    label: 'Biến',
    whatIs:
      'Một cái tên gắn với một giá trị. Đặt tên cho giá trị thì sau đó dùng tên thay vì gõ lại giá trị. Biến có thể chứa số, chuỗi, danh sách, đối tượng — bất cứ thứ gì.',
    whereInProject:
      'Mở `backend/app/db.py` — `DATABASE_URL` là biến đọc từ env. Mở `frontend/src/data/diagram.ts` — `clusters` và `diagramNodes` là các biến chứa data của roadmap này.',
    whenToCare:
      'Khi đổi cấu hình (đổi password admin, đổi địa chỉ database), thường mình chỉ đổi giá trị của biến — không sửa logic code.',
    vidu:
      '`thue = 0.1` lưu giá trị thuế 10% vào biến tên `thue`. Khi chính phủ đổi luật thuế thành 8%, chỉ đổi 1 chỗ: `thue = 0.08`. Toàn bộ logic dùng `thue` tự động cập nhật.',
    loiThuongGap:
      'Hardcode giá trị ở khắp nơi. Khi cần đổi → sửa 50 chỗ, sót 1 chỗ là bug. Quy tắc: giá trị xuất hiện 2+ lần → đặt làm biến.',
    code: `const thue = 0.1
const tien_truoc_thue = 100000
const tien_thue = tien_truoc_thue * thue
const tong = tien_truoc_thue + tien_thue`,
    codeLang: 'typescript',
  },
  {
    id: 'library',
    cluster: 'foundations',
    parent: 'language',
    label: 'Thư viện',
    whatIs:
      'Code do người khác viết sẵn, đóng gói thành thư viện (library/package), mình import vào dùng. Đỡ thời gian, đỡ bug, không phải tự viết lại từ đầu.',
    whereInProject:
      '`backend/requirements.txt` liệt kê thư viện Python: fastapi, uvicorn, sqlalchemy, asyncpg. `frontend/package.json` liệt kê thư viện JS/TS: react, react-router-dom. Mỗi dòng = 1 thư viện.',
    whenToCare:
      'Khi Claude đề xuất "cần cài thư viện X", thường nên đồng ý. Trừ khi: thư viện quá lạ, lâu không update, hoặc mình muốn tự học cách viết.',
    vidu:
      'Project này không tự viết HTTP server từ scratch — dùng FastAPI. Không tự viết cách nói chuyện với Postgres — dùng SQLAlchemy. Không tự render UI — dùng React. Toàn bộ phần nặng do thư viện làm.',
    loiThuongGap:
      'Cài quá nhiều thư viện không cần thiết. Project to lên, build chậm, dễ bug. Quy tắc: chỉ cài khi thật sự cần và đã thử tự làm hoặc Claude xác nhận cần.',
  },

  // ═══════════════════════════════════════════════════════════════
  // CLUSTER 2 — Web app anatomy
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'frontend',
    cluster: 'anatomy',
    label: 'Frontend',
    whatIs:
      'Phần website người dùng nhìn thấy và bấm vào trong trình duyệt. Là HTML, CSS, JavaScript chạy trên trình duyệt của user — không phải trên server của mình.',
    whereInProject:
      'Toàn bộ folder `frontend/`. Entry point: `frontend/src/App.tsx`. Trang đang đứng (`pages/Home.tsx`) chính là frontend đang render.',
    whenToCare:
      'Khi đổi giao diện (màu sắc, layout, text trên màn hình) — sửa file trong `frontend/`. Logic phía user (validate form, animation, navigation) nên ở frontend.',
    vidu:
      'Click vào 1 item trong roadmap này → DetailPanel slide ra. Đó là frontend đang xử lý — không gọi server, mọi thứ đã có sẵn trong browser.',
    loiThuongGap:
      'Nhét logic bí mật vào frontend (ví dụ: kiểm tra password trong JavaScript). User mở DevTools là đọc được code mình. Quy tắc: gì secret thì để backend, frontend chỉ là UI.',
    code: `function Greeting({ ten }: { ten: string }) {
  return <h1>Xin chào, {ten}!</h1>
}`,
    codeLang: 'typescript',
  },
  {
    id: 'backend',
    cluster: 'anatomy',
    label: 'Backend',
    whatIs:
      'Server xử lý dữ liệu phía sau. User không thấy trực tiếp — frontend gọi qua HTTP, backend trả lời. Lưu data, gọi 3rd-party API, xử lý logic phức tạp đều ở backend.',
    whereInProject:
      'Toàn bộ folder `backend/`. Entry point: `backend/app/main.py`. Mỗi endpoint (URL như `/config`, `/auth/login`) là 1 file trong `backend/app/routes/`.',
    whenToCare:
      'Khi cần lưu/đọc data, gọi API ngoài, hoặc làm logic không nên cho user thấy code (như compare password, gọi API có secret key).',
    vidu:
      'Đăng nhập admin: frontend gửi password lên backend qua POST /auth/login. Backend so sánh với password trong env, nếu đúng thì cấp session. Toàn bộ logic compare password ở backend — frontend không bao giờ thấy password thật.',
    loiThuongGap:
      'Bỏ secret keys vào code rồi commit lên GitHub. Code public → secret leak → ai cũng dùng được. Quy tắc: secret luôn ở env var, không bao giờ trong code.',
    code: `@router.get("/config")
async def get_config(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(SiteConfig))).scalars().all()
    return {row.key: row.value for row in rows}`,
    codeLang: 'python',
  },
  {
    id: 'database',
    cluster: 'anatomy',
    label: 'Database',
    whatIs:
      'Nơi lưu data lâu dài. Server tắt rồi mở lại, data vẫn còn. Project này dùng PostgreSQL — database quan hệ phổ biến (lưu data dạng bảng, có cột, có hàng).',
    whereInProject:
      'Schema (cấu trúc bảng): `backend/init.sql`. Models (Python class map sang bảng): `backend/app/models.py`. Database thật chạy trên Railway như 1 service riêng.',
    whenToCare:
      'Khi cần lưu thông tin để dùng lại (user info, settings, posts...) — vào database. Mọi thay đổi cấu trúc bảng phải migration cẩn thận; đừng xóa bảng đang có data thật.',
    vidu:
      'Bảng `site_config` lưu tiêu đề + màu của site. Khi admin đổi màu trên `/admin`, backend UPDATE row. Lần sau ai vào site, frontend gọi /config → backend SELECT → trả màu mới. Data sống ngoài code.',
    loiThuongGap:
      'Lưu mọi thứ vào DB (kể cả file ảnh, file video). DB chậm dần, tốn tiền. Quy tắc: text/số/boolean → DB. File lớn → object storage (S3, R2).',
    code: `CREATE TABLE site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`,
    codeLang: 'sql',
  },
  {
    id: 'auth',
    cluster: 'anatomy',
    label: 'Authentication',
    whatIs:
      '"Mày là ai?". Cách phổ biến: user gõ password, server kiểm tra đúng → cấp 1 "vé" (session token). Lưu vé vào cookie. Mỗi request sau gửi vé, server check vé.',
    whereInProject:
      'Logic chính: `backend/app/sessions.py`. Endpoints login/logout: `backend/app/routes/auth.py`. Trang `/admin/login` cho user nhập password.',
    whenToCare:
      'Bất cứ khi nào có chức năng "chỉ user X mới được làm". Đừng tự nghĩ ra cơ chế auth riêng — dùng pattern chuẩn.',
    vidu:
      'Login admin: gõ password đúng → backend tạo session token (random 32 bytes), lưu vào DB, set cookie HttpOnly. Đổi màu site: frontend gửi PUT /config kèm cookie → backend đọc cookie, check token, OK → cập nhật DB.',
    loiThuongGap:
      'So sánh password bằng `password == env_password` — vulnerable to timing attack. Dùng `secrets.compare_digest` (constant-time). Đừng tự code, dùng utility chuẩn.',
    code: `if not secrets.compare_digest(payload.password, env_password):
    raise HTTPException(401, "Sai mật khẩu")`,
    codeLang: 'python',
  },

  // ═══════════════════════════════════════════════════════════════
  // CLUSTER 3 — Triển khai & vận hành
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'deployment',
    cluster: 'infra',
    label: 'Deployment',
    whatIs:
      'Đẩy code từ máy mình lên server để cả thế giới truy cập được. Trước đó code chỉ chạy trên `localhost` — chỉ máy mình mở được.',
    whereInProject:
      '`frontend/Dockerfile` và `backend/Dockerfile` là cấu hình cách package code thành "image" để Railway hiểu. Push code lên GitHub → Railway tự deploy.',
    whenToCare:
      'Mỗi lần đổi code muốn cho user thấy → deploy lại. Với Railway connect GitHub, chỉ cần push commit là tự build + deploy.',
    vidu:
      'Project này: anh push commit lên GitHub. Railway tự pull code, build image (chạy Dockerfile), deploy thành service mới, switch traffic. Toàn bộ ~3 phút, không cần thao tác gì khác.',
    loiThuongGap:
      'Deploy thẳng lên production mà không test ở môi trường khác (staging). Bug lọt vào production = user thấy ngay. Quy tắc: deploy lên preview/staging trước, verify, rồi mới promote production.',
    readMore: 'https://docs.railway.com/guides/dockerfiles',
  },
  {
    id: 'hosting',
    cluster: 'infra',
    label: 'Hosting',
    whatIs:
      'Server thật mà code chạy trên đó. Server bật 24/7, có địa chỉ IP, ai gọi đến cũng nhận được. Project này host trên Railway.',
    whereInProject:
      'Không có file cụ thể. Railway dashboard (https://railway.com) là nơi xem 2 service (frontend + backend) + database đang chạy ra sao, log, env vars.',
    whenToCare:
      'Server lỗi → vào Railway xem log. Đổi env var (như password admin) → vào Railway settings → service → variables.',
    vidu:
      'Frontend Railway URL: `frontend-production-xxxxx.up.railway.app`. Backend: `backend-production-yyyyy.up.railway.app`. 2 URL khác nhau vì 2 service riêng. Postgres không có URL public — chỉ backend gọi nội bộ được.',
    loiThuongGap:
      'Deploy lên hosting free, không monitor. Hết quota giữa đêm, site sập, không ai biết. Quy tắc: thiết lập alert (email/slack) khi service down.',
    readMore: 'https://railway.com',
  },
  {
    id: 'domain',
    cluster: 'infra',
    label: 'Domain',
    whatIs:
      'Tên dễ nhớ trỏ đến server. Thay vì gõ IP `123.45.67.89`, gõ `myapp.com`. Cloudflare quản lý DNS — bảng tra "domain → IP" của Internet.',
    whereInProject:
      'Không có file. Config trên Cloudflare dashboard. Trỏ DNS record của domain về địa chỉ Railway service.',
    whenToCare:
      'Khi muốn user truy cập qua tên đẹp thay vì URL Railway tự sinh. Cần mua domain (~10-15 USD/năm) và config DNS.',
    vidu:
      'Mua domain `myapp.com` ở Cloudflare. Tạo CNAME record: `@` trỏ đến `frontend-production-xxxxx.up.railway.app`. Đợi DNS propagate (~5-30 phút). Sau đó gõ `myapp.com` mở thẳng frontend.',
    loiThuongGap:
      'Quên gia hạn domain. Domain hết hạn → site sập, mất uy tín. Quy tắc: bật auto-renew + nhận email reminder.',
  },
]
