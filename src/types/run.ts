export type RunStatus = 'idle' | 'running' | 'paused'
export type TabKey = 'home' | 'running' | 'record' | 'meeting' | 'my'

export interface GeoPoint {
  lat: number
  lng: number
  accuracy: number
  timestamp: number
}

export interface RunDraft {
  status: RunStatus
  startedAt: number | null
  pausedStartedAt: number | null
  accumulatedPausedMs: number
  route: GeoPoint[]
  currentPosition: GeoPoint | null
}

export interface RunRecord {
  id: string
  startedAt: number
  endedAt: number
  durationMs: number
  distanceMeters: number
  averagePaceSeconds: number | null
  route: GeoPoint[]
}

export interface WeekChoice {
  key: string
  dayLabel: string
  dayNumber: number
  timestamp: number
}
