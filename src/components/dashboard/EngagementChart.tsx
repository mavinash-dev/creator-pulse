'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

// TODO: Replace with real data fetched from /api/creator/metrics
const MOCK_DATA = [
  { date: 'Apr 17', engagement: 4.2, reach: 28400 },
  { date: 'Apr 22', engagement: 5.1, reach: 31200 },
  { date: 'Apr 27', engagement: 4.8, reach: 29800 },
  { date: 'May 2', engagement: 3.9, reach: 25600 },
  { date: 'May 7', engagement: 4.5, reach: 30100 },
  { date: 'May 12', engagement: 4.8, reach: 31200 },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-lg p-3 text-sm shadow-lg">
      <p className="text-muted mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-metric font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function EngagementChart() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h2 className="text-sm font-medium text-foreground mb-4">
        Engagement Rate — Last 30 days
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={MOCK_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#262626" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#737373', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#737373', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="engagement"
            name="Engagement %"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
