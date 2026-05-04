/**
 * Wrapper gọn cho fetch — luôn gửi cookie session, parse JSON, throw nếu lỗi.
 * Tất cả các call đến backend đều đi qua đây.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
    throw new Error(error.detail ?? `HTTP ${response.status}`)
  }
  return response.json() as Promise<T>
}

export interface SiteConfig {
  site_title: string
  primary_color: string
}

export interface OkResponse {
  ok: boolean
}

export interface MeResponse {
  session_id: string
  expires_at: string
}

export const getConfig = (): Promise<SiteConfig> => apiFetch<SiteConfig>('/config')

export const updateConfig = (config: SiteConfig): Promise<SiteConfig> =>
  apiFetch<SiteConfig>('/config', {
    method: 'PUT',
    body: JSON.stringify(config),
  })

export const login = (password: string): Promise<OkResponse> =>
  apiFetch<OkResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })

export const logout = (): Promise<OkResponse> =>
  apiFetch<OkResponse>('/auth/logout', { method: 'POST' })

export const me = (): Promise<MeResponse> => apiFetch<MeResponse>('/auth/me')
