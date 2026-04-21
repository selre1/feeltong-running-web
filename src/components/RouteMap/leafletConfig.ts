import type { PathOptions } from 'leaflet'

export const DEFAULT_ZOOM = 16
export const TILE_URL = 'https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg'
export const TILE_SUBDOMAINS: string[] = []

export const LIVE_POINT_STYLE: PathOptions = {
  color: '#ff7e5f',
  fillColor: '#ff6b6b',
  fillOpacity: 1,
  weight: 2,
}

