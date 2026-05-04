import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getConfig, updateConfig, logout, me, type SiteConfig } from '../lib/api'

export default function Admin() {
  const navigate = useNavigate()
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)

  // Lúc mount: verify đã login (gọi /auth/me). Nếu 401 → đẩy về /admin/login.
  useEffect(() => {
    Promise.all([me(), getConfig()])
      .then(([, cfg]) => setConfig(cfg))
      .catch(() => navigate('/admin/login'))
  }, [navigate])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!config) return
    setError(null)
    setSaving(true)
    try {
      const updated = await updateConfig(config)
      setConfig(updated)
      setSavedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/admin/login')
    }
  }

  if (!config) {
    return (
      <div style={{ padding: '2rem', color: 'var(--muted)' }}>Đang tải...</div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface)' }}>
      <header
        style={{
          padding: '1rem 1.5rem',
          background: 'white',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Admin</h1>
        <button onClick={handleLogout}>Đăng xuất</button>
      </header>

      <main style={{ maxWidth: 560, margin: '2rem auto', padding: '0 1.5rem' }}>
        <form
          onSubmit={handleSave}
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: 12,
            border: '1px solid var(--border)',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' }}>
            Cấu hình site
          </h2>
          <p style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
            Đổi tiêu đề và màu chủ đạo. Lưu xong reload trang chủ để thấy thay đổi.
          </p>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Tiêu đề site
            </span>
            <input
              type="text"
              value={config.site_title}
              onChange={(e) => setConfig({ ...config, site_title: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: '0.95rem',
                fontFamily: 'inherit',
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>
              Màu chủ đạo
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="color"
                value={config.primary_color}
                onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                style={{ width: 56, height: 40, padding: 2, border: '1px solid var(--border)', borderRadius: 6 }}
              />
              <input
                type="text"
                value={config.primary_color}
                onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                pattern="^#[0-9a-fA-F]{6}$"
                style={{
                  flex: 1,
                  padding: '0.625rem 0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: '0.95rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </label>

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: '1rem',
                padding: '0.625rem 0.75rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 6,
                color: '#991b1b',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          {savedAt && !error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.625rem 0.75rem',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 6,
                color: '#166534',
                fontSize: '0.875rem',
              }}
            >
              Đã lưu lúc {savedAt.toLocaleTimeString('vi-VN')}.
            </div>
          )}

          <button type="submit" className="primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </main>
    </div>
  )
}
