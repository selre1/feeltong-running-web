import AdaptiveDiv from '../../components/AdaptiveDiv'
import Button from '../../components/Button'
import Header from '../../components/Header'
import RouteMap from '../../components/RouteMap/RouteMap'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import { useRunning } from '../../contexts/RunningContext'
import { clsx } from '../../utils/clsx'
import { formatCalories, formatDistance, formatDuration, formatPace } from '../../utils/format'
import './index.css'

const DEFAULT_CENTER = {
  lat: 37.5665,
  lng: 126.978,
  accuracy: 0,
  timestamp: 0,
}

export default function RunningPage() {
  const {
    averagePaceSeconds,
    canStartRun,
    distanceMeters,
    draft,
    elapsedMs,
    isSavingSummary,
    isSummarySaved,
    latestSummary,
    notice,
    finishRun,
    pauseRun,
    resumeRun,
    saveSummary,
    startRun,
    saveSummaryError,
    runningView,
  } = useRunning()
  const summarySource = latestSummary ?? null
  const isActiveView = runningView === 'active'
  const isSummaryView = runningView === 'summary'
  const mapRoute = runningView === 'summary' && summarySource ? summarySource.route : draft.route
  const mapCurrentPosition = mapRoute.at(-1) ?? draft.currentPosition ?? DEFAULT_CENTER

  return (
    <AdaptiveDiv
      className={clsx(
        'RunningPage',
        runningView === 'ready' && 'RunningPage--ready',
        isActiveView && 'RunningPage--active',
        isSummaryView && 'RunningPage--summary',
      )}
      type="center"
    >
      <Header
        variant="page"
        subtitle={
          runningView === 'ready'
            ? '몸풀기 하셨나요?'
            : undefined
        }
        title={runningView === 'summary' ? '러닝 결과' : '러닝'}
      />

      <AdaptiveCard className="RunningPage__mapCard">
        <RouteMap
          currentPosition={mapCurrentPosition}
          hasLivePosition={Boolean(mapRoute.at(-1) ?? draft.currentPosition)}
          route={mapRoute}
          showCurrentMarker={runningView !== 'summary'}
        />
        {!isActiveView && !isSummaryView ? <p className="RunningPage__notice">{notice}</p> : null}

        {runningView === 'ready' && (
          <AdaptiveCard className="RunningPage__dock">
            <div className="RunningPage__intro">
              <strong>필통런! 바로 뛰기</strong>
              <p>모임을 만들어 러닝을 시작해보세요.</p>
            </div>
            <div className="RunningPage__actions">
              <Button
                className="RunningPage__button RunningPage__button--primary"
                disabled={!canStartRun}
                onClick={startRun}
                variant="purple"
              >
                러닝 시작
              </Button>
            </div>
          </AdaptiveCard>
        )}

        {runningView === 'active' && (
          <div className="RunningPage__stats">
            <div className="RunningPage__heroStats">
              <div className="RunningPage__heroStat">
                <span>Km</span>
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
                <span>분/km</span>
                <strong>{formatPace(averagePaceSeconds)}</strong>
              </div>
            </div>

            <div
              className={clsx(
                'RunningPage__controls',
                'RunningPage__controls--dock',
                draft.status === 'paused' ? 'is-paused' : 'is-running',
              )}
            >
              {draft.status === 'paused' ? (
                <>
                  <Button className="RunningPage__button RunningPage__button--end" onClick={finishRun} variant="purple">
                    끝내기
                  </Button>
                  <Button className="RunningPage__button RunningPage__button--resume" onClick={resumeRun} variant="white">
                    재시작
                  </Button>
                </>
              ) : (
                <Button className="RunningPage__button RunningPage__button--pause" onClick={pauseRun} variant="purple">
                  일시정지
                </Button>
              )}
            </div>
          </div>
        )}

        {runningView === 'summary' && (
          <div className="RunningPage__summary">
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
                  <span>평균 페이스</span>
                  <strong>{formatPace(summarySource.averagePaceSeconds)}</strong>
                </div>
              </div>
            ) : null}

            {saveSummaryError ? <p className="RunningPage__notice RunningPage__notice--panel">{saveSummaryError}</p> : null}

            <div className="RunningPage__actions RunningPage__actions--inline RunningPage__actions--summary">
              <Button className="RunningPage__button" disabled={!canStartRun} onClick={startRun} variant="white">
                한 번 더
              </Button>
              <Button
                className="RunningPage__button RunningPage__button--primary"
                disabled={isSavingSummary || isSummarySaved || !summarySource}
                onClick={saveSummary}
                variant="purple"
              >
                {isSummarySaved ? '저장 완료' : isSavingSummary ? '저장 중' : '저장'}
              </Button>
            </div>
          </div>
        )}
      </AdaptiveCard>

    </AdaptiveDiv>
  )
}
