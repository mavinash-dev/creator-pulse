'use client'

import { useState } from 'react'
import { type RateCard, formatINR } from '@/lib/rates'

interface RateCardProps {
  rates: RateCard
  showOnMediaKit?: boolean // if false, show "Add to media kit" toggle
}

const RATE_ROWS: { label: string; minKey: keyof RateCard; maxKey: keyof RateCard }[] = [
  { label: 'Post', minKey: 'post_min', maxKey: 'post_max' },
  { label: 'Story', minKey: 'story_min', maxKey: 'story_max' },
  { label: 'Reel', minKey: 'reel_min', maxKey: 'reel_max' },
  { label: 'Brand Collab (3-post deal)', minKey: 'collab_min', maxKey: 'collab_max' },
]

export default function RateCard({ rates, showOnMediaKit = true }: RateCardProps) {
  const [visible, setVisible] = useState(showOnMediaKit)

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-[#FAFAFA]">
          What should you charge?
        </h2>
        {!showOnMediaKit && (
          <button
            onClick={() => setVisible((v) => !v)}
            className={[
              'text-xs font-medium px-3 py-1.5 rounded-lg border transition',
              visible
                ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 hover:bg-[#3B82F6]/30'
                : 'bg-[#262626] text-[#737373] border-[#262626] hover:bg-[#1a1a1a]',
            ].join(' ')}
          >
            {visible ? 'Hide from media kit' : 'Show on media kit'}
          </button>
        )}
      </div>

      {visible ? (
        <>
          {/* Rate rows */}
          <div className="space-y-0 divide-y divide-[#262626]">
            {RATE_ROWS.map(({ label, minKey, maxKey }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3"
              >
                <span className="text-sm text-[#737373]">{label}</span>
                <span className="font-mono text-sm font-semibold text-[#22C55E]">
                  {formatINR(rates[minKey] as number)}
                  {' – '}
                  {formatINR(rates[maxKey] as number)}
                </span>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-[#737373] mt-4 leading-relaxed">
            Based on India market benchmarks. Use as a guide.
          </p>
        </>
      ) : (
        <p className="text-sm text-[#737373] py-2">
          Rate benchmarks are hidden from your public media kit.
        </p>
      )}
    </div>
  )
}
