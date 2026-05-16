interface KPICardProps {
  label: string
  value: string | number
  delta?: number
  deltaLabel?: string
  unit?: string
  isMonospace?: boolean
}

export default function KPICard({
  label,
  value,
  delta,
  deltaLabel = 'vs last 7 days',
  unit,
  isMonospace = true,
}: KPICardProps) {
  const hasDelta = delta !== undefined && delta !== null
  const isPositive = hasDelta && delta > 0
  const isNeutral = hasDelta && delta === 0

  const deltaColor = isNeutral
    ? 'text-[#737373]'
    : isPositive
    ? 'text-[#22C55E]'
    : 'text-[#EF4444]'

  const arrow = isNeutral ? '—' : isPositive ? '↑' : '↓'

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 flex flex-col gap-2">
      <p className="text-xs font-medium text-[#737373] uppercase tracking-wider">
        {label}
      </p>

      <div className="flex items-baseline gap-1">
        <p
          className={[
            'text-2xl font-semibold text-[#FAFAFA] leading-none',
            isMonospace ? 'font-mono' : 'font-sans',
          ].join(' ')}
        >
          {value}
        </p>
        {unit && (
          <span className="text-sm text-[#737373] font-mono">{unit}</span>
        )}
      </div>

      {hasDelta && (
        <p className={`text-xs font-medium flex items-center gap-1 ${deltaColor}`}>
          <span className="text-sm leading-none">{arrow}</span>
          {!isNeutral ? (
            <>
              <span className="font-mono">{Math.abs(delta).toFixed(1)}%</span>
              <span className="text-[#737373] font-normal">{deltaLabel}</span>
            </>
          ) : (
            <span className="text-[#737373] font-normal">No change</span>
          )}
        </p>
      )}
    </div>
  )
}
