import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(password)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--surface)',
        padding: '1.5rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: 12,
          border: '1px solid var(--border)',
          width: 'min(100%, 380px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.5rem' }}>Đăng nhập admin</h1>
        <p style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
          Nhập mật khẩu admin để chỉnh tiêu đề và màu chủ đạo của site.
        </p>

        <label style={{ display: 'block', marginBottom: '1rem' }}>
          <span style={{ display: 'block', marginBottom: '0.375rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Mật khẩu
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
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

        <button
          type="submit"
          className="primary"
          disabled={submitting}
          style={{ width: '100%', padding: '0.625rem', fontSize: '0.95rem' }}
        >
          {submitting ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}
