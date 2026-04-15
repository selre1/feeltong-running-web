import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { LatLngTuple } from './leafletHelpers'

interface RecenterMapProps {
  center: LatLngTuple
}

export default function RecenterMap({ center }: RecenterMapProps) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: false })
  }, [center, map])

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
