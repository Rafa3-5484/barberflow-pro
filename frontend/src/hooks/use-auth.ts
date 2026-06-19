'use client'

import { useState, useEffect, useCallback } from 'react'
import { api, ApiRequestError } from '@/lib/api'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false })
      return
    }
    try {
      const user = await api.get<User>('/auth/me')
      setState({ user, isLoading: false, isAuthenticated: true })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setState({ user: null, isLoading: false, isAuthenticated: false })
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = useCallback(async (data: LoginData) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await api.post<{ token: string; refreshToken: string; user: User }>(
        '/auth/login',
        data
      )
      localStorage.setItem('token', response.token)
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
      setState({ user: response.user, isLoading: false, isAuthenticated: true })
      return response.user
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await api.post<{ token: string; refreshToken: string; user: User }>(
        '/auth/register',
        data
      )
      localStorage.setItem('token', response.token)
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
      setState({ user: response.user, isLoading: false, isAuthenticated: true })
      return response.user
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setState({ user: null, isLoading: false, isAuthenticated: false })
    window.location.href = '/'
  }, [])

  const refreshSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await api.post<{ token: string; refreshToken?: string }>(
        '/auth/refresh',
        { refreshToken: localStorage.getItem('refreshToken') }
      )
      localStorage.setItem('token', response.token)
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken)
      }
      await fetchUser()
    } catch {
      logout()
    }
  }, [fetchUser, logout])

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
  }
}
