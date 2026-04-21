import './index.css'

export type PeriodKey = 'today' | 'week' | 'month' | 'all'
export type PeriodTabsVariant = 'pill' | 'underline'

interface PeriodTabsProps {
  disabled?: boolean
  onChange: (value: PeriodKey) => void
  value: PeriodKey
  variant?: PeriodTabsVariant
}

const PERIODS: Array<{ label: string; value: PeriodKey }> = [
  { label: '오늘', value: 'today' },
  { label: '이번주', value: 'week' },
  { label: '이번달', value: 'month' },
  { label: '전체', value: 'all' },
]

export default function PeriodTabs({ disabled = false, onChange, value, variant = 'pill' }: PeriodTabsProps) {
  return (
    <div className={['PeriodTabs', variant === 'underline' ? 'PeriodTabs--underline' : ''].filter(Boolean).join(' ')}>
      {PERIODS.map((period) => (
        <button
          className={['PeriodTabs__button', value === period.value ? 'is-active' : ''].filter(Boolean).join(' ')}
          disabled={disabled}
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
