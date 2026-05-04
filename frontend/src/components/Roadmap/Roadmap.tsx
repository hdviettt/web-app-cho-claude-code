import type { CSSProperties } from 'react'
import { diagramNodes, type Alternative } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const CANVAS_W = 1200
const CANVAS_H = 3300
const SPINE_X = 600

// ─── Box variants matching roadmap.sh aesthetic ────────────────────
// yellow: primary topic on spine (clickable)
// peach:  alternative option (clickable)
// purple: sub-concept boxes (Hàm/Biến/Thư viện, HTML/CSS/JS)
// white:  info note / advanced concept

type BoxColor = 'yellow' | 'peach' | 'purple' | 'white'

interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
  color: BoxColor
}

// All clickable nodes (data-driven from diagram.ts)
const layout: Record<string, NodeLayout> = {
  // ═══ Section: Khái niệm cơ bản ═══
  language:  { x: 490, y: 320, w: 220, h: 56, color: 'yellow' },
  function:  { x: 360, y: 410, w: 130, h: 38, color: 'purple' },
  variable:  { x: 530, y: 410, w: 130, h: 38, color: 'purple' },
  library:   { x: 700, y: 410, w: 130, h: 38, color: 'purple' },

  // ═══ Section: Frontend ═══
  'fe-framework': { x: 490, y: 600, w: 220, h: 56, color: 'yellow' },
  'fe-build':     { x: 490, y: 700, w: 220, h: 56, color: 'yellow' },
  'fe-styling':   { x: 490, y: 800, w: 220, h: 56, color: 'yellow' },
  'fe-html':      { x: 360, y: 920, w: 130, h: 38, color: 'purple' },
  'fe-css':       { x: 530, y: 920, w: 130, h: 38, color: 'purple' },

  // ═══ Section: Backend ═══
  'be-framework': { x: 490, y: 1110, w: 220, h: 56, color: 'yellow' },
  'be-api':       { x: 490, y: 1210, w: 220, h: 56, color: 'yellow' },
  'be-orm':       { x: 490, y: 1310, w: 220, h: 56, color: 'yellow' },
  'be-runtime':   { x: 490, y: 1410, w: 220, h: 56, color: 'yellow' },

  // ═══ Section: Database (sub-section of backend) ═══
  // These live inside a big container — positions relative to canvas
  'db-relational': { x: 130, y: 1620, w: 150, h: 38, color: 'peach' },
  'db-nosql':      { x: 350, y: 1620, w: 150, h: 38, color: 'peach' },
  'db-cache':      { x: 700, y: 1620, w: 150, h: 38, color: 'peach' },
  'db-vector':     { x: 920, y: 1620, w: 150, h: 38, color: 'peach' },

  // ═══ Section: Source Control ═══
  git:            { x: 490, y: 1880, w: 220, h: 56, color: 'yellow' },
  github:         { x: 490, y: 1980, w: 220, h: 56, color: 'yellow' },
  branch:         { x: 360, y: 2080, w: 150, h: 42, color: 'peach' },
  'pull-request': { x: 690, y: 2080, w: 150, h: 42, color: 'peach' },

  // ═══ Section: Security ═══
  'sec-auth':   { x: 490, y: 2240, w: 220, h: 56, color: 'yellow' },
  'sec-env':    { x: 490, y: 2340, w: 220, h: 56, color: 'yellow' },
  'sec-https':  { x: 490, y: 2440, w: 220, h: 56, color: 'yellow' },
  'sec-authz':  { x: 360, y: 2540, w: 150, h: 38, color: 'peach' },
  'sec-cors':   { x: 690, y: 2540, w: 150, h: 38, color: 'peach' },

  // ═══ Section: Triển khai ═══
  'infra-hosting': { x: 490, y: 2700, w: 220, h: 56, color: 'yellow' },
  'infra-domain':  { x: 490, y: 2800, w: 220, h: 56, color: 'yellow' },
  'infra-cdn':     { x: 490, y: 2900, w: 220, h: 56, color: 'yellow' },
  'infra-docker':  { x: 360, y: 3000, w: 150, h: 38, color: 'peach' },
  'infra-cicd':    { x: 690, y: 3000, w: 150, h: 38, color: 'peach' },

  // ═══ Section: Vận hành ═══
  'ops-analytics':  { x: 130, y: 3160, w: 150, h: 38, color: 'peach' },
  'ops-logs':       { x: 320, y: 3160, w: 150, h: 38, color: 'peach' },
  'ops-monitoring': { x: 510, y: 3160, w: 150, h: 38, color: 'peach' },
  'ops-email':      { x: 700, y: 3160, w: 150, h: 38, color: 'peach' },
  'ops-storage':    { x: 890, y: 3160, w: 150, h: 38, color: 'peach' },
}

// ─── Floating section titles (no box, just bold text on spine) ────

interface SectionTitle {
  text: string
  y: number
}

const SECTIONS: SectionTitle[] = [
  { text: 'Khái niệm cơ bản', y: 230 },
  { text: 'Frontend',         y: 530 },
  { text: 'Backend',          y: 1040 },
  { text: 'Database',         y: 1540 },
  { text: 'Source Control',   y: 1810 },
  { text: 'Security',         y: 2170 },
  { text: 'Triển khai',       y: 2630 },
  { text: 'Vận hành',         y: 3090 },
]

// ─── Plain white containers (black border, no header bar) ─────────
// Label appears as plain text at top center inside container (or external).

interface Container {
  x: number
  y: number
  w: number
  h: number
  label?: string                    // text label at top inside, optional
  externalLabel?: { text: string; align: 'top' | 'left' }  // label outside container
}

const CONTAINERS: Container[] = [
  // S1: Language alts (2x3 grid) — outside-labeled
  { x: 60, y: 280, w: 380, h: 130, externalLabel: { text: 'Lựa chọn ngôn ngữ', align: 'top' } },

  // S2: Frontend Framework alts
  { x: 760, y: 580, w: 380, h: 100, externalLabel: { text: 'Framework lựa chọn', align: 'top' } },

  // S2: Frontend Build tool alts
  { x: 60, y: 690, w: 380, h: 80, externalLabel: { text: 'Build tools', align: 'top' } },

  // S2: Styling alts
  { x: 760, y: 780, w: 380, h: 100, externalLabel: { text: 'Styling lựa chọn', align: 'top' } },

  // S3: Backend Framework alts
  { x: 60, y: 1090, w: 380, h: 130, externalLabel: { text: 'Backend Framework', align: 'top' } },

  // S3: API alts
  { x: 760, y: 1190, w: 380, h: 130, externalLabel: { text: 'API Styles', align: 'top' } },

  // S3: ORM alts
  { x: 60, y: 1290, w: 380, h: 100, externalLabel: { text: 'ORM lựa chọn', align: 'top' } },

  // S3: Runtime alts
  { x: 760, y: 1390, w: 380, h: 130, externalLabel: { text: 'Server runtime', align: 'top' } },

  // S4 Database: BIG container with 4 sub-categories ─────
  { x: 50, y: 1590, w: 1100, h: 200, label: 'Database — chọn theo loại data' },

  // S6: Hosting alts
  { x: 760, y: 2680, w: 380, h: 130, externalLabel: { text: 'Hosting platform', align: 'top' } },

  // S6: Domain alts
  { x: 60, y: 2780, w: 380, h: 100, externalLabel: { text: 'Domain provider', align: 'top' } },

  // S6: CDN alts
  { x: 760, y: 2880, w: 380, h: 100, externalLabel: { text: 'CDN', align: 'top' } },

  // S5: Auth alts
  { x: 760, y: 2220, w: 380, h: 130, externalLabel: { text: 'Auth methods', align: 'top' } },

  // S5: Env vars - no alts container needed
]

// Sub-cells inside Database container (4 mini-categories)
interface SubCell {
  x: number
  y: number
  w: number
  h: number
  label: string
}

const DATABASE_SUBCELLS: SubCell[] = [
  { x: 80,  y: 1610, w: 250, h: 165, label: 'Quan hệ (Relational)' },
  { x: 350, y: 1610, w: 220, h: 165, label: 'NoSQL' },
  { x: 590, y: 1610, w: 220, h: 165, label: 'Cache' },
  { x: 830, y: 1610, w: 280, h: 165, label: 'Vector DB' },
]

// ─── Tip boxes (white bg, gray border, plain CTA-style) ────────────

interface TipBox {
  x: number
  y: number
  w: number
  h: number
  body: string
}

const TIPS: TipBox[] = [
  {
    x: 60, y: 460, w: 380, h: 80,
    body: 'Marketer non-tech: chọn 1 ngôn ngữ và build 5 dự án nhỏ trước khi học cái thứ hai. Một ngôn ngữ làm được 80% mọi thứ.',
  },
  {
    x: 760, y: 920, w: 380, h: 80,
    body: 'Đừng học HTML/CSS sâu — Claude generate được rồi. Mình chỉ cần biết phân biệt 2 cái này là gì để đọc output.',
  },
  {
    x: 60, y: 1980, w: 380, h: 80,
    body: 'Solo dev: chỉ cần Git + GitHub. Bỏ qua Branch/PR cho đến khi có team. Push code thường xuyên.',
  },
]

// ─── Edges (explicit connectors) ───────────────────────────────────

interface Edge {
  from: string         // node id or 'spine:Y' for spine point
  to: string           // node id or 'container:N' for container index
  style: 'solid' | 'dotted' | 'fan'
}

const EDGES: Edge[] = [
  // S1
  { from: 'spine:240', to: 'language', style: 'solid' },
  { from: 'language', to: 'function', style: 'solid' },
  { from: 'language', to: 'variable', style: 'solid' },
  { from: 'language', to: 'library',  style: 'solid' },
  { from: 'language', to: 'container:0', style: 'dotted' },  // language → lang container

  // S2
  { from: 'spine:540', to: 'fe-framework', style: 'solid' },
  { from: 'fe-framework', to: 'fe-build', style: 'solid' },
  { from: 'fe-build', to: 'fe-styling', style: 'solid' },
  { from: 'fe-styling', to: 'fe-html', style: 'solid' },
  { from: 'fe-styling', to: 'fe-css', style: 'solid' },
  { from: 'fe-framework', to: 'container:1', style: 'dotted' },
  { from: 'fe-build', to: 'container:2', style: 'dotted' },
  { from: 'fe-styling', to: 'container:3', style: 'dotted' },

  // S3
  { from: 'spine:1050', to: 'be-framework', style: 'solid' },
  { from: 'be-framework', to: 'be-api', style: 'solid' },
  { from: 'be-api', to: 'be-orm', style: 'solid' },
  { from: 'be-orm', to: 'be-runtime', style: 'solid' },
  { from: 'be-framework', to: 'container:4', style: 'dotted' },
  { from: 'be-api', to: 'container:5', style: 'dotted' },
  { from: 'be-orm', to: 'container:6', style: 'dotted' },
  { from: 'be-runtime', to: 'container:7', style: 'dotted' },

  // S3-DB: ORM connects down to database container
  { from: 'be-runtime', to: 'container:8', style: 'solid' },

  // S4
  { from: 'spine:1820', to: 'git', style: 'solid' },
  { from: 'git', to: 'github', style: 'solid' },
  { from: 'github', to: 'branch', style: 'solid' },
  { from: 'github', to: 'pull-request', style: 'solid' },

  // S5
  { from: 'spine:2180', to: 'sec-auth', style: 'solid' },
  { from: 'sec-auth', to: 'sec-env', style: 'solid' },
  { from: 'sec-env', to: 'sec-https', style: 'solid' },
  { from: 'sec-https', to: 'sec-authz', style: 'solid' },
  { from: 'sec-https', to: 'sec-cors', style: 'solid' },
  { from: 'sec-auth', to: 'container:12', style: 'dotted' },

  // S6
  { from: 'spine:2640', to: 'infra-hosting', style: 'solid' },
  { from: 'infra-hosting', to: 'infra-domain', style: 'solid' },
  { from: 'infra-domain', to: 'infra-cdn', style: 'solid' },
  { from: 'infra-cdn', to: 'infra-docker', style: 'solid' },
  { from: 'infra-cdn', to: 'infra-cicd', style: 'solid' },
  { from: 'infra-hosting', to: 'container:9', style: 'dotted' },
  { from: 'infra-domain', to: 'container:10', style: 'dotted' },
  { from: 'infra-cdn', to: 'container:11', style: 'dotted' },
]

// ─── Chip layout (alts inside containers) ──────────────────────────

interface ChipPlacement {
  parentId: string
  containerIdx: number  // which container they belong to
  cols: number
}

const CHIP_PLACEMENTS: ChipPlacement[] = [
  { parentId: 'language',       containerIdx: 0, cols: 2 },
  { parentId: 'fe-framework',   containerIdx: 1, cols: 2 },
  { parentId: 'fe-build',       containerIdx: 2, cols: 2 },
  { parentId: 'fe-styling',     containerIdx: 3, cols: 2 },
  { parentId: 'be-framework',   containerIdx: 4, cols: 2 },
  { parentId: 'be-api',         containerIdx: 5, cols: 2 },
  { parentId: 'be-orm',         containerIdx: 6, cols: 2 },
  { parentId: 'be-runtime',     containerIdx: 7, cols: 2 },
  { parentId: 'infra-hosting',  containerIdx: 9, cols: 2 },
  { parentId: 'infra-domain',   containerIdx: 10, cols: 2 },
  { parentId: 'infra-cdn',      containerIdx: 11, cols: 2 },
  { parentId: 'sec-auth',       containerIdx: 12, cols: 2 },
]

interface DbSubChip {
  subCellIdx: number
  parentId: string
}

const DB_SUB_CHIPS: DbSubChip[] = [
  { subCellIdx: 0, parentId: 'db-relational' },
  { subCellIdx: 1, parentId: 'db-nosql' },
  { subCellIdx: 2, parentId: 'db-cache' },
  { subCellIdx: 3, parentId: 'db-vector' },
]

// ─── Helpers ───────────────────────────────────────────────────────

function getEndpoint(ref: string): { x: number; y: number; w: number; h: number } | null {
  if (ref.startsWith('spine:')) {
    const y = parseInt(ref.split(':')[1], 10)
    return { x: SPINE_X - 1, y, w: 2, h: 0 }
  }
  if (ref.startsWith('container:')) {
    const idx = parseInt(ref.split(':')[1], 10)
    const c = CONTAINERS[idx]
    return c ? { x: c.x, y: c.y, w: c.w, h: c.h } : null
  }
  return layout[ref] ?? null
}

function edgePoints(
  from: { x: number; y: number; w: number; h: number },
  to: { x: number; y: number; w: number; h: number },
): { fx: number; fy: number; tx: number; ty: number } {
  const fcx = from.x + from.w / 2
  const fcy = from.y + from.h / 2
  const tcx = to.x + to.w / 2
  const tcy = to.y + to.h / 2
  const dx = tcx - fcx
  const dy = tcy - fcy
  if (Math.abs(dy) > Math.abs(dx)) {
    if (dy > 0) return { fx: fcx, fy: from.y + from.h, tx: tcx, ty: to.y }
    return { fx: fcx, fy: from.y, tx: tcx, ty: to.y + to.h }
  }
  if (dx > 0) return { fx: from.x + from.w, fy: fcy, tx: to.x, ty: tcy }
  return { fx: from.x, fy: fcy, tx: to.x + to.w, ty: tcy }
}

function bezier(fx: number, fy: number, tx: number, ty: number): string {
  const dx = tx - fx
  const dy = ty - fy
  if (Math.abs(dx) > Math.abs(dy)) {
    const cp = (fx + tx) / 2
    return `M ${fx} ${fy} C ${cp} ${fy}, ${cp} ${ty}, ${tx} ${ty}`
  }
  const cp = (fy + ty) / 2
  return `M ${fx} ${fy} C ${fx} ${cp}, ${tx} ${cp}, ${tx} ${ty}`
}

// ─── Chip placement compute ────────────────────────────────────────

const CHIP_W = 130
const CHIP_H = 28
const CHIP_GAP_X = 12
const CHIP_GAP_Y = 6

interface ChipPos {
  alt: Alternative
  x: number
  y: number
}

function computeChips(): ChipPos[] {
  const result: ChipPos[] = []
  for (const placement of CHIP_PLACEMENTS) {
    const node = diagramNodes.find((n) => n.id === placement.parentId)
    const container = CONTAINERS[placement.containerIdx]
    if (!node?.alternatives || !container) continue
    const alts = node.alternatives
    const cols = placement.cols
    const rows = Math.ceil(alts.length / cols)
    const gridW = cols * CHIP_W + (cols - 1) * CHIP_GAP_X
    const gridH = rows * CHIP_H + (rows - 1) * CHIP_GAP_Y
    const startX = container.x + (container.w - gridW) / 2
    const startY = container.y + (container.h - gridH) / 2
    alts.forEach((alt, i) => {
      result.push({
        alt,
        x: startX + (i % cols) * (CHIP_W + CHIP_GAP_X),
        y: startY + Math.floor(i / cols) * (CHIP_H + CHIP_GAP_Y),
      })
    })
  }
  // Database sub-cells: 1 chip per sub-category showing main alt
  for (const sub of DB_SUB_CHIPS) {
    const node = diagramNodes.find((n) => n.id === sub.parentId)
    const cell = DATABASE_SUBCELLS[sub.subCellIdx]
    if (!node?.alternatives || !cell) continue
    const alts = node.alternatives
    // 1 column inside subcell
    const startX = cell.x + (cell.w - CHIP_W) / 2
    const startY = cell.y + 60 // below subcell label + parent box
    alts.forEach((alt, i) => {
      result.push({
        alt,
        x: startX,
        y: startY + i * (CHIP_H + CHIP_GAP_Y),
      })
    })
  }
  return result
}

// ─── Component ─────────────────────────────────────────────────────

export function Roadmap({ selectedNodeId, onNodeClick }: RoadmapProps) {
  const chips = computeChips()

  return (
    <div
      style={{
        overflowX: 'auto',
        overflowY: 'visible',
        padding: '2rem 1rem 4rem',
        background: 'var(--surface)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: CANVAS_W,
          height: CANVAS_H,
          minWidth: CANVAS_W,
          margin: '0 auto',
        }}
      >
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {/* Continuous spine */}
          <path
            d={`M ${SPINE_X} 60 L ${SPINE_X} ${CANVAS_H - 30}`}
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* Plain white containers */}
          {CONTAINERS.map((c, i) => (
            <rect
              key={`c-${i}`}
              x={c.x}
              y={c.y}
              width={c.w}
              height={c.h}
              fill="white"
              stroke="#1F2937"
              strokeWidth={2}
              rx={8}
            />
          ))}

          {/* Database sub-cells */}
          {DATABASE_SUBCELLS.map((cell, i) => (
            <rect
              key={`sub-${i}`}
              x={cell.x}
              y={cell.y}
              width={cell.w}
              height={cell.h}
              fill="white"
              stroke="#1F2937"
              strokeWidth={1.5}
              rx={6}
            />
          ))}

          {/* Tip boxes */}
          {TIPS.map((tip, i) => (
            <rect
              key={`t-${i}`}
              x={tip.x}
              y={tip.y}
              width={tip.w}
              height={tip.h}
              fill="white"
              stroke="#94A3B8"
              strokeWidth={1.5}
              rx={6}
            />
          ))}

          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = getEndpoint(edge.from)
            const to = getEndpoint(edge.to)
            if (!from || !to) return null
            const { fx, fy, tx, ty } = edgePoints(from, to)
            return (
              <path
                key={`e-${i}`}
                d={bezier(fx, fy, tx, ty)}
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                strokeDasharray={edge.style === 'dotted' ? '2 5' : undefined}
                strokeLinecap="round"
              />
            )
          })}
        </svg>

        {/* Container labels (text-only, no header bar) */}
        {CONTAINERS.map((c, i) => {
          if (c.label) {
            return (
              <div
                key={`cl-${i}`}
                style={{
                  position: 'absolute',
                  left: c.x + c.w / 2,
                  top: c.y + 8,
                  transform: 'translateX(-50%)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#1F2937',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  zIndex: 3,
                  background: 'white',
                  padding: '0 8px',
                }}
              >
                {c.label}
              </div>
            )
          }
          if (c.externalLabel) {
            return (
              <div
                key={`cl-${i}`}
                style={{
                  position: 'absolute',
                  left: c.x + c.w / 2,
                  top: c.y - 18,
                  transform: 'translateX(-50%)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  zIndex: 3,
                  whiteSpace: 'nowrap',
                }}
              >
                {c.externalLabel.text}
              </div>
            )
          }
          return null
        })}

        {/* Database sub-cell labels */}
        {DATABASE_SUBCELLS.map((cell, i) => (
          <div
            key={`sc-l-${i}`}
            style={{
              position: 'absolute',
              left: cell.x + cell.w / 2,
              top: cell.y + 6,
              transform: 'translateX(-50%)',
              fontSize: 11,
              fontWeight: 700,
              color: '#1F2937',
              letterSpacing: '0.04em',
              zIndex: 3,
              background: 'white',
              padding: '0 6px',
              textTransform: 'uppercase',
            }}
          >
            {cell.label}
          </div>
        ))}

        {/* Floating section titles (no box) */}
        {SECTIONS.map((s) => (
          <div
            key={s.text}
            style={{
              position: 'absolute',
              left: '50%',
              top: s.y,
              transform: 'translateX(-50%)',
              fontSize: 22,
              fontWeight: 700,
              color: '#1F2937',
              background: 'var(--surface)',
              padding: '0 16px',
              letterSpacing: '-0.01em',
              zIndex: 3,
              whiteSpace: 'nowrap',
            }}
          >
            {s.text}
          </div>
        ))}

        {/* Tip boxes content */}
        {TIPS.map((tip, i) => (
          <div
            key={`tb-${i}`}
            style={{
              position: 'absolute',
              left: tip.x + 14,
              top: tip.y + 12,
              width: tip.w - 28,
              fontSize: 13,
              lineHeight: 1.45,
              color: '#475569',
              zIndex: 3,
              pointerEvents: 'none',
            }}
          >
            {tip.body}
          </div>
        ))}

        {/* Primary nodes */}
        {diagramNodes.map((node) => {
          const l = layout[node.id]
          if (!l) return null
          const isSelected = node.id === selectedNodeId
          return (
            <button
              key={node.id}
              type="button"
              className="roadmap-box"
              onClick={() => onNodeClick(node.id)}
              style={primaryBoxStyle(l, isSelected)}
            >
              {node.label}
            </button>
          )
        })}

        {/* Alt chips */}
        {chips.map((chip, i) => (
          <div
            key={`chip-${i}`}
            title={chip.alt.note ?? chip.alt.label}
            style={chipStyle(chip.x, chip.y)}
          >
            {chip.alt.iconSlug && (
              <img
                src={`https://cdn.simpleicons.org/${chip.alt.iconSlug}/64748b`}
                width={14}
                height={14}
                alt=""
                style={{ flexShrink: 0 }}
              />
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {chip.alt.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function primaryBoxStyle(l: NodeLayout, isSelected: boolean): CSSProperties {
  const colorMap: Record<BoxColor, { bg: string; border: string; text: string }> = {
    yellow: { bg: '#FFD93B', border: '#1F2937', text: '#1F2937' },
    peach:  { bg: '#FFE4B5', border: '#1F2937', text: '#1F2937' },
    purple: { bg: '#DDD6FE', border: '#1F2937', text: '#1F2937' },
    white:  { bg: '#FFFFFF', border: '#1F2937', text: '#1F2937' },
  }
  const c = isSelected ? { bg: '#FCA5A5', border: '#1F2937', text: '#1F2937' } : colorMap[l.color]
  return {
    all: 'unset',
    boxSizing: 'border-box',
    position: 'absolute',
    left: l.x,
    top: l.y,
    width: l.w,
    height: l.h,
    background: c.bg,
    border: `2.5px solid ${c.border}`,
    borderRadius: 7,
    boxShadow: '4px 4px 0 #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: l.h < 45 ? 13 : 14,
    fontWeight: l.h < 45 ? 500 : 600,
    color: c.text,
    cursor: 'pointer',
    textAlign: 'center',
    padding: '0 10px',
    zIndex: 4,
  }
}

function chipStyle(x: number, y: number): CSSProperties {
  return {
    position: 'absolute',
    left: x,
    top: y,
    width: CHIP_W,
    height: CHIP_H,
    background: '#FFE4B5',
    border: '1.5px solid #1F2937',
    borderRadius: 5,
    boxShadow: '2px 2px 0 #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 7,
    padding: '0 8px',
    fontSize: 11.5,
    fontWeight: 500,
    color: '#1F2937',
    zIndex: 4,
  }
}
