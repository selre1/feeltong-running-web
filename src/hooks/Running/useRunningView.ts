import { useEffect, useState } from 'react'
import type { RunningView } from './types'

interface UseRunningViewOptions {
  pathname: string
  trackingStatus: 'idle' | 'running' | 'paused'
}

export default function useRunningView({ pathname, trackingStatus }: UseRunningViewOptions) {
  const [runningView, setRunningView] = useState<RunningView>('ready')

  useEffect(() => {
    if (pathname !== '/running' && trackingStatus === 'idle') {
      setRunningView((current) => (current === 'summary' ? current : 'ready'))
      return
    }

    if (pathname === '/running' && trackingStatus === 'running') {
      setRunningView('active')
    }
  }, [pathname, trackingStatus])

  return {
    runningView,
    setRunningView,
  }
}

