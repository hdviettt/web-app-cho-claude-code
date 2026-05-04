import type { ReactNode } from 'react'
import type { DiagramNode } from '../../data/diagram'

interface DetailPanelProps {
  node: DiagramNode
  onClose: () => void
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  return (
    <aside
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 'min(440px, 90vw)',
        background: 'white',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-6px 0 24px rgba(0, 0, 0, 0.06)',
        overflow: 'auto',
        padding: '1.75rem 1.75rem 2.5rem',
        animation: 'slideIn 0.2s ease',
        zIndex: 10,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Đóng"
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          border: 'none',
          background: 'transparent',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'var(--muted)',
          padding: 0,
          width: 36,
          height: 36,
          lineHeight: 1,
        }}
      >
        ×
      </button>
      <h2 style={{ marginTop: '0.25rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
        {node.label}
      </h2>

      <Section title="Đây là gì?">{node.whatIs}</Section>
      <Section title="Trong project này nằm ở đâu?">{node.whereInProject}</Section>
      <Section title="Khi nào học viên cần care?">{node.whenToCare}</Section>
      {node.readMore && (
        <Section title="Đọc thêm">
          <a href={node.readMore} target="_blank" rel="noopener noreferrer">
            {node.readMore}
          </a>
        </Section>
      )}
    </aside>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h3
        style={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--muted)',
          margin: '0 0 0.5rem',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <div style={{ fontSize: '0.95rem', lineHeight: 1.65, color: 'var(--fg)' }}>{children}</div>
    </section>
  )
}
