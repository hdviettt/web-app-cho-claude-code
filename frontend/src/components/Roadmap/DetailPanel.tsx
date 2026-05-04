import type { ReactNode } from 'react'
import type { DiagramNode } from '../../data/diagram'
import { clusters } from '../../data/diagram'

interface DetailPanelProps {
  node: DiagramNode
  onClose: () => void
}

export function DetailPanel({ node, onClose }: DetailPanelProps) {
  const cluster = clusters.find((c) => c.id === node.cluster)!

  return (
    <aside
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 'min(480px, 92vw)',
        background: 'white',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-12px 0 32px rgba(0, 0, 0, 0.08)',
        overflow: 'auto',
        zIndex: 50,
        animation: 'slideIn 0.2s ease',
      }}
    >
      <header
        style={{
          padding: '1.25rem 1.5rem 1rem',
          borderBottom: '1px solid var(--border)',
          borderTop: `3px solid ${cluster.accent}`,
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 1,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Đóng"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            border: 'none',
            background: 'transparent',
            fontSize: 24,
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
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: cluster.accent,
            marginBottom: 4,
          }}
        >
          {cluster.title}
        </div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{node.label}</h2>
      </header>

      <div style={{ padding: '1.5rem' }}>
        <Section title="Đây là gì?">{node.whatIs}</Section>
        <Section title="Trong project này nằm ở đâu?">{node.whereInProject}</Section>
        <Section title="Khi nào học viên cần care?">{node.whenToCare}</Section>
        {node.vidu && <Section title="Ví dụ thực tế" accent={cluster.accent}>{node.vidu}</Section>}
        {node.loiThuongGap && (
          <Section title="Lỗi thường gặp" accent="#dc2626">{node.loiThuongGap}</Section>
        )}
        {node.code && (
          <CodeSection code={node.code} lang={node.codeLang ?? 'bash'} accent={cluster.accent} />
        )}
        {node.readMore && (
          <Section title="Đọc thêm">
            <a
              href={node.readMore}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: cluster.accent, wordBreak: 'break-all' }}
            >
              {node.readMore}
            </a>
          </Section>
        )}
      </div>
    </aside>
  )
}

function Section({
  title,
  children,
  accent,
}: {
  title: string
  children: ReactNode
  accent?: string
}) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h3
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: accent ?? 'var(--muted)',
          margin: '0 0 0.5rem',
          fontWeight: 600,
        }}
      >
        {title}
      </h3>
      <div style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg)' }}>{children}</div>
    </section>
  )
}

function CodeSection({ code, lang, accent }: { code: string; lang: string; accent: string }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <h3
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: accent,
            margin: 0,
            fontWeight: 600,
          }}
        >
          Code mẫu
        </h3>
        <span
          style={{
            fontSize: 10,
            color: 'var(--muted)',
            fontFamily: 'monospace',
            textTransform: 'lowercase',
            background: 'var(--surface)',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          {lang}
        </span>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '0.875rem 1rem',
          background: '#0f172a',
          color: '#e2e8f0',
          borderRadius: 8,
          fontSize: 12.5,
          lineHeight: 1.55,
          overflow: 'auto',
          fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
        }}
      >
        <code>{code}</code>
      </pre>
    </section>
  )
}
