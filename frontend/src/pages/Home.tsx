import { useEffect, useState } from 'react'
import { Canvas } from '../components/Diagram/Canvas'
import { DetailPanel } from '../components/Diagram/DetailPanel'
import { diagramNodes } from '../data/diagram'
import { getConfig, type SiteConfig } from '../lib/api'

export default function Home() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Lúc mount: fetch config từ backend, apply vào CSS variable + document.title.
  useEffect(() => {
    getConfig()
      .then((cfg) => {
        setConfig(cfg)
        document.documentElement.style.setProperty('--primary', cfg.primary_color)
        document.title = cfg.site_title
      })
      .catch((err) => {
        console.error('Không fetch được config:', err)
      })
  }, [])

  const selectedNode = selectedNodeId
    ? diagramNodes.find((n) => n.id === selectedNodeId)
    : null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'white',
          zIndex: 5,
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
          {config?.site_title ?? 'Web App cho Claude Code'}
        </h1>
        <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)', fontSize: '0.875rem' }}>
          Bấm vào từng node để xem chi tiết. Tài liệu sống cho buổi 2 khóa Claude Code cho SEO.
        </p>
      </header>
      <div style={{ flex: 1, display: 'flex', position: 'relative', minHeight: 0 }}>
        <Canvas onNodeClick={setSelectedNodeId} selectedNodeId={selectedNodeId} />
        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
        )}
      </div>
    </div>
  )
}
