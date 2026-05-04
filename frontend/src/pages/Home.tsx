import { useEffect, useState } from 'react'
import { Roadmap } from '../components/Roadmap/Roadmap'
import { DetailPanel } from '../components/Roadmap/DetailPanel'
import { diagramNodes } from '../data/diagram'
import { getConfig, type SiteConfig } from '../lib/api'

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setConfig(cfg)
        document.documentElement.style.setProperty('--primary', cfg.primary_color)
        document.title = cfg.site_title
      })
      .catch((err) => console.error('Không fetch được config:', err))
  }, [])

  const selectedNode = selectedNodeId
    ? diagramNodes.find((n) => n.id === selectedNodeId)
    : null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <header
        style={{
          background: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '2.5rem 1.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              background: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              padding: '4px 10px',
              borderRadius: 999,
              marginBottom: '1rem',
            }}
          >
            Buổi 2 · Khóa Claude Code cho SEO
          </div>
          <h1
            style={{
              margin: '0 0 0.5rem',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {config?.site_title ?? 'Web App cho Claude Code'}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(0.95rem, 2vw, 1.0625rem)',
              color: 'var(--muted)',
              lineHeight: 1.55,
            }}
          >
            Anatomy của một web app fullstack — 19 khái niệm tối thiểu marketer cần biết để
            build với Claude Code. Bấm vào từng box để xem định nghĩa, ví dụ thực tế,
            lỗi thường gặp, và lựa chọn khác.
          </p>
        </div>
      </header>

      <Roadmap selectedNodeId={selectedNodeId} onNodeClick={setSelectedNodeId} />

      {selectedNode && (
        <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
      )}

      <footer
        style={{
          padding: '2rem 1.5rem',
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--muted)',
          borderTop: '1px solid var(--border)',
          background: 'white',
        }}
      >
        Open source ·{' '}
        <a
          href="https://github.com/hdviettt/web-app-cho-claude-code"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--primary)' }}
        >
          github.com/hdviettt/web-app-cho-claude-code
        </a>
      </footer>
    </div>
  )
}
