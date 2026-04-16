import type { RunRecord } from '../types/run'
import type { PeriodKey } from '../components/PeriodTabs'

export interface RunSummary {
  count: number
  distanceMeters: number
  durationMs: number
}

const getPeriodStart = (period: PeriodKey) => {
  const current = new Date()
  current.setHours(0, 0, 0, 0)

  if (period === 'week') {
    // Monday-based week start (ko-KR UX expectation)
    const day = current.getDay()
    const mondayOffset = day === 0 ? 6 : day - 1
    current.setDate(current.getDate() - mondayOffset)
    return current.getTime()
  }

  if (period === 'month') {
    current.setDate(1)
    return current.getTime()
  }

  return 0
}

export const getRecordsByPeriod = (records: RunRecord[], period: PeriodKey) => {
  const threshold = getPeriodStart(period)
  return records.filter((record) => record.startedAt >= threshold)
}

export const summarizeRecords = (records: RunRecord[]): RunSummary =>
  records.reduce(
    (accumulator, record) => ({
      count: accumulator.count + 1,
      distanceMeters: accumulator.distanceMeters + record.distanceMeters,
      durationMs: accumulator.durationMs + record.durationMs,
    }),
    { count: 0, distanceMeters: 0, durationMs: 0 },
  )

