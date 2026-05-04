import type { CSSProperties } from 'react'
import { diagramNodes, type Alternative } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const CANVAS_W = 1200
const CANVAS_H = 2700
const SPINE_X = 600

type BoxColor = 'yellow' | 'peach' | 'purple'

interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
  color: BoxColor
}

const layout: Record<string, NodeLayout> = {
  // ═══ S1: Lập trình & ngôn ngữ ═══
  language: { x: 490, y: 200, w: 220, h: 56, color: 'yellow' },

  // ═══ S2: Frontend ═══
  'fe-framework':  { x: 490, y: 410, w: 220, h: 56, color: 'yellow' },
  'fe-html':       { x: 290, y: 510, w: 130, h: 38, color: 'purple' },
  'fe-css':        { x: 470, y: 510, w: 130, h: 38, color: 'purple' },
  'fe-javascript': { x: 650, y: 510, w: 150, h: 38, color: 'purple' },

  // ═══ S3: Backend ═══
  'be-api':      { x: 490, y: 690, w: 220, h: 56, color: 'yellow' },
  'be-database': { x: 490, y: 790, w: 220, h: 56, color: 'yellow' },
  'be-storage':  { x: 490, y: 890, w: 220, h: 56, color: 'yellow' },

  // ═══ S4: Security ═══
  'sec-auth':   { x: 490, y: 1080, w: 220, h: 56, color: 'yellow' },
  'sec-authz':  { x: 490, y: 1180, w: 220, h: 56, color: 'yellow' },
  'sec-env':    { x: 490, y: 1280, w: 220, h: 56, color: 'yellow' },
  'sec-https':  { x: 490, y: 1380, w: 220, h: 56, color: 'yellow' },
  'sec-cors':   { x: 490, y: 1480, w: 220, h: 56, color: 'yellow' },

  // ═══ S5: Triển khai ═══
  'infra-docker':  { x: 490, y: 1680, w: 220, h: 56, color: 'yellow' },
  'infra-hosting': { x: 490, y: 1780, w: 220, h: 56, color: 'yellow' },
  'infra-cicd':    { x: 490, y: 1880, w: 220, h: 56, color: 'yellow' },
  'infra-domain':  { x: 490, y: 1980, w: 220, h: 56, color: 'yellow' },

  // ═══ S6: Vận hành ═══
  'ops-logs':       { x: 490, y: 2180, w: 220, h: 56, color: 'yellow' },
  'ops-monitoring': { x: 490, y: 2280, w: 220, h: 56, color: 'yellow' },
  'ops-analytics':  { x: 490, y: 2380, w: 220, h: 56, color: 'yellow' },
  'ops-email':      { x: 490, y: 2480, w: 220, h: 56, color: 'yellow' },

  // ═══ S7: Source Control ═══
  git:    { x: 490, y: 2590, w: 220, h: 56, color: 'yellow' },
  github: { x: 490, y: 2690, w: 220, h: 56, color: 'yellow' },
}

interface SectionTitle {
  text: string
  y: number
}

const SECTIONS: SectionTitle[] = [
  { text: 'Lập trình & ngôn ngữ', y: 110 },
  { text: 'Frontend',             y: 320 },
  { text: 'Backend',              y: 600 },
  { text: 'Security',             y: 990 },
  { text: 'Triển khai',           y: 1590 },
  { text: 'Vận hành',             y: 2090 },
  { text: 'Source Control',       y: 2500 },
]

interface Container {
  x: number
  y: number
  w: number
  h: number
  externalLabel: string
  side: 'left' | 'right'
}

// Containers: alt cluster cho mỗi primary có alternatives
const CONTAINERS: Container[] = [
  { x: 60,  y: 180, w: 380, h: 130, externalLabel: 'Lựa chọn ngôn ngữ',     side: 'left' },     // language
  { x: 760, y: 390, w: 380, h: 130, externalLabel: 'Framework lựa chọn',    side: 'right' },    // fe-framework
  { x: 60,  y: 670, w: 380, h: 130, externalLabel: 'API styles',            side: 'left' },     // be-api
  { x: 760, y: 770, w: 380, h: 130, externalLabel: 'Database lựa chọn',     side: 'right' },    // be-database
  { x: 60,  y: 870, w: 380, h: 130, externalLabel: 'Object Storage',        side: 'left' },     // be-storage
  { x: 760, y: 1060, w: 380, h: 130, externalLabel: 'Auth methods',         side: 'right' },    // sec-auth
  { x: 760, y: 1760, w: 380, h: 130, externalLabel: 'Hosting platform',     side: 'right' },    // infra-hosting
  { x: 60,  y: 1860, w: 380, h: 100, externalLabel: 'CI/CD',                side: 'left' },     // infra-cicd
  { x: 760, y: 1960, w: 380, h: 100, externalLabel: 'Domain provider',      side: 'right' },    // infra-domain
  { x: 60,  y: 2260, w: 380, h: 100, externalLabel: 'Monitoring',           side: 'left' },     // ops-monitoring
  { x: 760, y: 2360, w: 380, h: 130, externalLabel: 'Analytics',            side: 'right' },    // ops-analytics
  { x: 60,  y: 2460, w: 380, h: 100, externalLabel: 'Email',                side: 'left' },     // ops-email
  { x: 760, y: 2670, w: 380, h: 100, externalLabel: 'Repo hosting',         side: 'right' },    // github
]

interface ChipPlacement {
  parentId: string
  containerIdx: number
  cols: number
}

const CHIP_PLACEMENTS: ChipPlacement[] = [
  { parentId: 'language',       containerIdx: 0,  cols: 2 },
  { parentId: 'fe-framework',   containerIdx: 1,  cols: 2 },
  { parentId: 'be-api',         containerIdx: 2,  cols: 2 },
  { parentId: 'be-database',    containerIdx: 3,  cols: 2 },
  { parentId: 'be-storage',     containerIdx: 4,  cols: 1 },
  { parentId: 'sec-auth',       containerIdx: 5,  cols: 2 },
  { parentId: 'infra-hosting',  containerIdx: 6,  cols: 2 },
  { parentId: 'infra-cicd',     containerIdx: 7,  cols: 2 },
  { parentId: 'infra-domain',   containerIdx: 8,  cols: 2 },
  { parentId: 'ops-monitoring', containerIdx: 9,  cols: 2 },
  { parentId: 'ops-analytics',  containerIdx: 10, cols: 2 },
  { parentId: 'ops-email',      containerIdx: 11, cols: 2 },
  { parentId: 'github',         containerIdx: 12, cols: 2 },
]

interface Edge {
  from: string
  to: string
  style: 'solid' | 'dotted'
}

const EDGES: Edge[] = [
  // S1
  { from: 'language', to: 'container:0', style: 'dotted' },
  // S2
  { from: 'fe-framework', to: 'container:1', style: 'dotted' },
  { from: 'fe-framework', to: 'fe-html',       style: 'solid' },
  { from: 'fe-framework', to: 'fe-css',        style: 'solid' },
  { from: 'fe-framework', to: 'fe-javascript', style: 'solid' },
  // S3
  { from: 'be-api',      to: 'container:2', style: 'dotted' },
  { from: 'be-database', to: 'container:3', style: 'dotted' },
  { from: 'be-storage',  to: 'container:4', style: 'dotted' },
  // S4
  { from: 'sec-auth', to: 'container:5', style: 'dotted' },
  // S5
  { from: 'infra-hosting', to: 'container:6', style: 'dotted' },
  { from: 'infra-cicd',    to: 'container:7', style: 'dotted' },
  { from: 'infra-domain',  to: 'container:8', style: 'dotted' },
  // S6
  { from: 'ops-monitoring', to: 'container:9',  style: 'dotted' },
  { from: 'ops-analytics',  to: 'container:10', style: 'dotted' },
  { from: 'ops-email',      to: 'container:11', style: 'dotted' },
  // S7
  { from: 'github', to: 'container:12', style: 'dotted' },
]

// ─── Helpers ───────────────────────────────────────────────────────

function getEndpoint(ref: string): { x: number; y: number; w: number; h: number } | null {
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

// ─── Chip placement ────────────────────────────────────────────────

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
          {/* Spine */}
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

        {/* Container external labels */}
        {CONTAINERS.map((c, i) => (
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
            {c.externalLabel}
          </div>
        ))}

        {/* Floating section titles on spine */}
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
  const colorMap: Record<BoxColor, string> = {
    yellow: '#FFD93B',
    peach:  '#FFE4B5',
    purple: '#DDD6FE',
  }
  const bg = isSelected ? '#FCA5A5' : colorMap[l.color]
  return {
    all: 'unset',
    boxSizing: 'border-box',
    position: 'absolute',
    left: l.x,
    top: l.y,
    width: l.w,
    height: l.h,
    background: bg,
    border: '2.5px solid #1F2937',
    borderRadius: 7,
    boxShadow: '4px 4px 0 #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: l.h < 45 ? 13 : 14,
    fontWeight: l.h < 45 ? 500 : 600,
    color: '#1F2937',
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
