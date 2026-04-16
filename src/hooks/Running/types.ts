import type { RunDraft, RunRecord } from '../../types/run'

export type RunningView = 'ready' | 'active' | 'summary'

export interface RunningControllerState {
  averagePaceSeconds: number | null
  canStartRun: boolean
  distanceMeters: number
  draft: RunDraft
  elapsedMs: number
  isRunningActive: boolean
  isSavingSummary: boolean
  isSummarySaved: boolean
  latestSummary: RunRecord | null
  notice: string
  records: RunRecord[]
  runningView: RunningView
  saveSummaryError: string
  todayRecordCount: number
}

export interface RunningControllerActions {
  finishRun: () => void
  openRecords: () => void
  openRunning: () => void
  pauseRun: () => void
  resumeRun: () => void
  saveSummary: () => Promise<void>
  startRun: () => void
}

export type RunningController = RunningControllerState & RunningControllerActions
