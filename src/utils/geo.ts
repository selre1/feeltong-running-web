import type { GeoPoint } from '../types/run'

interface GeoPointLike {
  lat: number
  lng: number
}

const EARTH_RADIUS_METERS = 6_371_000

const toRadians = (degree: number) => (degree * Math.PI) / 180

export const getDistanceMeters = (from: GeoPointLike, to: GeoPointLike) => {
  const latDelta = toRadians(to.lat - from.lat)
  const lngDelta = toRadians(to.lng - from.lng)
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)

  const haversine =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(haversine))
}

export const getRouteDistanceMeters = (route: GeoPointLike[]) =>
  route.reduce((total, point, index) => {
    const previous = route[index - 1]
    return previous ? total + getDistanceMeters(previous, point) : total
  }, 0)

export const getAveragePaceSeconds = (distanceMeters: number, durationMs: number) => {
  // 50m 미만은 유효한 페이스 계산 불가 (GPS 드리프트 오차 범위)
  if (distanceMeters < 50 || durationMs < 1) {
    return null
  }

  return durationMs / 1000 / (distanceMeters / 1000)
}

export const toGeoPoint = (position: GeolocationPosition): GeoPoint => ({
  lat: position.coords.latitude,
  lng: position.coords.longitude,
  accuracy: position.coords.accuracy,
  timestamp: position.timestamp,
})

const perpendicularDistanceDeg = (
  point: GeoPointLike,
  start: GeoPointLike,
  end: GeoPointLike,
): number => {
  const dx = end.lng - start.lng
  const dy = end.lat - start.lat

  if (dx === 0 && dy === 0) {
    return Math.sqrt((point.lat - start.lat) ** 2 + (point.lng - start.lng) ** 2)
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.lat - start.lat) * dy + (point.lng - start.lng) * dx) / (dx ** 2 + dy ** 2),
    ),
  )

  return Math.sqrt(
    (point.lat - (start.lat + t * dy)) ** 2 + (point.lng - (start.lng + t * dx)) ** 2,
  )
}

const douglasPeuckerRecursive = <T extends GeoPointLike>(points: T[], tolerance: number): T[] => {
  if (points.length <= 2) return points

  let maxDist = 0
  let maxIdx = 0

  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicularDistanceDeg(points[i], points[0], points[points.length - 1])
    if (dist > maxDist) {
      maxDist = dist
      maxIdx = i
    }
  }

  if (maxDist > tolerance) {
    const left = douglasPeuckerRecursive(points.slice(0, maxIdx + 1), tolerance)
    const right = douglasPeuckerRecursive(points.slice(maxIdx), tolerance)
    return [...left.slice(0, -1), ...right]
  }

  return [points[0], points[points.length - 1]]
}

export const simplifyRoute = <T extends GeoPointLike>(
  points: T[],
  toleranceDegrees = 0.00005,
): T[] => {
  if (points.length <= 2) return points
  return douglasPeuckerRecursive(points, toleranceDegrees)
}
