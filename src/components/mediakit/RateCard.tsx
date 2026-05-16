import { formatINR } from '@/lib/rates'

interface RateCardProps {
  handle: string
  // TODO: Accept followerCount, engagementRate, niche, platform once data layer is ready
}

// TODO: Replace with real calculated rates once creator data is available
const PLACEHOLDER_RATES = {
  feedPost: 0,
  storySet: 0,
  reel: 0,
  dedicatedVideo: null as number | null,
  confidence: 20,
}

export default function RateCard({ handle }: RateCardProps) {
  void handle // used for future data fetching — TODO: pass to API call
  const rates = PLACEHOLDER_RATES

  const items = [
    { label: 'Feed Post', value: rates.feedPost },
    { label: 'Story Set (3 stories)', value: rates.storySet },
    { label: 'Reel', value: rates.reel },
    ...(rates.dedicatedVideo
      ? [{ label: 'Dedicated Video', value: rates.dedicatedVideo }]
      : []),
  ]

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-foreground">Suggested Brand Rates</h2>
        <span className="text-xs text-muted">±{rates.confidence}% estimate</span>
      </div>

      <div className="space-y-3">
        {items.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <span className="text-sm text-muted">{label}</span>
            <span className="font-metric font-semibold text-foreground">
              {value === 0 ? '—' : formatINR(value)}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mt-4">
        Rates are estimated benchmarks for Indian creator market (2024).
        Actual rates may vary by niche, audience quality, and deliverables.
      </p>
    </div>
  )
}
