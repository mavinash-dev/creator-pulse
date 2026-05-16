/**
 * Rate benchmarking logic for Indian creators.
 * Calculates suggested brand deal rates (INR) based on follower count,
 * engagement rate, niche, and platform benchmarks.
 * TODO: Calibrate coefficients against real market data.
 */

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

export interface RateCard {
  /** Estimated rate for a single feed post (INR) */
  feedPost: number
  /** Estimated rate for a story set (INR) */
  storySet: number
  /** Estimated rate for a reel (INR) */
  reel: number
  /** Estimated rate for a dedicated YouTube video (INR) */
  dedicatedVideo: number | null
  /** Confidence band: ± percentage */
  confidence: number
}

/**
 * Niche multipliers relative to baseline.
 * Finance and tech command premium rates; food and travel are mid-tier.
 */
const NICHE_MULTIPLIERS: Record<Niche, number> = {
  finance: 1.5,
  tech: 1.4,
  fitness: 1.2,
  beauty: 1.2,
  fashion: 1.1,
  travel: 1.0,
  food: 0.9,
  gaming: 0.85,
  other: 1.0,
}

/**
 * Calculates a suggested rate card for a creator.
 * Uses CPM-style pricing: followers * engagement multiplier * niche factor.
 * TODO: Replace with ML model trained on actual brand deal data.
 */
export function calculateRateCard(
  followerCount: number,
  engagementRate: number,
  niche: Niche,
  platform: 'instagram' | 'youtube' | 'tiktok' = 'instagram'
): RateCard {
  const nicheMultiplier = NICHE_MULTIPLIERS[niche]

  // Base CPM in INR (cost per thousand followers, engagement-adjusted)
  const baseCPM = 80
  const engagementBonus = Math.min(engagementRate / 3, 2) // cap at 2x
  const adjustedCPM = baseCPM * engagementBonus * nicheMultiplier

  const base = (followerCount / 1000) * adjustedCPM

  const feedPost = Math.round(base)
  const storySet = Math.round(base * 0.4)
  const reel = Math.round(base * 1.5)
  const dedicatedVideo = platform === 'youtube' ? Math.round(base * 3) : null

  return {
    feedPost,
    storySet,
    reel,
    dedicatedVideo,
    confidence: 20, // ± 20% until we have real training data
  }
}

/**
 * Formats an INR value as a human-readable string (e.g., ₹12,500 or ₹1.2L).
 */
export function formatINR(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}
