export interface Creator {
  id: string
  handle: string
  platform: 'instagram' | 'youtube' | 'tiktok'
  name: string
  bio: string
  niche: string
  profile_pic_url: string
  created_at: string
  last_synced_at: string
}

export interface CreatorMetrics {
  id: string
  creator_id: string
  recorded_at: string
  follower_count: number
  following_count: number
  post_count: number
  engagement_rate: number
  avg_reach: number
  avg_impressions: number
}

export interface Alert {
  id: string
  creator_id: string
  type: 'engagement_drop' | 'follower_stall' | 'post_spike'
  threshold: number
  email: string
  is_active: boolean
  last_triggered_at: string | null
}

export interface MediaKit {
  id: string
  creator_id: string
  slug: string
  is_public: boolean
  custom_domain: string | null
  watermark_enabled: boolean
}
