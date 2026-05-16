'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import type { Alert } from '@/lib/types'

// TODO: Replace with real data fetched from /api/alerts
const MOCK_ALERTS: Omit<Alert, 'creator_id' | 'last_triggered_at'>[] = [
  {
    id: '1',
    type: 'engagement_drop',
    threshold: 20,
    email: 'you@example.com',
    is_active: true,
  },
  {
    id: '2',
    type: 'follower_stall',
    threshold: 7,
    email: 'you@example.com',
    is_active: false,
  },
  {
    id: '3',
    type: 'post_spike',
    threshold: 50,
    email: 'you@example.com',
    is_active: true,
  },
]

const ALERT_LABELS: Record<Alert['type'], string> = {
  engagement_drop: 'Engagement drop',
  follower_stall: 'Follower growth stall',
  post_spike: 'Post reach spike',
}

const ALERT_DESCRIPTIONS: Record<Alert['type'], string> = {
  engagement_drop: 'Alert when engagement rate drops by more than threshold %',
  follower_stall: 'Alert when no new followers in threshold days',
  post_spike: 'Alert when a post performs threshold % above your average',
}

export default function AlertConfig() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)

  function toggleAlert(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
    )
    // TODO: PATCH /api/alerts with updated is_active value
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-foreground">Alert Configuration</h2>
        <Button size="sm" variant="secondary" disabled>
          + Add alert
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 bg-background border border-border rounded-lg"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">
                  {ALERT_LABELS[alert.type]}
                </span>
                <Badge variant={alert.is_active ? 'active' : 'inactive'}>
                  {alert.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <p className="text-xs text-muted">
                {ALERT_DESCRIPTIONS[alert.type].replace(
                  'threshold',
                  String(alert.threshold)
                )}
              </p>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => toggleAlert(alert.id)}
              aria-label={`Toggle ${ALERT_LABELS[alert.type]}`}
              className={[
                'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background',
                alert.is_active ? 'bg-accent' : 'bg-border',
              ].join(' ')}
            >
              <span
                className={[
                  'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform',
                  alert.is_active ? 'translate-x-4' : 'translate-x-0',
                ].join(' ')}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
