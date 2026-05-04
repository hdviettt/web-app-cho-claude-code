/**
 * Toàn bộ data cho roadmap "Web App với Claude Code".
 *
 * 8 section, ~36 primary node, ~50 alternative chip.
 *
 * Đối tượng đọc: marketer non-tech đang học build web app với Claude Code.
 * Voice: dùng analogies (cửa hàng, kho, sổ cái, két sắt) thay vì jargon.
 *
 * Đổi nội dung dạy → sửa file này. Đây là single source of truth.
 */

export type ClusterId =
  | 'foundations'
  | 'source-control'
  | 'frontend'
  | 'backend'
  | 'database'
  | 'security'
  | 'infra'
  | 'ops'

export interface Cluster {
  id: ClusterId
  title: string
  subtitle: string
  accent: string
}

export const clusters: Cluster[] = [
  {
    id: 'foundations',
    title: 'Khái niệm cơ bản',
    subtitle: 'Vài thuật ngữ tối thiểu để đọc hiểu được code Claude tạo ra',
    accent: '#0ea5e9',
  },
  {
    id: 'source-control',
    title: 'Source Control',
    subtitle: 'Nơi lưu code và chia sẻ với team',
    accent: '#6366f1',
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
    subtitle: 'Kho hậu cần — xử lý logic phía sau',
    accent: '#ec4899',
  },
  {
    id: 'database',
    title: 'Database',
    subtitle: 'Sổ cái — nơi data sống lâu dài',
    accent: '#f59e0b',
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
    id: 'ops',
    title: 'Vận hành',
    subtitle: 'Theo dõi sản phẩm sau khi đã live',
    accent: '#0891b2',
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
  // 1. KHÁI NIỆM CƠ BẢN
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'language',
    cluster: 'foundations',
    label: 'Ngôn ngữ lập trình',
    whatIs:
      'Cách mình ra lệnh cho máy tính. Mỗi ngôn ngữ là một bộ "ngữ pháp" riêng — như tiếng Việt vs tiếng Anh vs tiếng Nhật. Chọn ngôn ngữ là chọn phong cách viết, không phải chọn cái máy "hiểu" hay "không hiểu".',
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
  {
    id: 'function',
    cluster: 'foundations',
    label: 'Hàm',
    whatIs:
      'Một khối code làm 1 việc cụ thể, có tên. Gọi tên → chạy. Như công thức nấu ăn: tên món + nguyên liệu vào → món ra.',
    whereInProject:
      'Mở `backend/app/routes/config.py`. `get_config(db)` là một hàm. Tên `get_config` cho biết nó "lấy config". Tham số `db` là "thứ nó cần để chạy".',
    whenToCare:
      'Khi nói với Claude "thêm tính năng X", thường Claude tạo một hàm mới. Đặt tên hàm rõ ràng (động từ + danh từ) thì sau này đọc lại sẽ hiểu ngay.',
    vidu:
      '`tinh_tien(so_luong, don_gia)` — đọc tên là biết nó tính tiền dựa trên số lượng và đơn giá. Không cần đọc code bên trong.',
    loiThuongGap:
      'Đặt tên kiểu `process()`, `helper()`, `do_thing()`. 6 tháng sau quay lại không hiểu hàm làm gì. Quy tắc: tên = động từ + danh từ cụ thể.',
    code: `def tinh_tien(so_luong: int, don_gia: float) -> float:
    return so_luong * don_gia

print(tinh_tien(3, 50000))  # 150000`,
    codeLang: 'python',
  },
  {
    id: 'variable',
    cluster: 'foundations',
    label: 'Biến',
    whatIs:
      'Một cái tên gắn với một giá trị. Như nhãn dán trên hộp: hộp gọi là "thuế_VAT", giá trị bên trong là 0.1 (10%). Chỗ nào cần dùng giá trị thuế thì gõ `thue_VAT`, không gõ `0.1`.',
    whereInProject:
      'Mở `backend/app/db.py` — `DATABASE_URL` là biến đọc từ file `.env`. Mở `frontend/src/data/diagram.ts` — `clusters` và `diagramNodes` là biến chứa data của roadmap này.',
    whenToCare:
      'Khi đổi cấu hình (đổi password, đổi địa chỉ database, đổi giá), thường mình chỉ đổi giá trị của biến — không sửa logic.',
    vidu:
      '`thue_VAT = 0.1` lưu thuế 10%. Khi luật đổi thành 8%, đổi 1 chỗ: `thue_VAT = 0.08`. Toàn bộ logic dùng `thue_VAT` tự cập nhật. Không hardcode số 0.1 ở 50 chỗ.',
    loiThuongGap:
      'Hardcode số/text ở khắp nơi. Khi cần đổi → sửa 50 chỗ, sót 1 chỗ là bug. Quy tắc: giá trị xuất hiện 2+ lần → đặt làm biến.',
    code: `const thue_VAT = 0.1
const tien_truoc_thue = 100000
const tong = tien_truoc_thue * (1 + thue_VAT)`,
    codeLang: 'typescript',
  },
  {
    id: 'library',
    cluster: 'foundations',
    label: 'Thư viện',
    whatIs:
      'Code do người khác viết sẵn, đóng gói, mình import vào dùng. Như mua sốt cà chua đóng chai thay vì tự nấu — đỡ thời gian, ổn định hơn.',
    whereInProject:
      '`backend/requirements.txt` liệt kê thư viện Python (FastAPI, SQLAlchemy...). `frontend/package.json` liệt kê thư viện JS/TS (React, React Router...). Mỗi dòng = 1 thư viện.',
    whenToCare:
      'Khi Claude đề xuất "cần cài thư viện X", thường nên đồng ý. Tránh khi: thư viện quá lạ (ít người dùng), lâu không có update, hoặc mục tiêu là tự học.',
    vidu:
      'Project này không tự viết HTTP server từ đầu — dùng FastAPI. Không tự viết logic database — dùng SQLAlchemy. Không tự render UI — dùng React. Phần "nặng" do thư viện làm.',
    loiThuongGap:
      'Cài quá nhiều thư viện không cần thiết. Project to ra, build chậm, dễ bug, dễ bị "supply chain attack". Quy tắc: chỉ cài khi thật sự cần.',
    alternatives: [
      { label: 'npm', iconSlug: 'npm', note: 'Package manager cho JS/TS' },
      { label: 'pip', iconSlug: 'pypi', note: 'Package manager cho Python' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. SOURCE CONTROL
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
      'Anh push commit "thêm trang admin" lên GitHub → Railway tự nhận signal → build + deploy → 3 phút sau site có trang admin mới. Không cần thao tác gì khác.',
    loiThuongGap:
      'Commit `.env` (chứa password, API key) lên GitHub. Code public → ai cũng dùng được API mình → mất tiền/dữ liệu. Quy tắc: thêm `.env` vào `.gitignore` ngay từ đầu.',
    alternatives: [
      { label: 'GitLab', iconSlug: 'gitlab', note: 'Tự host được, dùng cho team enterprise' },
      { label: 'Bitbucket', iconSlug: 'bitbucket', note: 'Tích hợp với Atlassian (Jira)' },
    ],
  },
  {
    id: 'branch',
    cluster: 'source-control',
    label: 'Branch & Commit',
    whatIs:
      'Branch = nhánh code song song. Như Google Doc có nhiều version draft. `main` là branch chính (production). `feature/x` là nhánh thử nghiệm. Code trên feature branch không ảnh hưởng main.',
    whereInProject:
      'Project này hiện chỉ có branch `main`. Khi team to lên, mỗi tính năng mới làm trên branch riêng, xong mới merge vào main.',
    whenToCare:
      'Solo developer: thường chỉ cần `main`. Team từ 2 người: dùng feature branch để không đè lên nhau khi cùng sửa code.',
    vidu:
      'Anh và đồng nghiệp cùng sửa frontend. Anh làm trên `feature/dark-mode`, đồng nghiệp làm trên `feature/admin-panel`. Cả 2 không đụng nhau. Xong việc, mỗi người mở Pull Request để merge vào main.',
    loiThuongGap:
      'Commit thẳng lên `main` mà không test. Bug đẩy thẳng production = user thấy ngay. Quy tắc: dùng feature branch + Pull Request cho mọi thay đổi quan trọng.',
  },
  {
    id: 'pull-request',
    cluster: 'source-control',
    label: 'Pull Request',
    whatIs:
      'Yêu cầu merge code từ feature branch vào main. Đi kèm review từ team — đồng nghiệp đọc code mình, comment "chỗ này nên sửa", approve thì mới merge.',
    whereInProject:
      'Chưa có PR nào trong repo này (Viet làm 1 mình). Khi mở repo cho team, mọi thay đổi sẽ qua PR.',
    whenToCare:
      'Team từ 2 người trở lên. PR là chỗ cản bug + share kiến thức. Người mới vào team đọc PR cũ là cách nhanh nhất hiểu codebase.',
    vidu:
      'Mở PR "thêm dark mode" → đồng nghiệp comment "anh quên handle nút toggle" → fix → push commit mới → PR auto-update → approve → merge. Không có PR = bug lọt vào main.',
    loiThuongGap:
      'PR quá to (50+ files). Reviewer mệt, review sơ → bug lọt. Quy tắc: PR nhỏ, mỗi PR 1 mục đích rõ ràng. Tách thành nhiều PR nhỏ thay vì 1 PR khổng lồ.',
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. FRONTEND
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
      'Component `<DetailPanel>` trong project này hiện thông tin của 1 node. Cùng cấu trúc, hiển thị 36 lần với 36 data khác nhau. Nếu không có React, phải copy-paste 36 lần.',
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
    id: 'fe-build',
    cluster: 'frontend',
    label: 'Build tool',
    whatIs:
      'Tool đóng gói code TypeScript/React thành file HTML/CSS/JS mà trình duyệt hiểu. Trình duyệt không hiểu trực tiếp TypeScript — phải "compile" trước. Build tool làm việc đó tự động.',
    whereInProject:
      'Project dùng Vite. Lệnh `npm run dev` chạy Vite trong dev mode (auto reload khi sửa code). `npm run build` build ra file production trong `frontend/dist/`.',
    whenToCare:
      'Khi build dự án mới, Claude Code thường tự chọn Vite (mặc định, nhanh nhất). Hiếm khi cần tự chọn build tool.',
    vidu:
      'Sửa file `Roadmap.tsx`, save. Vite tự build lại + reload trang trong 100ms — thấy thay đổi ngay. Production build: `npm run build` ra 1 file JS gzipped 83KB cho cả 36 component.',
    loiThuongGap:
      'Dùng Webpack cho dự án nhỏ. Webpack rất mạnh nhưng cấu hình phức tạp. Quy tắc: Vite cho mọi dự án mới, Webpack chỉ khi đã có lý do cụ thể.',
    alternatives: [
      { label: 'Vite', iconSlug: 'vite', note: 'Mặc định cho dự án mới — nhanh' },
      { label: 'Webpack', iconSlug: 'webpack', note: 'Cũ, nhiều cấu hình, dự án enterprise' },
    ],
  },
  {
    id: 'fe-styling',
    cluster: 'frontend',
    label: 'Styling',
    whatIs:
      'Cách tô màu, sắp xếp layout, làm đẹp UI. Frontend = nội dung; Styling = trang điểm cho nội dung. Mỗi tool styling có "phong cách viết" riêng.',
    whereInProject:
      'Project này dùng inline styles + CSS variables (đơn giản nhất, ít magic). Xem `frontend/src/index.css` cho biến CSS toàn cục (`--primary`, `--bg`).',
    whenToCare:
      'Mọi dự án đều cần styling. Tailwind là lựa chọn an toàn nhất hiện nay — Claude Code rất giỏi viết Tailwind class. Nhưng dự án nhỏ thì inline style cũng đủ.',
    vidu:
      'Tailwind: `<button class="bg-blue-500 text-white px-4 py-2 rounded">Click</button>` — đọc class là biết style. CSS thuần: phải mở file CSS riêng để xem.',
    loiThuongGap:
      'Mix nhiều tool styling trong cùng project (Tailwind + CSS Modules + styled-components). Hỗn loạn. Quy tắc: chọn 1 tool, dùng nhất quán.',
    alternatives: [
      { label: 'Tailwind CSS', iconSlug: 'tailwindcss', note: 'Phổ biến nhất, Claude rất giỏi' },
      { label: 'CSS Modules', iconSlug: 'css', note: 'Truyền thống, nhiều dự án cũ' },
      { label: 'shadcn/ui', iconSlug: 'shadcnui', note: 'Component library trên Tailwind' },
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

  // ═══════════════════════════════════════════════════════════════
  // 4. BACKEND
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'be-framework',
    cluster: 'backend',
    label: 'Framework',
    whatIs:
      'Bộ công cụ build server backend. Cung cấp sẵn router (URL → hàm xử lý), middleware (xử lý request trước khi đến hàm chính), và pattern chuẩn. Không phải tự viết server từ đầu.',
    whereInProject:
      'Project dùng FastAPI (Python). Xem `backend/app/main.py` — chỉ cần `app = FastAPI()` và `app.include_router(...)` là có server hoàn chỉnh.',
    whenToCare:
      'Mỗi backend đều cần framework. Chọn framework theo ngôn ngữ: Python → FastAPI, Node → Express/Hono, Go → Gin/Echo. Claude Code biết tất cả.',
    vidu:
      'FastAPI tự generate trang `/docs` (Swagger UI) liệt kê tất cả endpoint, có chỗ test luôn — không cần Postman. Đó là tính năng built-in của framework.',
    loiThuongGap:
      'Tự viết HTTP server từ scratch để "học sâu". Tốn thời gian, code thiếu features (CORS, validation, docs). Quy tắc: dùng framework phổ biến cho mọi dự án thật.',
    alternatives: [
      { label: 'FastAPI', iconSlug: 'fastapi', note: 'Python, modern, auto-doc' },
      { label: 'Express', iconSlug: 'express', note: 'Node.js, lâu đời, nhiều người dùng' },
      { label: 'Rails', iconSlug: 'rubyonrails', note: 'Ruby, "convention over config"' },
      { label: 'Django', iconSlug: 'django', note: 'Python, full-featured cho dự án to' },
    ],
  },
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
    ],
  },
  {
    id: 'be-orm',
    cluster: 'backend',
    label: 'ORM',
    whatIs:
      '"Phiên dịch" giữa code và database. Thay vì viết SQL trực tiếp, viết Python class → ORM tự generate SQL. An toàn hơn (không bị SQL injection), code đọc dễ hơn.',
    whereInProject:
      'Project dùng SQLAlchemy. Xem `backend/app/models.py` — `class SiteConfig(Base)` là 1 ORM model, map sang bảng `site_config` trong Postgres.',
    whenToCare:
      'Mỗi backend có database thường dùng ORM. Trừ khi viết query phức tạp lạ kiểu (analytics, reporting), thì bypass ORM dùng SQL thuần.',
    vidu:
      '`db.get(SiteConfig, "site_title")` (Python) tự generate `SELECT * FROM site_config WHERE key = \'site_title\'` (SQL). Mình không phải nhớ cú pháp SQL.',
    loiThuongGap:
      'Lạm dụng ORM cho mọi query. Một số query rất phức tạp (joins lớn, aggregations) thì SQL thuần nhanh hơn 10x. Quy tắc: ORM cho 90% case, SQL thuần cho 10% performance-critical.',
    alternatives: [
      { label: 'SQLAlchemy', note: 'Python, mature, mạnh nhất' },
      { label: 'Prisma', iconSlug: 'prisma', note: 'TypeScript/Node, type-safe' },
      { label: 'Drizzle', note: 'TypeScript, mới hơn, gần SQL hơn' },
    ],
  },
  {
    id: 'be-runtime',
    cluster: 'backend',
    label: 'Server runtime',
    whatIs:
      '"Động cơ" chạy code backend trên server. Code Python không tự chạy — cần một runtime nhận request HTTP và đưa vào code. Như xe có động cơ, runtime là động cơ của backend.',
    whereInProject:
      'Lệnh `uvicorn app.main:app` trong `Dockerfile` — Uvicorn là runtime cho FastAPI. Nó listen port, nhận request, gọi hàm Python tương ứng.',
    whenToCare:
      'Khi deploy production, cần chọn runtime đủ mạnh để xử lý nhiều request đồng thời. Cho 95% case, runtime mặc định của framework là đủ.',
    vidu:
      'Dev local: `uvicorn --reload` (auto reload khi sửa code). Production: `uvicorn --workers 4` (4 process song song xử lý request). Same code, khác config.',
    loiThuongGap:
      'Quên đổi runtime config khi đi production (vẫn dùng `--reload`). Performance kém. Quy tắc: dev và prod dùng config khác nhau.',
    alternatives: [
      { label: 'Uvicorn', note: 'Cho FastAPI, chuẩn' },
      { label: 'Gunicorn', note: 'Truyền thống cho Python' },
      { label: 'Node', iconSlug: 'nodedotjs', note: 'Cho Express/Hono' },
      { label: 'Bun', iconSlug: 'bun', note: 'Mới, nhanh hơn Node 3x' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. DATABASE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'db-relational',
    cluster: 'database',
    label: 'Relational DB',
    whatIs:
      'Database tổ chức data theo bảng (như Excel): hàng và cột. Các bảng nối với nhau qua "khóa" (id). Phù hợp cho 90% web app — user, post, đơn hàng, etc.',
    whereInProject:
      'Project dùng PostgreSQL trên Railway. Schema (cấu trúc bảng) ở `backend/init.sql` — 2 bảng: `site_config` và `admin_session`.',
    whenToCare:
      'Mặc định cho mọi web app SMB. Khi không chắc chọn loại DB nào → chọn Postgres. Mạnh, miễn phí, Claude Code rất quen.',
    vidu:
      'Bảng `users` có cột id, email, password. Bảng `posts` có cột id, user_id, content. user_id ở `posts` link đến id ở `users` — đó là "relational".',
    loiThuongGap:
      'Bắt đầu với MongoDB vì "trendier" rồi đổi sang Postgres khi data phức tạp lên. Tốn công migrate. Quy tắc: bắt đầu với Postgres, đổi sau nếu cần.',
    alternatives: [
      { label: 'PostgreSQL', iconSlug: 'postgresql', note: 'Mặc định cho mọi dự án' },
      { label: 'MySQL', iconSlug: 'mysql', note: 'Cũ, nhiều dự án legacy' },
      { label: 'SQLite', iconSlug: 'sqlite', note: 'File đơn, cho dự án rất nhỏ' },
    ],
  },
  {
    id: 'db-nosql',
    cluster: 'database',
    label: 'NoSQL DB',
    whatIs:
      'Database không theo bảng cố định. Lưu data dạng "document" (như JSON) — mỗi record có cấu trúc khác nhau. Linh hoạt hơn, nhưng khó cho data có quan hệ phức tạp.',
    whereInProject:
      'Project này KHÔNG dùng NoSQL. Nhưng nếu mình build app cần lưu document linh hoạt (ví dụ: profile user với schema thay đổi liên tục), MongoDB là lựa chọn.',
    whenToCare:
      'Hiếm khi cần. Trừ khi schema thay đổi nhanh hoặc data cực lớn (Big Data). 95% web app dùng Postgres tốt hơn.',
    vidu:
      'MongoDB lưu document: `{ _id: 123, name: "Việt", interests: ["AI", "SEO"], custom_field: "..."}`. Document khác có thể không có `interests` mà có field khác — không cần khai báo trước.',
    loiThuongGap:
      'Dùng MongoDB cho web app thường. Sau 6 tháng nhận ra data có quan hệ phức tạp, query khó. Quy tắc: chỉ chọn NoSQL khi đã rõ lý do, không vì "trend".',
    alternatives: [
      { label: 'MongoDB', iconSlug: 'mongodb', note: 'Document DB phổ biến nhất' },
      { label: 'DynamoDB', iconSlug: 'amazondynamodb', note: 'AWS, cho scale lớn' },
    ],
  },
  {
    id: 'db-cache',
    cluster: 'database',
    label: 'Cache',
    whatIs:
      'Database tốc độ cao, lưu tạm trong RAM. Dùng để lưu data hay đọc nhưng ít đổi (config, kết quả query nặng). Đọc từ cache nhanh hơn 100x so với DB chính.',
    whereInProject:
      'Project này KHÔNG có cache (quy mô nhỏ, chưa cần). Khi traffic to lên, có thể thêm Redis để cache response của `/config` (đỡ hit DB mỗi lần).',
    whenToCare:
      'Khi DB query chậm hoặc traffic lớn. Dấu hiệu: page load chậm, DB tốn nhiều CPU. Thêm cache thường giải quyết được.',
    vidu:
      'API gọi `/config` trả ra cùng 1 kết quả mọi lần. Thay vì SELECT từ DB mỗi request (mất 50ms), cache 60 giây trong Redis (mất 1ms). 50x nhanh hơn.',
    loiThuongGap:
      'Cache mọi thứ "for the lulz". Khi data đổi mà cache chưa expire → user thấy data cũ. Quy tắc: chỉ cache cái ít đổi, set TTL hợp lý.',
    alternatives: [
      { label: 'Redis', iconSlug: 'redis', note: 'Phổ biến nhất, mạnh' },
      { label: 'Memcached', note: 'Đơn giản hơn Redis, ít features' },
    ],
  },
  {
    id: 'db-vector',
    cluster: 'database',
    label: 'Vector DB',
    whatIs:
      'Database lưu "embedding" — vector số biểu diễn ý nghĩa của text/ảnh. Cho phép search "ý nghĩa tương tự" thay vì khớp text chính xác. Cốt lõi của AI-powered apps (RAG, semantic search).',
    whereInProject:
      'Project này không dùng. Nhưng nếu build chatbot trả lời từ docs công ty, hoặc semantic search SEO, cần vector DB.',
    whenToCare:
      'Bất cứ dự án AI nào dùng "Retrieval-Augmented Generation" (RAG): user hỏi → search docs → đưa context vào prompt cho Claude/GPT → trả lời. Search bước 2 cần vector DB.',
    vidu:
      'pgvector (extension cho Postgres) cho phép thêm cột `embedding vector(1536)` vào bảng. Search "tìm doc tương tự" với 1 dòng SQL. Không cần dùng DB riêng.',
    loiThuongGap:
      'Dùng Pinecone cho dự án nhỏ (overkill, $70/tháng). Quy tắc: bắt đầu với pgvector (free, đã có Postgres), đổi sau nếu cần scale.',
    alternatives: [
      { label: 'pgvector', iconSlug: 'postgresql', note: 'Extension cho Postgres, free' },
      { label: 'Pinecone', note: 'Managed service, scale lớn' },
      { label: 'Weaviate', note: 'Open source, nhiều features' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. SECURITY
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
  // 7. TRIỂN KHAI
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
      'Hiện dùng URL Railway tự sinh (frontend-production-...up.railway.app). Buổi 2 anh sẽ demo trỏ Cloudflare DNS sang URL đó.',
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
  {
    id: 'infra-cdn',
    cluster: 'infra',
    label: 'CDN',
    whatIs:
      'Content Delivery Network — mạng lưới server toàn cầu, cache file tĩnh (ảnh, JS, CSS) gần user. User Hà Nội load file từ server Singapore (10ms) thay vì Mỹ (200ms).',
    whereInProject:
      'Cloudflare CDN auto-active khi config domain qua Cloudflare. Không config gì thêm.',
    whenToCare:
      'Mọi web app có user toàn cầu. CDN miễn phí (Cloudflare) làm site nhanh gấp 5-10 lần ở các vùng xa server.',
    vidu:
      'User Mỹ load ảnh logo: lần đầu fetch từ server Việt Nam (chậm). CDN cache lại trên edge server gần user → lần sau load từ edge (nhanh).',
    loiThuongGap:
      'Cache file động (như API response cá nhân hóa) thay vì static. User A thấy data của user B. Quy tắc: chỉ cache file tĩnh (ảnh, JS, CSS), không cache API data.',
    alternatives: [
      { label: 'Cloudflare CDN', iconSlug: 'cloudflare', note: 'Free tier mạnh' },
      { label: 'Vercel Edge', iconSlug: 'vercel', note: 'Tích hợp với Vercel hosting' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. VẬN HÀNH
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'ops-logs',
    cluster: 'ops',
    label: 'Logs',
    whatIs:
      'Lịch sử mọi thứ xảy ra trên server: request đến, response, error. Khi có bug → đọc log để biết "lúc đó server làm gì". Không có log = mò trong bóng tối.',
    whereInProject:
      'Railway dashboard có tab "Logs" cho mỗi service. Live tail. FastAPI in log mỗi request ra stdout → Railway capture.',
    whenToCare:
      'Mỗi production app cần log. Khi user báo "site lỗi" → mở log xem timestamp đó có gì → debug.',
    vidu:
      'User báo "tôi click save mà không lưu được". Mở log Railway, filter theo timestamp → thấy `ERROR: connection to database refused`. Biết ngay: DB rớt.',
    loiThuongGap:
      'Log mọi thứ kể cả password (`logger.info(f"login attempt: {password}")`). Password leak vào log. Quy tắc: không log data nhạy cảm, dùng log level (debug/info/error) phân loại.',
  },
  {
    id: 'ops-monitoring',
    cluster: 'ops',
    label: 'Monitoring',
    whatIs:
      'Tự động phát hiện + báo khi có bug, crash, performance kém. Không phải đợi user complain — system tự alert qua email/Slack ngay khi có lỗi.',
    whereInProject:
      'Project chưa có. Cho production thật, nên thêm Sentry (free tier 5k errors/tháng) — log mọi exception, gửi alert.',
    whenToCare:
      'Mọi production app có user thật. Càng sớm càng tốt — chậm 1 giờ phát hiện bug = 1000 user gặp lỗi.',
    vidu:
      'Sentry: backend throw exception → Sentry capture stack trace + context → alert Slack/email trong 30 giây. Mình biết bug trước user complain.',
    loiThuongGap:
      'Set up monitoring nhưng không config alert → bug log vô tận, không ai đọc. Quy tắc: alert đến channel có người trực, snooze duplicate.',
    alternatives: [
      { label: 'Sentry', iconSlug: 'sentry', note: 'Phổ biến nhất, free tier ổn' },
      { label: 'Datadog', iconSlug: 'datadog', note: 'Enterprise, đắt nhưng full features' },
    ],
  },
  {
    id: 'ops-analytics',
    cluster: 'ops',
    label: 'Analytics',
    whatIs:
      'Đo "user làm gì trên site". Bao nhiêu user/ngày, page nào nhiều view nhất, conversion rate ở bước nào, etc. Khác với monitoring — analytics đo hành vi, monitoring đo health.',
    whereInProject:
      'Project chưa có. Thêm Plausible (privacy-friendly) hoặc Google Analytics (free, mạnh hơn nhưng phức tạp).',
    whenToCare:
      'Khi có user thật. Marketer đặc biệt quan tâm: conversion, retention, funnel. Không có analytics = không biết product có work không.',
    vidu:
      'Plausible: thấy "70% user vào landing → 30% click CTA → 5% đăng ký". Drop ở bước 2 → cần A/B test CTA mới.',
    loiThuongGap:
      'Cài GA4 mà không set up event/conversion. Chỉ thấy pageview, không thấy hành vi quan trọng. Quy tắc: define event chính (signup, purchase) ngay khi cài.',
    alternatives: [
      { label: 'Plausible', iconSlug: 'plausibleanalytics', note: 'Privacy-friendly, đơn giản' },
      { label: 'GA4', iconSlug: 'googleanalytics', note: 'Free, mạnh, phức tạp' },
      { label: 'Umami', iconSlug: 'umami', note: 'Open source, tự host' },
    ],
  },
  {
    id: 'ops-email',
    cluster: 'ops',
    label: 'Email',
    whatIs:
      'Gửi email từ app: confirmation đăng ký, reset password, newsletter. Cần dịch vụ chuyên (SendGrid, Resend) — không tự host SMTP server (sẽ vào spam folder).',
    whereInProject:
      'Project hiện chưa gửi email. Khi thêm signup flow, cần Resend hoặc SendGrid để gửi email "welcome" / "verify".',
    whenToCare:
      'Mọi web app có user authentication thường cần. Verify email, reset password, alert. Marketing email là nhánh khác (Mailchimp, ConvertKit).',
    vidu:
      'Resend: API call `resend.emails.send({ to, subject, html })` → email đến hộp thư user trong 5 giây. Dashboard tracking open/click rate.',
    loiThuongGap:
      'Tự host SMTP. Email từ IP cá nhân/server lạ → Gmail/Outlook đánh spam ngay. Quy tắc: dùng dịch vụ chuyên, có warmed-up IP.',
    alternatives: [
      { label: 'Resend', iconSlug: 'resend', note: 'Modern, dev-friendly' },
      { label: 'SendGrid', iconSlug: 'maildotru', note: 'Lâu đời, scale lớn' },
      { label: 'Nodemailer', note: 'Library Node để gửi qua SMTP' },
    ],
  },
  {
    id: 'ops-storage',
    cluster: 'ops',
    label: 'Object Storage',
    whatIs:
      'Lưu file lớn (ảnh, video, PDF) ngoài database. DB không nên lưu file lớn — chậm, đắt. Object storage rẻ ($0.015/GB/tháng) và tối ưu cho file.',
    whereInProject:
      'Project chưa có. Khi thêm upload ảnh (avatar user, ảnh sản phẩm), cần Cloudflare R2 hoặc AWS S3.',
    whenToCare:
      'Mọi app cho user upload file. Đừng lưu base64 trong DB — DB to nhanh chóng, query chậm dần.',
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
]
