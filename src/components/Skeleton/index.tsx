import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthSession, type SessionUser } from '../../hooks/useAuthSession'
import { useRunRecords } from '../../hooks/useRunRecords'
import { useRunTracking } from '../../hooks/useRunTracking'
import AuthPage from '../../pages/Auth'
import type { RunRecord } from '../../types/run'
import Header from '../Header'
import Navigation from './Navigation'
import AppRoutes from './Routes'
import './index.css'

type RunningView = 'ready' | 'active' | 'summary'

const Container = ({ children }: { children: ReactNode }) => (
  <div className="SkeletonContainer">{children}</div>
)

function SkeletonApp({ onLogout, user }: { onLogout: () => void | Promise<void>; user: SessionUser }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tracking = useRunTracking()
  const { records } = useRunRecords(true)
  const [runningView, setRunningView] = useState<RunningView>('ready')
  const [latestSummary, setLatestSummary] = useState<RunRecord | null>(null)

  const todayRecordCount = useMemo(() => {
    const today = new Date()
    return records.filter((record) => {
      const date = new Date(record.startedAt)
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      )
    }).length
  }, [records])

  useEffect(() => {
    if (pathname !== '/running' && tracking.draft.status === 'idle') {
      setRunningView((current) => (current === 'summary' ? current : 'ready'))
    }

    if (pathname === '/running' && tracking.draft.status === 'running') {
      setRunningView('active')
    }
  }, [pathname, tracking.draft.status])

  const handleStartRun = () => {
    tracking.startRun(() => {
      setLatestSummary(null)
      setRunningView('active')
      navigate('/running')
    })
  }

  const handleResumeRun = () => {
    tracking.resumeRun(() => {
      setRunningView('active')
      navigate('/running')
    })
  }

  const handleFinishRun = () => {
    tracking.finishRun((record) => {
      setLatestSummary(record)
      setRunningView('summary')
      navigate('/running')
    })
  }

  return (
    <Container>
      <Header variant="bar" />
      <AppRoutes
        averagePaceSeconds={tracking.averagePaceSeconds}
        distanceMeters={tracking.distanceMeters}
        draft={tracking.draft}
        elapsedMs={tracking.elapsedMs}
        latestSummary={latestSummary}
        notice={tracking.notice}
        onBackHome={() => navigate('/home')}
        onFinishRun={handleFinishRun}
        onLogout={onLogout}
        onOpenRecords={() => navigate('/record')}
        onOpenRunning={() => navigate('/running')}
        onPauseRun={tracking.pauseRun}
        onResumeRun={handleResumeRun}
        onStartRun={handleStartRun}
        onViewChange={setRunningView}
        records={records}
        runningView={runningView}
        todayRecordCount={todayRecordCount}
        userEmail={user.email}
        userNickname={user.nickname}
      />
      <Navigation />
      <div className="SkeletonNavSpacer" />
    </Container>
  )
}

export default function Skeleton() {
  const auth = useAuthSession()

  if (auth.initializing) {
    return null
  }

  if (!auth.user) {
    return (
      <AuthPage
        error={auth.error}
        loading={auth.loading}
        onLogin={auth.login}
        onSignUp={auth.signUp}
      />
    )
  }

  return <SkeletonApp onLogout={auth.logout} user={auth.user} />
}
