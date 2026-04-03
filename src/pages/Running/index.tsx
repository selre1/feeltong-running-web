import AdaptiveDiv from '../../components/AdaptiveDiv'
import Button from '../../components/Button'
import Header from '../../components/Header'
import RouteMap from '../../components/RouteMap/RouteMap'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import type { RunDraft, RunRecord } from '../../types/run'
import { formatCalories, formatDistance, formatDuration, formatKmPerMinute, formatPace } from '../../utils/format'
import './index.css'

interface RunningPageProps {
  averagePaceSeconds: number | null
  distanceMeters: number
  draft: RunDraft
  elapsedMs: number
  latestSummary: RunRecord | null
  notice: string
  onBack: () => void
  onFinish: () => void
  onPause: () => void
  onResume: () => void
  onStart: () => void
  onViewChange: (view: 'ready' | 'active' | 'summary') => void
  runningView: 'ready' | 'active' | 'summary'
}

const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978,
  accuracy: 0,
  timestamp: 0,
}

export default function RunningPage({
  averagePaceSeconds,
  distanceMeters,
  draft,
  elapsedMs,
  latestSummary,
  notice,
  onBack: _onBack,
  onFinish,
  onPause,
  onResume,
  onStart,
  onViewChange,
  runningView,
}: RunningPageProps) {
  const summarySource = latestSummary ?? null
  const isActiveView = runningView === 'active'

  return (
    <AdaptiveDiv className={['RunningPage', isActiveView ? 'RunningPage--active' : ''].filter(Boolean).join(' ')} type="center">
      <Header
        variant="page"
        subtitle={
          runningView === 'ready'
            ? '준비가 되셨나요?'
            : runningView === 'summary'
              ? '기록을 확인하세요.'
              : undefined
        }
        title={runningView === 'summary' ? '러닝 결과' : '러닝'}
      />

      {runningView !== 'summary' && (
        <AdaptiveCard className="RunningPage__mapCard">
          <RouteMap
            currentPosition={draft.currentPosition ?? DEFAULT_CENTER}
            hasLivePosition={Boolean(draft.currentPosition)}
            route={draft.route}
          />
          {!isActiveView ? <p className="RunningPage__notice">{notice}</p> : null}
        </AdaptiveCard>
      )}

      {runningView === 'ready' && (
        <AdaptiveCard className="RunningPage__panel">
          <div className="RunningPage__intro">
            <span>러닝 준비</span>
            <strong>필통런! 바로 뛰기</strong>
            <p>모임을 만들어 러닝을 시작해보세요.</p>
          </div>
          <div className="RunningPage__actions">
            <Button className="RunningPage__button RunningPage__button--primary" onClick={onStart} variant="purple">
              러닝 시작
            </Button>
          </div>
        </AdaptiveCard>
      )}

      {runningView === 'active' && (
        <AdaptiveCard className="RunningPage__stats">
          <div className="RunningPage__heroStats">
            <div className="RunningPage__heroStat">
              <span>거리</span>
              <strong>{formatDistance(distanceMeters)}</strong>
            </div>
            <div className="RunningPage__heroStat">
              <span>시간</span>
              <strong>{formatDuration(elapsedMs)}</strong>
            </div>
          </div>

          <div className="RunningPage__metaStats">
            <div className="RunningPage__metaStat">
              <span>칼로리</span>
              <strong>{formatCalories(distanceMeters)}</strong>
            </div>
            <div className="RunningPage__metaStat">
              <span>페이스</span>
              <strong>{formatPace(averagePaceSeconds)}</strong>
            </div>
            <div className="RunningPage__metaStat">
              <span>상태</span>
              <strong>{draft.status === 'paused' ? '일시 정지' : '러닝 중'}</strong>
            </div>
          </div>

          <p className="RunningPage__notice RunningPage__notice--panel">{notice}</p>

          <div className="RunningPage__controls">
            {draft.status === 'paused' ? (
              <Button className="RunningPage__button RunningPage__button--primary" onClick={onResume} variant="purple">
                다시 시작
              </Button>
            ) : (
              <Button className="RunningPage__button" onClick={onPause} variant="white">
                일시정지
              </Button>
            )}
            <Button className="RunningPage__button RunningPage__button--primary" onClick={onFinish} variant="purple">
              종료
            </Button>
          </div>
        </AdaptiveCard>
      )}

      {runningView === 'summary' && (
        <AdaptiveCard className="RunningPage__summary">
          <div className="RunningPage__summaryHero">
            <span>러닝 결과</span>
            <strong>{summarySource ? '러닝이 종료되었습니다.' : '종합 통계를 기다리는 중입니다.'}</strong>
          </div>

          {summarySource ? (
            <div className="RunningPage__summaryGrid">
              <div className="RunningPage__summaryItem">
                <span>총 거리</span>
                <strong>{formatDistance(summarySource.distanceMeters)}</strong>
              </div>
              <div className="RunningPage__summaryItem">
                <span>총 시간</span>
                <strong>{formatDuration(summarySource.durationMs)}</strong>
              </div>
              <div className="RunningPage__summaryItem">
                <span>칼로리</span>
                <strong>{formatCalories(summarySource.distanceMeters)}</strong>
              </div>
              <div className="RunningPage__summaryItem">
                <span>평균 km/분</span>
                <strong>{formatKmPerMinute(summarySource.distanceMeters, summarySource.durationMs)}</strong>
              </div>
            </div>
          ) : null}

          <div className="RunningPage__actions RunningPage__actions--inline RunningPage__actions--summary">
            <Button className="RunningPage__button" onClick={() => onViewChange('ready')} variant="white">
              준비 대기
            </Button>
            <Button className="RunningPage__button RunningPage__button--primary" onClick={onStart} variant="purple">
              러닝 시작
            </Button>
          </div>
        </AdaptiveCard>
      )}
    </AdaptiveDiv>
  )
}
