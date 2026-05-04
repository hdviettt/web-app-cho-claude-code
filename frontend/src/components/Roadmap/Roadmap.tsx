import type { CSSProperties } from 'react'
import { diagramNodes, type Alternative } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const SPINE_X = 600
const CANVAS_W = 1200
const CANVAS_H = 3700

interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
  side: 'left' | 'right'
  altSide?: 'left' | 'right'  // chips trên trái hay phải của primary box
}

interface SectionLabel {
  label: string
  y: number
}

// ─── Vị trí từng primary node trên canvas ──────────────────────────
const TOPIC_W = 220
const TOPIC_H = 56

const layout: Record<string, NodeLayout> = {
  // === Section 1: Khái niệm cơ bản (y=130) ===
  language:    { x: 380, y: 200, w: TOPIC_W, h: TOPIC_H, side: 'left', altSide: 'left' },
  function:    { x: 80,  y: 200, w: 130, h: 38, side: 'left' },
  variable:    { x: 80,  y: 250, w: 130, h: 38, side: 'left' },
  library:     { x: 80,  y: 300, w: 130, h: 38, side: 'left' },

  // === Section 2: Source Control (y=420) ===
  git:         { x: 600, y: 480,  w: TOPIC_W, h: TOPIC_H, side: 'right' },
  github:      { x: 380, y: 570,  w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  branch:      { x: 600, y: 660,  w: TOPIC_W, h: TOPIC_H, side: 'right' },
  'pull-request': { x: 380, y: 750, w: TOPIC_W, h: TOPIC_H, side: 'left' },

  // === Section 3: Frontend (y=870) ===
  'fe-framework': { x: 600, y: 930,   w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },
  'fe-build':     { x: 380, y: 1020,  w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'fe-styling':   { x: 600, y: 1110,  w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },
  'fe-html':      { x: 380, y: 1200,  w: TOPIC_W, h: TOPIC_H, side: 'left' },
  'fe-css':       { x: 600, y: 1290,  w: TOPIC_W, h: TOPIC_H, side: 'right' },

  // === Section 4: Backend (y=1410) ===
  'be-framework': { x: 380, y: 1470,  w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'be-api':       { x: 600, y: 1560,  w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },
  'be-orm':       { x: 380, y: 1650,  w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'be-runtime':   { x: 600, y: 1740,  w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },

  // === Section 5: Database (y=1860) ===
  'db-relational': { x: 380, y: 1920, w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'db-nosql':      { x: 600, y: 2010, w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },
  'db-cache':      { x: 380, y: 2100, w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'db-vector':     { x: 600, y: 2190, w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },

  // === Section 6: Security (y=2310) ===
  'sec-auth':   { x: 380, y: 2370, w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'sec-authz':  { x: 600, y: 2460, w: TOPIC_W, h: TOPIC_H, side: 'right' },
  'sec-env':    { x: 380, y: 2550, w: TOPIC_W, h: TOPIC_H, side: 'left' },
  'sec-https':  { x: 600, y: 2640, w: TOPIC_W, h: TOPIC_H, side: 'right' },
  'sec-cors':   { x: 380, y: 2730, w: TOPIC_W, h: TOPIC_H, side: 'left' },

  // === Section 7: Triển khai (y=2850) ===
  'infra-docker':   { x: 600, y: 2910, w: TOPIC_W, h: TOPIC_H, side: 'right' },
  'infra-hosting':  { x: 380, y: 3000, w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'infra-cicd':     { x: 600, y: 3090, w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },
  'infra-domain':   { x: 380, y: 3180, w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  'infra-cdn':      { x: 600, y: 3270, w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },

  // === Section 8: Vận hành (y=3390) ===
  'ops-logs':       { x: 380, y: 3450, w: TOPIC_W, h: TOPIC_H, side: 'left' },
  'ops-monitoring': { x: 600, y: 3540, w: TOPIC_W, h: TOPIC_H, side: 'right', altSide: 'right' },
  'ops-analytics':  { x: 380, y: 3630, w: TOPIC_W, h: TOPIC_H, side: 'left',  altSide: 'left' },
  // Note: ops-email và ops-storage cắt khỏi canvas vì height limit; mở qua scroll
}

const ROOT = { x: 440, y: 20, w: 320, h: 64 }

const SECTIONS: SectionLabel[] = [
  { label: 'Khái niệm cơ bản', y: 140 },
  { label: 'Source Control', y: 430 },
  { label: 'Frontend', y: 880 },
  { label: 'Backend', y: 1420 },
  { label: 'Database', y: 1870 },
  { label: 'Security', y: 2320 },
  { label: 'Triển khai', y: 2860 },
  { label: 'Vận hành', y: 3400 },
]

const SUB_LINKS = [
  { parentId: 'language', childId: 'function' },
  { parentId: 'language', childId: 'variable' },
  { parentId: 'language', childId: 'library' },
]

// ─── SVG path generators ───────────────────────────────────────────

function topicConnectorPath(node: NodeLayout): string {
  const cy = node.y + node.h / 2
  const isLeft = node.side === 'left'
  const targetX = isLeft ? node.x + node.w : node.x
  const cp1x = SPINE_X + (targetX - SPINE_X) * 0.45
  return `M ${SPINE_X} ${cy} C ${cp1x} ${cy}, ${cp1x} ${cy}, ${targetX} ${cy}`
}

function subLinkPath(parent: NodeLayout, child: NodeLayout): string {
  const childIsLeft = child.x + child.w < parent.x
  const startX = childIsLeft ? parent.x : parent.x + parent.w
  const startY = parent.y + parent.h / 2
  const endX = childIsLeft ? child.x + child.w : child.x
  const endY = child.y + child.h / 2
  const midX = (startX + endX) / 2
  return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
}

function altChipPath(parentX: number, parentY: number, chipX: number, chipY: number): string {
  const midX = (parentX + chipX) / 2
  return `M ${parentX} ${parentY} C ${midX} ${parentY}, ${midX} ${chipY}, ${chipX} ${chipY}`
}

// ─── Chip layout ───────────────────────────────────────────────────

const CHIP_W = 130
const CHIP_H = 32
const CHIP_GAP_X = 16
const CHIP_GAP_Y = 6

interface ChipLayout {
  parentId: string
  alts: Array<{ alt: Alternative; x: number; y: number }>
  // connector start point (parent box edge)
  px: number
  py: number
}

function computeChipLayouts(): ChipLayout[] {
  const result: ChipLayout[] = []
  for (const node of diagramNodes) {
    if (!node.alternatives || node.alternatives.length === 0) continue
    const l = layout[node.id]
    if (!l || !l.altSide) continue

    const isLeft = l.altSide === 'left'
    const baseX = isLeft ? l.x - CHIP_GAP_X - CHIP_W : l.x + l.w + CHIP_GAP_X
    const baseY = l.y + l.h / 2 - ((node.alternatives.length * (CHIP_H + CHIP_GAP_Y)) - CHIP_GAP_Y) / 2

    const alts = node.alternatives.map((alt, i) => ({
      alt,
      x: baseX,
      y: baseY + i * (CHIP_H + CHIP_GAP_Y),
    }))

    result.push({
      parentId: node.id,
      alts,
      px: isLeft ? l.x : l.x + l.w,
      py: l.y + l.h / 2,
    })
  }
  return result
}

// ─── Component ─────────────────────────────────────────────────────

export function Roadmap({ selectedNodeId, onNodeClick }: RoadmapProps) {
  const chipLayouts = computeChipLayouts()

  return (
    <div
      style={{
        overflowX: 'auto',
        overflowY: 'visible',
        padding: '2rem 1rem 5rem',
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
        {/* SVG: spine + connectors */}
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {/* Spine */}
          <path
            d={`M ${SPINE_X} ${ROOT.y + ROOT.h} L ${SPINE_X} ${CANVAS_H - 30}`}
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />

          {/* Topic connectors */}
          {Object.entries(layout).map(([id, l]) => {
            // Skip subtopics (function/variable/library) — they connect to parent, not spine
            if (['function', 'variable', 'library'].includes(id)) return null
            return (
              <path
                key={id}
                d={topicConnectorPath(l)}
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
            )
          })}

          {/* Subtopic connectors (Hàm/Biến/Thư viện → Ngôn ngữ) */}
          {SUB_LINKS.map((link) => (
            <path
              key={`${link.parentId}-${link.childId}`}
              d={subLinkPath(layout[link.parentId], layout[link.childId])}
              stroke="#3B82F6"
              strokeWidth={2}
              fill="none"
              strokeDasharray="2 6"
              strokeLinecap="round"
            />
          ))}

          {/* Alt chip connectors (dotted) */}
          {chipLayouts.flatMap((cl) =>
            cl.alts.map((altPos, i) => (
              <path
                key={`${cl.parentId}-${i}`}
                d={altChipPath(
                  cl.px,
                  cl.py,
                  altPos.x + (cl.px > altPos.x ? CHIP_W : 0),
                  altPos.y + CHIP_H / 2,
                )}
                stroke="#94A3B8"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="2 5"
                strokeLinecap="round"
              />
            )),
          )}
        </svg>

        {/* Root box (decorative) */}
        <div
          style={{
            position: 'absolute',
            left: ROOT.x,
            top: ROOT.y,
            width: ROOT.w,
            height: ROOT.h,
            background: '#FFD93B',
            border: '2.5px solid #1F2937',
            borderRadius: 8,
            boxShadow: '5px 5px 0 #1F2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
            color: '#1F2937',
            zIndex: 2,
          }}
        >
          Web App với Claude Code
        </div>

        {/* Section labels */}
        {SECTIONS.map((s) => (
          <div
            key={s.label}
            style={{
              position: 'absolute',
              left: '50%',
              top: s.y,
              transform: 'translateX(-50%)',
              background: 'var(--surface)',
              padding: '6px 18px',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#1F2937',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            {s.label}
          </div>
        ))}

        {/* Primary nodes */}
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

        {/* Alternative chips (decorative — show tech choices) */}
        {chipLayouts.flatMap((cl) =>
          cl.alts.map((altPos, i) => (
            <div
              key={`chip-${cl.parentId}-${i}`}
              title={altPos.alt.note ?? altPos.alt.label}
              style={chipStyle(altPos.x, altPos.y)}
            >
              {altPos.alt.iconSlug && (
                <img
                  src={`https://cdn.simpleicons.org/${altPos.alt.iconSlug}/64748b`}
                  width={14}
                  height={14}
                  alt=""
                  style={{ flexShrink: 0 }}
                />
              )}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {altPos.alt.label}
              </span>
            </div>
          )),
        )}
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
    background: '#F1F5F9',
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
