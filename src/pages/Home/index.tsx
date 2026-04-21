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
        {/* Full-bleed animated background */}
        <div className="HomeHero__bg" aria-hidden="true">
          <div className="HomeHero__blob HomeHero__blob--1" />
          <div className="HomeHero__blob HomeHero__blob--2" />
          <div className="HomeHero__blob HomeHero__blob--3" />
          <div className="HomeHero__particle HomeHero__particle--1" />
          <div className="HomeHero__particle HomeHero__particle--2" />
          <div className="HomeHero__particle HomeHero__particle--3" />
          <div className="HomeHero__particle HomeHero__particle--4" />

          {/* Beating heart — decorative, centered in bg */}
          <div className="HomeHero__heartStage">
            <div className="HomeHero__heartRing HomeHero__heartRing--1" />
            <div className="HomeHero__heartRing HomeHero__heartRing--2" />
            <div className="HomeHero__heartRing HomeHero__heartRing--3" />
            <svg className="HomeHero__heart" viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient cx="50%" cy="35%" id="hg" r="65%">
                  <stop offset="0%" stopColor="#ff9a6c" />
                  <stop offset="55%" stopColor="#ee5c25" />
                  <stop offset="100%" stopColor="#c73e0e" />
                </radialGradient>
                <filter id="hglow">
                  <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="3" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M50 82 C22 65 4 52 4 34 A24 24 0 0 1 50 17 A24 24 0 0 1 96 34 C96 52 78 65 50 82Z"
                fill="url(#hg)"
                filter="url(#hglow)"
              />
              {/* Inner highlight */}
              <path
                d="M38 28 C36 24 40 20 46 22 C42 24 40 28 42 32"
                fill="none"
                opacity="0.45"
                stroke="white"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Centered content — same as before */}
        <AdaptiveDiv type="center">
          <div className="HomeHero__topBar">
            <div className="HomeHero__brandRow">
              <img alt="" className="HomeHero__brandLogo" src="/favicon.svg" />
              <strong className="HomeHero__brand">FEELTONG</strong>
            </div>
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
