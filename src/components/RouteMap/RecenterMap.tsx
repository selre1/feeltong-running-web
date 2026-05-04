import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLngTuple } from './leafletHelpers'

interface RecenterMapProps {
  center: LatLngTuple
  follow: boolean
  onUserInteract: () => void
}

export default function RecenterMap({ center, follow, onUserInteract }: RecenterMapProps) {
  const map = useMap()
  const prevCenterRef = useRef<LatLngTuple | null>(null)

  useEffect(() => {
    map.on('dragstart', onUserInteract)
    return () => { map.off('dragstart', onUserInteract) }
  }, [map, onUserInteract])

  useEffect(() => {
    if (!follow) return
    const [lat, lng] = center
    const [prevLat, prevLng] = prevCenterRef.current ?? [null, null]
    if (lat === prevLat && lng === prevLng) return
    prevCenterRef.current = center
    map.setView(center, map.getZoom(), { animate: false })
  }, [center, follow, map])

  useEffect(() => {
    const invalidate = () => map.invalidateSize()
    const timers = [80, 220, 420].map((delay) => window.setTimeout(invalidate, delay))

    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })
    observer.observe(map.getContainer())

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      observer.disconnect()
    }
  }, [map])

  return null
}
