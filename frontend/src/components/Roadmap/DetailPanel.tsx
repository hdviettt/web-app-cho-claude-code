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
        position: 'sticky',
        top: 0,
        width: '100%',
        height: '100vh',
        background: 'white',
        borderLeft: '2.5px solid #1F2937',
        overflow: 'auto',
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
          aria-label="Đóng (ESC)"
          title="Đóng (ESC)"
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            border: '2px solid #1F2937',
            background: 'var(--primary)',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            color: '#1F2937',
            padding: 0,
            width: 36,
            height: 36,
            lineHeight: 1,
            borderRadius: 6,
            boxShadow: '2px 2px 0 #1F2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.08s, box-shadow 0.08s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)'
            e.currentTarget.style.boxShadow = '3px 3px 0 #1F2937'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)'
            e.currentTarget.style.boxShadow = '2px 2px 0 #1F2937'
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
        {node.alternatives && node.alternatives.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: cluster.accent,
                margin: '0 0 0.6rem',
                fontWeight: 600,
              }}
            >
              Lựa chọn khác
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {node.alternatives.map((alt) => (
                <li
                  key={alt.label}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 10,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {alt.iconSlug ? (
                    <img
                      src={`https://cdn.simpleicons.org/${alt.iconSlug}/${cluster.accent.slice(1)}`}
                      width={18}
                      height={18}
                      alt=""
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                  ) : (
                    <span style={{ width: 18, flexShrink: 0 }} />
                  )}
                  <span>
                    <strong style={{ fontWeight: 600 }}>{alt.label}</strong>
                    {alt.note && (
                      <span style={{ color: 'var(--muted)' }}> — {alt.note}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
        <Section title="Nằm ở đâu trong repo?">{node.whereInProject}</Section>
        <Section title="Khi nào care?">{node.whenToCare}</Section>
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
