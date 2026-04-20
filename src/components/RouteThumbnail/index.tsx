import { useId } from 'react'
import type { GeoPoint } from '../../types/run'
import './index.css'

interface RouteThumbnailProps {
  className?: string
  route: GeoPoint[]
}

const W = 124
const H = 92
const PAD = 14

export default function RouteThumbnail({ className, route }: RouteThumbnailProps) {
  const rawId = useId()
  const uid = rawId.replace(/:/g, '_')
  const cls = ['RouteThumbnail', className].filter(Boolean).join(' ')

  if (route.length < 2) {
    return (
      <div className={`${cls} RouteThumbnail--empty`} aria-hidden="true">
        <svg viewBox={`0 0 ${W} ${H}`} className="RouteThumbnail__emptySvg">
          <defs>
            <pattern id={`eg-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="0.55" fill="rgba(255,255,255,0.08)" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill={`url(#eg-${uid})`} />
          <text
            x={W / 2}
            y={H / 2 + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.18)"
            fontSize="7"
            fontWeight="600"
            letterSpacing="0.5"
          >
            경로 없음
          </text>
        </svg>
      </div>
    )
  }

  const lats = route.map((p) => p.lat)
  const lngs = route.map((p) => p.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const lngRange = maxLng - minLng || 0.001
  const latRange = maxLat - minLat || 0.001
  const innerW = W - PAD * 2
  const innerH = H - PAD * 2

  // uniform scale that fits the route inside the padded area
  const scale = Math.min(innerW / lngRange, innerH / latRange)

  // center offset: remaining space after scaling ÷ 2
  const offsetX = PAD + (innerW - lngRange * scale) / 2
  const offsetY = PAD + (innerH - latRange * scale) / 2

  const pts = route.map((p) => ({
    x: offsetX + (p.lng - minLng) * scale,
    y: offsetY + (maxLat - p.lat) * scale,
  }))

  const pointsStr = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <svg
      aria-hidden="true"
      className={cls}
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* dot grid — map-like feel */}
        <pattern id={`g-${uid}`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.55" fill="rgba(255,255,255,0.1)" />
        </pattern>

        {/* edge vignette mask */}
        <radialGradient id={`v-${uid}`} cx="50%" cy="50%" r="62%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.35" />
        </radialGradient>
        <mask id={`m-${uid}`}>
          <rect width={W} height={H} fill={`url(#v-${uid})`} />
        </mask>
      </defs>

      {/* grid layer with vignette */}
      <rect width={W} height={H} fill={`url(#g-${uid})`} mask={`url(#m-${uid})`} />

      {/* route — outermost glow */}
      <polyline
        fill="none"
        mask={`url(#m-${uid})`}
        opacity="0.07"
        points={pointsStr}
        stroke="#ff6b6b"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9"
      />
      {/* route — mid glow */}
      <polyline
        fill="none"
        mask={`url(#m-${uid})`}
        opacity="0.2"
        points={pointsStr}
        stroke="#ff6b6b"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4.5"
      />
      {/* route — bright core */}
      <polyline
        fill="none"
        opacity="0.95"
        points={pointsStr}
        stroke="#ff8e53"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      {/* route — white hot center */}
      <polyline
        fill="none"
        opacity="0.55"
        points={pointsStr}
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.6"
      />

    </svg>
  )
}
