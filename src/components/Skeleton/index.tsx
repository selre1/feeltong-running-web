import { type ReactNode } from 'react'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { RunningProvider, useRunning } from '../../contexts/RunningContext'
import Header from '../Header'
import Navigation from './Navigation'
import AppRoutes from './Routes'
import './index.css'

const Container = ({ children }: { children: ReactNode }) => <div className="SkeletonContainer">{children}</div>

function SkeletonApp() {
  const { isRunningActive } = useRunning()
  return (
    <Container>
      <Header variant="bar" />
      <AppRoutes />
      {!isRunningActive ? <Navigation /> : null}
      {!isRunningActive ? <div className="SkeletonNavSpacer" /> : null}
    </Container>
  )
}

function SkeletonInner() {
  const { initializing } = useAuth()
  if (initializing) return null
  return (
    <RunningProvider>
      <SkeletonApp />
    </RunningProvider>
  )
}

export default function Skeleton() {
  return (
    <AuthProvider>
      <SkeletonInner />
    </AuthProvider>
  )
}
