/**
 * Instagram client for CreatorPulse.
 *
 * Currently uses a deterministic mock for development (no API keys needed).
 * When the Instagram Basic Display API / Graph API credentials are available,
 * replace the mock body in `fetchPublicProfile` with a real HTTP call to:
 *   GET https://graph.instagram.com/v18.0/{ig-user-id}
 *       ?fields=id,username,name,biography,followers_count,follows_count,
 *               media_count,profile_picture_url,website
 *       &access_token={USER_ACCESS_TOKEN}
 *
 * For scrape-based public lookups (before OAuth), consider the unofficial
 * endpoint pattern documented in the project ARCH.md.
 */

export interface InstagramProfile {
  id: string
  username: string
  name: string
  biography: string
  followers_count: number
  follows_count: number
  media_count: number
  profile_picture_url: string
  website: string
}

export interface PublicProfileData {
  name: string
  bio: string
  follower_count: number
  following_count: number
  post_count: number
  engagement_rate: number
  avg_reach: number
  profile_pic_url: string
}

export interface MediaInsights {
  reach: number
  impressions: number
  engagement: number
  saved: number
}

// ---------------------------------------------------------------------------
// Deterministic mock helpers
// ---------------------------------------------------------------------------

/**
 * Simple djb2-style hash that returns a stable integer for a given string.
 * Same handle always produces the same seed across calls/environments.
 */
function hashHandle(handle: string): number {
  let hash = 5381
  for (let i = 0; i < handle.length; i++) {
    hash = ((hash << 5) + hash) ^ handle.charCodeAt(i)
  }
  // Force unsigned 32-bit integer
  return hash >>> 0
}

/**
 * Returns a pseudo-random float in [0, 1) seeded by the given integer.
 * Uses an LCG step so successive calls with (seed+1), (seed+2), … give
 * different but stable values.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

/** Pick a value from an array deterministically based on a seed. */
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// Realistic Indian creator profile pools
const INDIAN_NAMES = [
  'Priya Sharma', 'Rahul Gupta', 'Ananya Patel', 'Vikram Singh',
  'Meera Nair', 'Arjun Mehta', 'Deepika Reddy', 'Kiran Joshi',
  'Simran Kaur', 'Rohan Desai', 'Pooja Iyer', 'Nikhil Verma',
  'Ritika Agarwal', 'Sahil Khan', 'Sneha Pillai', 'Aditya Rao',
  'Kavya Menon', 'Tushar Malhotra', 'Ishita Bhatt', 'Manish Tiwari',
]

const NICHES = ['fashion', 'food', 'tech', 'fitness', 'travel', 'beauty', 'finance', 'gaming']

const BIOS: Record<string, string[]> = {
  fashion: [
    'Styling the everyday Indian wardrobe ✨ | Sustainable fashion advocate | DMs open for collabs',
    'Fashion content creator | Street style meets ethnic fusion | Mumbai 🇮🇳',
    'Outfit inspo for real bodies | Plus-size fashion | Brand inquiries: mail me',
  ],
  food: [
    'Home chef & food storyteller | Regional Indian cuisine | Instagram recipes daily 🍛',
    'Street food explorer | From chaat to fine dining | Foodie in Delhi NCR',
    'Plant-based Indian cooking | Healthy twists on desi classics | Recipe ebook link below',
  ],
  tech: [
    'Tech reviews in Hindi & English | Budget flagship picks | YouTube engineer by day',
    'Gadget unboxer | Honest reviews, no BS | Covering Indian tech market since 2019',
    'App developer + creator | Building in public | Follow my SaaS journey',
  ],
  fitness: [
    'Certified personal trainer 💪 | Home workout routines | Nutrition tips for Indians',
    'Powerlifter & coach | Breaking fitness myths | DM for custom plans',
    'Running & calisthenics | From couch to 10K | Beginner-friendly content',
  ],
  travel: [
    'Exploring India one state at a time 🗺️ | Budget travel tips | 28 states done!',
    'Solo backpacker | Southeast Asia & Indian subcontinent | Visa guides & itineraries',
    'Luxury travel on a mid-range budget | Hotel reviews | Weekend getaway ideas',
  ],
  beauty: [
    'Makeup artist & beauty creator | Indian skin tones represented | Tutorials weekly',
    'Skincare minimalist | Dermatologist-approved routines | No filler, just science',
    'Nail art & beauty hacks | Affordable dupes | Mumbai-based MUA',
  ],
  finance: [
    'Personal finance educator | Mutual funds, SIP & tax explained simply | CA by training',
    'Stock market content | Fundamental analysis | Not SEBI registered — DYOR',
    'FIRE journey in India 🔥 | Early retirement planning | Tracking monthly expenses publicly',
  ],
  gaming: [
    'BGMI & Valorant content | Tips for Indian servers | Tournament highlights',
    'Retro gaming & reviews | PlayStation + PC | Gaming on Indian budget',
    'Game dev & gaming creator | Indie games spotlight | Made in India 🕹️',
  ],
}

function buildBio(niche: string, seed: number): string {
  const pool = BIOS[niche] ?? BIOS['food']
  return pool[seed % pool.length]
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches a public Instagram profile by handle.
 *
 * MOCK IMPLEMENTATION — returns deterministic plausible data based on the
 * handle string so the same handle always returns the same numbers.
 *
 * TODO: Replace this mock body with a real API call once credentials exist:
 *   const res = await fetch(
 *     `https://graph.instagram.com/v18.0/me?fields=id,username,...&access_token=${token}`
 *   )
 *   const data = await res.json()
 *   // map data fields to PublicProfileData
 */
export async function fetchPublicProfile(handle: string): Promise<PublicProfileData | null> {
  // Simulate a short network delay (remove in production)
  await new Promise<void>((resolve) => setTimeout(resolve, 50))

  const seed = hashHandle(handle.toLowerCase())

  const r0 = seededRandom(seed)
  const r1 = seededRandom(seed + 1)
  const r2 = seededRandom(seed + 2)
  const r3 = seededRandom(seed + 3)
  const r4 = seededRandom(seed + 4)

  const niche = pick(NICHES, seed)
  const name = pick(INDIAN_NAMES, seed + 7)
  const bio = buildBio(niche, seed + 3)

  // Follower range: 5K – 2M (log-scaled to skew toward micro-creators)
  const follower_count = Math.round(5000 + r0 * 995000 * (1 + r1 * 1.2))
  // Following is much smaller
  const following_count = Math.round(200 + r2 * 2800)
  // Posts: 40 – 600
  const post_count = Math.round(40 + r3 * 560)
  // Engagement rate: 1.5% – 8% (higher for smaller accounts)
  const engagement_rate = parseFloat(
    (1.5 + r4 * 6.5 * (1 - Math.min(follower_count / 1_000_000, 0.8))).toFixed(2)
  )
  // Avg reach: 10–40% of followers
  const reach_rate = 0.10 + seededRandom(seed + 5) * 0.30
  const avg_reach = Math.round(follower_count * reach_rate)
  // Avg impressions: 1.2–1.8x of reach
  const impressions_mult = 1.2 + seededRandom(seed + 6) * 0.6
  const avg_impressions_approx = Math.round(avg_reach * impressions_mult)
  void avg_impressions_approx // included in returned object below for consistency

  const profile_pic_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(handle)}`

  return {
    name,
    bio,
    follower_count,
    following_count,
    post_count,
    engagement_rate,
    avg_reach,
    profile_pic_url,
  }
}

/**
 * Fetches creator metrics using a real Instagram Graph API access token.
 * Requires a Business or Creator account with the instagram_manage_insights permission.
 *
 * TODO: Implement once OAuth flow is complete.
 *   GET https://graph.instagram.com/v18.0/{igUserId}/insights
 *       ?metric=follower_count,reach,impressions
 *       &period=day
 *       &access_token={accessToken}
 */
export async function fetchCreatorMetrics(
  accessToken: string,
  creatorId: string
): Promise<MediaInsights | null> {
  // TODO: Replace with real Graph API call
  void accessToken
  void creatorId
  return null
}

/**
 * Exchanges a short-lived auth code for a long-lived Instagram access token.
 *
 * TODO: Implement OAuth token exchange:
 *   POST https://api.instagram.com/oauth/access_token
 *   with client_id, client_secret, grant_type, redirect_uri, code
 */
export async function exchangeCodeForToken(code: string): Promise<string | null> {
  // TODO: implement
  void code
  return null
}
