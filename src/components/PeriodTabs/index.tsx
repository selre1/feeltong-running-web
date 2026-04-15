import './index.css'

export type PeriodKey = 'week' | 'month' | 'all'

interface PeriodTabsProps {
  onChange: (value: PeriodKey) => void
  value: PeriodKey
}

const PERIODS: Array<{ label: string; value: PeriodKey }> = [
  { label: '이번주', value: 'week' },
  { label: '이번달', value: 'month' },
  { label: '전체', value: 'all' },
]

export default function PeriodTabs({ onChange, value }: PeriodTabsProps) {
  return (
    <div className="PeriodTabs">
      {PERIODS.map((period) => (
        <button
          className={['PeriodTabs__button', value === period.value ? 'is-active' : ''].filter(Boolean).join(' ')}
          key={period.value}
          onClick={() => onChange(period.value)}
          type="button"
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

