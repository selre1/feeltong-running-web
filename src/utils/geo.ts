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
  if (distanceMeters < 1 || durationMs < 1) {
    return null
  }

  return durationMs / 1000 / (distanceMeters / 1000)
}

export const projectPoint = ({ lat, lng }: GeoPointLike, zoom: number) => {
  const scale = 256 * 2 ** zoom
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat))
  const sinLat = Math.sin(toRadians(clampedLat))

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  }
}

export const getMapZoom = (route: GeoPointLike[]) => {
  const totalDistance = getRouteDistanceMeters(route)

  if (totalDistance > 10_000) {
    return 13
  }

  if (totalDistance > 5_000) {
    return 14
  }

  if (totalDistance > 2_000) {
    return 15
  }

  return 16
}

export const toGeoPoint = (position: GeolocationPosition): GeoPoint => ({
  lat: position.coords.latitude,
  lng: position.coords.longitude,
  accuracy: position.coords.accuracy,
  timestamp: position.timestamp,
})
