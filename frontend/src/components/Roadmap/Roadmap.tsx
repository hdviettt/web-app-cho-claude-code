import type { CSSProperties } from 'react'
import { diagramNodes, type Alternative } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const CANVAS_W = 1200
const CANVAS_H = 3500
const SPINE_X = 600

// ─── Node positions ────────────────────────────────────────────────

interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
  variant?: 'primary' | 'sub' | 'mini' // sub = purple, mini = smaller
}

const layout: Record<string, NodeLayout> = {
  // ═══ S1: Khái niệm cơ bản (y=0-340) ═══
  language: { x: 490, y: 130, w: 220, h: 60, variant: 'primary' },
  function: { x: 320, y: 240, w: 140, h: 42, variant: 'sub' },
  variable: { x: 490, y: 240, w: 140, h: 42, variant: 'sub' },
  library:  { x: 660, y: 240, w: 140, h: 42, variant: 'sub' },

  // ═══ S2: Frontend (y=400-980) ═══
  'fe-framework': { x: 490, y: 540, w: 220, h: 60, variant: 'primary' },
  'fe-build':     { x: 490, y: 660, w: 220, h: 60, variant: 'primary' },
  'fe-styling':   { x: 490, y: 780, w: 220, h: 60, variant: 'primary' },
  'fe-html':      { x: 380, y: 900, w: 140, h: 40, variant: 'sub' },
  'fe-css':       { x: 540, y: 900, w: 140, h: 40, variant: 'sub' },

  // ═══ S3: Backend + Database container (y=1040-2080) ═══
  'be-framework': { x: 490, y: 1170, w: 220, h: 60, variant: 'primary' },
  'be-api':       { x: 490, y: 1290, w: 220, h: 60, variant: 'primary' },
  'be-orm':       { x: 490, y: 1410, w: 220, h: 60, variant: 'primary' },
  'be-runtime':   { x: 490, y: 1530, w: 220, h: 60, variant: 'primary' },

  // Database nested container @ y=1640
  'db-relational': { x: 250, y: 1750, w: 180, h: 50, variant: 'primary' },
  'db-nosql':      { x: 460, y: 1750, w: 180, h: 50, variant: 'primary' },
  'db-cache':      { x: 670, y: 1750, w: 180, h: 50, variant: 'primary' },
  'db-vector':     { x: 880, y: 1750, w: 180, h: 50, variant: 'primary' },

  // ═══ S4: Source Control (y=2150-2400) ═══
  git:            { x: 110, y: 2240, w: 170, h: 56, variant: 'primary' },
  github:         { x: 330, y: 2240, w: 170, h: 56, variant: 'primary' },
  branch:         { x: 550, y: 2240, w: 170, h: 56, variant: 'primary' },
  'pull-request': { x: 770, y: 2240, w: 170, h: 56, variant: 'primary' },

  // ═══ S5: Security (y=2470-2740) ═══
  'sec-auth':   { x: 80,  y: 2580, w: 180, h: 56, variant: 'primary' },
  'sec-authz':  { x: 290, y: 2580, w: 180, h: 56, variant: 'primary' },
  'sec-env':    { x: 510, y: 2580, w: 180, h: 56, variant: 'primary' },
  'sec-https':  { x: 730, y: 2580, w: 180, h: 56, variant: 'primary' },
  'sec-cors':   { x: 940, y: 2580, w: 180, h: 56, variant: 'primary' },

  // ═══ S6: Triển khai (y=2810-3080) ═══
  'infra-docker':  { x: 60,  y: 2920, w: 180, h: 56, variant: 'primary' },
  'infra-hosting': { x: 280, y: 2920, w: 180, h: 56, variant: 'primary' },
  'infra-cicd':    { x: 500, y: 2920, w: 180, h: 56, variant: 'primary' },
  'infra-domain':  { x: 720, y: 2920, w: 180, h: 56, variant: 'primary' },
  'infra-cdn':     { x: 940, y: 2920, w: 180, h: 56, variant: 'primary' },

  // ═══ S7: Vận hành (y=3150-3450) ═══
  'ops-logs':       { x: 60,  y: 3260, w: 180, h: 56, variant: 'primary' },
  'ops-monitoring': { x: 280, y: 3260, w: 180, h: 56, variant: 'primary' },
  'ops-analytics':  { x: 500, y: 3260, w: 180, h: 56, variant: 'primary' },
  'ops-email':      { x: 720, y: 3260, w: 180, h: 56, variant: 'primary' },
  'ops-storage':    { x: 940, y: 3260, w: 180, h: 56, variant: 'primary' },
}

// ─── Section anchors ──────────────────────────────────────────────

interface Anchor {
  label: string
  x: number
  y: number
  w: number
  h: number
}

const ANCHORS: Anchor[] = [
  { label: 'Khái niệm cơ bản', x: 470, y: 30,   w: 260, h: 60 },
  { label: 'Frontend',         x: 540, y: 430,  w: 120, h: 56 },
  { label: 'Backend',          x: 540, y: 1070, w: 120, h: 56 },
  { label: 'Source Control',   x: 510, y: 2160, w: 180, h: 56 },
  { label: 'Security',         x: 540, y: 2490, w: 120, h: 56 },
  { label: 'Triển khai',       x: 540, y: 2830, w: 120, h: 56 },
  { label: 'Vận hành',         x: 540, y: 3170, w: 120, h: 56 },
]

// ─── Container boxes (with header bars) ────────────────────────────

interface Container {
  x: number
  y: number
  w: number
  h: number
  label: string
  accent: string
  nested?: boolean // for inner containers like Database inside Backend
}

const CONTAINERS: Container[] = [
  // S2: Frontend Stack
  { x: 50, y: 510, w: 1100, h: 460, label: 'FRONTEND STACK', accent: '#7c3aed' },

  // S3: Backend Server (outer big container)
  { x: 50, y: 1140, w: 1100, h: 920, label: 'BACKEND SERVER', accent: '#ec4899' },

  // S3 inner: Database (nested inside Backend)
  { x: 80, y: 1660, w: 1040, h: 380, label: 'DATABASE', accent: '#f59e0b', nested: true },

  // S5: Security checklist
  { x: 30, y: 2550, w: 1140, h: 200, label: 'SECURITY CHECKLIST', accent: '#dc2626' },

  // S6: Pipeline
  { x: 30, y: 2890, w: 1140, h: 200, label: 'PIPELINE TRIỂN KHAI', accent: '#10b981' },

  // S7: Observability
  { x: 30, y: 3230, w: 1140, h: 220, label: 'OBSERVABILITY + TÍCH HỢP', accent: '#0891b2' },
]

// ─── Tip boxes (helpful notes between sections) ────────────────────

interface TipBox {
  x: number
  y: number
  w: number
  h: number
  title: string
  body: string
}

const TIPS: TipBox[] = [
  {
    x: 50, y: 200, w: 380, h: 130,
    title: 'Lời khuyên cho marketer',
    body: 'Chọn 1 ngôn ngữ — Python (cho AI) hoặc TypeScript (cho web). Build 5 dự án nhỏ trước khi học ngôn ngữ thứ hai.',
  },
  {
    x: 770, y: 200, w: 380, h: 130,
    title: 'Quy tắc đặt tên',
    body: 'Hàm = động từ + danh từ (tinh_tien, gui_email). Biến = danh từ rõ nghĩa (tien_thue, danh_sach_user). Đặt tên tốt > viết code phức tạp.',
  },
  {
    x: 50, y: 1000, w: 540, h: 110,
    title: 'Frontend = mặt tiền cửa hàng',
    body: 'Khách thấy frontend đầu tiên, đẹp xấu quyết định first impression. Marketer non-tech: dùng Tailwind + shadcn/ui. Claude rất giỏi với combo này.',
  },
  {
    x: 610, y: 1000, w: 540, h: 110,
    title: 'Đừng học HTML/CSS sâu',
    body: 'Claude generate HTML/CSS được rồi. Mình chỉ cần biết phân biệt 2 cái đó là gì để đọc được output. Tập trung vào framework + styling.',
  },
  {
    x: 50, y: 2400, w: 540, h: 90,
    title: 'Workflow GitHub cho người mới',
    body: 'Solo dev: chỉ cần Git + GitHub. Bỏ qua Branch/PR cho đến khi có team 2+ người. Push commit thường xuyên — code không trên GitHub = không tồn tại.',
  },
  {
    x: 610, y: 2400, w: 540, h: 90,
    title: 'Auth chuẩn',
    body: 'Đừng tự code login từ đầu. Dùng OAuth (đăng nhập qua Google/GitHub) là rẻ, nhanh, an toàn nhất cho dự án mới.',
  },
]

// ─── Edges (explicit connectors) ───────────────────────────────────

interface Edge {
  from: string
  to: string
  style: 'solid' | 'arrow' | 'dotted'
}

const EDGES: Edge[] = [
  // S1
  { from: 'anchor:Khái niệm cơ bản', to: 'language', style: 'solid' },
  { from: 'language', to: 'function', style: 'solid' },
  { from: 'language', to: 'variable', style: 'solid' },
  { from: 'language', to: 'library',  style: 'solid' },

  // S2
  { from: 'anchor:Frontend', to: 'fe-framework', style: 'solid' },
  { from: 'fe-framework', to: 'fe-build', style: 'solid' },
  { from: 'fe-build', to: 'fe-styling', style: 'solid' },
  { from: 'fe-styling', to: 'fe-html', style: 'solid' },
  { from: 'fe-styling', to: 'fe-css', style: 'solid' },

  // S3
  { from: 'anchor:Backend', to: 'be-framework', style: 'solid' },
  { from: 'be-framework', to: 'be-api', style: 'solid' },
  { from: 'be-api', to: 'be-orm', style: 'solid' },
  { from: 'be-orm', to: 'be-runtime', style: 'solid' },
  { from: 'be-orm', to: 'db-relational', style: 'dotted' },
  { from: 'be-orm', to: 'db-nosql', style: 'dotted' },
  { from: 'be-orm', to: 'db-cache', style: 'dotted' },
  { from: 'be-orm', to: 'db-vector', style: 'dotted' },

  // S4
  { from: 'anchor:Source Control', to: 'git', style: 'solid' },
  { from: 'git', to: 'github', style: 'arrow' },
  { from: 'github', to: 'branch', style: 'arrow' },
  { from: 'branch', to: 'pull-request', style: 'arrow' },

  // S5
  { from: 'anchor:Security', to: 'sec-auth', style: 'solid' },
  { from: 'anchor:Security', to: 'sec-authz', style: 'solid' },
  { from: 'anchor:Security', to: 'sec-env', style: 'solid' },
  { from: 'anchor:Security', to: 'sec-https', style: 'solid' },
  { from: 'anchor:Security', to: 'sec-cors', style: 'solid' },

  // S6
  { from: 'anchor:Triển khai', to: 'infra-docker', style: 'solid' },
  { from: 'infra-docker', to: 'infra-hosting', style: 'arrow' },
  { from: 'infra-hosting', to: 'infra-cicd', style: 'arrow' },
  { from: 'infra-cicd', to: 'infra-domain', style: 'arrow' },
  { from: 'infra-domain', to: 'infra-cdn', style: 'arrow' },

  // S7
  { from: 'anchor:Vận hành', to: 'ops-logs', style: 'solid' },
  { from: 'anchor:Vận hành', to: 'ops-monitoring', style: 'solid' },
  { from: 'anchor:Vận hành', to: 'ops-analytics', style: 'solid' },
  { from: 'anchor:Vận hành', to: 'ops-email', style: 'solid' },
  { from: 'anchor:Vận hành', to: 'ops-storage', style: 'solid' },
]

// ─── Chip layout per node ──────────────────────────────────────────

interface ChipPlacement {
  parentId: string
  layout: 'fan-right' | 'fan-left' | 'grid-right' | 'grid-left' | 'row-below' | 'row-above'
  cols?: number
}

const CHIP_PLACEMENTS: ChipPlacement[] = [
  { parentId: 'language',       layout: 'grid-left',  cols: 2 },
  { parentId: 'library',        layout: 'fan-right' },
  { parentId: 'github',         layout: 'row-below' },
  { parentId: 'fe-framework',   layout: 'grid-right', cols: 2 },
  { parentId: 'fe-build',       layout: 'grid-right', cols: 2 },
  { parentId: 'fe-styling',     layout: 'grid-right', cols: 2 },
  { parentId: 'be-framework',   layout: 'grid-right', cols: 2 },
  { parentId: 'be-api',         layout: 'grid-right', cols: 2 },
  { parentId: 'be-orm',         layout: 'grid-right', cols: 2 },
  { parentId: 'be-runtime',     layout: 'grid-right', cols: 2 },
  { parentId: 'db-relational',  layout: 'row-below' },
  { parentId: 'db-nosql',       layout: 'row-below' },
  { parentId: 'db-cache',       layout: 'row-below' },
  { parentId: 'db-vector',      layout: 'row-below' },
  { parentId: 'sec-auth',       layout: 'row-below' },
  { parentId: 'infra-hosting',  layout: 'row-below' },
  { parentId: 'infra-cicd',     layout: 'row-below' },
  { parentId: 'infra-domain',   layout: 'row-below' },
  { parentId: 'infra-cdn',      layout: 'row-below' },
  { parentId: 'ops-monitoring', layout: 'row-below' },
  { parentId: 'ops-analytics',  layout: 'row-below' },
  { parentId: 'ops-email',      layout: 'row-below' },
  { parentId: 'ops-storage',    layout: 'row-below' },
]

// ─── Helpers ───────────────────────────────────────────────────────

function nodeBox(id: string): { x: number; y: number; w: number; h: number } | null {
  if (id.startsWith('anchor:')) {
    const label = id.slice('anchor:'.length)
    const a = ANCHORS.find((an) => an.label === label)
    return a ? { x: a.x, y: a.y, w: a.w, h: a.h } : null
  }
  return layout[id] ?? null
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

// ─── Chip computation ──────────────────────────────────────────────

const CHIP_W = 130
const CHIP_H = 30
const CHIP_GAP = 6

interface ChipPos {
  parentId: string
  alt: Alternative
  x: number
  y: number
  px: number
  py: number
}

function computeChips(): ChipPos[] {
  const result: ChipPos[] = []
  for (const placement of CHIP_PLACEMENTS) {
    const node = diagramNodes.find((n) => n.id === placement.parentId)
    const l = layout[placement.parentId]
    if (!node?.alternatives || !l) continue
    const alts = node.alternatives
    let positions: Array<{ x: number; y: number }> = []
    let edge = { px: 0, py: 0 }

    switch (placement.layout) {
      case 'fan-right': {
        const baseX = l.x + l.w + 50
        const totalH = alts.length * (CHIP_H + CHIP_GAP) - CHIP_GAP
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({ x: baseX, y: baseY + i * (CHIP_H + CHIP_GAP) }))
        edge = { px: l.x + l.w, py: l.y + l.h / 2 }
        break
      }
      case 'fan-left': {
        const baseX = l.x - 50 - CHIP_W
        const totalH = alts.length * (CHIP_H + CHIP_GAP) - CHIP_GAP
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({ x: baseX, y: baseY + i * (CHIP_H + CHIP_GAP) }))
        edge = { px: l.x, py: l.y + l.h / 2 }
        break
      }
      case 'grid-right': {
        const cols = placement.cols ?? 2
        const baseX = l.x + l.w + 40
        const totalH = Math.ceil(alts.length / cols) * (CHIP_H + CHIP_GAP) - CHIP_GAP
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({
          x: baseX + (i % cols) * (CHIP_W + CHIP_GAP),
          y: baseY + Math.floor(i / cols) * (CHIP_H + CHIP_GAP),
        }))
        edge = { px: l.x + l.w, py: l.y + l.h / 2 }
        break
      }
      case 'grid-left': {
        const cols = placement.cols ?? 2
        const totalGridW = cols * (CHIP_W + CHIP_GAP) - CHIP_GAP
        const baseX = l.x - 40 - totalGridW
        const totalH = Math.ceil(alts.length / cols) * (CHIP_H + CHIP_GAP) - CHIP_GAP
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({
          x: baseX + (i % cols) * (CHIP_W + CHIP_GAP),
          y: baseY + Math.floor(i / cols) * (CHIP_H + CHIP_GAP),
        }))
        edge = { px: l.x, py: l.y + l.h / 2 }
        break
      }
      case 'row-below': {
        const baseY = l.y + l.h + 12
        const totalW = alts.length * (CHIP_W + CHIP_GAP) - CHIP_GAP
        const baseX = l.x + l.w / 2 - totalW / 2
        positions = alts.map((_, i) => ({ x: baseX + i * (CHIP_W + CHIP_GAP), y: baseY }))
        edge = { px: l.x + l.w / 2, py: l.y + l.h }
        break
      }
      case 'row-above': {
        const baseY = l.y - 12 - CHIP_H
        const totalW = alts.length * (CHIP_W + CHIP_GAP) - CHIP_GAP
        const baseX = l.x + l.w / 2 - totalW / 2
        positions = alts.map((_, i) => ({ x: baseX + i * (CHIP_W + CHIP_GAP), y: baseY }))
        edge = { px: l.x + l.w / 2, py: l.y }
        break
      }
    }

    alts.forEach((alt, i) => {
      result.push({
        parentId: node.id,
        alt,
        x: positions[i].x,
        y: positions[i].y,
        px: edge.px,
        py: edge.py,
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
        {/* SVG: containers + spine + connectors */}
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {/* Container boxes with header bars */}
          {CONTAINERS.map((c, i) => (
            <g key={i}>
              {/* Outer rect */}
              <rect
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                fill="white"
                stroke={c.accent}
                strokeWidth={c.nested ? 1.5 : 2}
                strokeDasharray={c.nested ? '0' : '0'}
                rx={10}
              />
              {/* Header bar */}
              <rect
                x={c.x}
                y={c.y}
                width={c.w}
                height={28}
                fill={c.accent}
                rx={10}
              />
              {/* Header bottom-square (cover bottom rounded corners of header) */}
              <rect x={c.x} y={c.y + 18} width={c.w} height={10} fill={c.accent} />
              {/* Title text */}
              <text
                x={c.x + 16}
                y={c.y + 19}
                fontSize={11}
                fontWeight={700}
                fill="white"
                letterSpacing="0.08em"
              >
                {c.label}
              </text>
            </g>
          ))}

          {/* Tip boxes */}
          {TIPS.map((tip, i) => (
            <g key={`tip-${i}`}>
              <rect
                x={tip.x}
                y={tip.y}
                width={tip.w}
                height={tip.h}
                fill="#FFFBEB"
                stroke="#D97706"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                rx={8}
              />
              <text
                x={tip.x + 16}
                y={tip.y + 22}
                fontSize={11}
                fontWeight={700}
                fill="#92400E"
                letterSpacing="0.05em"
              >
                {tip.title.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Spine */}
          <path
            d={`M ${SPINE_X} 90 L ${SPINE_X} 200 M ${SPINE_X} 280 L ${SPINE_X} 540 M ${SPINE_X} 600 L ${SPINE_X} 660 M ${SPINE_X} 720 L ${SPINE_X} 780 M ${SPINE_X} 840 L ${SPINE_X} 900 M ${SPINE_X} 960 L ${SPINE_X} 1170 M ${SPINE_X} 1230 L ${SPINE_X} 1290 M ${SPINE_X} 1350 L ${SPINE_X} 1410 M ${SPINE_X} 1470 L ${SPINE_X} 1530 M ${SPINE_X} 1590 L ${SPINE_X} 2060 M ${SPINE_X} 2220 L ${SPINE_X} 2240 M ${SPINE_X} 2550 L ${SPINE_X} 2580 M ${SPINE_X} 2890 L ${SPINE_X} 2920 M ${SPINE_X} 3230 L ${SPINE_X} 3260`}
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = nodeBox(edge.from)
            const to = nodeBox(edge.to)
            if (!from || !to) return null
            const { fx, fy, tx, ty } = edgePoints(from, to)
            const isArrow = edge.style === 'arrow'
            const isDotted = edge.style === 'dotted'
            return (
              <path
                key={i}
                d={bezier(fx, fy, tx, ty)}
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                strokeDasharray={isDotted ? '2 5' : undefined}
                strokeLinecap="round"
                markerEnd={isArrow ? 'url(#arrowhead)' : undefined}
              />
            )
          })}

          {/* Chip connectors */}
          {chips.map((chip, i) => {
            const tx = chip.x + (chip.px > chip.x ? CHIP_W : 0)
            const ty = chip.y + CHIP_H / 2
            return (
              <path
                key={`cc-${i}`}
                d={bezier(chip.px, chip.py, tx, ty)}
                stroke="#94A3B8"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="2 5"
                strokeLinecap="round"
              />
            )
          })}

          <defs>
            <marker
              id="arrowhead"
              markerWidth={10}
              markerHeight={10}
              refX={9}
              refY={3}
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
            </marker>
          </defs>
        </svg>

        {/* Tip box bodies (HTML for proper text wrapping) */}
        {TIPS.map((tip, i) => (
          <div
            key={`tipbody-${i}`}
            style={{
              position: 'absolute',
              left: tip.x + 16,
              top: tip.y + 38,
              width: tip.w - 32,
              fontSize: 12.5,
              lineHeight: 1.55,
              color: '#78350F',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            {tip.body}
          </div>
        ))}

        {/* Section anchors */}
        {ANCHORS.map((a) => (
          <div
            key={a.label}
            style={{
              position: 'absolute',
              left: a.x,
              top: a.y,
              width: a.w,
              height: a.h,
              background: '#FFD93B',
              border: '2.5px solid #1F2937',
              borderRadius: 8,
              boxShadow: '5px 5px 0 #1F2937',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#1F2937',
              zIndex: 3,
              textAlign: 'center',
              padding: '0 10px',
            }}
          >
            {a.label}
          </div>
        ))}

        {/* Primary nodes */}
        {diagramNodes.map((node) => {
          const l = layout[node.id]
          if (!l) return null
          const isSelected = node.id === selectedNodeId
          const isSub = l.variant === 'sub'
          return (
            <button
              key={node.id}
              type="button"
              className="roadmap-box"
              onClick={() => onNodeClick(node.id)}
              style={primaryBoxStyle(l, isSelected, isSub)}
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

function primaryBoxStyle(l: NodeLayout, isSelected: boolean, isSub: boolean): CSSProperties {
  return {
    all: 'unset',
    boxSizing: 'border-box',
    position: 'absolute',
    left: l.x,
    top: l.y,
    width: l.w,
    height: l.h,
    background: isSelected ? '#FCA5A5' : isSub ? '#DDD6FE' : '#FFD93B',
    border: '2.5px solid #1F2937',
    borderRadius: 7,
    boxShadow: '4px 4px 0 #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isSub ? 13 : 14,
    fontWeight: isSub ? 500 : 600,
    color: '#1F2937',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '0 12px',
    zIndex: 2,
  }
}

function chipStyle(x: number, y: number): CSSProperties {
  return {
    position: 'absolute',
    left: x,
    top: y,
    width: CHIP_W,
    height: CHIP_H,
    background: 'white',
    border: '1.5px solid #1F2937',
    borderRadius: 6,
    boxShadow: '2px 2px 0 #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    padding: '0 10px',
    fontSize: 12,
    fontWeight: 500,
    color: '#1F2937',
    zIndex: 2,
  }
}
