import AdaptiveDiv from '../../components/AdaptiveDiv'
import Header from '../../components/Header'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import type { RunRecord } from '../../types/run'
import { formatCalories, formatDate, formatDistance, formatDuration, formatKmPerMinute } from '../../utils/format'
import './index.css'

interface RecordPageProps {
  onBack: () => void
  records: RunRecord[]
}

export default function RecordPage({ onBack, records }: RecordPageProps) {
  return (
    <AdaptiveDiv className="RecordPage" type="center">
      <Header
        variant="page"
        onBack={onBack}
        subtitle="저장된 모든 러닝 기록을 간단한 카드 목록으로 관리합니다."
        title="기록"
      />

      {records.length > 0 ? (
        <div className="RecordPage__list">
          {records.map((record) => (
            <AdaptiveCard className="RecordPage__card" key={record.id}>
              <div className="RecordPage__top">
                <strong>{formatDate(record.startedAt)}</strong>
                <span>{formatDistance(record.distanceMeters)}</span>
              </div>
              <div className="RecordPage__grid">
                <div>
                  <span>시간</span>
                  <strong>{formatDuration(record.durationMs)}</strong>
                </div>
                <div>
                  <span>칼로리</span>
                  <strong>{formatCalories(record.distanceMeters)}</strong>
                </div>
                <div>
                  <span>km/분</span>
                  <strong>{formatKmPerMinute(record.distanceMeters, record.durationMs)}</strong>
                </div>
                <div>
                  <span>경로 포인트</span>
                  <strong>{record.route.length}개</strong>
                </div>
              </div>
            </AdaptiveCard>
          ))}
        </div>
      ) : (
        <AdaptiveCard className="RecordPage__empty">
          <strong>아직 저장된 기록이 없습니다.</strong>
          <p>러닝 페이지에서 시작 버튼을 누르면 첫 기록이 여기에 쌓입니다.</p>
        </AdaptiveCard>
      )}
    </AdaptiveDiv>
  )
}
