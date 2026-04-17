import { useCallback, useState } from 'react'
import useApiClient from '../useApi'
import type { RunRecord } from '../../types/run'
import { simplifyRoute } from '../../utils/geo'

interface UseRunningSummaryOptions {
  onSaved?: () => Promise<void> | void
}

export default function useRunningSummary({ onSaved }: UseRunningSummaryOptions = {}) {
  const apiClient = useApiClient()
  const [latestSummary, setLatestSummary] = useState<RunRecord | null>(null)
  const [isSavingSummary, setIsSavingSummary] = useState(false)
  const [isSummarySaved, setIsSummarySaved] = useState(false)
  const [saveSummaryError, setSaveSummaryError] = useState('')

  const resetSummaryState = useCallback(() => {
    setSaveSummaryError('')
    setIsSummarySaved(false)
  }, [])

  const openSummary = useCallback((record: RunRecord) => {
    setLatestSummary(record)
    setIsSavingSummary(false)
    setIsSummarySaved(false)
    setSaveSummaryError('')
  }, [])

  const clearSummary = useCallback(() => {
    setLatestSummary(null)
    setIsSavingSummary(false)
    setIsSummarySaved(false)
    setSaveSummaryError('')
  }, [])

  const saveSummary = useCallback(async () => {
    if (!latestSummary || isSavingSummary || isSummarySaved) {
      return false
    }

    setIsSavingSummary(true)
    setSaveSummaryError('')

    try {
      await apiClient.post('/runs/save', {
        distanceMeters: latestSummary.distanceMeters,
        durationSeconds: Math.round(latestSummary.durationMs / 1000),
        paceSecondsPerKm: latestSummary.averagePaceSeconds ?? 0,
        startedAt: new Date(latestSummary.startedAt).toISOString(),
        endedAt: new Date(latestSummary.endedAt).toISOString(),
        route: simplifyRoute(latestSummary.route).map((point) => ({
          lat: point.lat,
          lng: point.lng,
          timestamp: point.timestamp,
        })),
      })

      setIsSummarySaved(true)
      if (onSaved) {
        await onSaved()
      }

      return true
    } catch {
      setSaveSummaryError('Save failed. Please retry.')
      return false
    } finally {
      setIsSavingSummary(false)
    }
  }, [apiClient, isSavingSummary, isSummarySaved, latestSummary, onSaved])

  return {
    clearSummary,
    isSavingSummary,
    isSummarySaved,
    latestSummary,
    openSummary,
    resetSummaryState,
    saveSummary,
    saveSummaryError,
  }
}
