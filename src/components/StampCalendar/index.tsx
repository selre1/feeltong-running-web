import { useCallback, useMemo, useState } from 'react'
import type { RunRecord } from '../../types/run'
import './index.css'

interface StampCalendarProps {
  onTodayAction?: () => void
  records: RunRecord[]
}

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export default function StampCalendar({ onTodayAction, records }: StampCalendarProps) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const leadingDays = firstDay.getDay()

  const stampedDates = useMemo(
    () =>
      new Set(
        records
          .filter((record) => {
            const date = new Date(record.startedAt)
            return date.getFullYear() === year && date.getMonth() === month
          })
          .map((record) => formatDateKey(new Date(record.startedAt))),
      ),
    [month, records, year],
  )

  const goToPrevMonth = useCallback(() => setCurrentDate(new Date(year, month - 1, 1)), [year, month])
  const goToNextMonth = useCallback(() => setCurrentDate(new Date(year, month + 1, 1)), [year, month])

  const cells = useMemo(() => Array.from({ length: leadingDays + lastDay.getDate() }, (_, index) => {
    const dayNumber = index - leadingDays + 1
    if (dayNumber < 1) {
      return <div className="StampCalendar__cell StampCalendar__cell--empty" key={`empty-${index}`} />
    }

    const date = new Date(year, month, dayNumber)
    const dateKey = formatDateKey(date)
    const isToday = formatDateKey(today) === dateKey
    const stamped = stampedDates.has(dateKey)

    return (
      <button
        className={[
          'StampCalendar__cell',
          stamped ? 'is-stamped' : '',
          isToday ? 'is-today' : '',
        ].filter(Boolean).join(' ')}
        key={dateKey}
        type="button"
      >
        <span className="StampCalendar__date">{dayNumber}</span>
        {stamped ? <span className="StampCalendar__stamp">RUN</span> : null}
      </button>
    )
  }), [leadingDays, lastDay, year, month, stampedDates, today])

  return (
    <section className="StampCalendar">
      <div className="StampCalendar__header">
        <button className="StampCalendar__navButton" onClick={goToPrevMonth} type="button">
          ‹
        </button>
        <strong>
          {year}년 {month + 1}월
        </strong>
        <button className="StampCalendar__navButton" onClick={goToNextMonth} type="button">
          ›
        </button>
      </div>
      <div className="StampCalendar__weekdays">
        {WEEK_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="StampCalendar__grid">{cells}</div>
      {onTodayAction ? (
        <div className="StampCalendar__footer">
          <button className="StampCalendar__todayButton" onClick={onTodayAction} type="button">
            오늘 러닝 시작하기
          </button>
        </div>
      ) : null}
    </section>
  )
}
