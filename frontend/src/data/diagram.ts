/**
 * Toàn bộ data cho roadmap "Web App với Claude Code".
 *
 * 7 sections × 23 primary nodes (đã gọt theo spec Viet ngày 2026-05-04).
 *
 * Đối tượng đọc: marketer non-tech đang học build web app với Claude Code.
 * Voice: dùng analogies (cửa hàng, kho, sổ cái, két sắt) thay vì jargon.
 *
 * Đổi nội dung dạy → sửa file này. Đây là single source of truth.
 */

export type ClusterId =
  | 'foundations'
  | 'frontend'
  | 'backend'
  | 'security'
  | 'infra'
  | 'source-control'

export interface Cluster {
  id: ClusterId
  title: string
  subtitle: string
  accent: string
}

export const clusters: Cluster[] = [
  {
    id: 'foundations',
    title: 'Lập trình & ngôn ngữ',
    subtitle: 'Khái niệm tối thiểu để đọc hiểu code Claude tạo ra',
    accent: '#0ea5e9',
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Mặt tiền — phần khách nhìn thấy và tương tác',
    accent: '#7c3aed',
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'Kho hậu cần — xử lý logic + lưu data phía sau',
    accent: '#ec4899',
  },
  {
    id: 'security',
    title: 'Security',
    subtitle: 'Két sắt — bảo vệ password, secret, dữ liệu nhạy cảm',
    accent: '#dc2626',
  },
  {
    id: 'infra',
    title: 'Triển khai',
    subtitle: 'Đẩy code lên server cho cả thế giới truy cập',
    accent: '#10b981',
  },
  {
    id: 'source-control',
    title: 'Source Control',
    subtitle: 'Nơi lưu code và chia sẻ với team',
    accent: '#6366f1',
  },
]

export type CodeLang = 'python' | 'typescript' | 'sql' | 'bash'

export interface Alternative {
  label: string
  iconSlug?: string
  note?: string
}

export interface DiagramNode {
  id: string
  cluster: ClusterId
  label: string
  whatIs: string
  whereInProject: string
  whenToCare: string
  vidu?: string
  loiThuongGap?: string
  code?: string
  codeLang?: CodeLang
  alternatives?: Alternative[]
  readMore?: string
}

export const diagramNodes: DiagramNode[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. LẬP TRÌNH & NGÔN NGỮ
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'language',
    cluster: 'foundations',
    label: 'Ngôn ngữ lập trình',
    whatIs:
      'Cách mình ra lệnh cho máy tính. Mỗi ngôn ngữ là một bộ "ngữ pháp" riêng — như tiếng Việt vs tiếng Anh. Chọn ngôn ngữ là chọn phong cách viết, không phải chọn cái máy "hiểu" hay "không hiểu".',
    whereInProject:
      'Project này dùng 2 ngôn ngữ. Backend (kho hậu cần) viết bằng Python — xem `backend/app/`. Frontend (mặt tiền) viết bằng TypeScript — xem `frontend/src/`.',
    whenToCare:
      'Claude Code lo phần viết. Mình chỉ cần biết đang dùng ngôn ngữ nào để: 1) Claude tạo file đúng định dạng (.py vs .ts), 2) khi muốn tự sửa thì biết file nào để vào.',
    vidu:
      'Một startup chọn Python cho backend vì có nhiều thư viện AI sẵn (Claude, OpenAI). Một startup khác chọn Node.js vì team frontend đã quen JavaScript, không phải học ngôn ngữ thứ hai.',
    loiThuongGap:
      'Cố gắng học cú pháp ngôn ngữ trước khi build cái gì. Sai. Build trước, chỗ nào đọc không hiểu thì hỏi Claude giải thích. Học bằng việc làm, không phải đọc sách.',
    alternatives: [
      { label: 'Python', iconSlug: 'python', note: 'Phổ biến cho AI, data, backend' },
      { label: 'TypeScript', iconSlug: 'typescript', note: 'Cho frontend hiện đại + backend Node' },
      { label: 'JavaScript', iconSlug: 'javascript', note: 'Bản gốc của TypeScript, web cổ điển' },
      { label: 'Go', iconSlug: 'go', note: 'Backend nhanh, server nặng' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. FRONTEND
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'fe-framework',
    cluster: 'frontend',
    label: 'Framework',
    whatIs:
      'Bộ công cụ giúp viết frontend nhanh hơn, có cấu trúc. Như IKEA cung cấp khung tủ + ốc vít sẵn — mình ráp lại, không phải tự đo gỗ + cưa từ đầu. React là framework phổ biến nhất hiện tại.',
    whereInProject:
      'Project này dùng React (xem `frontend/package.json`). Toàn bộ component (`Roadmap.tsx`, `DetailPanel.tsx`...) là React component.',
    whenToCare:
      'Khi build site nhỏ-vừa, framework giúp Claude Code làm việc nhanh hơn vì có pattern chuẩn. Khi build landing page tĩnh, có thể skip framework.',
    vidu:
      'Component `<DetailPanel>` trong project này hiện thông tin của 1 node. Cùng cấu trúc, hiển thị 23 lần với 23 data khác nhau. Nếu không có React, phải copy-paste 23 lần.',
    loiThuongGap:
      'Chọn framework "hot trend" mà ít user (như framework mới ra 6 tháng). Cộng đồng nhỏ = ít tài liệu = Claude Code không quen. Quy tắc: chọn framework có 5+ năm và cộng đồng lớn.',
    alternatives: [
      { label: 'React', iconSlug: 'react', note: 'Phổ biến nhất, Claude Code rất quen' },
      { label: 'Vue', iconSlug: 'vuedotjs', note: 'Học nhanh hơn React, ít abstract' },
      { label: 'Svelte', iconSlug: 'svelte', note: 'Mới hơn, code ngắn gọn' },
      { label: 'Next.js', iconSlug: 'nextdotjs', note: 'React + tính năng full-stack' },
    ],
  },
  {
    id: 'fe-html',
    cluster: 'frontend',
    label: 'HTML',
    whatIs:
      'Ngôn ngữ tả "cái gì là cái gì" trên trang web. `<h1>` = tiêu đề lớn, `<p>` = đoạn văn, `<button>` = nút bấm. HTML là "khung xương" của mọi trang web.',
    whereInProject:
      'File `frontend/index.html` là entry point. Khi build, React render component thành HTML và nhét vào `<div id="root">`.',
    whenToCare:
      'React/Vue auto-generate HTML từ component, mình ít khi viết HTML thuần. Nhưng cần biết các tag cơ bản (h1-h6, p, div, button, a, img) để Claude tạo đúng.',
    vidu:
      'Component `<Header>` trong React render thành HTML thật khi user mở trang: `<header><h1>Web App</h1></header>`. Trình duyệt đọc HTML đó để vẽ.',
    loiThuongGap:
      'Dùng `<div>` cho mọi thứ (kể cả nút bấm). Lỗi accessibility — screen reader không hiểu. Quy tắc: nút bấm dùng `<button>`, link dùng `<a>`, không lạm dụng `<div>`.',
  },
  {
    id: 'fe-css',
    cluster: 'frontend',
    label: 'CSS',
    whatIs:
      'Ngôn ngữ tả "trông như thế nào". Màu sắc, font, kích thước, vị trí — tất cả là CSS. HTML quyết định nội dung; CSS quyết định ngoại hình.',
    whereInProject:
      '`frontend/src/index.css` — biến toàn cục + base styles. Style cụ thể của component: inline trong file `.tsx` (đơn giản hóa cho student-reader).',
    whenToCare:
      'Mỗi lần đổi giao diện đều dùng CSS. Claude rất giỏi viết CSS — chỉ cần tả "tôi muốn nút màu xanh, bo tròn 8px, hover sáng hơn" → Claude generate.',
    vidu:
      'Đổi màu chính của site từ tím sang xanh: chỉ cần đổi 1 dòng CSS variable `--primary`. Tất cả nút, link, accent đều tự đổi theo. Nếu không dùng variable, phải sửa 50 chỗ.',
    loiThuongGap:
      'Hardcode màu/spacing ở mỗi chỗ thay vì dùng design system. Khi cần đổi theme → sửa 100 chỗ. Quy tắc: dùng CSS variables hoặc Tailwind theme.',
  },
  {
    id: 'fe-javascript',
    cluster: 'frontend',
    label: 'JavaScript',
    whatIs:
      'Ngôn ngữ làm cho frontend "sống". HTML là cấu trúc, CSS là trang điểm, JavaScript là hành vi — xử lý click, chuyển trang, animation, gọi API. Không có JS thì site chỉ là tờ giấy tĩnh.',
    whereInProject:
      'Tất cả file `.tsx` trong `frontend/src/` được compile thành JavaScript khi build. TypeScript là phiên bản nâng cao của JavaScript — thêm type checking để bắt bug sớm.',
    whenToCare:
      'JavaScript là ngôn ngữ duy nhất chạy trên trình duyệt. Mọi tương tác phía user (click, hover, animation) đều cần JS. Mình ít khi viết JS thuần — Claude tạo TypeScript, build tool compile sang JS.',
    vidu:
      'Click vào 1 node trên roadmap này → DetailPanel slide ra. Đó là JavaScript event handler chạy trên trình duyệt user. Không cần gọi server, mọi xử lý local.',
    loiThuongGap:
      'Lạm dụng JavaScript cho mọi thứ (kể cả static content). Site nặng, load chậm, SEO kém. Quy tắc: HTML/CSS làm được thì dùng HTML/CSS, JavaScript chỉ cho tương tác.',
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. BACKEND
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'be-api',
    cluster: 'backend',
    label: 'API',
    whatIs:
      '"Hợp đồng" giữa frontend và backend. Frontend gọi đến URL nào, gửi gì, nhận gì lại — đều quy định trong API. Như menu nhà hàng: client gọi món, bếp trả món.',
    whereInProject:
      'Mỗi file trong `backend/app/routes/` là 1 nhóm API endpoints. Ví dụ `/config`, `/auth/login` — frontend gọi qua `lib/api.ts`.',
    whenToCare:
      'Mọi web app fullstack đều có API. Cần thiết kế API rõ ràng từ đầu — đặt tên endpoint chuẩn (REST: `/users`, `/users/123`). Đổi sau là phá vỡ frontend.',
    vidu:
      'Endpoint `GET /config`: frontend gọi → backend trả `{site_title: "...", primary_color: "..."}`. Frontend áp dụng vào CSS. Đó là 1 hợp đồng API rõ ràng.',
    loiThuongGap:
      'Đặt tên endpoint không nhất quán: `/getConfig`, `/save_user`, `/posts/list`. Claude Code lấy ra ví dụ này, ví dụ kia → confused. Quy tắc: theo REST chuẩn (verbs là method, không phải URL).',
    alternatives: [
      { label: 'REST', note: 'Phổ biến nhất, dễ hiểu, dễ debug' },
      { label: 'GraphQL', iconSlug: 'graphql', note: 'Linh hoạt, dùng khi data phức tạp' },
      { label: 'JSON APIs', note: 'Format chuẩn cho REST' },
      { label: 'gRPC', note: 'Nhanh, dùng cho microservices nội bộ' },
    ],
  },
  {
    id: 'be-database',
    cluster: 'backend',
    label: 'Database',
    whatIs:
      'Nơi lưu data lâu dài. Server tắt rồi mở lại, data vẫn còn. Có 2 loại chính: Relational (PostgreSQL, MySQL — tổ chức như Excel với hàng/cột) và NoSQL (MongoDB — linh hoạt như JSON). 95% web app SMB chọn PostgreSQL.',
    whereInProject:
      'Schema (cấu trúc bảng): `backend/init.sql`. Models (Python class map sang bảng): `backend/app/models.py`. Database thật chạy trên Railway như 1 service riêng.',
    whenToCare:
      'Khi cần lưu thông tin để dùng lại (user info, settings, posts...). Bắt đầu với PostgreSQL — Claude Code rất quen, miễn phí trên Railway, đáp ứng 95% nhu cầu.',
    vidu:
      'Bảng `users` (id, email, password) + bảng `posts` (id, user_id, content). user_id ở `posts` link đến id ở `users` — đó là "relational". MongoDB lưu dạng document `{ _id, name, custom_fields... }` — schema tự do, nhưng query phức tạp khó.',
    loiThuongGap:
      'Bắt đầu với MongoDB vì "trendier", rồi đổi sang Postgres khi data có quan hệ phức tạp. Tốn công migrate data + rewrite query. Quy tắc: Postgres mặc định, đổi sau nếu có lý do cụ thể.',
    code: `-- PostgreSQL schema (relational, dạng bảng)
CREATE TABLE site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- MongoDB schema (NoSQL, dạng JSON)
{ _id: 1, key: "site_title", value: "Web App" }`,
    codeLang: 'sql',
    alternatives: [
      { label: 'PostgreSQL', iconSlug: 'postgresql', note: 'Mặc định cho dự án mới — relational, mạnh nhất' },
      { label: 'MySQL', iconSlug: 'mysql', note: 'Relational, lâu đời, nhiều dự án legacy' },
      { label: 'MongoDB', iconSlug: 'mongodb', note: 'NoSQL, linh hoạt schema, document store' },
      { label: 'SQLite', iconSlug: 'sqlite', note: 'File đơn, cho dự án nhỏ, no setup' },
    ],
  },
  {
    id: 'be-storage',
    cluster: 'backend',
    label: 'Object Storage',
    whatIs:
      'Lưu file lớn (ảnh, video, PDF) ngoài database. DB không nên lưu file lớn — chậm, đắt. Object storage rẻ ($0.015/GB/tháng) và tối ưu cho file. Database lưu metadata (text, URL); object storage lưu file thật.',
    whereInProject:
      'Project này chưa cần (chỉ lưu config text). Khi thêm tính năng upload (avatar, ảnh sản phẩm, file PDF), wire R2/S3 vào backend qua SDK.',
    whenToCare:
      'Mọi app có user upload file. Đừng lưu base64 trong DB — DB phình to, query chậm dần. Tách file ra object storage, DB chỉ giữ URL.',
    vidu:
      'User upload avatar → frontend gửi file đến backend → backend upload lên R2 → R2 trả URL → backend lưu URL trong DB (chỉ text, nhẹ). Khi hiển thị → frontend load ảnh từ URL R2 trực tiếp.',
    loiThuongGap:
      'Lưu base64 ảnh trong DB. DB phình to 10GB sau 1000 user. Backup đắt. Quy tắc: file nhị phân → object storage, DB chỉ lưu URL text.',
    alternatives: [
      { label: 'Cloudflare R2', iconSlug: 'cloudflare', note: 'Rẻ nhất, không phí egress' },
      { label: 'AWS S3', iconSlug: 'amazons3', note: 'Tiêu chuẩn, đắt egress' },
      { label: 'Google Cloud Storage', iconSlug: 'googlecloud', note: 'GCP ecosystem' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. SECURITY
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'sec-auth',
    cluster: 'security',
    label: 'Authentication',
    whatIs:
      '"Mày là ai?". User gõ password → server check → đúng thì cấp 1 "vé" (session token) lưu trong cookie. Mỗi request sau gửi vé → server biết "à, vẫn là user đó".',
    whereInProject:
      'Logic chính ở `backend/app/sessions.py`. Endpoint login/logout ở `backend/app/routes/auth.py`. Trang `/admin/login` cho user nhập password.',
    whenToCare:
      'Bất cứ chức năng "chỉ user X được làm". Đừng tự nghĩ ra cơ chế auth — dùng pattern chuẩn. Auth tự code thường có lỗ hổng.',
    vidu:
      'Login admin: gõ password đúng → backend tạo session token random 32 bytes, lưu DB, set cookie HttpOnly. PUT /config kèm cookie → backend đọc, check, OK → update.',
    loiThuongGap:
      'So sánh password bằng `password == env_password` — vulnerable to timing attack. Lưu password plaintext trong DB. Quy tắc: `secrets.compare_digest` cho compare, `bcrypt` cho lưu DB.',
    alternatives: [
      { label: 'Session cookie', note: 'Dự án này dùng — đơn giản, server-side' },
      { label: 'JWT', note: 'Stateless token, dùng cho microservices' },
      { label: 'OAuth', note: 'Đăng nhập qua Google/Facebook/GitHub' },
      { label: 'Magic link', note: 'Email link thay vì password' },
    ],
  },
  {
    id: 'sec-authz',
    cluster: 'security',
    label: 'Authorization',
    whatIs:
      '"Mày được làm gì?". Khác với Authentication ("mày là ai"). User đã login thì authorization quyết định "user này có quyền xóa post của user khác không?".',
    whereInProject:
      'Project chỉ có 1 admin → chưa cần authorization phức tạp. Khi có nhiều role (user thường, mod, admin), thêm logic check role trước mỗi action.',
    whenToCare:
      'Khi có 2+ role user. Ví dụ: post chỉ author edit được (không phải user khác); admin xóa được mọi post.',
    vidu:
      'Endpoint `DELETE /post/123`: check authentication (user đã login chưa?) → check authorization (user là author của post 123 hoặc admin chưa?) → cho phép xóa hoặc 403.',
    loiThuongGap:
      'Check auth ở frontend mà quên check ở backend. User mở DevTools, gọi API trực tiếp → bypass. Quy tắc: mọi check authorization bắt buộc ở backend.',
  },
  {
    id: 'sec-env',
    cluster: 'security',
    label: 'Environment variables',
    whatIs:
      'File `.env` — két sắt cho password, API key, secret. Code đọc từ env, không bao giờ hardcode trong file. Code public lên GitHub mà secret leak = đại họa.',
    whereInProject:
      '`.env.example` là template (commit được, không có giá trị thật). `.env` có giá trị thật (NEVER commit). Backend đọc qua `os.environ`.',
    whenToCare:
      'Mọi dự án. Bất cứ lúc nào có "thứ không nên public" — password DB, API key OpenAI/Stripe, JWT secret — phải vào env.',
    vidu:
      'OpenAI API key: nếu hardcode trong code và push lên GitHub public → bot scan trong 5 phút → ai cũng dùng API trên tài khoản mình → mất hàng nghìn đô.',
    loiThuongGap:
      'Quên thêm `.env` vào `.gitignore`. Hoặc commit `.env` đầu tiên trước khi nhớ ra. File đã vào git history thì khó xóa hết. Quy tắc: thêm `.env` vào `.gitignore` NGAY khi tạo project.',
  },
  {
    id: 'sec-https',
    cluster: 'security',
    label: 'HTTPS / SSL',
    whatIs:
      'Mã hóa data giữa trình duyệt và server. URL bắt đầu `https://` (có ổ khóa) thay vì `http://` (không có). Nếu không HTTPS, password user gõ có thể bị nghe lén trên wifi công cộng.',
    whereInProject:
      'Railway tự cấp HTTPS miễn phí cho mọi service. URL `https://backend-production-...up.railway.app` đã có sẵn ổ khóa.',
    whenToCare:
      'Mọi dự án production. Không có lý do nào không dùng HTTPS năm 2026 — Railway/Vercel/Cloudflare đều free.',
    vidu:
      'User login trên wifi quán cà phê. HTTP: hacker ngồi cùng quán đọc được password trong 30 giây. HTTPS: hacker thấy gibberish, không decode được.',
    loiThuongGap:
      'Dev local dùng `http://localhost`, prod cũng quên đổi `https://`. Hosting tự lo — nhưng phải nhớ check. Quy tắc: prod URL luôn `https://`.',
  },
  {
    id: 'sec-cors',
    cluster: 'security',
    label: 'CORS',
    whatIs:
      'Cross-Origin Resource Sharing — quy định: web nào được phép gọi API của mình. Nếu không config, hacker tạo site khác giả mạo gọi API → bypass.',
    whereInProject:
      'Backend `main.py` dùng `CORSMiddleware` allow `FRONTEND_ORIGIN` (URL frontend). Bất kỳ origin khác gọi API → 403.',
    whenToCare:
      'Frontend và backend ở 2 domain khác nhau (như project này: frontend trên Railway URL A, backend trên Railway URL B). Phải config CORS đúng.',
    vidu:
      'Frontend tại `frontend-production.railway.app` gọi backend tại `backend-production.railway.app`. CORS check origin từ header → đúng → cho qua. Origin khác (vd: hacker.com) → block.',
    loiThuongGap:
      'Set CORS `*` (cho phép mọi origin) cho tiện. Bypass mục đích bảo vệ. Quy tắc: list cụ thể domain frontend, không bao giờ `*` ở production.',
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. TRIỂN KHAI
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'infra-docker',
    cluster: 'infra',
    label: 'Docker / Container',
    whatIs:
      '"Hộp đóng gói" cho code + dependencies + OS. Đảm bảo "code chạy được trên máy mình thì cũng chạy được trên server". Không bị "hoạt động trên localhost mà chết trên prod".',
    whereInProject:
      '`backend/Dockerfile` và `frontend/Dockerfile` định nghĩa cách build container. Railway tự build từ Dockerfile khi mình push code.',
    whenToCare:
      'Mỗi project deploy production thường dùng Docker. Trừ khi dùng platform "no-Docker" (Vercel cho Next.js).',
    vidu:
      '`Dockerfile` ghi: "lấy Python 3.11, cài requirements.txt, copy code, chạy uvicorn". Railway đọc → build image → deploy. Cùng image chạy trên máy Viet hay Railway, kết quả giống nhau.',
    loiThuongGap:
      'Quên đặt `.dockerignore` → ship cả `node_modules`, `.venv`, `.git` lên server. Image to gấp 10 lần. Quy tắc: luôn có `.dockerignore` từ đầu.',
    alternatives: [
      { label: 'Docker', iconSlug: 'docker', note: 'Tiêu chuẩn, mọi platform support' },
    ],
  },
  {
    id: 'infra-hosting',
    cluster: 'infra',
    label: 'Hosting platform',
    whatIs:
      'Server thật chạy code 24/7. Trả tiền theo tháng/usage. Cung cấp dashboard quản lý, log, env vars, restart. Như thuê mặt bằng cho cửa hàng.',
    whereInProject:
      'Project deploy trên Railway. Frontend, backend, Postgres đều ở đó. Railway dashboard: railway.com.',
    whenToCare:
      'Mọi dự án production. Chọn platform theo: dễ dùng (Railway, Vercel) hay enterprise (AWS, GCP). Cho dự án SMB → Railway luôn.',
    vidu:
      'Railway: connect GitHub → push code → tự build + deploy. Dashboard: thấy log realtime, restart, đổi env var. Vercel: tương tự nhưng tối ưu cho Next.js.',
    loiThuongGap:
      'Đi thẳng AWS cho dự án nhỏ. AWS phức tạp gấp 10 lần Railway, dễ tính nhầm tiền. Quy tắc: bắt đầu với Railway/Vercel, chuyển AWS khi đã hiểu rõ pricing.',
    alternatives: [
      { label: 'Railway', iconSlug: 'railway', note: 'Đơn giản, all-in-one, dự án này dùng' },
      { label: 'Vercel', iconSlug: 'vercel', note: 'Tối ưu cho Next.js' },
      { label: 'Netlify', iconSlug: 'netlify', note: 'Tối ưu cho frontend tĩnh' },
      { label: 'AWS', iconSlug: 'amazonaws', note: 'Enterprise, phức tạp, scale to' },
    ],
  },
  {
    id: 'infra-cicd',
    cluster: 'infra',
    label: 'CI/CD',
    whatIs:
      'Continuous Integration / Continuous Deployment. Pipeline tự động: push code → test → build → deploy. Không phải SSH thủ công vào server mỗi lần đổi code.',
    whereInProject:
      'Project hiện chỉ dùng Railway auto-deploy (push GitHub → Railway tự deploy). Không có GitHub Actions chạy test trước.',
    whenToCare:
      'Mọi project có 2+ developer. Pipeline tự động test trước khi deploy → giảm bug đẩy production. Solo dev có thể skip ban đầu.',
    vidu:
      'GitHub Actions: mỗi push lên main → chạy test → build → deploy. Test fail thì block deploy → bug không lọt production.',
    loiThuongGap:
      'Cài CI/CD trước khi có test. Pipeline chạy → không có gì để test → vô nghĩa. Quy tắc: viết test trước, set up pipeline sau.',
    alternatives: [
      { label: 'GitHub Actions', iconSlug: 'githubactions', note: 'Tích hợp với GitHub, free' },
      { label: 'Railway auto-deploy', iconSlug: 'railway', note: 'Auto deploy khi push' },
    ],
  },
  {
    id: 'infra-domain',
    cluster: 'infra',
    label: 'Domain & DNS',
    whatIs:
      'Domain = tên dễ nhớ (myapp.com). DNS = bảng tra "domain → IP server". Mua domain là đăng ký tên đó với cơ quan quản lý Internet trong 1-2 năm.',
    whereInProject:
      'Hiện dùng URL Railway tự sinh (frontend-production-...up.railway.app). Trong buổi 2 sẽ demo trỏ Cloudflare DNS sang URL này.',
    whenToCare:
      'Khi muốn user truy cập qua tên đẹp thay vì URL Railway. Cần mua domain (~$10-15/năm) + config DNS.',
    vidu:
      'Mua domain `webappclaude.com` ở Cloudflare. Tạo CNAME record `@` trỏ đến `frontend-production.up.railway.app`. Đợi 5-30 phút DNS propagate. Sau đó gõ `webappclaude.com` mở thẳng frontend.',
    loiThuongGap:
      'Quên gia hạn domain → site sập, mất uy tín. Quy tắc: bật auto-renew + email reminder.',
    alternatives: [
      { label: 'Cloudflare', iconSlug: 'cloudflare', note: 'Rẻ + có CDN miễn phí' },
      { label: 'Namecheap', iconSlug: 'namecheap', note: 'Cheap, lâu năm' },
      { label: 'GoDaddy', note: 'Phổ biến nhưng đắt' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. SOURCE CONTROL (cuối)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'git',
    cluster: 'source-control',
    label: 'Git',
    whatIs:
      'Tool ghi lại lịch sử thay đổi code. Như Track Changes trong Word, nhưng cho cả thư mục code, mạnh hơn nhiều. Mỗi lần lưu → 1 "snapshot" gọi là commit. Có thể quay về snapshot cũ bất cứ lúc nào.',
    whereInProject:
      'Folder `.git/` (ẩn) trong root của project lưu toàn bộ lịch sử. Không bao giờ động vào folder này thủ công — Git tự quản.',
    whenToCare:
      'Mỗi lần làm xong 1 chunk công việc → tạo 1 commit. Git là phao cứu sinh: lỡ làm hỏng thì rollback về commit gần nhất.',
    vidu:
      'Đang chỉnh giao diện admin, không ưng → `git checkout .` để rollback về commit gần nhất, mất 1 giây. Không có Git thì phải sửa thủ công ngược lại từng dòng.',
    loiThuongGap:
      'Commit cả tuần một lần với 50 file thay đổi. Khi cần rollback một chuyện cụ thể thì không tách ra được. Quy tắc: 1 commit = 1 thay đổi rõ ràng.',
    code: `git add .
git commit -m "thêm trang admin"
git log         # xem lịch sử`,
    codeLang: 'bash',
  },
  {
    id: 'github',
    cluster: 'source-control',
    label: 'GitHub',
    whatIs:
      'Dịch vụ lưu code online, dùng Git. Như Google Drive cho code, nhưng tích hợp sẵn tools cho team work: review code, theo dõi bug, deploy tự động.',
    whereInProject:
      'Repo này: github.com/hdviettt/web-app-cho-claude-code (public, ai cũng đọc được). Code mình push lên đây, Railway tự pull về để deploy.',
    whenToCare:
      'Build với Claude Code mà không push lên GitHub = code chỉ sống trên 1 máy. Máy hỏng = mất hết. Push lên GitHub = backup miễn phí + share được với team.',
    vidu:
      'Mình push commit "thêm trang admin" lên GitHub → Railway tự nhận signal → build + deploy → 3 phút sau site có trang admin mới. Không cần thao tác gì khác.',
    loiThuongGap:
      'Commit `.env` (chứa password, API key) lên GitHub. Code public → ai cũng dùng được API mình → mất tiền/dữ liệu. Quy tắc: thêm `.env` vào `.gitignore` ngay từ đầu.',
    alternatives: [
      { label: 'GitLab', iconSlug: 'gitlab', note: 'Tự host được, dùng cho team enterprise' },
      { label: 'Bitbucket', iconSlug: 'bitbucket', note: 'Tích hợp với Atlassian (Jira)' },
    ],
  },
]
