import { useMemo, useState } from 'react'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import AdaptiveCard from '../../components/AdaptiveDiv/AdaptiveCard'
import Header from '../../components/Header'
import PeriodTabs, { type PeriodKey } from '../../components/PeriodTabs'
import StampCalendar from '../../components/StampCalendar'
import type { RunRecord } from '../../types/run'
import { formatDistance, formatDuration, formatNumber } from '../../utils/format'
import './index.css'

interface HomePageProps {
  onOpenRecords: () => void
  onOpenRunning: () => void
  records: RunRecord[]
  todayRecordCount: number
}

const getPeriodStart = (period: PeriodKey) => {
  const now = new Date()
  const current = new Date(now)
  current.setHours(0, 0, 0, 0)

  if (period === 'week') {
    const dayOffset = current.getDay()
    current.setDate(current.getDate() - dayOffset)
    return current.getTime()
  }

  if (period === 'month') {
    current.setDate(1)
    return current.getTime()
  }

  return 0
}

export default function HomePage({
  onOpenRecords,
  onOpenRunning,
  records,
  todayRecordCount,
}: HomePageProps) {
  const [period, setPeriod] = useState<PeriodKey>('week')

  const filteredRecords = useMemo(() => {
    const threshold = getPeriodStart(period)
    return records.filter((record) => record.startedAt >= threshold)
  }, [period, records])

  const summary = useMemo(
    () =>
      filteredRecords.reduce(
        (accumulator, record) => ({
          count: accumulator.count + 1,
          distanceMeters: accumulator.distanceMeters + record.distanceMeters,
          durationMs: accumulator.durationMs + record.durationMs,
        }),
        { count: 0, distanceMeters: 0, durationMs: 0 },
      ),
    [filteredRecords],
  )

  return (
    <>
      <Header
        variant="home"
        onPrimaryAction={onOpenRunning}
        onSecondaryAction={onOpenRecords}
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
            <PeriodTabs onChange={setPeriod} value={period} />
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
          </div>
        </section>

        <StampCalendar onTodayAction={onOpenRunning} records={records} />
      </AdaptiveDiv>
    </>
  )
}
