import L from 'leaflet'
import type { GeoPoint } from '../../types/run'

export type LatLngTuple = [number, number]

export interface RainbowSegment {
  id: string
  color: string
  points: [LatLngTuple, LatLngTuple]
}

export const toLatLng = (point: GeoPoint): LatLngTuple => [point.lat, point.lng]

export const createNumberIcon = (index: number) =>
  L.divIcon({
    className: 'RouteMap__numberIcon',
    html: `<span>${index}</span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })

export const createRunnerIcon = () =>
  L.divIcon({
    className: 'RouteMap__runnerIcon',
    html: '<span>&#127939;</span>',
    iconSize: [32, 32],
    iconAnchor: [14, 14],
  })

export const buildRainbowSegments = (points: GeoPoint[]): RainbowSegment[] => {
  if (points.length < 2) {
    return []
  }

  const segmentCount = points.length - 1

  return points.slice(1).map((point, index) => {
    const previous = points[index]
    const hue = Math.round((index / Math.max(1, segmentCount - 1)) * 300)

    return {
      id: `${previous.timestamp}-${point.timestamp}`,
      color: `hsl(${hue}, 82%, 56%)`,
      points: [toLatLng(previous), toLatLng(point)],
    }
  })
}
