import { Navigate, Route, Routes } from 'react-router-dom'
import type { RunningView } from '../../hooks/Running'
import AuthPage from '../../pages/Auth'
import HomePage from '../../pages/Home'
import MeetingPage from '../../pages/Meeting'
import MyPage from '../../pages/My'
import RecordPage from '../../pages/Record'
import RunningPage from '../../pages/Running'
import type { RunDraft, RunRecord } from '../../types/run'

interface AppRoutesProps {
  authError: string
  authLoading: boolean
  averagePaceSeconds: number | null
  canStartRun: boolean
  distanceMeters: number
  draft: RunDraft
  elapsedMs: number
  isAuthenticated: boolean
  isSavingSummary: boolean
  isSummarySaved: boolean
  latestSummary: RunRecord | null
  notice: string
  onAuthLogin: (payload: { email: string; password: string }) => Promise<void>
  onAuthSignUp: (payload: { email: string; nickname: string; password: string }) => Promise<void>
  onOpenAuth: () => void
  onFinishRun: () => void
  onLogout: () => void | Promise<void>
  onOpenRecords: () => void
  onOpenRunning: () => void
  onPauseRun: () => void
  onResumeRun: () => void
  onSaveSummary: () => void
  onStartRun: () => void
  records: RunRecord[]
  runningView: RunningView
  saveSummaryError: string
  todayRecordCount: number
  userEmail: string
  userNickname: string
}

export default function AppRoutes(props: AppRoutesProps) {
  return (
    <Routes>
      <Route
        element={
          props.isAuthenticated ? (
            <Navigate replace to="/home" />
          ) : (
            <AuthPage
              error={props.authError}
              loading={props.authLoading}
              onLogin={props.onAuthLogin}
              onSignUp={props.onAuthSignUp}
            />
          )
        }
        path="/auth"
      />

      <Route
        element={
          <HomePage
            isAuthenticated={props.isAuthenticated}
            onLogin={props.onOpenAuth}
            onOpenRecords={props.onOpenRecords}
            onOpenRunning={props.onOpenRunning}
            records={props.records}
            todayRecordCount={props.todayRecordCount}
          />
        }
        path="/"
      />

      <Route
        element={
          <HomePage
            isAuthenticated={props.isAuthenticated}
            onLogin={props.onOpenAuth}
            onOpenRecords={props.onOpenRecords}
            onOpenRunning={props.onOpenRunning}
            records={props.records}
            todayRecordCount={props.todayRecordCount}
          />
        }
        path="/home"
      />

      <Route
        element={
          <RunningPage
            averagePaceSeconds={props.averagePaceSeconds}
            canStartRun={props.canStartRun}
            distanceMeters={props.distanceMeters}
            draft={props.draft}
            elapsedMs={props.elapsedMs}
            isSavingSummary={props.isSavingSummary}
            isSummarySaved={props.isSummarySaved}
            latestSummary={props.latestSummary}
            notice={props.notice}
            onFinish={props.onFinishRun}
            onPause={props.onPauseRun}
            onResume={props.onResumeRun}
            onSaveSummary={props.onSaveSummary}
            onStart={props.onStartRun}
            runningView={props.runningView}
            saveSummaryError={props.saveSummaryError}
          />
        }
        path="/running"
      />

      <Route
        element={<RecordPage isAuthenticated={props.isAuthenticated} onLogin={props.onOpenAuth} records={props.records} />}
        path="/record"
      />
      <Route element={<MeetingPage isAuthenticated={props.isAuthenticated} onLogin={props.onOpenAuth} />} path="/meeting" />
      <Route
        element={
          <MyPage
            email={props.userEmail}
            isAuthenticated={props.isAuthenticated}
            nickname={props.userNickname}
            onLogin={props.onOpenAuth}
            onLogout={props.onLogout}
            recordCount={props.records.length}
          />
        }
        path="/my"
      />

      <Route
        element={
          <HomePage
            isAuthenticated={props.isAuthenticated}
            onLogin={props.onOpenAuth}
            onOpenRecords={props.onOpenRecords}
            onOpenRunning={props.onOpenRunning}
            records={props.records}
            todayRecordCount={props.todayRecordCount}
          />
        }
        path="*"
      />
    </Routes>
  )
}
