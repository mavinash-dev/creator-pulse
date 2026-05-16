/**
 * Rate benchmarking logic for Indian creators.
 * Calculates suggested brand deal rates (INR) based on follower count,
 * engagement rate, niche, and platform benchmarks.
 */

export interface RateInput {
  follower_count: number
  engagement_rate: number // as decimal, e.g. 0.042 for 4.2%
  niche: string
  platform: 'instagram' | 'youtube' | 'tiktok'
}

export interface RateCard {
  post_min: number   // INR
  post_max: number   // INR
  story_min: number
  story_max: number
  reel_min: number
  reel_max: number
  collab_min: number // brand collab (3-post deal)
  collab_max: number
}

/** CPM base: ₹150 per 1000 followers */
const CPM_BASE = 150

/** Engagement rate multipliers */
function getEngagementMultiplier(er: number): number {
  if (er > 0.08) return 2.0
  if (er > 0.05) return 1.5
  if (er > 0.03) return 1.2
  return 1.0
}

/** Niche multipliers over base */
function getNicheMultiplier(niche: string): number {
  const normalized = niche.toLowerCase().trim()
  if (['finance', 'tech', 'business'].includes(normalized)) return 2.0
  if (['fitness', 'health'].includes(normalized)) return 1.6
  if (['fashion', 'beauty', 'lifestyle'].includes(normalized)) return 1.3
  if (['food', 'travel'].includes(normalized)) return 1.2
  if (['entertainment', 'memes'].includes(normalized)) return 0.9
  return 1.0
}

export function calculateRates(input: RateInput): RateCard {
  const { follower_count, engagement_rate, niche } = input

  const engagementMultiplier = getEngagementMultiplier(engagement_rate)
  const nicheMultiplier = getNicheMultiplier(niche)

  // Base rate per post = (follower_count / 1000) * CPM_rate
  const basePost = (follower_count / 1000) * CPM_BASE * engagementMultiplier * nicheMultiplier

  const postBase = Math.round(basePost)
  const storyBase = Math.round(basePost * 0.4)
  const reelBase = Math.round(basePost * 1.5)
  const collabBase = Math.round(basePost * 2.5)

  // Min/max = base ± 20%
  return {
    post_min: Math.round(postBase * 0.8),
    post_max: Math.round(postBase * 1.2),
    story_min: Math.round(storyBase * 0.8),
    story_max: Math.round(storyBase * 1.2),
    reel_min: Math.round(reelBase * 0.8),
    reel_max: Math.round(reelBase * 1.2),
    collab_min: Math.round(collabBase * 0.8),
    collab_max: Math.round(collabBase * 1.2),
  }
}

// ---------------------------------------------------------------------------
// Legacy shim — used by DashboardClient
// ---------------------------------------------------------------------------

/**
 * @deprecated Use `calculateRates` with `RateInput` instead.
 * Kept for DashboardClient compatibility. Will be removed once that
 * component is migrated to the new `RateCard` interface.
 */
export interface LegacyRateCard {
  feedPost: number
  storySet: number
  reel: number
  dedicatedVideo: number | null
  confidence: number
}

export type Niche =
  | 'fashion'
  | 'food'
  | 'travel'
  | 'tech'
  | 'fitness'
  | 'beauty'
  | 'finance'
  | 'gaming'
  | 'other'

/** @deprecated Use `calculateRates` instead. */
export function calculateRateCard(
  followerCount: number,
  engagementRate: number,
  niche: Niche,
  platform: 'instagram' | 'youtube' | 'tiktok' = 'instagram'
): LegacyRateCard {
  const card = calculateRates({
    follower_count: followerCount,
    engagement_rate: engagementRate > 1 ? engagementRate / 100 : engagementRate,
    niche,
    platform,
  })

  return {
    feedPost: Math.round((card.post_min + card.post_max) / 2),
    storySet: Math.round((card.story_min + card.story_max) / 2),
    reel: Math.round((card.reel_min + card.reel_max) / 2),
    dedicatedVideo: platform === 'youtube' ? Math.round((card.collab_min + card.collab_max) / 2) : null,
    confidence: 20,
  }
}

/**
 * Formats an INR value as a human-readable string.
 * e.g. 8000 → "₹8,000", 150000 → "₹1.5L"
 */
export function formatINR(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${amount.toLocaleString('en-IN')}`
  }
  return `₹${amount}`
}
