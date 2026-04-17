import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import AuthRequiredCard from '../../components/AuthRequiredCard'
import Header from '../../components/Header'
import { recordCopy } from '../../tools/pageText'
import type { RunRecord } from '../../types/run'
import { formatDistance, formatDuration, formatPace } from '../../utils/format'
import { formatKoreanDateTime } from '../../utils/date'
import './index.css'

interface RecordPageProps {
  isAuthenticated: boolean
  onLogin: () => void
  records: RunRecord[]
}

const formatTotalKm = (meters: number) => (meters / 1000).toFixed(2)

export default function RecordPage({ isAuthenticated, onLogin, records }: RecordPageProps) {
  const totalDistanceMeters = records.reduce((sum, record) => sum + record.distanceMeters, 0)

  return (
    <AdaptiveDiv className="RecordPage" type="center">
      <Header title={recordCopy.title} variant="page" />

      {!isAuthenticated ? (
        <AuthRequiredCard
          description="러닝 기록은 로그인 후 계정과 연동되어 표시됩니다."
          onLogin={onLogin}
          title="로그인이 필요합니다."
        />
      ) : null}

      {isAuthenticated ? (
      <AdaptiveCard className="RecordPage__summary">
        <div className="RecordPage__summaryItem">
          <strong>{records.length}</strong>
          <span>{recordCopy.runCountLabel}</span>
        </div>
        <div className="RecordPage__summaryDivider" />
        <div className="RecordPage__summaryItem">
          <strong>{formatTotalKm(totalDistanceMeters)}</strong>
          <span>{recordCopy.totalDistanceLabel}</span>
        </div>
      </AdaptiveCard>
      ) : null}

      {isAuthenticated && records.length > 0 ? (
        <div className="RecordPage__list">
          {records.map((record) => (
            <div className="RecordPage__item" key={record.id}>
              <p className="RecordPage__dateLabel">{formatKoreanDateTime(record.startedAt)}</p>

              <AdaptiveCard className="RecordPage__row">
                <div className="RecordPage__thumb" aria-hidden="true" />

                <div className="RecordPage__content">
                  <p className="RecordPage__distance">{formatDistance(record.distanceMeters)}</p>

                  <div className="RecordPage__meta">
                    <span>{formatDuration(record.durationMs)}</span>
                    <span>{formatPace(record.averagePaceSeconds)}</span>
                    <span>{recordCopy.pointLabel(record.route.length)}</span>
                  </div>
                </div>
              </AdaptiveCard>
            </div>
          ))}
        </div>
      ) : null}

      {isAuthenticated && records.length === 0 ? (
        <AdaptiveCard className="RecordPage__empty">
          <strong>{recordCopy.emptyTitle}</strong>
          <p>{recordCopy.emptyDescription}</p>
        </AdaptiveCard>
      ) : null}
    </AdaptiveDiv>
  )
}
