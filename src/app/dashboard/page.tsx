import KPICard from '@/components/dashboard/KPICard'
import EngagementChart from '@/components/dashboard/EngagementChart'
import AlertConfig from '@/components/dashboard/AlertConfig'

export const metadata = {
  title: 'Dashboard — CreatorPulse',
}

// TODO: Fetch real data for the authenticated user from Supabase
const MOCK_METRICS = {
  followers: 142800,
  followerDelta: 3.2,
  engagementRate: 4.8,
  engagementDelta: -0.6,
  avgReach: 31200,
  reachDelta: 1.1,
  postCount: 312,
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-1 text-sm">
          Last synced: a few moments ago
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Followers"
          value={MOCK_METRICS.followers.toLocaleString('en-IN')}
          delta={MOCK_METRICS.followerDelta}
          suffix=""
        />
        <KPICard
          label="Engagement Rate"
          value={MOCK_METRICS.engagementRate.toFixed(1)}
          delta={MOCK_METRICS.engagementDelta}
          suffix="%"
        />
        <KPICard
          label="Avg. Reach"
          value={MOCK_METRICS.avgReach.toLocaleString('en-IN')}
          delta={MOCK_METRICS.reachDelta}
          suffix=""
        />
        <KPICard
          label="Total Posts"
          value={String(MOCK_METRICS.postCount)}
          delta={0}
          suffix=""
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EngagementChart />
      </div>

      {/* Alerts */}
      <AlertConfig />
    </div>
  )
}
