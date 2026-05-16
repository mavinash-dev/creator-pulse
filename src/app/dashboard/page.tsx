import DashboardClient from './DashboardClient'
import type { Alert } from '@/lib/types'

export const metadata = {
  title: 'Dashboard — CreatorPulse',
}

// Mock alert defaults (will come from DB later)
const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    creator_id: 'mock-creator',
    type: 'engagement_drop',
    threshold: 20,
    email: 'creator@example.com',
    is_active: true,
    last_triggered_at: null,
  },
  {
    id: '2',
    creator_id: 'mock-creator',
    type: 'follower_stall',
    threshold: 7,
    email: 'creator@example.com',
    is_active: false,
    last_triggered_at: null,
  },
  {
    id: '3',
    creator_id: 'mock-creator',
    type: 'post_spike',
    threshold: 50,
    email: 'creator@example.com',
    is_active: true,
    last_triggered_at: null,
  },
  {
    id: '4',
    creator_id: 'mock-creator',
    type: 'weekly_digest',
    threshold: 0,
    email: 'creator@example.com',
    is_active: true,
    last_triggered_at: null,
  },
]

export default function DashboardPage() {
  return (
    <DashboardClient
      creatorId="mock-creator"
      creatorHandle="@priya.creates"
      platform="instagram"
      lastSynced="2 minutes ago"
      initialAlerts={MOCK_ALERTS}
    />
  )
}
