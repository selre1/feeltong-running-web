import { useEffect, useRef, useState } from 'react'

export type GeolocationPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported' | 'unknown'

export default function useGpsPermission() {
  const [permissionState, setPermissionState] = useState<GeolocationPermissionState>('unknown')
  const permissionStatusRef = useRef<PermissionStatus | null>(null)

  useEffect(() => {
    if (!('permissions' in navigator) || !navigator.permissions?.query) {
      setPermissionState('unknown')
      return
    }

    let active = true

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((status) => {
        if (!active) {
          return
        }

        permissionStatusRef.current = status
        setPermissionState(status.state)

        status.onchange = () => {
          setPermissionState(status.state)
        }
      })
      .catch(() => {
        setPermissionState('unknown')
      })

    return () => {
      active = false
      if (permissionStatusRef.current) {
        permissionStatusRef.current.onchange = null
      }
    }
  }, [])

  return {
    permissionState,
    setPermissionState,
  }
}

