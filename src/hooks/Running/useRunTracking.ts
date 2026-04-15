import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import type { RunDraft, RunRecord } from '../../types/run'
import { getAveragePaceSeconds, getRouteDistanceMeters, toGeoPoint } from '../../utils/geo'

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

export default function useRunTracking() {
  const [draft, setDraft] = useState<RunDraft>(() => parseStoredJson(DRAFT_STORAGE_KEY, createEmptyDraft()))
  const [records, setRecords] = useState<RunRecord[]>(() => parseStoredJson(RECORDS_STORAGE_KEY, []))
  const [now, setNow] = useState(() => Date.now())
  const [notice, setNotice] = useState('GPS 권한을 허용하면 현재 위치를 표시합니다.')
  const watchIdRef = useRef<number | null>(null)

  const elapsedMs = getElapsedMs(draft, now)
  const distanceMeters = useMemo(() => getRouteDistanceMeters(draft.route), [draft.route])
  const averagePaceSeconds = useMemo(
    () => getAveragePaceSeconds(distanceMeters, elapsedMs),
    [distanceMeters, elapsedMs],
  )

  useEffect(() => {
    window.localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records))
  }, [records])

  useEffect(() => {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (draft.status === 'idle' && draft.currentPosition) {
      setNotice('GPS 허용됨: 현재 위치를 확인했습니다.')
    }
  }, [draft.status, draft.currentPosition])

  useEffect(() => {
    if (draft.status !== 'running') {
      return
    }
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [draft.status])

  const handlePosition = useEffectEvent((position: GeolocationPosition) => {
    const point = toGeoPoint(position)

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
      setNotice(`GPS 수신 중입니다. 최신 위치 ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`)
      return
    }

    setNotice('GPS 허용됨: 현재 위치를 확인했습니다.')
  })

  const handleGeolocationError = useEffectEvent((error: GeolocationPositionError) => {
    const fallback =
      error.code === error.PERMISSION_DENIED
        ? 'GPS 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.'
        : 'GPS 수신이 불안정합니다. 실외 또는 실제 기기에서 다시 확인해 주세요.'
    setNotice(fallback)
  })

  useEffect(() => {
    if (draft.status === 'idle' && !draft.currentPosition) {
      if (!('geolocation' in navigator)) {
        setNotice('이 브라우저는 Geolocation API를 지원하지 않습니다.')
        return
      }

      navigator.geolocation.getCurrentPosition(handlePosition, handleGeolocationError, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 12_000,
      })
      return
    }

    if (draft.status !== 'running') {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      return
    }

    if (!('geolocation' in navigator)) {
      setNotice('이 브라우저는 Geolocation API를 지원하지 않습니다.')
      return
    }

    navigator.geolocation.getCurrentPosition(handlePosition, handleGeolocationError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15_000,
    })

    watchIdRef.current = navigator.geolocation.watchPosition(handlePosition, handleGeolocationError, {
      enableHighAccuracy: true,
      maximumAge: 2_000,
      timeout: 20_000,
    })

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
  }, [draft.status, draft.currentPosition, handleGeolocationError, handlePosition])

  const startRun = (onAfterStart?: () => void) => {
    const startedAt = Date.now()
    setNow(startedAt)
    setNotice('러닝을 시작했습니다. GPS 신호를 수신 중입니다.')
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
    setNotice('러닝을 일시 정지했습니다.')
    setDraft((previous) => ({
      ...previous,
      status: 'paused',
      pausedStartedAt,
    }))
  }

  const resumeRun = (onAfterResume?: () => void) => {
    const resumedAt = Date.now()
    setNow(resumedAt)
    setNotice('러닝을 다시 시작했습니다.')
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
    setNotice('러닝이 종료되었습니다. 저장 버튼으로 기록을 보관하세요.')
    onAfterFinish?.(record)
  }

  return {
    averagePaceSeconds,
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

