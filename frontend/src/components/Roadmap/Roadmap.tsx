import type { CSSProperties } from 'react'
import { diagramNodes, type Alternative } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const CANVAS_W = 1200
const CANVAS_H = 2090
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

  // ═══ S4: Security — 4 items cùng cấp trong "Web Security checklist" ═══
  'sec-auth':   { x: 90,  y: 1080, w: 240, h: 46, color: 'peach' },
  'sec-authz':  { x: 350, y: 1080, w: 240, h: 46, color: 'peach' },
  'sec-env':    { x: 610, y: 1080, w: 240, h: 46, color: 'peach' },
  'sec-cors':   { x: 870, y: 1080, w: 240, h: 46, color: 'peach' },

  // ═══ S5: Triển khai — Hosting/Domain là core, Docker/CI-CD là tools (peach inside container) ═══
  'infra-hosting': { x: 490, y: 1470, w: 220, h: 56, color: 'yellow' },
  'infra-domain':  { x: 490, y: 1570, w: 220, h: 56, color: 'yellow' },
  'infra-docker':  { x: 220, y: 1730, w: 320, h: 38, color: 'peach' },
  'infra-cicd':    { x: 660, y: 1730, w: 320, h: 38, color: 'peach' },

  // ═══ S6: Source Control ═══
  git:    { x: 490, y: 1890, w: 220, h: 56, color: 'yellow' },
  github: { x: 490, y: 1990, w: 220, h: 56, color: 'yellow' },
}

interface SectionTitle {
  text: string
  y: number
}

interface SectionTitleWithId extends SectionTitle {
  id: string
}

const SECTIONS: SectionTitleWithId[] = [
  { text: 'Lập trình & ngôn ngữ', y: 110,  id: 'sec-foundations' },
  { text: 'Frontend',             y: 320,  id: 'sec-frontend' },
  { text: 'Backend',              y: 600,  id: 'sec-backend' },
  { text: 'Security',             y: 990,  id: 'sec-security' },
  { text: 'Triển khai',           y: 1380, id: 'sec-infra' },
  { text: 'Source Control',       y: 1800, id: 'sec-source-control' },
]

interface Container {
  x: number
  y: number
  w: number
  h: number
  externalLabel: string
  internalLabel?: boolean // label nằm bên trong container thay vì bên ngoài
}

const CONTAINERS: Container[] = [
  // Alt chip containers (label external uppercase gray on top)
  { x: 60,  y: 180, w: 380, h: 130, externalLabel: 'Lựa chọn ngôn ngữ' },     // 0 language
  { x: 760, y: 390, w: 380, h: 130, externalLabel: 'Framework lựa chọn' },    // 1 fe-framework
  { x: 60,  y: 670, w: 380, h: 130, externalLabel: 'API styles' },            // 2 be-api
  { x: 760, y: 770, w: 380, h: 130, externalLabel: 'Database lựa chọn' },     // 3 be-database
  { x: 60,  y: 870, w: 380, h: 130, externalLabel: 'Object Storage' },        // 4 be-storage
  { x: 60,  y: 1200, w: 380, h: 130, externalLabel: 'Auth methods' },         // 5 sec-auth (alts, dưới checklist)
  { x: 760, y: 1450, w: 380, h: 130, externalLabel: 'Hosting platform' },     // 6 infra-hosting
  { x: 60,  y: 1550, w: 380, h: 130, externalLabel: 'Domain provider' },      // 7 infra-domain
  { x: 760, y: 1970, w: 380, h: 130, externalLabel: 'Repo hosting' },         // 8 github

  // Special wrapping containers (peach items inside, label internal)
  { x: 60,  y: 1040, w: 1080, h: 130, externalLabel: 'Web Security checklist' },     // 9 — wraps 4 peach items
  { x: 180, y: 1680, w: 840,  h: 100, externalLabel: 'Tools — Claude tự lo phần lớn' }, // 10 — wraps Docker/CI-CD
]

interface ChipPlacement {
  parentId: string
  containerIdx: number
  cols: number
}

const CHIP_PLACEMENTS: ChipPlacement[] = [
  { parentId: 'language',       containerIdx: 0, cols: 2 },
  { parentId: 'fe-framework',   containerIdx: 1, cols: 2 },
  { parentId: 'be-api',         containerIdx: 2, cols: 2 },
  { parentId: 'be-database',    containerIdx: 3, cols: 2 },
  { parentId: 'be-storage',     containerIdx: 4, cols: 1 },
  { parentId: 'sec-auth',       containerIdx: 5, cols: 2 },
  { parentId: 'infra-hosting',  containerIdx: 6, cols: 2 },
  { parentId: 'infra-domain',   containerIdx: 7, cols: 2 },
  { parentId: 'github',         containerIdx: 8, cols: 2 },
]

interface Edge {
  from: string
  to: string
  style: 'solid' | 'dotted'
}

const EDGES: Edge[] = [
  { from: 'language', to: 'container:0', style: 'dotted' },
  { from: 'fe-framework', to: 'container:1', style: 'dotted' },
  { from: 'fe-framework', to: 'fe-html',       style: 'solid' },
  { from: 'fe-framework', to: 'fe-css',        style: 'solid' },
  { from: 'fe-framework', to: 'fe-javascript', style: 'solid' },
  { from: 'be-api',      to: 'container:2', style: 'dotted' },
  { from: 'be-database', to: 'container:3', style: 'dotted' },
  { from: 'be-storage',  to: 'container:4', style: 'dotted' },
  { from: 'sec-auth', to: 'container:5', style: 'dotted' },
  { from: 'infra-hosting', to: 'container:6', style: 'dotted' },
  { from: 'infra-domain',  to: 'container:7', style: 'dotted' },
  { from: 'infra-domain',  to: 'container:10', style: 'solid' }, // Domain → Tools container
  { from: 'github', to: 'container:8', style: 'dotted' },
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
          {/* Spine — multi-arc bezier for organic flow (±15px around SPINE_X) */}
          <path
            d={`
              M ${SPINE_X} 60
              C ${SPINE_X} 200, ${SPINE_X + 12} 200, ${SPINE_X + 12} 320
              C ${SPINE_X + 12} 480, ${SPINE_X - 12} 480, ${SPINE_X - 12} 600
              C ${SPINE_X - 12} 800, ${SPINE_X + 15} 800, ${SPINE_X + 15} 990
              C ${SPINE_X + 15} 1180, ${SPINE_X - 15} 1180, ${SPINE_X - 15} 1380
              C ${SPINE_X - 15} 1600, ${SPINE_X + 12} 1600, ${SPINE_X + 12} 1800
              L ${SPINE_X + 12} ${CANVAS_H - 30}
            `}
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />

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

        {SECTIONS.map((s, idx) => (
          <div
            key={s.text}
            id={s.id}
            data-section
            style={{
              position: 'absolute',
              left: '50%',
              top: s.y,
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '4px 18px',
              background: 'var(--surface)',
              zIndex: 3,
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#1F2937',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {idx + 1}
            </span>
            <span style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', letterSpacing: '-0.015em' }}>
              {s.text}
            </span>
          </div>
        ))}

        {diagramNodes.map((node) => {
          const l = layout[node.id]
          if (!l) return null
          const isSelected = node.id === selectedNodeId
          const isChecklistItem = node.id.startsWith('sec-')
          return (
            <button
              key={node.id}
              type="button"
              className="roadmap-box"
              onClick={() => onNodeClick(node.id)}
              style={primaryBoxStyle(l, isSelected)}
            >
              {isChecklistItem && (
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  style={{ marginRight: 8, flexShrink: 0 }}
                  aria-hidden
                >
                  <circle cx={8} cy={8} r={7} fill="#10B981" stroke="#1F2937" strokeWidth={1.5} />
                  <path
                    d="M5 8 L7 10 L11 6"
                    stroke="white"
                    strokeWidth={2}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {node.label}
            </button>
          )
        })}

        {chips.map((chip, i) => (
          <div
            key={`chip-${i}`}
            className="roadmap-chip"
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
