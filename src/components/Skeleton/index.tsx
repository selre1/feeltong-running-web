import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthSession, type SessionUser } from '../../hooks/useAuthSession'
import { useRunningController } from '../../hooks/Running'
import Header from '../Header'
import Navigation from './Navigation'
import AppRoutes from './Routes'
import './index.css'

const Container = ({ children }: { children: ReactNode }) => <div className="SkeletonContainer">{children}</div>

function SkeletonApp({
  authError,
  authLoading,
  isAuthenticated,
  onLogin,
  onLogout,
  onSignUp,
  user,
}: {
  authError: string
  authLoading: boolean
  isAuthenticated: boolean
  onLogin: (payload: { email: string; password: string }) => Promise<void>
  onLogout: () => void | Promise<void>
  onSignUp: (payload: { email: string; nickname: string; password: string }) => Promise<void>
  user: SessionUser | null
}) {
  const navigate = useNavigate()
  const running = useRunningController(isAuthenticated)

  return (
    <Container>
      <Header variant="bar" />
      <AppRoutes
        authError={authError}
        authLoading={authLoading}
        isAuthenticated={isAuthenticated}
        averagePaceSeconds={running.averagePaceSeconds}
        canStartRun={running.canStartRun}
        distanceMeters={running.distanceMeters}
        draft={running.draft}
        elapsedMs={running.elapsedMs}
        isSavingSummary={running.isSavingSummary}
        isSummarySaved={running.isSummarySaved}
        latestSummary={running.latestSummary}
        notice={running.notice}
        onAuthLogin={onLogin}
        onAuthSignUp={onSignUp}
        onOpenAuth={() => navigate('/auth')}
        onFinishRun={running.finishRun}
        onLogout={onLogout}
        onOpenRecords={running.openRecords}
        onOpenRunning={running.openRunning}
        onPauseRun={running.pauseRun}
        onResumeRun={running.resumeRun}
        onSaveSummary={running.saveSummary}
        onStartRun={running.startRun}
        records={running.records}
        runningView={running.runningView}
        saveSummaryError={running.saveSummaryError}
        todayRecordCount={running.todayRecordCount}
        userEmail={user?.email ?? ''}
        userNickname={user?.nickname ?? ''}
      />
      {!running.isRunningActive ? <Navigation /> : null}
      {!running.isRunningActive ? <div className="SkeletonNavSpacer" /> : null}
    </Container>
  )
}

export default function Skeleton() {
  const auth = useAuthSession()

  if (auth.initializing) {
    return null
  }

  return (
    <SkeletonApp
      authError={auth.error}
      authLoading={auth.loading}
      isAuthenticated={Boolean(auth.user)}
      onLogin={auth.login}
      onLogout={auth.logout}
      onSignUp={auth.signUp}
      user={auth.user}
    />
  )
}
