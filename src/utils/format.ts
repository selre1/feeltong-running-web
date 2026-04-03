export const formatDistance = (meters: number) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`
  }

  return `${Math.round(meters)} m`
}

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

export const formatPace = (paceSeconds: number | null) => {
  if (!paceSeconds || !Number.isFinite(paceSeconds)) {
    return '--'
  }

  const normalizedSeconds = Math.round(paceSeconds)
  const minutes = Math.floor(normalizedSeconds / 60)
  const seconds = normalizedSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}/km`
}

export const formatDate = (timestamp: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp)

export const formatRangeDate = (timestamp: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(timestamp)

export const formatWeekdayLabel = (timestamp: number) =>
  new Intl.DateTimeFormat('ko-KR', {
    weekday: 'short',
  })
    .format(timestamp)
    .replace('.', '')

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('ko-KR').format(value)

export const formatCalories = (distanceMeters: number) => {
  const estimated = Math.max(0, Math.round((distanceMeters / 1000) * 62))
  return `${formatNumber(estimated)} kcal`
}

export const formatKmPerMinute = (distanceMeters: number, durationMs: number) => {
  if (distanceMeters < 1 || durationMs < 1) {
    return '--'
  }

  const kmPerMinute = distanceMeters / 1000 / (durationMs / 1000 / 60)
  return `${kmPerMinute.toFixed(2)} km/min`
}
