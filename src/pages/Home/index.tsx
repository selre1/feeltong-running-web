import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdaptiveDiv from '../../components/AdaptiveDiv'
import Button from '../../components/Button'
import PeriodTabs, { type PeriodKey } from '../../components/PeriodTabs'
import StampCalendar from '../../components/StampCalendar'
import { useAuth } from '../../contexts/AuthContext'
import { useRunning } from '../../contexts/RunningContext'
import { formatDuration, formatNumber, formatPace } from '../../utils/format'
import { getRecordsByPeriod, summarizeRecords } from '../../utils/stats'
import './index.css'

function getTodayString() {
  const now = new Date()
  const m = now.getMonth() + 1
  const d = now.getDate()
  const day = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()]
  return `${m}월 ${d}일 ${day}요일`
}

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { records, openRecords, openRunning } = useRunning()
  const [period, setPeriod] = useState<PeriodKey>('today')

  const effectivePeriod = isAuthenticated ? period : 'all'
  const filteredRecords = useMemo(() => getRecordsByPeriod(records, effectivePeriod), [effectivePeriod, records])
  const summary = useMemo(() => summarizeRecords(filteredRecords), [filteredRecords])

  const distKm = (summary.distanceMeters / 1000).toFixed(2)

  return (
    <>
      <section className="HomeHero">
        <div className="HomeHero__bg" aria-hidden="true" />
        <AdaptiveDiv type="center">
          <div className="HomeHero__topBar">
            <strong className="HomeHero__brand">FEELTONG</strong>
            {isAuthenticated ? (
              <button className="HomeHero__recordBtn" onClick={openRecords} type="button">
                기록 보기
              </button>
            ) : null}
          </div>

          <div className="HomeHero__body">
            <p className="HomeHero__date">{getTodayString()}</p>
            <h1 className="HomeHero__title">
              오늘도<br />달려요.
            </h1>
          </div>

          <Button
            className="HomeHero__cta"
            onClick={isAuthenticated ? openRunning : () => navigate('/auth')}
            variant="purple"
          >
            {isAuthenticated ? '러닝 시작' : '로그인하고 시작하기'}
          </Button>
        </AdaptiveDiv>
      </section>

      <AdaptiveDiv className="HomePage" type="center">
        <section className="HomePage__stats">
          <PeriodTabs
            disabled={!isAuthenticated}
            onChange={setPeriod}
            value={effectivePeriod}
            variant="underline"
          />

          <div className="HomePage__distHero">
            <span className="HomePage__distValue">{distKm}</span>
            <span className="HomePage__distUnit">km</span>
          </div>

          <div className="HomePage__statsStrip">
            <div className="HomePage__stat">
              <strong>{formatDuration(summary.durationMs)}</strong>
              <span>시간</span>
            </div>
            <div className="HomePage__stat">
              <strong>{formatPace(summary.averagePaceSeconds)}</strong>
              <span>페이스</span>
            </div>
            <div className="HomePage__stat">
              <strong>{formatNumber(summary.count)}회</strong>
              <span>횟수</span>
            </div>
          </div>
        </section>

        <StampCalendar onTodayAction={openRunning} records={records} />
      </AdaptiveDiv>
    </>
  )
}
