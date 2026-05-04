import type { CSSProperties } from 'react'
import { diagramNodes } from '../../data/diagram'

interface RoadmapProps {
  selectedNodeId: string | null
  onNodeClick: (id: string) => void
}

const SPINE_X = 500
const CANVAS_W = 800
const CANVAS_H = 1000

interface NodeLayout {
  x: number
  y: number
  w: number
  h: number
  variant: 'topic' | 'subtopic'
}

// Vị trí từng node — toạ độ tuyệt đối trên canvas 800×1000.
// Trái spine (x<500) hoặc phải spine (x>500) quyết định hướng connector.
const layout: Record<string, NodeLayout> = {
  language:   { x: 290, y: 140, w: 200, h: 60, variant: 'topic' },
  function:   { x: 70,  y: 120, w: 150, h: 42, variant: 'subtopic' },
  variable:   { x: 70,  y: 172, w: 150, h: 42, variant: 'subtopic' },
  library:    { x: 70,  y: 224, w: 150, h: 42, variant: 'subtopic' },

  frontend:   { x: 510, y: 380, w: 200, h: 60, variant: 'topic' },
  backend:    { x: 290, y: 460, w: 200, h: 60, variant: 'topic' },
  database:   { x: 510, y: 540, w: 200, h: 60, variant: 'topic' },
  auth:       { x: 290, y: 620, w: 200, h: 60, variant: 'topic' },

  deployment: { x: 510, y: 770, w: 200, h: 60, variant: 'topic' },
  hosting:    { x: 290, y: 850, w: 200, h: 60, variant: 'topic' },
  domain:     { x: 510, y: 930, w: 200, h: 60, variant: 'topic' },
}

const ROOT = { x: 340, y: 6, w: 320, h: 64 }

const SECTIONS = [
  { label: 'Lập trình cơ bản', y: 92 },
  { label: 'Web app anatomy', y: 332 },
  { label: 'Triển khai & vận hành', y: 720 },
]

const SUB_LINKS = [
  { parentId: 'language', childId: 'function' },
  { parentId: 'language', childId: 'variable' },
  { parentId: 'language', childId: 'library' },
]

// ─── SVG path helpers ──────────────────────────────────────────────

function topicConnectorPath(node: NodeLayout): string {
  const cy = node.y + node.h / 2
  const isLeft = node.x + node.w < SPINE_X
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

// ─── Component ─────────────────────────────────────────────────────

export function Roadmap({ selectedNodeId, onNodeClick }: RoadmapProps) {
  return (
    <div
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '2.5rem 1rem 4rem',
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
        {/* SVG: spine + connectors (under boxes) */}
        <svg
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
          {/* Spine (solid blue, vertical) */}
          <path
            d={`M ${SPINE_X} ${ROOT.y + ROOT.h} L ${SPINE_X} ${CANVAS_H - 20}`}
            stroke="#3B82F6"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />
          {/* Topic connectors (solid blue, curved) */}
          {Object.entries(layout)
            .filter(([, l]) => l.variant === 'topic')
            .map(([id, l]) => (
              <path
                key={id}
                d={topicConnectorPath(l)}
                stroke="#3B82F6"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          {/* Subtopic connectors (dotted blue) */}
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
        </svg>

        {/* Root box (decorative, biggest yellow) */}
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
            fontSize: 17,
            fontWeight: 600,
            color: '#1F2937',
            letterSpacing: '-0.005em',
            zIndex: 2,
          }}
        >
          Web App với Claude Code
        </div>

        {/* Section labels (sit on the spine, white bg covers spine line) */}
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

        {/* Node boxes (yellow topics + peach subtopics) */}
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
              style={nodeBoxStyle(l, isSelected)}
            >
              {node.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function nodeBoxStyle(l: NodeLayout, isSelected: boolean): CSSProperties {
  const isTopic = l.variant === 'topic'
  return {
    all: 'unset',
    boxSizing: 'border-box',
    position: 'absolute',
    left: l.x,
    top: l.y,
    width: l.w,
    height: l.h,
    background: isSelected ? '#FCA5A5' : isTopic ? '#FFD93B' : '#FFE4B5',
    border: '2.5px solid #1F2937',
    borderRadius: 7,
    boxShadow: '4px 4px 0 #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isTopic ? 14 : 13,
    fontWeight: isTopic ? 600 : 500,
    color: '#1F2937',
    letterSpacing: '-0.005em',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '0 14px',
    zIndex: 2,
  }
}
