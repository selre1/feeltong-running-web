import './index.css'

export type PeriodKey = 'week' | 'month' | 'all'

interface PeriodTabsProps {
  disabled?: boolean
  onChange: (value: PeriodKey) => void
  value: PeriodKey
}

const PERIODS: Array<{ label: string; value: PeriodKey }> = [
  { label: '\uC774\uBC88\uC8FC', value: 'week' },
  { label: '\uC774\uBC88\uB2EC', value: 'month' },
  { label: '\uC804\uCCB4', value: 'all' },
]

export default function PeriodTabs({ disabled = false, onChange, value }: PeriodTabsProps) {
  return (
    <div className="PeriodTabs">
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
