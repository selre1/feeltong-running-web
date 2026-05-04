import { useCallback, useMemo, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import type { GeoPoint } from '../../types/run'
import { DEFAULT_ZOOM, TILE_SUBDOMAINS, TILE_URL } from './leafletConfig'
import { createRunnerIcon, toLatLng } from './leafletHelpers'
import RecenterMap from './RecenterMap'
import { RoutePolylineLayer } from './RouteLayers'
import 'leaflet/dist/leaflet.css'
import './RouteMap.css'

interface RouteMapProps {
  currentPosition: GeoPoint
  hasLivePosition: boolean
  route: GeoPoint[]
  showCurrentMarker?: boolean
}

export default function RouteMap({
  currentPosition,
  hasLivePosition,
  route,
  showCurrentMarker = true,
}: RouteMapProps) {
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [autoFollow, setAutoFollow] = useState(true)

  const center = route.at(-1) ?? currentPosition
  const mapCenter = useMemo(() => toLatLng(center), [center])
  const runnerIcon = useMemo(() => createRunnerIcon(), [])

  const handleUserInteract = useCallback(() => {
    setAutoFollow(false)
  }, [])

  const moveToCurrentPosition = () => {
    if (!map) return

    const latestPoint = route.at(-1) ?? currentPosition
    map.flyTo(toLatLng(latestPoint), Math.max(map.getZoom(), 16), { animate: true, duration: 0.35 })
    setAutoFollow(true)
  }

  return (
    <div className="RouteMap">
      <div className="RouteMap__viewport">
        <MapContainer
          attributionControl={false}
          center={mapCenter}
          className="RouteMap__leaflet"
          doubleClickZoom
          ref={setMap}
          scrollWheelZoom
          touchZoom
          zoom={DEFAULT_ZOOM}
          zoomControl
        >
          <RecenterMap center={mapCenter} follow={autoFollow} onUserInteract={handleUserInteract} />

          <TileLayer subdomains={TILE_SUBDOMAINS} url={TILE_URL} />

          <RoutePolylineLayer points={route} />

          {hasLivePosition && showCurrentMarker ? <Marker icon={runnerIcon} position={toLatLng(currentPosition)} /> : null}
        </MapContainer>

        <button
          aria-label="current-location"
          className="RouteMap__locateButton"
          onClick={moveToCurrentPosition}
          type="button"
        >
          ◎
        </button>

        {!hasLivePosition ? (
          <div className="RouteMap__placeholder">
            <strong>GPS</strong>
            <span>수신 대기 중</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}
