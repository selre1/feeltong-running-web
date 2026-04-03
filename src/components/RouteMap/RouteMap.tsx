import type { GeoPoint } from '../../types/run'
import { getMapZoom, projectPoint } from '../../utils/geo'
import './RouteMap.css'

interface RouteMapProps {
  currentPosition: GeoPoint
  hasLivePosition: boolean
  route: GeoPoint[]
}

const TILE_SIZE = 256
const VIEW_WIDTH = 640
const VIEW_HEIGHT = 420

const wrapTileX = (value: number, zoom: number) => {
  const tiles = 2 ** zoom
  return ((value % tiles) + tiles) % tiles
}

export default function RouteMap({ currentPosition, hasLivePosition, route }: RouteMapProps) {
  const center = route.at(-1) ?? currentPosition
  const zoom = getMapZoom(route)
  const projectedCenter = projectPoint(center, zoom)
  const topLeftX = projectedCenter.x - VIEW_WIDTH / 2
  const topLeftY = projectedCenter.y - VIEW_HEIGHT / 2

  const tileStartX = Math.floor(topLeftX / TILE_SIZE) - 1
  const tileEndX = Math.floor((topLeftX + VIEW_WIDTH) / TILE_SIZE) + 1
  const tileStartY = Math.floor(topLeftY / TILE_SIZE) - 1
  const tileEndY = Math.floor((topLeftY + VIEW_HEIGHT) / TILE_SIZE) + 1

  const maxTileY = 2 ** zoom - 1
  const tiles: Array<{ key: string; left: number; top: number; src: string }> = []

  for (let tileX = tileStartX; tileX <= tileEndX; tileX += 1) {
    for (let tileY = tileStartY; tileY <= tileEndY; tileY += 1) {
      if (tileY < 0 || tileY > maxTileY) {
        continue
      }

      const normalizedX = wrapTileX(tileX, zoom)
      tiles.push({
        key: `${tileX}-${tileY}`,
        left: tileX * TILE_SIZE - topLeftX,
        top: tileY * TILE_SIZE - topLeftY,
        src: `https://tile.openstreetmap.org/${zoom}/${normalizedX}/${tileY}.png`,
      })
    }
  }

  const routePoints = route.map((point) => {
    const projected = projectPoint(point, zoom)
    return `${(projected.x - topLeftX).toFixed(1)},${(projected.y - topLeftY).toFixed(1)}`
  })

  const currentProjected = projectPoint(center, zoom)
  const currentX = currentProjected.x - topLeftX
  const currentY = currentProjected.y - topLeftY

  return (
    <div className="RouteMap">
      <div className="RouteMap__viewport">
        {tiles.map((tile) => (
          <img
            key={tile.key}
            className="RouteMap__tile"
            src={tile.src}
            alt=""
            loading="lazy"
            style={{ left: tile.left, top: tile.top }}
          />
        ))}

        <svg
          className="RouteMap__overlay"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="none"
          aria-label="running route map"
          role="img"
        >
          <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} className="RouteMap__frame" />
          {routePoints.length > 1 && <polyline points={routePoints.join(' ')} className="RouteMap__line" />}
          {routePoints.length === 1 && (
            <circle
              cx={Number(routePoints[0].split(',')[0])}
              cy={Number(routePoints[0].split(',')[1])}
              r="7"
              className="RouteMap__dot"
            />
          )}
          <circle cx={currentX} cy={currentY} r="8" className="RouteMap__current" />
        </svg>

        {!hasLivePosition && (
          <div className="RouteMap__placeholder">
            <strong>위치 신호를 기다리는 중입니다.</strong>
            <span>모바일 기기에서 위치 권한을 허용하면 현재 위치와 이동 경로가 표시됩니다.</span>
          </div>
        )}
      </div>
    </div>
  )
}
