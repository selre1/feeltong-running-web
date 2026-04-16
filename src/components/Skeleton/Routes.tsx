import { Route, Routes } from 'react-router-dom'
import type { RunningView } from '../../hooks/Running'
import HomePage from '../../pages/Home'
import MeetingPage from '../../pages/Meeting'
import MyPage from '../../pages/My'
import RecordPage from '../../pages/Record'
import RunningPage from '../../pages/Running'
import type { RunDraft, RunRecord } from '../../types/run'

interface AppRoutesProps {
  averagePaceSeconds: number | null
  canStartRun: boolean
  distanceMeters: number
  draft: RunDraft
  elapsedMs: number
  isSavingSummary: boolean
  isSummarySaved: boolean
  latestSummary: RunRecord | null
  notice: string
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
          <HomePage
            records={props.records}
            todayRecordCount={props.todayRecordCount}
            onOpenRecords={props.onOpenRecords}
            onOpenRunning={props.onOpenRunning}
          />
        }
        path="/"
      />
      <Route
        element={
          <HomePage
            records={props.records}
            todayRecordCount={props.todayRecordCount}
            onOpenRecords={props.onOpenRecords}
            onOpenRunning={props.onOpenRunning}
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

      <Route element={<RecordPage records={props.records} />} path="/record" />
      <Route element={<MeetingPage />} path="/meeting" />
      <Route
        element={
          <MyPage
            email={props.userEmail}
            nickname={props.userNickname}
            onLogout={props.onLogout}
            recordCount={props.records.length}
          />
        }
        path="/my"
      />

      <Route
        element={
          <HomePage
            records={props.records}
            todayRecordCount={props.todayRecordCount}
            onOpenRecords={props.onOpenRecords}
            onOpenRunning={props.onOpenRunning}
          />
        }
        path="*"
      />
    </Routes>
  )
}
