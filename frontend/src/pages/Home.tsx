import { useEffect, useRef, useState } from 'react'
import { Roadmap } from '../components/Roadmap/Roadmap'
import { DetailPanel } from '../components/Roadmap/DetailPanel'
import { Wayfinding } from '../components/Wayfinding'
import { diagramNodes } from '../data/diagram'
import { getConfig } from '../lib/api'

// Canvas natural dimensions (must keep in sync với Roadmap.tsx CANVAS_W/CANVAS_H + padding)
const ROADMAP_W = 1200

export default function Home() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [innerHeight, setInnerHeight] = useState(2200)

  useEffect(() => {
    getConfig()
      .then((cfg) => {
        document.documentElement.style.setProperty('--primary', cfg.primary_color)
        document.title = cfg.site_title
      })
      .catch((err) => console.error('Không fetch được config:', err))
  }, [])

  // ESC key đóng panel
  useEffect(() => {
    if (!selectedNodeId) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSelectedNodeId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedNodeId])

  // Auto-scale canvas để fit container width — react cả khi viewport resize
  // và khi panel mở/đóng (flex column thay đổi width).
  useEffect(() => {
    function updateScale() {
      if (!wrapperRef.current) return
      const w = wrapperRef.current.offsetWidth
      setScale(Math.min(1, w / ROADMAP_W))
    }
    function updateHeight() {
      if (innerRef.current) setInnerHeight(innerRef.current.offsetHeight)
    }
    updateScale()
    updateHeight()
    const wo = new ResizeObserver(updateScale)
    if (wrapperRef.current) wo.observe(wrapperRef.current)
    const io = new ResizeObserver(updateHeight)
    if (innerRef.current) io.observe(innerRef.current)
    return () => {
      wo.disconnect()
      io.disconnect()
    }
  }, [])

  const selectedNode = selectedNodeId
    ? diagramNodes.find((n) => n.id === selectedNodeId)
    : null

  const panelOpen = !!selectedNode

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <Wayfinding panelOpen={panelOpen} />

      <header
        style={{
          background: 'white',
          borderBottom: '2.5px solid #18181B',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#18181B',
              background: 'var(--primary)',
              border: '2px solid #18181B',
              padding: '5px 12px',
              borderRadius: 999,
              boxShadow: '3px 3px 0 #18181B',
              marginBottom: '1.75rem',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#18181B' }} />
            Buổi 2 · Khóa Claude Code cho SEO
          </div>
          <h1
            style={{
              margin: '0 0 1rem',
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              color: '#18181B',
            }}
          >
            Đừng học code. <br />
            Học <span style={{ background: 'var(--primary)', padding: '0 8px', boxShadow: '3px 3px 0 #18181B', display: 'inline-block', transform: 'rotate(-1deg)' }}>cấu trúc</span> của web app.
          </h1>
          <p
            style={{
              margin: '1.25rem auto 0',
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: 640,
            }}
          >
            <strong style={{ color: '#18181B' }}>19 khái niệm</strong> marketer cần biết để build web app với Claude Code.
            Khi Claude nói "đã thêm endpoint backend" — mình hiểu nó vừa đụng đến đâu.
            Bấm vào từng box bên dưới để mở.
          </p>
          <a
            href="#sec-foundations"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: '2rem',
              padding: '12px 24px',
              background: 'var(--primary)',
              color: '#18181B',
              border: '2.5px solid #18181B',
              borderRadius: 8,
              boxShadow: '4px 4px 0 #18181B',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.02em',
              textDecoration: 'none',
              transition: 'transform 0.08s, box-shadow 0.08s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-1px, -1px)'
              e.currentTarget.style.boxShadow = '5px 5px 0 #18181B'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)'
              e.currentTarget.style.boxShadow = '4px 4px 0 #18181B'
            }}
          >
            Bắt đầu từ đây
            <span style={{ fontSize: 16 }}>↓</span>
          </a>
        </div>
      </header>

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div
          ref={wrapperRef}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            height: innerHeight * scale,
            transition: 'height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            ref={innerRef}
            style={{
              width: ROADMAP_W,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Roadmap selectedNodeId={selectedNodeId} onNodeClick={setSelectedNodeId} />
          </div>
        </div>
        {selectedNode && (
          <div
            style={{
              flexBasis: 480,
              flexShrink: 0,
              alignSelf: 'stretch',
            }}
          >
            <DetailPanel node={selectedNode} onClose={() => setSelectedNodeId(null)} />
          </div>
        )}
      </div>

      <footer
        style={{
          padding: '3rem 1.5rem',
          background: '#18181B',
          color: '#E2E8F0',
          borderTop: '2.5px solid #18181B',
        }}
      >
        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'white',
              marginBottom: '0.5rem',
            }}
          >
            Roadmap này là <span style={{ color: 'var(--primary)' }}>open-source</span>.
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#CBD5E1', marginBottom: '1.5rem' }}>
            Repo public trên GitHub. Fork về sửa cho team mình. Hoặc đọc code để hiểu
            chính cái mình đang đứng được build thế nào.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a
              href="https://github.com/hdviettt/web-app-cho-claude-code"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'var(--primary)',
                color: '#18181B',
                border: '2px solid var(--primary)',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              <img
                src="https://cdn.simpleicons.org/github/1F2937"
                width={16}
                height={16}
                alt=""
              />
              Xem trên GitHub
            </a>
            <a
              href="https://github.com/hdviettt/web-app-cho-claude-code/blob/main/PLAN.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'transparent',
                color: 'var(--primary)',
                border: '2px solid var(--primary)',
                borderRadius: 6,
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              Đọc PLAN.md
            </a>
          </div>
          <div
            style={{
              marginTop: '2rem',
              fontSize: 12,
              color: '#64748B',
              borderTop: '1px solid #334155',
              paddingTop: '1.5rem',
            }}
          >
            MIT License · Build với Claude Code · Hà Đức Việt — agentic@seongon.com
          </div>
        </div>
      </footer>
    </div>
  )
}
