'use client'

import { useState, useMemo } from 'react'
import KPICard from '@/components/dashboard/KPICard'
import EngagementChart from '@/components/dashboard/EngagementChart'
import AlertConfig from '@/components/dashboard/AlertConfig'
import { calculateRates, formatINR } from '@/lib/rates'
import type { Alert } from '@/lib/types'

type Range = '7d' | '30d' | '90d'
type ActiveMetric = 'engagement_rate' | 'follower_count'

interface DashboardClientProps {
  creatorId: string
  creatorHandle: string
  platform: 'instagram' | 'youtube' | 'tiktok'
  lastSynced: string
  initialAlerts: Alert[]
}

function generateMockData(range: Range) {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const result: Array<{ date: string; engagement_rate: number; follower_count: number }> = []
  const now = new Date()

  let followers = 120000

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)

    const label =
      days <= 7
        ? d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
        : days <= 30
        ? d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })

    // Engagement rate: floats around 4.2% with ±0.5% random variation
    const engagementBase = 4.2
    const engagementNoise = (Math.random() - 0.5) * 1.0
    const engagement_rate = Math.max(0.5, engagementBase + engagementNoise)

    // Follower count: grows ~50/day with some variation
    const dailyGrowth = 40 + Math.floor(Math.random() * 20)
    followers += dailyGrowth

    result.push({
      date: label,
      engagement_rate: Math.round(engagement_rate * 100) / 100,
      follower_count: followers,
    })
  }

  return result
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-pink-900/40 text-pink-300 border-pink-800',
  youtube: 'bg-red-900/40 text-red-300 border-red-800',
  tiktok: 'bg-cyan-900/40 text-cyan-300 border-cyan-800',
}

export default function DashboardClient({
  creatorId,
  creatorHandle,
  platform,
  lastSynced,
  initialAlerts,
}: DashboardClientProps) {
  const [range, setRange] = useState<Range>('30d')
  const [activeMetric, setActiveMetric] = useState<ActiveMetric>('engagement_rate')
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  const data = useMemo(() => generateMockData(range), [range])

  // Derive KPI values from the last data point
  const latest = data[data.length - 1]
  const prev = data[0]

  const followerCount = latest?.follower_count ?? 124000
  const followerDelta =
    prev && prev.follower_count > 0
      ? ((latest.follower_count - prev.follower_count) / prev.follower_count) * 100
      : 0

  const avgEngagement =
    data.reduce((s, d) => s + d.engagement_rate, 0) / (data.length || 1)
  const prevHalf = data.slice(0, Math.floor(data.length / 2))
  const currHalf = data.slice(Math.floor(data.length / 2))
  const prevAvgEng = prevHalf.reduce((s, d) => s + d.engagement_rate, 0) / (prevHalf.length || 1)
  const currAvgEng = currHalf.reduce((s, d) => s + d.engagement_rate, 0) / (currHalf.length || 1)
  const engDelta = prevAvgEng > 0 ? ((currAvgEng - prevAvgEng) / prevAvgEng) * 100 : 0

  const avgReach = 18400
  const reachDelta = 5.0

  // Rate intelligence — convert avgEngagement (percentage) to decimal for calculateRates
  const rateCard = calculateRates({
    follower_count: followerCount,
    engagement_rate: avgEngagement / 100,
    niche: 'fashion',
    platform: 'instagram',
  })

  function formatFollowers(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
  }

  const RANGES: Range[] = ['7d', '30d', '90d']

  return (
    <div className="space-y-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#FAFAFA]">{creatorHandle}</span>
            <span
              className={[
                'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
                PLATFORM_COLORS[platform] ?? 'bg-[#141414] text-[#737373] border-[#262626]',
              ].join(' ')}
            >
              {PLATFORM_LABELS[platform] ?? platform}
            </span>
          </div>
          <span className="text-xs text-[#737373]">Last synced {lastSynced}</span>
        </div>

        <button className="self-start sm:self-auto inline-flex items-center gap-1.5 text-sm font-medium text-[#3B82F6] border border-[#3B82F6]/40 hover:border-[#3B82F6] rounded-lg px-3 py-1.5 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Share media kit
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard
          label="Followers"
          value={formatFollowers(followerCount)}
          delta={followerDelta}
          deltaLabel="this week"
          isMonospace
        />
        <KPICard
          label="Engagement Rate"
          value={avgEngagement.toFixed(1)}
          unit="%"
          delta={engDelta}
          deltaLabel="vs prior period"
          isMonospace
        />
        <KPICard
          label="Avg Reach"
          value={`${(avgReach / 1000).toFixed(1)}K`}
          delta={reachDelta}
          deltaLabel="vs prior period"
          isMonospace
        />
        <KPICard
          label="Best Post"
          value="Reel"
          deltaLabel="3 days ago"
          isMonospace={false}
        />
      </div>

      {/* Chart section */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
        {/* Range tabs + metric toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          {/* Range tabs */}
          <div className="inline-flex items-center gap-1 bg-[#0A0A0A] border border-[#262626] rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={[
                  'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                  range === r
                    ? 'bg-[#262626] text-[#FAFAFA]'
                    : 'text-[#737373] hover:text-[#FAFAFA]',
                ].join(' ')}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Metric toggle */}
          <div className="inline-flex items-center gap-1 bg-[#0A0A0A] border border-[#262626] rounded-lg p-1">
            <button
              onClick={() => setActiveMetric('engagement_rate')}
              className={[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                activeMetric === 'engagement_rate'
                  ? 'bg-[#262626] text-[#FAFAFA]'
                  : 'text-[#737373] hover:text-[#FAFAFA]',
              ].join(' ')}
            >
              Engagement Rate
            </button>
            <button
              onClick={() => setActiveMetric('follower_count')}
              className={[
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                activeMetric === 'follower_count'
                  ? 'bg-[#262626] text-[#FAFAFA]'
                  : 'text-[#737373] hover:text-[#FAFAFA]',
              ].join(' ')}
            >
              Followers
            </button>
          </div>
        </div>

        <EngagementChart data={data} activeMetric={activeMetric} range={range} />
      </div>

      {/* Bottom row: alerts + rate intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertConfig
          creatorId={creatorId}
          alerts={alerts}
          onSave={(updated) => setAlerts(updated)}
        />

        {/* Rate Intelligence */}
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-medium text-[#FAFAFA]">Rate Intelligence</h2>
              <p className="text-xs text-[#737373] mt-0.5">
                India-benchmarked brand deal rates
              </p>
            </div>
            <span className="text-xs text-[#737373] border border-[#262626] rounded px-2 py-0.5">
              ±20% estimate
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Feed Post', value: rateCard.post_min, max: rateCard.post_max },
              { label: 'Story Set (3 stories)', value: rateCard.story_min, max: rateCard.story_max },
              { label: 'Reel', value: rateCard.reel_min, max: rateCard.reel_max },
            ].map(({ label, value, max }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b border-[#262626] last:border-0"
              >
                <span className="text-sm text-[#737373]">{label}</span>
                <span className="font-mono text-sm font-semibold text-[#FAFAFA]">
                  {formatINR(value)} – {formatINR(max)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between bg-[#0A0A0A] border border-[#262626] rounded-lg px-3 py-2">
            <span className="text-xs text-[#737373]">Rate range</span>
            <span className="font-mono text-sm text-[#FAFAFA] font-medium">
              {formatINR(rateCard.story_min)} – {formatINR(rateCard.reel_max)}/post
            </span>
          </div>

          <p className="text-xs text-[#737373] mt-4 leading-relaxed">
            Benchmarks for Indian creator market. Actual rates vary by niche,
            audience quality, and deliverables.
          </p>
        </div>
      </div>
    </div>
  )
}
