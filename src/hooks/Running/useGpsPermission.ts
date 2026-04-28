import { useEffect, useRef, useState } from 'react'

export type GeolocationPermissionState = 'granted' | 'prompt' | 'denied' | 'unsupported' | 'unknown'

const isFlutterWebView = () => typeof window !== 'undefined' && !!window.flutter_inappwebview

export default function useGpsPermission() {
  const [permissionState, setPermissionState] = useState<GeolocationPermissionState>('unknown')
  const permissionStatusRef = useRef<PermissionStatus | null>(null)

  useEffect(() => {
    // Flutter WebView: GPS는 네이티브 앱이 관리하므로 Web Permissions API를 사용하지 않음
    // 실제 권한 상태는 position 수신 시 handlePosition에서 'granted'로 업데이트됨
    if (isFlutterWebView()) return

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

