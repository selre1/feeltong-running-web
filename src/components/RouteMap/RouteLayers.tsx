import { memo, useMemo } from 'react'
import { Marker, Polyline, Tooltip } from 'react-leaflet'
import type { GeoPoint } from '../../types/run'
import { buildRainbowSegments, createNumberIcon, toLatLng } from './leafletHelpers'

interface RoutePolylineLayerProps {
  points: GeoPoint[]
}

interface RouteMarkerLayerProps {
  points: GeoPoint[]
}

export const RoutePolylineLayer = memo(function RoutePolylineLayer({ points }: RoutePolylineLayerProps) {
  const rainbowSegments = useMemo(() => buildRainbowSegments(points), [points])

  return (
    <>
      {rainbowSegments.map((segment) => (
        <Polyline key={segment.id} pathOptions={{ color: segment.color, weight: 5, opacity: 0.92 }} positions={segment.points} />
      ))}
    </>
  )
})

export const RouteMarkerLayer = memo(function RouteMarkerLayer({ points }: RouteMarkerLayerProps) {
  return (
    <>
      {points.map((point, index) => (
        <Marker key={point.timestamp} position={toLatLng(point)} icon={createNumberIcon(index + 1)}>
          <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
            {index + 1}
          </Tooltip>
        </Marker>
      ))}
    </>
  )
})

