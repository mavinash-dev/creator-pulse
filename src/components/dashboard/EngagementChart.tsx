'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'

interface DataPoint {
  date: string
  engagement_rate: number
  follower_count: number
}

interface EngagementChartProps {
  data: DataPoint[]
  activeMetric: 'engagement_rate' | 'follower_count'
  range: '7d' | '30d' | '90d'
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  activeMetric: 'engagement_rate' | 'follower_count'
}

function CustomTooltip({ active, payload, label, activeMetric }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  const value = payload[0]?.value
  const formatted =
    activeMetric === 'engagement_rate'
      ? `${value?.toFixed(2)}%`
      : value?.toLocaleString('en-IN')

  return (
    <div
      style={{
        background: '#141414',
        border: '1px solid #262626',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: 12,
      }}
    >
      <p style={{ color: '#737373', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#FAFAFA', fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 600 }}>
        {activeMetric === 'engagement_rate' ? 'Engagement' : 'Followers'}:{' '}
        {formatted}
      </p>
    </div>
  )
}

function calcAvg(data: DataPoint[], metric: 'engagement_rate' | 'follower_count'): number {
  if (!data.length) return 0
  const sum = data.reduce((acc, d) => acc + d[metric], 0)
  return sum / data.length
}

export default function EngagementChart({ data, activeMetric, range }: EngagementChartProps) {
  const avg = calcAvg(data, activeMetric)

  const rangeLabel = range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'
  const metricLabel = activeMetric === 'engagement_rate' ? 'Engagement Rate' : 'Follower Count'

  const tickFormatter =
    activeMetric === 'engagement_rate'
      ? (v: number) => `${v.toFixed(1)}%`
      : (v: number) => {
          if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
          return String(v)
        }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-medium text-[#FAFAFA]">
          {metricLabel}
        </h2>
        <span className="text-xs text-[#737373]">{rangeLabel}</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'var(--font-inter), sans-serif' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#737373', fontSize: 11, fontFamily: 'var(--font-inter), sans-serif' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={tickFormatter}
            width={52}
          />
          <Tooltip content={<CustomTooltip activeMetric={activeMetric} />} />
          <ReferenceLine
            y={avg}
            stroke="#737373"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={false}
          />
          <Line
            type="monotone"
            dataKey={activeMetric}
            name={metricLabel}
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3B82F6', stroke: '#0A0A0A', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-[#3B82F6]" />
          <span className="text-xs text-[#737373]">{metricLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 border-t border-dashed border-[#737373]" />
          <span className="text-xs text-[#737373]">
            Avg:{' '}
            {activeMetric === 'engagement_rate'
              ? `${avg.toFixed(2)}%`
              : avg.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  )
}
