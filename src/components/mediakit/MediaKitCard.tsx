import Badge from '@/components/ui/Badge'

interface MediaKitCardProps {
  handle: string
  // TODO: Accept a full Creator + CreatorMetrics object once data layer is ready
}

export default function MediaKitCard({ handle }: MediaKitCardProps) {
  // TODO: Replace with real creator data from props/fetch

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        {/* Avatar placeholder */}
        <div className="h-16 w-16 rounded-full bg-border flex-shrink-0" />

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">@{handle}</h1>
            <Badge variant="instagram">Instagram</Badge>
          </div>
          <p className="text-sm text-muted">
            Niche / bio will appear here once connected.
          </p>
        </div>
      </div>

      {/* Metric row */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Followers', value: '—' },
          { label: 'Engagement', value: '—' },
          { label: 'Avg. Reach', value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="font-metric text-2xl font-semibold text-foreground">
              {value}
            </p>
            <p className="text-xs text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* TODO: Add recent posts grid, niche tags, audience demographics */}
    </div>
  )
}
