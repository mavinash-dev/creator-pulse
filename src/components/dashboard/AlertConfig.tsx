'use client'

import { useState } from 'react'
import type { Alert } from '@/lib/types'

interface AlertConfigProps {
  creatorId: string
  alerts: Alert[]
  onSave: (alerts: Alert[]) => void
}

interface AlertRow {
  type: Alert['type']
  label: string
  description?: string
  hasSlider?: boolean
  sliderMin?: number
  sliderMax?: number
  sliderDefault?: number
  sliderUnit?: string
}

const ALERT_ROWS: AlertRow[] = [
  {
    type: 'engagement_drop',
    label: 'Engagement drop alert',
    hasSlider: true,
    sliderMin: 10,
    sliderMax: 50,
    sliderDefault: 20,
    sliderUnit: '%',
  },
  {
    type: 'follower_stall',
    label: 'Follower stall alert',
    description: 'Triggers if <0.1% growth in 7 days',
  },
  {
    type: 'post_spike',
    label: 'Post spike alert',
    description: 'Triggers when a post outperforms by 2×',
  },
  {
    type: 'weekly_digest',
    label: 'Weekly digest email',
  },
]

function buildInitialState(
  alertRows: AlertRow[],
  existingAlerts: Alert[],
  creatorId: string
): Alert[] {
  return alertRows.map((row) => {
    const existing = existingAlerts.find((a) => a.type === row.type)
    if (existing) return existing
    return {
      id: `local-${row.type}`,
      creator_id: creatorId,
      type: row.type,
      threshold: row.sliderDefault ?? 0,
      email: '',
      is_active: false,
      last_triggered_at: null,
    }
  })
}

export default function AlertConfig({ creatorId, alerts, onSave }: AlertConfigProps) {
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(() =>
    buildInitialState(ALERT_ROWS, alerts, creatorId)
  )
  const [saved, setSaved] = useState(false)

  function toggleAlert(type: Alert['type']) {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.type === type ? { ...a, is_active: !a.is_active } : a))
    )
    setSaved(false)
  }

  function setThreshold(type: Alert['type'], threshold: number) {
    setLocalAlerts((prev) =>
      prev.map((a) => (a.type === type ? { ...a, threshold } : a))
    )
    setSaved(false)
  }

  function handleSave() {
    onSave(localAlerts)
    setSaved(true)
  }

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-lg p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-medium text-[#FAFAFA]">Alert Configuration</h2>
          <p className="text-xs text-[#737373] mt-0.5">
            Get notified when your metrics move
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {ALERT_ROWS.map((row) => {
          const alert = localAlerts.find((a) => a.type === row.type)!

          return (
            <div
              key={row.type}
              className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#FAFAFA]">{row.label}</p>
                  {row.description && (
                    <p className="text-xs text-[#737373] mt-0.5">{row.description}</p>
                  )}

                  {row.hasSlider && alert.is_active && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#737373]">Threshold</span>
                        <span className="text-xs font-mono text-[#FAFAFA]">
                          {alert.threshold}{row.sliderUnit ?? ''}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={row.sliderMin}
                        max={row.sliderMax}
                        value={alert.threshold}
                        onChange={(e) =>
                          setThreshold(row.type, Number(e.target.value))
                        }
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                            (((alert.threshold ?? row.sliderDefault ?? 20) - (row.sliderMin ?? 10)) /
                              ((row.sliderMax ?? 50) - (row.sliderMin ?? 10))) *
                            100
                          }%, #262626 ${
                            (((alert.threshold ?? row.sliderDefault ?? 20) - (row.sliderMin ?? 10)) /
                              ((row.sliderMax ?? 50) - (row.sliderMin ?? 10))) *
                            100
                          }%, #262626 100%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-[#737373]">{row.sliderMin}{row.sliderUnit}</span>
                        <span className="text-xs text-[#737373]">{row.sliderMax}{row.sliderUnit}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleAlert(row.type)}
                  aria-label={`Toggle ${row.label}`}
                  aria-checked={alert.is_active}
                  role="switch"
                  className={[
                    'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent',
                    'transition-colors duration-200 ease-in-out',
                    'focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-1 focus:ring-offset-[#0A0A0A]',
                    alert.is_active ? 'bg-[#3B82F6]' : 'bg-[#262626]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow',
                      'transform transition-transform duration-200 ease-in-out',
                      alert.is_active ? 'translate-x-4' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        {saved && (
          <p className="text-xs text-[#22C55E]">Saved successfully</p>
        )}
        {!saved && <div />}
        <button
          onClick={handleSave}
          className="bg-[#3B82F6] hover:bg-blue-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          Save alerts
        </button>
      </div>
    </div>
  )
}
