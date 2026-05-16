import type { Metadata } from 'next'
import Link from 'next/link'
import MediaKitCard from '@/components/mediakit/MediaKitCard'
import { calculateRates } from '@/lib/rates'
import type { Creator, CreatorMetrics } from '@/lib/types'

interface PageProps {
  params: Promise<{ handle: string }>
}

// ── Deterministic mock helpers ────────────────────────────────────────────────

/** Simple djb2 hash → stable unsigned integer from a string */
function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i)
  }
  return h >>> 0 // unsigned 32-bit
}

/** Seeded pseudo-random float [0, 1) derived from a hash */
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

/** Pick an element from an array, deterministically by index */
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRand(seed) * arr.length)]
}

const NICHES = ['fashion', 'fitness', 'food', 'tech', 'travel', 'finance', 'beauty', 'lifestyle', 'entertainment', 'business']
const PLATFORMS: Creator['platform'][] = ['instagram', 'youtube', 'tiktok']

const BIOS: Record<string, string> = {
  fashion: 'Styling everyday looks for real people. OOTDs, hauls & honest reviews.',
  fitness: 'Strength coach & nutrition nerd. Helping you build sustainable habits.',
  food: 'Home cook turned recipe creator. Street food enthusiast from Mumbai.',
  tech: 'Breaking down complex tech into simple explainers. Gadgets & software.',
  travel: 'Exploring India one city at a time. Budget travel tips & hidden gems.',
  finance: 'Making personal finance simple for millennials. SIPs, stocks & more.',
  beauty: 'Clean beauty advocate. Skincare routines, honest product reviews.',
  lifestyle: 'Documenting life in Bangalore. Coffee, minimalism & good vibes.',
  entertainment: 'Comedy sketches & pop culture takes. Here for the laughs.',
  business: 'Founder stories & startup lessons from the Indian ecosystem.',
}

function generateMockData(handle: string): { creator: Creator; metrics: CreatorMetrics } {
  const h = hashString(handle)

  const niche = pick(NICHES, h)
  const platform = pick(PLATFORMS, h + 7)

  const followerBase = 5000 + Math.floor(seededRand(h + 1) * 495000)
  const follower_count = followerBase
  const er = 0.01 + seededRand(h + 2) * 0.09          // 1%–10%
  const post_count = 20 + Math.floor(seededRand(h + 3) * 480)
  const avg_reach = Math.floor(follower_count * (0.1 + seededRand(h + 4) * 0.4))
  const avg_impressions = Math.floor(avg_reach * (1.2 + seededRand(h + 5) * 1.8))

  const creator: Creator = {
    id: `mock-${handle}`,
    handle,
    platform,
    name: handle
      .replace(/[_.-]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    bio: BIOS[niche] ?? 'Content creator & storyteller.',
    niche,
    profile_pic_url: '',
    user_id: null,
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    last_synced_at: new Date(Date.now() - Math.floor(seededRand(h + 6) * 3600 * 1000 * 24)).toISOString(),
  }

  const metrics: CreatorMetrics = {
    id: `mock-metrics-${handle}`,
    creator_id: creator.id,
    recorded_at: creator.last_synced_at,
    follower_count,
    following_count: Math.floor(follower_count * (0.1 + seededRand(h + 8) * 2)),
    post_count,
    engagement_rate: er,
    avg_reach,
    avg_impressions,
  }

  return { creator, metrics }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const { metrics } = generateMockData(handle)
  const followers = metrics.follower_count >= 1000
    ? `${(metrics.follower_count / 1000).toFixed(0)}K`
    : String(metrics.follower_count)
  const er = ((metrics.engagement_rate > 1 ? metrics.engagement_rate : metrics.engagement_rate * 100)).toFixed(1)

  return {
    title: `@${handle} | CreatorPulse`,
    description: `${followers} followers • ${er}% engagement rate • View live stats`,
    openGraph: {
      title: `@${handle} | CreatorPulse`,
      description: `${followers} followers • ${er}% engagement rate • View live stats`,
      images: [{ url: '/og-placeholder.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `@${handle} | CreatorPulse`,
      description: `${followers} followers • ${er}% engagement rate • View live stats`,
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MediaKitPage({ params }: PageProps) {
  const { handle } = await params
  const { creator, metrics } = generateMockData(handle)

  const rates = calculateRates({
    follower_count: metrics.follower_count,
    engagement_rate: metrics.engagement_rate > 1
      ? metrics.engagement_rate / 100
      : metrics.engagement_rate,
    niche: creator.niche,
    platform: creator.platform,
  })

  return (
    <main className="min-h-screen bg-[#0A0A0A] py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Back nav */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#737373] hover:text-[#FAFAFA] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to CreatorPulse
          </Link>
        </div>

        {/* Media kit card */}
        <MediaKitCard
          creator={creator}
          metrics={metrics}
          rates={rates}
          showWatermark={true}
          lastSynced={creator.last_synced_at}
        />

        {/* CTA */}
        <div className="text-center py-6 border border-[#262626] rounded-2xl bg-[#141414] px-6">
          <p className="text-sm text-[#737373] mb-3">
            Want your own live media kit like this?
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            Join CreatorPulse free
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </main>
  )
}
