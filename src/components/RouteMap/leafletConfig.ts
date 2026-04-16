import type { PathOptions } from 'leaflet'

export const DEFAULT_ZOOM = 16
export const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
export const DARK_TILE_SUBDOMAINS = ['a', 'b', 'c', 'd']

export const LIVE_POINT_STYLE: PathOptions = {
  color: '#ff7e5f',
  fillColor: '#ff6b6b',
  fillOpacity: 1,
  weight: 2,
}

