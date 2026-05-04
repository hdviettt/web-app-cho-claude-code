import type { DiagramNode } from '../../data/diagram'

interface ItemCardProps {
  node: DiagramNode
  accent: string
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}

export function ItemCard({ node, accent, isSelected, onClick, compact = false }: ItemCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: compact ? '7px 12px' : '10px 14px',
        borderRadius: 8,
        border: `1px solid ${isSelected ? accent : 'var(--border)'}`,
        borderLeft: `3px solid ${accent}`,
        background: isSelected ? `${accent}14` : 'white',
        fontSize: compact ? 13 : 14,
        fontWeight: compact ? 400 : 500,
        color: 'var(--fg)',
        transition: 'background 0.12s ease, border-color 0.12s ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--surface)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'white'
      }}
    >
      <span>{node.label}</span>
      <span
        style={{
          color: isSelected ? accent : 'var(--muted)',
          fontSize: 14,
          marginLeft: 8,
          transform: isSelected ? 'translateX(2px)' : 'none',
          transition: 'transform 0.12s ease',
        }}
        aria-hidden
      >
        →
      </span>
    </button>
  )
}
