import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import Badge from '@/components/ui/Badge'
import RateCard from '@/components/mediakit/RateCard'
import { type Creator, type CreatorMetrics } from '@/lib/types'
import { type RateCard as RateCardType } from '@/lib/rates'

interface MediaKitCardProps {
  creator: Creator
  metrics: CreatorMetrics
  rates?: RateCardType          // optional — only if creator enabled it
  showWatermark?: boolean       // "Powered by CreatorPulse"
  lastSynced: string            // ISO date string
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

function formatEngagement(er: number): string {
  // er is stored as decimal (0.042) or percentage (4.2) — normalise
  const pct = er > 1 ? er : er * 100
  return `${pct.toFixed(1)}%`
}

function formatAvgReach(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

/**
 * Audience Quality Score (0–100)
 * Factors: engagement rate, follower sweet-spot, post count.
 */
function calcAudienceScore(metrics: CreatorMetrics): number {
  const er = metrics.engagement_rate > 1
    ? metrics.engagement_rate / 100
    : metrics.engagement_rate

  let score = 0

  // Engagement rate
  if (er > 0.05) score += 30
  else if (er > 0.03) score += 20
  else if (er > 0.01) score += 10

  // Follower band
  const f = metrics.follower_count
  if (f >= 10_000 && f < 100_000) score += 25        // sweet spot
  else if (f >= 100_000 && f < 500_000) score += 20
  else if (f >= 500_000) score += 15
  else score += 10                                    // <10K

  // Post count
  if (metrics.post_count > 100) score += 15
  else if (metrics.post_count > 50) score += 10
  else if (metrics.post_count > 20) score += 5

  return Math.min(score, 100)
}

function platformLabel(p: Creator['platform']): string {
  if (p === 'instagram') return 'Instagram'
  if (p === 'youtube') return 'YouTube'
  return 'TikTok'
}

export default function MediaKitCard({
  creator,
  metrics,
  rates,
  showWatermark = true,
  lastSynced,
}: MediaKitCardProps) {
  const audienceScore = calcAudienceScore(metrics)
  const scoreWidth = `${audienceScore}%`

  const er = metrics.engagement_rate > 1
    ? metrics.engagement_rate / 100
    : metrics.engagement_rate

  let lastSyncedLabel = 'recently'
  try {
    lastSyncedLabel = formatDistanceToNow(new Date(lastSynced), { addSuffix: true })
  } catch {
    // ignore bad dates
  }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden">
      {/* ── Profile header ── */}
      <div className="p-6 flex items-start gap-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          {creator.profile_pic_url ? (
            <Image
              src={creator.profile_pic_url}
              alt={creator.name}
              fill
              className="rounded-full object-cover"
              sizes="64px"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-[#262626] flex items-center justify-center text-[#737373] text-xl font-semibold">
              {creator.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold text-[#FAFAFA] truncate">
              @{creator.handle}
            </h1>
            <Badge variant="platform" platform={creator.platform}>
              {platformLabel(creator.platform)}
            </Badge>
            {creator.niche && (
              <Badge variant="niche">
                {creator.niche}
              </Badge>
            )}
          </div>
          {creator.bio && (
            <p className="text-sm text-[#737373] mt-1 line-clamp-2 leading-relaxed">
              {creator.bio}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-[#262626]" />

      {/* ── Metrics row ── */}
      <div className="px-6 py-5 grid grid-cols-4 gap-2">
        {[
          { label: 'Followers', value: formatFollowers(metrics.follower_count) },
          { label: 'Eng. Rate', value: formatEngagement(er) },
          { label: 'Avg Reach', value: formatAvgReach(metrics.avg_reach) },
          { label: 'Posts', value: String(metrics.post_count) },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-mono text-xl font-semibold text-[#FAFAFA]">
              {value}
            </p>
            <p className="text-xs text-[#737373] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#262626]" />

      {/* ── Audience Quality Score ── */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#737373]">Audience Quality Score</span>
          <span className="font-mono text-sm font-semibold text-[#FAFAFA]">
            {audienceScore}
            <span className="text-[#737373] font-normal">/100</span>
          </span>
        </div>
        <div className="h-2 bg-[#262626] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#3B82F6] transition-all"
            style={{ width: scoreWidth }}
          />
        </div>
      </div>

      {/* ── Rate card (optional) ── */}
      {rates && (
        <>
          <div className="border-t border-[#262626]" />
          <div className="p-6">
            <RateCard rates={rates} showOnMediaKit={true} />
          </div>
        </>
      )}

      <div className="border-t border-[#262626]" />

      {/* ── Footer ── */}
      <div className="px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-[#737373]">
          Last updated {lastSyncedLabel}
        </span>
        {showWatermark && (
          <span className="text-xs text-[#737373]">
            Powered by{' '}
            <span className="text-[#3B82F6] font-medium">CreatorPulse</span>
          </span>
        )}
      </div>
    </div>
  )
}
