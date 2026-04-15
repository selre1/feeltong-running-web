import { type ReactNode } from 'react'
import { useAuthSession, type SessionUser } from '../../hooks/useAuthSession'
import { useRunningController } from '../../hooks/Running'
import AuthPage from '../../pages/Auth'
import Header from '../Header'
import Navigation from './Navigation'
import AppRoutes from './Routes'
import './index.css'

const Container = ({ children }: { children: ReactNode }) => (
  <div className="SkeletonContainer">{children}</div>
)

function SkeletonApp({ onLogout, user }: { onLogout: () => void | Promise<void>; user: SessionUser }) {
  const running = useRunningController()

  return (
    <Container>
      <Header variant="bar" />
      <AppRoutes
        averagePaceSeconds={running.averagePaceSeconds}
        distanceMeters={running.distanceMeters}
        draft={running.draft}
        elapsedMs={running.elapsedMs}
        isSavingSummary={running.isSavingSummary}
        isSummarySaved={running.isSummarySaved}
        latestSummary={running.latestSummary}
        notice={running.notice}
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
        userEmail={user.email}
        userNickname={user.nickname}
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
