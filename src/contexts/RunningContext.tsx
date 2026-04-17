import { createContext, type ReactNode, useContext } from 'react'
import { useRunningController } from '../hooks/Running'
import type { RunningController } from '../hooks/Running'
import { useAuth } from './AuthContext'

const RunningContext = createContext<RunningController | null>(null)

export function RunningProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const running = useRunningController(isAuthenticated)
  return <RunningContext.Provider value={running}>{children}</RunningContext.Provider>
}

export function useRunning() {
  const ctx = useContext(RunningContext)
  if (!ctx) throw new Error('useRunning must be used within RunningProvider')
  return ctx
}
