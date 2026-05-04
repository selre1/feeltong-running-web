import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import type { RunDraft, RunRecord } from '../../types/run'
import { getAveragePaceSeconds, getDistanceMeters, getRouteDistanceMeters, toGeoPoint } from '../../utils/geo'
import useGeolocation from './useGeolocation'
import useGpsPermission from './useGpsPermission'

const isFlutterWebView = () => typeof window !== 'undefined' && !!window.flutter_inappwebview

const DRAFT_STORAGE_KEY = 'feeltong-running-draft'
const ROUTE_SAMPLE_INTERVAL_MS = 5_000
const POSITION_STATE_INTERVAL_MS = 3_000
const MAX_ACCURACY_METERS = 30        // 경로 포인트 추가 시 오차 반경 상한
const MAX_MARKER_ACCURACY_METERS = 100 // 현재 위치 마커 표시 시 오차 반경 상한 (웹 브라우저는 GPS 정확도가 낮음)
const MAX_SPEED_MS = 8           // 8m/s ≈ 29km/h 초과 시 GPS 튐으로 판단
const MIN_DISTANCE_METERS = 8    // 8m 미만 이동은 GPS 드리프트로 간주, 경로에 추가 안 함

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
  if (!previous) return true

  if (point.timestamp - previous.timestamp < ROUTE_SAMPLE_INTERVAL_MS) return false

  // 정확도 필터: 오차 반경이 너무 크면 제거
  if (point.accuracy != null && point.accuracy > MAX_ACCURACY_METERS) return false

  const distM = getDistanceMeters(previous, point)

  // 최소 이동 거리 필터: GPS 드리프트(정지 중 좌표 흔들림) 제거
  if (distM < MIN_DISTANCE_METERS) return false

  // 속도 스파이크 필터: 비현실적인 이동 속도면 GPS 튐으로 판단
  const elapsedSec = (point.timestamp - previous.timestamp) / 1000
  if (elapsedSec > 0 && distM / elapsedSec > MAX_SPEED_MS) return false

  return true
}

export default function useRunningTracking() {
  const [draft, setDraft] = useState<RunDraft>(() => parseStoredJson(DRAFT_STORAGE_KEY, createEmptyDraft()))
  const [records, setRecords] = useState<RunRecord[]>([])
  const [now, setNow] = useState(() => Date.now())
  const isFlutter = isFlutterWebView()
  const [notice, setNotice] = useState(isFlutter ? 'GPS 연결 중...' : 'GPS 권한 상태를 확인하는 중입니다.')
  const { permissionState, setPermissionState } = useGpsPermission()
  const lastPositionUpdateRef = useRef(0)

  const elapsedMs = getElapsedMs(draft, now)

  const routeDistanceMeters = useMemo(() => getRouteDistanceMeters(draft.route), [draft.route])

  const distanceMeters = useMemo(() => {
    if (draft.status !== 'running' || !draft.currentPosition) {
      return routeDistanceMeters
    }
    const lastPoint = draft.route.at(-1)
    if (!lastPoint) return routeDistanceMeters
    const delta = getDistanceMeters(lastPoint, draft.currentPosition)
    // 드리프트 노이즈 제거: 경로 포인트 기준과 동일한 최소 거리 적용
    return routeDistanceMeters + (delta >= MIN_DISTANCE_METERS ? delta : 0)
  }, [routeDistanceMeters, draft.status, draft.currentPosition, draft.route])

  const averagePaceSeconds = useMemo(
    () => getAveragePaceSeconds(distanceMeters, elapsedMs),
    [distanceMeters, elapsedMs],
  )
  const canStartRun = permissionState !== 'denied' && permissionState !== 'unsupported'

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
    const now = Date.now()
    const isThrottled = now - lastPositionUpdateRef.current < POSITION_STATE_INTERVAL_MS

    setPermissionState('granted')

    // 정확도가 너무 낮으면 마커 업데이트 자체를 건너뜀 (경로 필터는 shouldAppendPoint에서 별도 적용)
    if (point.accuracy != null && point.accuracy > MAX_MARKER_ACCURACY_METERS) return

    setDraft((previous) => {
      const route =
        previous.status === 'running' && shouldAppendPoint(previous.route, point)
          ? [...previous.route, point]
          : previous.route

      if (isThrottled && route === previous.route) {
        return previous
      }

      return { ...previous, currentPosition: point, route }
    })

    if (isThrottled) return

    lastPositionUpdateRef.current = now

    if (draft.status === 'running') {
      setNotice('GPS 수신 중')
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

  // 백그라운드 복귀 시 Flutter에서 누락 구간 좌표를 일괄 전송
  const handlePositionBatch = useEffectEvent((positions: GeolocationPosition[]) => {
    if (draft.status !== 'running') return

    setPermissionState('granted')

    setDraft((previous) => {
      if (previous.status !== 'running') return previous

      let route = previous.route
      let currentPosition = previous.currentPosition

      for (const position of positions) {
        const point = toGeoPoint(position)
        if (point.accuracy != null && point.accuracy > MAX_ACCURACY_METERS) continue
        if (shouldAppendPoint(route, point)) {
          route = [...route, point]
        }
        currentPosition = point
      }

      if (route === previous.route && currentPosition === previous.currentPosition) {
        return previous
      }

      return { ...previous, route, currentPosition }
    })

    setNotice('GPS 수신 중')
  })

  const { requestCurrentPosition, startWatch, stopWatch } = useGeolocation({
    onError: handleGeolocationError,
    onPosition: handlePosition,
    onPositionBatch: handlePositionBatch,
  })

  useEffect(() => {
    if (permissionState === 'granted' && draft.status === 'idle' && draft.currentPosition === null) {
      requestCurrentPosition()
    }
  }, [draft.status, permissionState, requestCurrentPosition, draft.currentPosition])

  useEffect(() => {
    // 위치를 이미 받았으면 permission API 상태와 무관하게 GPS 정상 작동 중
    if (draft.currentPosition !== null && draft.status === 'idle') {
      setNotice('GPS 허용됨: 러닝을 시작할 수 있습니다.')
      return
    }

    if (permissionState === 'granted' && draft.status === 'idle') {
      setNotice('GPS 허용됨: 러닝을 시작할 수 있습니다.')
      return
    }

    if (permissionState === 'denied') {
      setNotice('GPS 권한이 차단되었습니다. 브라우저 설정에서 위치 권한을 허용해 주세요.')
      return
    }

    if (permissionState === 'prompt') {
      setNotice('GPS 권한이 필요합니다. 러닝 시작 버튼을 누르면 권한을 요청합니다.')
      return
    }

    if (permissionState === 'unsupported') {
      setNotice('이 브라우저는 위치 기능을 지원하지 않습니다.')
      return
    }

    // Flutter: 네이티브가 GPS를 관리하므로 permissionState는 항상 'unknown'에서 시작
    if (isFlutter) {
      setNotice('GPS 연결 중...')
      return
    }

    // 'unknown' — permissions API 미지원(iOS Safari) 또는 아직 확인 중
    setNotice('GPS 권한 상태를 확인하는 중입니다.')
  }, [draft.status, draft.currentPosition, permissionState])

  // idle 상태: GPS 권한 확인 및 현재 위치 1회 요청
  // permissionState를 별도 effect로 분리해 running 중 재시작 방지
  useEffect(() => {
    if (draft.status !== 'idle') return
    if (permissionState === 'denied') return

    if (!requestCurrentPosition()) {
      setPermissionState('unsupported')
      setNotice('이 브라우저는 위치 기능을 지원하지 않습니다.')
    }
  }, [draft.status, permissionState, requestCurrentPosition, setPermissionState])

  // running 상태: GPS 연속 추적 시작/중단
  // permissionState 미포함 — 권한 변경 시 watch 재시작 방지
  useEffect(() => {
    if (draft.status !== 'running') return

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
