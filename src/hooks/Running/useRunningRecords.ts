import { useCallback, useEffect, useState } from 'react'
import type { GeoPoint, RunRecord } from '../../types/run'
import useApiClient from '../useApi'

interface ApiRunRecord {
  _id?: string
  distanceMeters: number
  durationSeconds: number
  paceSecondsPerKm: number
  endedAt: string
  route: Array<GeoPoint>
  startedAt: string
  userId: string
}

const toRunRecord = (record: ApiRunRecord): RunRecord => ({
  id: record._id ?? `${record.userId}-${record.startedAt}`,
  startedAt: new Date(record.startedAt).getTime(),
  endedAt: new Date(record.endedAt).getTime(),
  durationMs: record.durationSeconds * 1000,
  distanceMeters: record.distanceMeters,
  averagePaceSeconds: record.paceSecondsPerKm,
  route: record.route,
})

export default function useRunningRecords(enabled: boolean) {
  const apiClient = useApiClient()
  const [records, setRecords] = useState<RunRecord[]>([])

  const refetch = useCallback(async () => {
    if (!enabled) {
      setRecords([])
      return
    }

    try {
      const { data } = await apiClient.get<ApiRunRecord[]>('/runs')
      setRecords(data.map(toRunRecord))
    } catch {
      setRecords([])
    }
  }, [apiClient, enabled])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    records,
    refetch,
  }
}

