import type { GeoPoint } from '../../types/run'
import './index.css'

interface RouteThumbnailProps {
  className?: string
  route: GeoPoint[]
}

const W = 100
const H = 74
const PAD = 10

export default function RouteThumbnail({ className, route }: RouteThumbnailProps) {
  const cls = ['RouteThumbnail', className].filter(Boolean).join(' ')

  if (route.length < 2) {
    return <div className={`${cls} RouteThumbnail--empty`} aria-hidden="true" />
  }

  const lats = route.map((p) => p.lat)
  const lngs = route.map((p) => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const range = Math.max(maxLat - minLat, maxLng - minLng) || 0.001
  const innerW = W - PAD * 2
  const innerH = H - PAD * 2

  const pts = route.map((p) => ({
    x: PAD + ((p.lng - minLng) / range) * innerW,
    y: PAD + ((maxLat - p.lat) / range) * innerH,
  }))

  const pointsStr = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const start = pts[0]
  const end = pts[pts.length - 1]

  return (
    <svg
      aria-hidden="true"
      className={cls}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline
        fill="none"
        opacity="0.9"
        points={pointsStr}
        stroke="var(--theme-accent)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx={start.x.toFixed(1)} cy={start.y.toFixed(1)} fill="var(--theme-accent-cool)" r="3" />
      <circle cx={end.x.toFixed(1)} cy={end.y.toFixed(1)} fill="var(--theme-accent)" r="3" />
    </svg>
  )
}
