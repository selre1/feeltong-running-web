import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '../../contexts/AuthContext'
import { RunningProvider, useRunning } from '../../contexts/RunningContext'
import Header from '../Header'
import Navigation from './Navigation'
import AppRoutes from './Routes'
import './index.css'

const Container = ({ children }: { children: ReactNode }) => <div className="SkeletonContainer">{children}</div>

function SkeletonApp() {
  const { isRunningActive } = useRunning()
  const { pathname } = useLocation()
  // 채팅 페이지(/meeting/:roomId)에서는 Navigation 숨김 — 러닝과 동일한 패턴
  const isChatPage = /^\/meeting\/.+/.test(pathname)
  const showNav = !isRunningActive && !isChatPage

  return (
    <Container>
      <Header variant="bar" />
      <AppRoutes />
      {showNav ? <Navigation /> : null}
      {showNav ? <div className="SkeletonNavSpacer" /> : null}
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
