const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const RETRY_COUNT = 1

interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export class ApiRequestError extends Error {
  status: number
  errors?: Record<string, string[]>

  constructor(error: ApiError) {
    super(error.message)
    this.name = 'ApiRequestError'
    this.status = error.status
    this.errors = error.errors
  }
}

async function refreshToken(): Promise<string | null> {
  const refreshTokenValue = localStorage.getItem('refreshToken')
  if (!refreshTokenValue) return null

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    })

    if (!response.ok) {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      return null
    }

    const data = await response.json()
    const newToken = data.token || data.accessToken
    if (newToken) {
      localStorage.setItem('token', newToken)
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken)
      }
    }
    return newToken
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    return null
  }
}

async function request<T>(
  method: string,
  path: string,
  data?: unknown
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config: RequestInit = {
    method,
    headers,
  }

  if (data && method !== 'GET' && method !== 'DELETE') {
    config.body = JSON.stringify(data)
  }

  let response = await fetch(`${API_URL}${path}`, config)

  if (response.status === 401 && token) {
    const newToken = await refreshToken()
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`
      config.headers = headers
      response = await fetch(`${API_URL}${path}`, config)
    } else {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      throw new ApiRequestError({
        status: 401,
        message: 'Sessão expirada. Faça login novamente.',
      })
    }
  }

  if (!response.ok) {
    let errorBody: ApiError = {
      status: response.status,
      message: `Erro ${response.status}`,
    }
    try {
      const parsed = await response.json()
      errorBody = {
        status: response.status,
        message: parsed.message || parsed.error || `Erro ${response.status}`,
        errors: parsed.errors,
      }
    } catch {
      // ignore
    }
    throw new ApiRequestError(errorBody)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, data?: unknown) => request<T>('POST', path, data),
  patch: <T>(path: string, data?: unknown) => request<T>('PATCH', path, data),
  delete: <T>(path: string) => request<T>('DELETE', path),
}
