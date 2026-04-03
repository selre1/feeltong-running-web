import { useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import Skeleton from './components/Skeleton'
import Navigation from './components/Skeleton/Navigation'
import { useRunTracking } from './hooks/useRunTracking'
import { supabase } from './lib/supabase'
import AuthPage from './pages/Auth'
import HomePage from './pages/Home'
import MeetingPage from './pages/Meeting'
import MyPage from './pages/My'
import RecordPage from './pages/Record'
import RunningPage from './pages/Running'
import type { RunRecord, TabKey } from './types/run'

type RunningView = 'ready' | 'active' | 'summary'

function RunningApp() {
  const tracking = useRunTracking()
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [runningView, setRunningView] = useState<RunningView>('ready')
  const [latestSummary, setLatestSummary] = useState<RunRecord | null>(null)

  const todayRecordCount = useMemo(() => {
    const today = new Date()
    return tracking.records.filter((record) => {
      const date = new Date(record.startedAt)
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      )
    }).length
  }, [tracking.records])

  const navigate = (tab: TabKey) => {
    setActiveTab(tab)

    if (tab !== 'running' && tracking.draft.status === 'idle') {
      setRunningView((current) => (current === 'summary' ? current : 'ready'))
    }

    if (tab === 'running' && tracking.draft.status === 'running') {
      setRunningView('active')
    }
  }

  const handleStartRun = () => {
    tracking.startRun(() => {
      setLatestSummary(null)
      setRunningView('active')
      setActiveTab('running')
    })
  }

  const handleResumeRun = () => {
    tracking.resumeRun(() => {
      setRunningView('active')
      setActiveTab('running')
    })
  }

  const handleFinishRun = () => {
    tracking.finishRun((record) => {
      setLatestSummary(record)
      setRunningView('summary')
      setActiveTab('running')
    })
  }

  const handleLogout = () => {
    supabase.auth.signOut()
  }

  return (
    <Skeleton navigation={<Navigation activeTab={activeTab} onNavigate={navigate} />}>
      {activeTab === 'home' && (
        <HomePage
          records={tracking.records}
          todayRecordCount={todayRecordCount}
          onOpenRecords={() => navigate('record')}
          onOpenRunning={() => navigate('running')}
        />
      )}

      {activeTab === 'running' && (
        <RunningPage
          averagePaceSeconds={tracking.averagePaceSeconds}
          distanceMeters={tracking.distanceMeters}
          draft={tracking.draft}
          elapsedMs={tracking.elapsedMs}
          latestSummary={latestSummary}
          notice={tracking.notice}
          onBack={() => navigate('home')}
          onFinish={handleFinishRun}
          onPause={tracking.pauseRun}
          onResume={handleResumeRun}
          onStart={handleStartRun}
          onViewChange={setRunningView}
          runningView={runningView}
        />
      )}

      {activeTab === 'record' && (
        <RecordPage records={tracking.records} onBack={() => navigate('home')} />
      )}

      {activeTab === 'meeting' && <MeetingPage onBack={() => navigate('home')} />}

      {activeTab === 'my' && (
        <MyPage
          onBack={() => navigate('home')}
          onLogout={handleLogout}
          recordCount={tracking.records.length}
        />
      )}
    </Skeleton>
  )
}

function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, changedSession) => {
      setSession(changedSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (session === undefined) {
    return null
  }

  if (!session) {
    return <AuthPage />
  }

  return <RunningApp />
}

export default App
