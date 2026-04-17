import { useCallback, useEffect, useRef } from 'react'

interface UseGeolocationOptions {
  onError: (error: GeolocationPositionError) => void
  onPosition: (position: GeolocationPosition) => void
}

export default function useGeolocation({ onError, onPosition }: UseGeolocationOptions) {
  const watchIdRef = useRef<number | null>(null)

  const isSupported = useCallback(() => 'geolocation' in navigator, [])

  const requestCurrentPosition = useCallback(() => {
    if (!isSupported()) {
      return false
    }

    navigator.geolocation.getCurrentPosition(onPosition, onError, {
      enableHighAccuracy: false,
      maximumAge: 30_000,
      timeout: 12_000,
    })

    return true
  }, [isSupported, onError, onPosition])

  const startWatch = useCallback(() => {
    if (!isSupported()) {
      return false
    }

    watchIdRef.current = navigator.geolocation.watchPosition(onPosition, onError, {
      enableHighAccuracy: true,
      maximumAge: 5_000,
      timeout: 20_000,
    })

    return true
  }, [isSupported, onError, onPosition])

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  useEffect(() => stopWatch, [stopWatch])

  return {
    isSupported,
    requestCurrentPosition,
    startWatch,
    stopWatch,
  }
}

