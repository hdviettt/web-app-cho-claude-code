import type { CSSProperties } from 'react'
import { diagramNodes, type Alternative } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const CANVAS_W = 1200
const CANVAS_H = 3400

// ─── Section anchors ──────────────────────────────────────────────
// Mỗi section bắt đầu bằng 1 yellow box "anchor" lớn — hiệu ứng giống
// roadmap.sh "DevOps" / "Operating System" làm điểm neo cho section.

interface Anchor {
  label: string
  x: number
  y: number
  w: number
  h: number
}

const ANCHORS: Anchor[] = [
  { label: 'Khái niệm cơ bản', x: 480, y: 30,   w: 240, h: 56 },
  { label: 'Source Control',   x: 480, y: 470,  w: 240, h: 56 },
  { label: 'Frontend',         x: 520, y: 800,  w: 160, h: 56 },
  { label: 'Backend',          x: 520, y: 1280, w: 160, h: 56 },
  { label: 'Database',         x: 520, y: 1720, w: 160, h: 56 },
  { label: 'Security',         x: 520, y: 2160, w: 160, h: 56 },
  { label: 'Triển khai',       x: 520, y: 2540, w: 160, h: 56 },
  { label: 'Vận hành',         x: 520, y: 2960, w: 160, h: 56 },
]

// ─── Node positions ────────────────────────────────────────────────
// Mỗi section có template riêng: hub-fan, linear, grid, container, spoke...

interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
}

const layout: Record<string, NodeLayout> = {
  // ── Section 1: Khái niệm cơ bản (hub + fan + 3 children) ──
  language:  { x: 490, y: 130, w: 220, h: 60 },
  function:  { x: 280, y: 240, w: 140, h: 42 },
  variable:  { x: 490, y: 240, w: 140, h: 42 },
  library:   { x: 700, y: 240, w: 140, h: 42 },

  // ── Section 2: Source Control (linear pipeline + GitHub branches) ──
  git:            { x: 110, y: 580, w: 180, h: 60 },
  github:         { x: 350, y: 580, w: 180, h: 60 },
  branch:         { x: 590, y: 580, w: 180, h: 60 },
  'pull-request': { x: 830, y: 580, w: 180, h: 60 },

  // ── Section 3: Frontend (3 stack primaries + 2 basics row) ──
  'fe-framework': { x: 140, y: 920,  w: 200, h: 60 },
  'fe-build':     { x: 500, y: 920,  w: 200, h: 60 },
  'fe-styling':   { x: 860, y: 920,  w: 200, h: 60 },
  'fe-html':      { x: 380, y: 1180, w: 180, h: 50 },
  'fe-css':       { x: 640, y: 1180, w: 180, h: 50 },

  // ── Section 4: Backend (2x2 grid) ──
  'be-framework': { x: 280, y: 1400, w: 200, h: 60 },
  'be-api':       { x: 720, y: 1400, w: 200, h: 60 },
  'be-orm':       { x: 280, y: 1530, w: 200, h: 60 },
  'be-runtime':   { x: 720, y: 1530, w: 200, h: 60 },

  // ── Section 5: Database (2x2 inside container) ──
  'db-relational': { x: 200, y: 1850, w: 200, h: 60 },
  'db-nosql':      { x: 800, y: 1850, w: 200, h: 60 },
  'db-cache':      { x: 200, y: 2000, w: 200, h: 60 },
  'db-vector':     { x: 800, y: 2000, w: 200, h: 60 },

  // ── Section 6: Security (5-spoke fan from anchor) ──
  'sec-auth':   { x: 80,  y: 2300, w: 180, h: 56 },
  'sec-authz':  { x: 290, y: 2300, w: 180, h: 56 },
  'sec-env':    { x: 510, y: 2300, w: 180, h: 56 },
  'sec-https':  { x: 730, y: 2300, w: 180, h: 56 },
  'sec-cors':   { x: 940, y: 2300, w: 180, h: 56 },

  // ── Section 7: Triển khai (5-step horizontal pipeline) ──
  'infra-docker':  { x: 60,  y: 2680, w: 180, h: 56 },
  'infra-hosting': { x: 280, y: 2680, w: 180, h: 56 },
  'infra-cicd':    { x: 500, y: 2680, w: 180, h: 56 },
  'infra-domain':  { x: 720, y: 2680, w: 180, h: 56 },
  'infra-cdn':     { x: 940, y: 2680, w: 180, h: 56 },

  // ── Section 8: Vận hành (5 cards in a row) ──
  'ops-logs':       { x: 60,  y: 3080, w: 180, h: 56 },
  'ops-monitoring': { x: 280, y: 3080, w: 180, h: 56 },
  'ops-analytics':  { x: 500, y: 3080, w: 180, h: 56 },
  'ops-email':      { x: 720, y: 3080, w: 180, h: 56 },
  'ops-storage':    { x: 940, y: 3080, w: 180, h: 56 },
}

// ─── Container boxes (visual cluster decorations) ──────────────────
interface ContainerBox {
  x: number
  y: number
  w: number
  h: number
  label?: string
  accent?: string
}

const CONTAINERS: ContainerBox[] = [
  // Frontend Stack container
  { x: 50, y: 880, w: 1100, h: 240, label: 'Stack', accent: '#7c3aed' },
  // Database container
  { x: 50, y: 1820, w: 1100, h: 260, label: 'Lựa chọn', accent: '#f59e0b' },
  // Triển khai pipeline container
  { x: 30, y: 2640, w: 1140, h: 200, label: 'Pipeline triển khai', accent: '#10b981' },
  // Vận hành stack container
  { x: 30, y: 3040, w: 1140, h: 250, label: 'Observability + tích hợp', accent: '#0891b2' },
]

// ─── Chip layout per node ──────────────────────────────────────────
interface ChipPlacement {
  parentId: string
  layout: 'fan-right' | 'column-right' | 'column-left' | 'row-below' | 'row-above'
  offsetX?: number
  offsetY?: number
}

const CHIP_PLACEMENTS: ChipPlacement[] = [
  { parentId: 'language',       layout: 'fan-right' },
  { parentId: 'library',        layout: 'row-below' },
  { parentId: 'github',         layout: 'row-below' },
  { parentId: 'fe-framework',   layout: 'row-below' },
  { parentId: 'fe-build',       layout: 'row-below' },
  { parentId: 'fe-styling',     layout: 'row-below' },
  { parentId: 'be-framework',   layout: 'column-left' },
  { parentId: 'be-api',         layout: 'column-right' },
  { parentId: 'be-orm',         layout: 'column-left' },
  { parentId: 'be-runtime',     layout: 'column-right' },
  { parentId: 'db-relational',  layout: 'row-below' },
  { parentId: 'db-nosql',       layout: 'row-below' },
  { parentId: 'db-cache',       layout: 'row-below' },
  { parentId: 'db-vector',      layout: 'row-below' },
  { parentId: 'sec-auth',       layout: 'row-below' },
  { parentId: 'infra-docker',   layout: 'row-below' },
  { parentId: 'infra-hosting',  layout: 'row-below' },
  { parentId: 'infra-cicd',     layout: 'row-below' },
  { parentId: 'infra-domain',   layout: 'row-below' },
  { parentId: 'infra-cdn',      layout: 'row-below' },
  { parentId: 'ops-monitoring', layout: 'row-below' },
  { parentId: 'ops-analytics',  layout: 'row-below' },
  { parentId: 'ops-email',      layout: 'row-below' },
  { parentId: 'ops-storage',    layout: 'row-below' },
]

// ─── Explicit connector edges ──────────────────────────────────────
interface Edge {
  from: string
  to: string
  style: 'solid' | 'dashed' | 'dotted' | 'arrow'
}

const EDGES: Edge[] = [
  // Section 1: anchor → language → 3 children
  { from: 'anchor:foundations', to: 'language', style: 'solid' },
  { from: 'language', to: 'function', style: 'solid' },
  { from: 'language', to: 'variable', style: 'solid' },
  { from: 'language', to: 'library',  style: 'solid' },

  // Section 2: anchor → Git, then linear pipeline
  { from: 'anchor:source-control', to: 'git', style: 'solid' },
  { from: 'git', to: 'github', style: 'arrow' },
  { from: 'github', to: 'branch', style: 'arrow' },
  { from: 'branch', to: 'pull-request', style: 'arrow' },

  // Section 3: anchor → 3 frontend stack + 2 basics
  { from: 'anchor:frontend', to: 'fe-framework', style: 'solid' },
  { from: 'anchor:frontend', to: 'fe-build', style: 'solid' },
  { from: 'anchor:frontend', to: 'fe-styling', style: 'solid' },
  { from: 'anchor:frontend', to: 'fe-html', style: 'solid' },
  { from: 'anchor:frontend', to: 'fe-css', style: 'solid' },

  // Section 4: anchor → 4 backend nodes
  { from: 'anchor:backend', to: 'be-framework', style: 'solid' },
  { from: 'anchor:backend', to: 'be-api', style: 'solid' },
  { from: 'anchor:backend', to: 'be-orm', style: 'solid' },
  { from: 'anchor:backend', to: 'be-runtime', style: 'solid' },

  // Section 5: anchor → 4 database nodes
  { from: 'anchor:database', to: 'db-relational', style: 'solid' },
  { from: 'anchor:database', to: 'db-nosql', style: 'solid' },
  { from: 'anchor:database', to: 'db-cache', style: 'solid' },
  { from: 'anchor:database', to: 'db-vector', style: 'solid' },

  // Section 6: anchor → 5 security spokes
  { from: 'anchor:security', to: 'sec-auth', style: 'solid' },
  { from: 'anchor:security', to: 'sec-authz', style: 'solid' },
  { from: 'anchor:security', to: 'sec-env', style: 'solid' },
  { from: 'anchor:security', to: 'sec-https', style: 'solid' },
  { from: 'anchor:security', to: 'sec-cors', style: 'solid' },

  // Section 7: anchor → first node, then linear pipeline
  { from: 'anchor:infra', to: 'infra-docker', style: 'solid' },
  { from: 'infra-docker', to: 'infra-hosting', style: 'arrow' },
  { from: 'infra-hosting', to: 'infra-cicd', style: 'arrow' },
  { from: 'infra-cicd', to: 'infra-domain', style: 'arrow' },
  { from: 'infra-domain', to: 'infra-cdn', style: 'arrow' },

  // Section 8: anchor → 5 ops cards
  { from: 'anchor:ops', to: 'ops-logs', style: 'solid' },
  { from: 'anchor:ops', to: 'ops-monitoring', style: 'solid' },
  { from: 'anchor:ops', to: 'ops-analytics', style: 'solid' },
  { from: 'anchor:ops', to: 'ops-email', style: 'solid' },
  { from: 'anchor:ops', to: 'ops-storage', style: 'solid' },
]

// ─── Geometry helpers ──────────────────────────────────────────────

function nodeCenter(id: string): { x: number; y: number; w: number; h: number } {
  if (id.startsWith('anchor:')) {
    const clusterId = id.slice('anchor:'.length)
    const a = ANCHORS.find((an) =>
      an.label.toLowerCase().replace(/\s+/g, '').includes(
        clusterId === 'foundations' ? 'cơbản' :
        clusterId === 'source-control' ? 'sourcecontrol' :
        clusterId === 'infra' ? 'triểnkhai' :
        clusterId === 'ops' ? 'vậnhành' :
        clusterId,
      ),
    )
    if (a) return { x: a.x, y: a.y, w: a.w, h: a.h }
  }
  const l = layout[id]
  return l ?? { x: 0, y: 0, w: 0, h: 0 }
}

// Find best edge points on two boxes (closest sides)
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

  // Decide horizontal vs vertical connection
  if (Math.abs(dy) > Math.abs(dx)) {
    // Vertical connection
    if (dy > 0) {
      return { fx: fcx, fy: from.y + from.h, tx: tcx, ty: to.y }
    } else {
      return { fx: fcx, fy: from.y, tx: tcx, ty: to.y + to.h }
    }
  } else {
    // Horizontal connection
    if (dx > 0) {
      return { fx: from.x + from.w, fy: fcy, tx: to.x, ty: tcy }
    } else {
      return { fx: from.x, fy: fcy, tx: to.x + to.w, ty: tcy }
    }
  }
}

function bezierPath(fx: number, fy: number, tx: number, ty: number): string {
  const dx = tx - fx
  const dy = ty - fy
  const isHorizontal = Math.abs(dx) > Math.abs(dy)
  if (isHorizontal) {
    const cp = (fx + tx) / 2
    return `M ${fx} ${fy} C ${cp} ${fy}, ${cp} ${ty}, ${tx} ${ty}`
  } else {
    const cp = (fy + ty) / 2
    return `M ${fx} ${fy} C ${fx} ${cp}, ${tx} ${cp}, ${tx} ${ty}`
  }
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
  // anchor point for connector (parent edge)
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
    const totalH = alts.length * (CHIP_H + CHIP_GAP) - CHIP_GAP
    const totalW = alts.length * (CHIP_W + CHIP_GAP) - CHIP_GAP

    let positions: Array<{ x: number; y: number }> = []
    let parentEdge = { px: 0, py: 0 }

    switch (placement.layout) {
      case 'fan-right': {
        const baseX = l.x + l.w + 60
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({ x: baseX, y: baseY + i * (CHIP_H + CHIP_GAP) }))
        parentEdge = { px: l.x + l.w, py: l.y + l.h / 2 }
        break
      }
      case 'column-right': {
        const baseX = l.x + l.w + 30
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({ x: baseX, y: baseY + i * (CHIP_H + CHIP_GAP) }))
        parentEdge = { px: l.x + l.w, py: l.y + l.h / 2 }
        break
      }
      case 'column-left': {
        const baseX = l.x - 30 - CHIP_W
        const baseY = l.y + l.h / 2 - totalH / 2
        positions = alts.map((_, i) => ({ x: baseX, y: baseY + i * (CHIP_H + CHIP_GAP) }))
        parentEdge = { px: l.x, py: l.y + l.h / 2 }
        break
      }
      case 'row-below': {
        const baseY = l.y + l.h + 14
        const baseX = l.x + l.w / 2 - totalW / 2
        positions = alts.map((_, i) => ({ x: baseX + i * (CHIP_W + CHIP_GAP), y: baseY }))
        parentEdge = { px: l.x + l.w / 2, py: l.y + l.h }
        break
      }
      case 'row-above': {
        const baseY = l.y - 14 - CHIP_H
        const baseX = l.x + l.w / 2 - totalW / 2
        positions = alts.map((_, i) => ({ x: baseX + i * (CHIP_W + CHIP_GAP), y: baseY }))
        parentEdge = { px: l.x + l.w / 2, py: l.y }
        break
      }
    }

    alts.forEach((alt, i) => {
      result.push({
        parentId: node.id,
        alt,
        x: positions[i].x,
        y: positions[i].y,
        px: parentEdge.px,
        py: parentEdge.py,
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
        {/* SVG layer: container backgrounds + connectors */}
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {/* Container box decorations */}
          {CONTAINERS.map((c, i) => (
            <g key={i}>
              <rect
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                fill={c.accent ? `${c.accent}08` : '#00000005'}
                stroke={c.accent ?? '#94A3B8'}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                rx={12}
              />
              {c.label && (
                <text
                  x={c.x + 16}
                  y={c.y + 18}
                  fontSize={11}
                  fontWeight={700}
                  fill={c.accent ?? '#64748B'}
                  letterSpacing="0.08em"
                  style={{ textTransform: 'uppercase' as const }}
                >
                  {c.label}
                </text>
              )}
            </g>
          ))}

          {/* Connectors */}
          {EDGES.map((edge, i) => {
            const from = nodeCenter(edge.from)
            const to = nodeCenter(edge.to)
            const { fx, fy, tx, ty } = edgePoints(from, to)
            const isArrow = edge.style === 'arrow'
            const isDashed = edge.style === 'dashed'
            const isDotted = edge.style === 'dotted'
            return (
              <path
                key={i}
                d={bezierPath(fx, fy, tx, ty)}
                stroke="#3B82F6"
                strokeWidth={isArrow ? 2 : 2}
                fill="none"
                strokeDasharray={isDashed ? '6 4' : isDotted ? '2 5' : undefined}
                strokeLinecap="round"
                markerEnd={isArrow ? 'url(#arrowhead)' : undefined}
              />
            )
          })}

          {/* Chip connectors (always dotted) */}
          {chips.map((chip, i) => {
            const tx = chip.x + (chip.px > chip.x ? CHIP_W : 0)
            const ty = chip.y + CHIP_H / 2
            return (
              <path
                key={`chip-${i}`}
                d={bezierPath(chip.px, chip.py, tx, ty)}
                stroke="#94A3B8"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="2 5"
                strokeLinecap="round"
              />
            )
          })}

          {/* Arrow marker definition */}
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

        {/* Section anchor boxes */}
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
              fontSize: 15,
              fontWeight: 700,
              color: '#1F2937',
              letterSpacing: '-0.005em',
              zIndex: 3,
            }}
          >
            {a.label}
          </div>
        ))}

        {/* Primary node boxes */}
        {diagramNodes.map((node) => {
          const l = layout[node.id]
          if (!l) return null
          const isSelected = node.id === selectedNodeId
          const isSub = ['function', 'variable', 'library'].includes(node.id)
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

        {/* Alt chip boxes */}
        {chips.map((chip, i) => (
          <div
            key={`chipbox-${i}`}
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
    background: isSelected ? '#FCA5A5' : isSub ? '#FFE4B5' : '#FFD93B',
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
