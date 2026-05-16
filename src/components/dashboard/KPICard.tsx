interface KPICardProps {
  label: string
  value: string
  /** Percentage delta vs. previous period. Positive = up, negative = down, 0 = neutral */
  delta: number
  suffix?: string
}

export default function KPICard({ label, value, delta, suffix = '' }: KPICardProps) {
  const isPositive = delta > 0
  const isNeutral = delta === 0

  const deltaColor = isNeutral
    ? 'text-muted'
    : isPositive
    ? 'text-green-400'
    : 'text-red-400'

  const arrow = isNeutral ? '—' : isPositive ? '↑' : '↓'

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="font-metric text-3xl font-semibold text-foreground">
        {value}
        {suffix && <span className="text-xl ml-0.5">{suffix}</span>}
      </p>
      {/* Delta badge */}
      <p className={`text-sm font-medium ${deltaColor} flex items-center gap-1`}>
        <span>{arrow}</span>
        {!isNeutral && (
          <span>
            {Math.abs(delta).toFixed(1)}%{' '}
            <span className="text-muted font-normal">vs last 30d</span>
          </span>
        )}
        {isNeutral && <span className="text-muted font-normal">No change</span>}
      </p>
    </div>
  )
}
