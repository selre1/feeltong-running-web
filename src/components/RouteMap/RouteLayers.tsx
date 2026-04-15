import { Marker, Polyline, Tooltip } from 'react-leaflet'
import type { GeoPoint } from '../../types/run'
import { buildRainbowSegments, createNumberIcon, toLatLng } from './leafletHelpers'

interface RoutePolylineLayerProps {
  points: GeoPoint[]
}

interface RouteMarkerLayerProps {
  points: GeoPoint[]
}

export function RoutePolylineLayer({ points }: RoutePolylineLayerProps) {
  const rainbowSegments = buildRainbowSegments(points)

  return (
    <>
      {rainbowSegments.map((segment) => (
        <Polyline key={segment.id} pathOptions={{ color: segment.color, weight: 5, opacity: 0.92 }} positions={segment.points} />
      ))}
    </>
  )
}

export function RouteMarkerLayer({ points }: RouteMarkerLayerProps) {
  return (
    <>
      {points.map((point, index) => (
        <Marker key={`marker-${point.timestamp}-${index}`} position={toLatLng(point)} icon={createNumberIcon(index + 1)}>
          <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
            {index + 1}
          </Tooltip>
        </Marker>
      ))}
    </>
  )
}

