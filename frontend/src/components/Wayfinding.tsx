import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'sec-foundations',    label: 'Lập trình & ngôn ngữ' },
  { id: 'sec-frontend',       label: 'Frontend' },
  { id: 'sec-backend',        label: 'Backend' },
  { id: 'sec-security',       label: 'Security' },
  { id: 'sec-infra',          label: 'Triển khai' },
  { id: 'sec-source-control', label: 'Source Control' },
]

export function Wayfinding() {
  const [scrollPct, setScrollPct] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      const pct = docH > 0 ? Math.min(100, (window.scrollY / docH) * 100) : 0
      setScrollPct(pct)

      // Find which section is closest to top of viewport (with offset)
      const offset = 200
      let active = 0
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top < offset) active = i
      }
      setActiveSection(active)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function jumpTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTocOpen(false)
  }

  return (
    <>
      {/* Scroll progress bar — fixed top */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'transparent',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${scrollPct}%`,
            background: '#FFD93B',
            borderBottom: '1px solid #1F2937',
            transition: 'width 0.05s linear',
          }}
        />
      </div>

      {/* TOC button — fixed top-right corner */}
      <button
        type="button"
        onClick={() => setTocOpen((o) => !o)}
        aria-label="Mục lục"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 90,
          padding: '8px 14px',
          background: '#FFD93B',
          border: '2.5px solid #1F2937',
          borderRadius: 8,
          boxShadow: '4px 4px 0 #1F2937',
          fontSize: 13,
          fontWeight: 700,
          color: '#1F2937',
          cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'transform 0.08s, box-shadow 0.08s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(-1px, -1px)'
          e.currentTarget.style.boxShadow = '5px 5px 0 #1F2937'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)'
          e.currentTarget.style.boxShadow = '4px 4px 0 #1F2937'
        }}
      >
        <span style={{ opacity: 0.6, fontSize: 11 }}>{activeSection + 1}/6</span>
        <span>{SECTIONS[activeSection].label}</span>
        <span style={{ fontSize: 11 }}>{tocOpen ? '▲' : '▼'}</span>
      </button>

      {/* TOC dropdown */}
      {tocOpen && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            right: 16,
            zIndex: 90,
            width: 260,
            background: 'white',
            border: '2.5px solid #1F2937',
            borderRadius: 8,
            boxShadow: '6px 6px 0 #1F2937',
            padding: 8,
          }}
        >
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpTo(s.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 12px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: i === activeSection ? 700 : 500,
                color: '#1F2937',
                background: i === activeSection ? '#FFD93B' : 'transparent',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (i !== activeSection) e.currentTarget.style.background = '#F1F5F9'
              }}
              onMouseLeave={(e) => {
                if (i !== activeSection) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: i === activeSection ? '#1F2937' : '#E2E8F0',
                  color: i === activeSection ? 'white' : '#64748B',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
