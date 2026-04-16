import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import type { RunDraft, RunRecord } from '../../types/run'
import { getAveragePaceSeconds, getRouteDistanceMeters, toGeoPoint } from '../../utils/geo'
import useGeolocation from './useGeolocation'
import useGpsPermission from './useGpsPermission'

const RECORDS_STORAGE_KEY = 'feeltong-running-records'
const DRAFT_STORAGE_KEY = 'feeltong-running-draft'
const ROUTE_SAMPLE_INTERVAL_MS = 30_000

const createEmptyDraft = (): RunDraft => ({
  status: 'idle',
  startedAt: null,
  pausedStartedAt: null,
  accumulatedPausedMs: 0,
  route: [],
  currentPosition: null,
})

const parseStoredJson = <T,>(key: string, fallback: T): T => {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

const getElapsedMs = (draft: RunDraft, now: number) => {
  if (!draft.startedAt) {
    return 0
  }

  if (draft.status === 'paused' && draft.pausedStartedAt) {
    return Math.max(0, draft.pausedStartedAt - draft.startedAt - draft.accumulatedPausedMs)
  }

  if (draft.status === 'running') {
    return Math.max(0, now - draft.startedAt - draft.accumulatedPausedMs)
  }

  return 0
}

const shouldAppendPoint = (route: RunDraft['route'], point: RunDraft['route'][number]) => {
  const previous = route.at(-1)
  if (!previous) {
    return true
  }
  return point.timestamp - previous.timestamp >= ROUTE_SAMPLE_INTERVAL_MS
}

export default function useRunningTracking() {
  const [draft, setDraft] = useState<RunDraft>(() => parseStoredJson(DRAFT_STORAGE_KEY, createEmptyDraft()))
  const [records, setRecords] = useState<RunRecord[]>(() => parseStoredJson(RECORDS_STORAGE_KEY, []))
  const [now, setNow] = useState(() => Date.now())
  const [notice, setNotice] = useState('GPS 권한 상태를 확인하는 중입니다.')
  const { permissionState, setPermissionState } = useGpsPermission()

  const elapsedMs = getElapsedMs(draft, now)
  const distanceMeters = useMemo(() => getRouteDistanceMeters(draft.route), [draft.route])
  const averagePaceSeconds = useMemo(
    () => getAveragePaceSeconds(distanceMeters, elapsedMs),
    [distanceMeters, elapsedMs],
  )
  const canStartRun = permissionState === 'granted'

  useEffect(() => {
    window.localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records))
  }, [records])

  useEffect(() => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (draft.status !== 'running') {
      return
    }
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [draft.status])

  const handlePosition = useEffectEvent((position: GeolocationPosition) => {
    const point = toGeoPoint(position)
    setPermissionState('granted')

    setDraft((previous) => {
      const route =
        previous.status === 'running' && shouldAppendPoint(previous.route, point)
          ? [...previous.route, point]
          : previous.route

      return {
        ...previous,
        currentPosition: point,
        route,
      }
    })

    if (draft.status === 'running') {
      setNotice(`GPS 수신 중: ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`)
      return
    }

    setNotice('GPS 허용됨: 현재 위치를 확인했습니다.')
  })

  const handleGeolocationError = useEffectEvent((error: GeolocationPositionError) => {
    if (error.code === error.PERMISSION_DENIED) {
      setPermissionState('denied')
      setNotice('GPS 권한이 차단되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.')
      return
    }

    setNotice('GPS 수신이 불안정합니다. 네트워크/기기 상태를 확인해 주세요.')
  })

  const { requestCurrentPosition, startWatch, stopWatch } = useGeolocation({
    onError: handleGeolocationError,
    onPosition: handlePosition,
  })

  useEffect(() => {
    if (permissionState === 'granted' && draft.status === 'idle') {
      requestCurrentPosition()
    }
  }, [draft.status, permissionState, requestCurrentPosition])

  useEffect(() => {
    if (permissionState === 'granted' && draft.status === 'idle') {
      setNotice('GPS 허용됨: 러닝을 시작할 수 있습니다.')
      return
    }

    if (permissionState === 'denied') {
      setNotice('GPS 권한이 차단되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.')
      return
    }

    if (permissionState === 'prompt') {
      setNotice('GPS 권한이 필요합니다. 아래 버튼으로 위치 권한을 요청해 주세요.')
      return
    }

    if (permissionState === 'unsupported') {
      setNotice('이 브라우저는 위치 기능을 지원하지 않습니다.')
      return
    }
  }, [draft.status, permissionState])

  useEffect(() => {
    if (draft.status === 'idle') {
      if (!requestCurrentPosition()) {
        setPermissionState('unsupported')
        setNotice('이 브라우저는 위치 기능을 지원하지 않습니다.')
      }
      return
    }

    if (draft.status !== 'running') {
      stopWatch()
      return
    }

    if (!requestCurrentPosition()) {
      setPermissionState('unsupported')
      setNotice('이 브라우저는 위치 기능을 지원하지 않습니다.')
      return
    }

    if (!startWatch()) {
      setPermissionState('unsupported')
      setNotice('이 브라우저는 위치 기능을 지원하지 않습니다.')
      return
    }

    return () => {
      stopWatch()
    }
  }, [draft.status, requestCurrentPosition, setPermissionState, startWatch, stopWatch])

  const startRun = (onAfterStart?: () => void) => {
    if (!canStartRun) {
      setNotice('GPS 권한을 허용해야 러닝을 시작할 수 있습니다.')
      return
    }

    requestCurrentPosition()

    const startedAt = Date.now()
    setNow(startedAt)
    setNotice('러닝 시작: GPS를 추적합니다.')
    setDraft({
      status: 'running',
      startedAt,
      pausedStartedAt: null,
      accumulatedPausedMs: 0,
      route: [],
      currentPosition: draft.currentPosition,
    })
    onAfterStart?.()
  }

  const pauseRun = () => {
    const pausedStartedAt = Date.now()
    setNow(pausedStartedAt)
    setNotice('러닝 일시정지')
    setDraft((previous) => ({
      ...previous,
      status: 'paused',
      pausedStartedAt,
    }))
  }

  const resumeRun = (onAfterResume?: () => void) => {
    if (!canStartRun) {
      setNotice('GPS 권한을 허용해야 러닝을 재시작할 수 있습니다.')
      return
    }

    requestCurrentPosition()

    const resumedAt = Date.now()
    setNow(resumedAt)
    setNotice('러닝 재시작: GPS를 다시 추적합니다.')
    setDraft((previous) => ({
      ...previous,
      status: 'running',
      accumulatedPausedMs: previous.pausedStartedAt
        ? previous.accumulatedPausedMs + (resumedAt - previous.pausedStartedAt)
        : previous.accumulatedPausedMs,
      pausedStartedAt: null,
    }))
    onAfterResume?.()
  }

  const finishRun = (onAfterFinish?: (record: RunRecord) => void) => {
    if (!draft.startedAt) {
      setDraft(createEmptyDraft())
      return
    }

    const endedAt = Date.now()
    const durationMs = getElapsedMs(draft, endedAt)
    const totalDistanceMeters = getRouteDistanceMeters(draft.route)

    const record: RunRecord = {
      id: String(endedAt),
      startedAt: draft.startedAt,
      endedAt,
      durationMs,
      distanceMeters: totalDistanceMeters,
      averagePaceSeconds: getAveragePaceSeconds(totalDistanceMeters, durationMs),
      route: draft.route,
    }

    setRecords((previous) => [record, ...previous].slice(0, 100))
    setDraft(createEmptyDraft())
    setNow(endedAt)
    setNotice('러닝 종료: 결과를 확인해 주세요.')
    onAfterFinish?.(record)
  }

  return {
    averagePaceSeconds,
    canStartRun,
    distanceMeters,
    draft,
    elapsedMs,
    finishRun,
    notice,
    pauseRun,
    records,
    resumeRun,
    startRun,
  }
}
