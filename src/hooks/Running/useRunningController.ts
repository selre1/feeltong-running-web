import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { RunningController } from './types'
import useRunningRecords from './useRunningRecords'
import useRunningTracking from './useRunningTracking'
import useRunningSummary from './useRunningSummary'
import useRunningView from './useRunningView'

export default function useRunningController(): RunningController {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const tracking = useRunningTracking()
  const { records, refetch } = useRunningRecords(true)
  const { runningView, setRunningView } = useRunningView({
    pathname,
    trackingStatus: tracking.draft.status,
  })
  const summary = useRunningSummary({ onSaved: refetch })

  const isRunningActive = pathname === '/running' && runningView === 'active'

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

  const startRun = () => {
    summary.resetSummaryState()
    tracking.startRun(() => {
      summary.clearSummary()
      setRunningView('active')
      navigate('/running')
    })
  }

  const resumeRun = () => {
    tracking.resumeRun(() => {
      setRunningView('active')
      navigate('/running')
    })
  }

  const finishRun = () => {
    tracking.finishRun((record) => {
      summary.openSummary(record)
      setRunningView('summary')
      navigate('/running')
    })
  }

  const saveSummary = async () => {
    const saved = await summary.saveSummary()
    if (!saved) {
      return
    }

    summary.clearSummary()
    setRunningView('ready')
    navigate('/running')
  }

  return {
    averagePaceSeconds: tracking.averagePaceSeconds,
    canStartRun: tracking.canStartRun,
    distanceMeters: tracking.distanceMeters,
    draft: tracking.draft,
    elapsedMs: tracking.elapsedMs,
    finishRun,
    isRunningActive,
    isSavingSummary: summary.isSavingSummary,
    isSummarySaved: summary.isSummarySaved,
    latestSummary: summary.latestSummary,
    notice: tracking.notice,
    openRecords: () => navigate('/record'),
    openRunning: () => navigate('/running'),
    pauseRun: tracking.pauseRun,
    records,
    resumeRun,
    runningView,
    saveSummary,
    saveSummaryError: summary.saveSummaryError,
    startRun,
    todayRecordCount,
  }
}
