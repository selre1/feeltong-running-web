import { useCallback, useEffect, useRef } from 'react'

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (name: string, ...args: unknown[]) => Promise<unknown>
    }
  }
}

interface FlutterPositionDetail {
  lat: number
  lng: number
  accuracy: number
  timestamp: number
}

interface FlutterPositionErrorDetail {
  code: number
  message: string
}

interface UseGeolocationOptions {
  onError: (error: GeolocationPositionError) => void
  onPosition: (position: GeolocationPosition) => void
  onPositionBatch?: (positions: GeolocationPosition[]) => void
}

const isFlutterWebView = () => typeof window !== 'undefined' && !!window.flutter_inappwebview

const makeGeolocationPosition = (detail: FlutterPositionDetail): GeolocationPosition => ({
  coords: {
    latitude: detail.lat,
    longitude: detail.lng,
    accuracy: detail.accuracy,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
    toJSON() { return this },
  } as GeolocationCoordinates,
  timestamp: detail.timestamp,
  toJSON() { return this },
})

const makeGeolocationPositionError = (detail: FlutterPositionErrorDetail): GeolocationPositionError => ({
  code: detail.code,
  message: detail.message,
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
})

export default function useGeolocation({ onError, onPosition, onPositionBatch }: UseGeolocationOptions) {
  const watchIdRef = useRef<number | null>(null)
  const isWatchingRef = useRef(false)
  const isFlutter = isFlutterWebView()

  const isSupported = useCallback(() => {
    if (isFlutter) return true
    return 'geolocation' in navigator
  }, [isFlutter])

  const requestCurrentPosition = useCallback(() => {
    if (isFlutter) {
      window.flutter_inappwebview!.callHandler('gps_request_current')
      return true
    }

    if (!('geolocation' in navigator)) return false

    navigator.geolocation.getCurrentPosition(onPosition, onError, {
      enableHighAccuracy: false,
      maximumAge: 30_000,
      timeout: 12_000,
    })

    return true
  }, [isFlutter, onError, onPosition])

  const startWatch = useCallback(() => {
    if (isFlutter) {
      if (isWatchingRef.current) return true  // 이미 시작됨 — 중복 gps_start 방지
      isWatchingRef.current = true
      window.flutter_inappwebview!.callHandler('gps_start')
      return true
    }

    if (!('geolocation' in navigator)) return false

    watchIdRef.current = navigator.geolocation.watchPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 5_000,
      timeout: 20_000,
    })

    return true
  }, [isFlutter, onError, onPosition])

  const stopWatch = useCallback(() => {
    if (isFlutter) {
      if (!isWatchingRef.current) return  // 이미 중단됨 — 중복 gps_stop 방지
      isWatchingRef.current = false
      window.flutter_inappwebview!.callHandler('gps_stop')
      return
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [isFlutter])

  // Flutter 환경: CustomEvent로 위치 수신
  useEffect(() => {
    if (!isFlutter) return

    const handlePosition = (e: Event) => {
      const detail = (e as CustomEvent<FlutterPositionDetail>).detail
      onPosition(makeGeolocationPosition(detail))
    }

    const handleError = (e: Event) => {
      const detail = (e as CustomEvent<FlutterPositionErrorDetail>).detail
      onError(makeGeolocationPositionError(detail))
    }

    const handlePositionBatch = (e: Event) => {
      if (!onPositionBatch) return
      const { positions } = (e as CustomEvent<{ positions: FlutterPositionDetail[] }>).detail
      onPositionBatch(positions.map(makeGeolocationPosition))
    }

    window.addEventListener('flutter_position', handlePosition)
    window.addEventListener('flutter_position_error', handleError)
    window.addEventListener('flutter_position_batch', handlePositionBatch)

    return () => {
      window.removeEventListener('flutter_position', handlePosition)
      window.removeEventListener('flutter_position_error', handleError)
      window.removeEventListener('flutter_position_batch', handlePositionBatch)
    }
  }, [isFlutter, onPosition, onError, onPositionBatch])

  useEffect(() => stopWatch, [stopWatch])

  return {
    isSupported,
    requestCurrentPosition,
    startWatch,
    stopWatch,
  }
}

