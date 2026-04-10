import { useCallback, useEffect, useState } from 'react'
import useApiClient from '@/hooks/useApi'

export interface SessionUser {
  email: string
  id: string
  nickname: string
}

type AuthPayload = {
  email: string
  nickname?: string
  password: string
}

interface SessionResponse {
  user: SessionUser
}

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) {
      return response.data.message
    }
  }
  return 'Authentication failed.'
}

export const useAuthSession = () => {
  const apiClient = useApiClient()
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<SessionUser | null>(null)

  const loadSession = useCallback(async () => {
    try {
      const { data } = await apiClient.get<SessionResponse>('/auth/session')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setInitializing(false)
    }
  }, [apiClient])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const login = useCallback(
    async (payload: AuthPayload) => {
      setLoading(true)
      setError('')

      try {
        const { data } = await apiClient.post<SessionResponse>('/auth/login', {
          email: payload.email,
          password: payload.password,
        })
        setUser(data.user)
      } catch (caughtError) {
        setError(getErrorMessage(caughtError))
        throw caughtError
      } finally {
        setLoading(false)
      }
    },
    [apiClient],
  )

  const signUp = useCallback(
    async (payload: AuthPayload) => {
      setLoading(true)
      setError('')

      try {
        const { data } = await apiClient.post<SessionResponse>('/auth/signup', {
          email: payload.email,
          nickname: payload.nickname,
          password: payload.password,
        })
        setUser(data.user)
      } catch (caughtError) {
        setError(getErrorMessage(caughtError))
        throw caughtError
      } finally {
        setLoading(false)
      }
    },
    [apiClient],
  )

  const logout = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      await apiClient.post('/auth/logout')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [apiClient])

  return {
    error,
    initializing,
    loading,
    login,
    logout,
    signUp,
    user,
  }
}
