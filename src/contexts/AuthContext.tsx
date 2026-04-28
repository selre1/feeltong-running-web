import { createContext, type ReactNode, useContext } from 'react'
import { useAuthSession } from '../hooks/useAuthSession'
import type { SessionUser } from '../hooks/useAuthSession'

interface AuthContextValue {
  deleteAccount: () => Promise<void>
  error: string
  initializing: boolean
  isAuthenticated: boolean
  loading: boolean
  login: (payload: { email: string; password: string }) => Promise<void>
  logout: () => void | Promise<void>
  signUp: (payload: { email: string; nickname: string; password: string }) => Promise<void>
  user: SessionUser | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthSession()
  return (
    <AuthContext.Provider
      value={{
        deleteAccount: auth.deleteAccount,
        error: auth.error,
        initializing: auth.initializing,
        isAuthenticated: Boolean(auth.user),
        loading: auth.loading,
        login: auth.login,
        logout: auth.logout,
        signUp: auth.signUp,
        user: auth.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
