import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import Header from '../../components/Header'
import PeriodTabs, { type PeriodKey } from '../../components/PeriodTabs'
import StampCalendar from '../../components/StampCalendar'
import { useAuth } from '../../contexts/AuthContext'
import { useRunning } from '../../contexts/RunningContext'
import { formatDistance, formatDuration, formatNumber, formatPace } from '../../utils/format'
import { getRecordsByPeriod, summarizeRecords } from '../../utils/stats'
import './index.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { records, todayRecordCount, openRecords, openRunning } = useRunning()
  const [period, setPeriod] = useState<PeriodKey>('week')

  const effectivePeriod = isAuthenticated ? period : 'all'
  const filteredRecords = useMemo(() => getRecordsByPeriod(records, effectivePeriod), [effectivePeriod, records])
  const summary = useMemo(() => summarizeRecords(filteredRecords), [filteredRecords])

  return (
    <>
      <Header
        variant="home"
        onPrimaryAction={isAuthenticated ? openRunning : () => navigate('/auth')}
        onSecondaryAction={isAuthenticated ? openRecords : undefined}
        primaryActionLabel={isAuthenticated ? '러닝 시작' : '로그인'}
        secondaryActionLabel={isAuthenticated ? '기록 보기' : undefined}
        subtitle="지금 바로 러닝을 시작해보세요."
        title="바로 뛰어버리기"
      />

      <AdaptiveDiv className="HomePage" type="center">
        <section className="HomePage__section">
          <div className="HomePage__sectionTop">
            <div>
              <p className="HomePage__sectionLabel">종합</p>
              <h2>러닝 요약</h2>
            </div>
            <PeriodTabs
              disabled={!isAuthenticated}
              onChange={setPeriod}
              value={effectivePeriod}
            />
          </div>

          <div className="HomePage__stats">
            <AdaptiveCard className="HomePage__statCard">
              <span>누적 거리</span>
              <strong>{formatDistance(summary.distanceMeters)}</strong>
            </AdaptiveCard>
            <AdaptiveCard className="HomePage__statCard">
              <span>누적 시간</span>
              <strong>{formatDuration(summary.durationMs)}</strong>
            </AdaptiveCard>
            <AdaptiveCard className="HomePage__statCard">
              <span>러닝 횟수</span>
              <strong>{formatNumber(summary.count)}회</strong>
            </AdaptiveCard>
            <AdaptiveCard className="HomePage__statCard HomePage__statCard--accent">
              <span>오늘 완료</span>
              <strong>{formatNumber(todayRecordCount)}개</strong>
            </AdaptiveCard>
            <AdaptiveCard className="HomePage__statCard">
              <span>평균 페이스</span>
              <strong>{formatPace(summary.averagePaceSeconds)}</strong>
            </AdaptiveCard>
            <AdaptiveCard className="HomePage__statCard">
              <span>총 칼로리</span>
              <strong>{formatNumber(summary.calories)} kcal</strong>
            </AdaptiveCard>
          </div>
        </section>

        <StampCalendar onTodayAction={openRunning} records={records} />
      </AdaptiveDiv>
    </>
  )
}
