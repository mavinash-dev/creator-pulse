import { NextRequest, NextResponse } from 'next/server'
import { fetchPublicProfile } from '@/lib/instagram'
import { supabaseAdmin } from '@/lib/supabase'
import type { Creator, CreatorMetrics, MediaKit } from '@/lib/types'

/**
 * POST /api/sync
 * Body: { handle: string, platform: string }
 *
 * Fetches public profile data, upserts the creator record, inserts a fresh
 * metrics snapshot, and creates a default media kit if one doesn't exist.
 * Returns { creator, metrics }.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    !('handle' in body) ||
    !('platform' in body)
  ) {
    return NextResponse.json(
      { error: 'Missing required fields: handle, platform' },
      { status: 400 }
    )
  }

  const { handle, platform } = body as { handle: string; platform: string }

  if (!handle || typeof handle !== 'string') {
    return NextResponse.json({ error: 'handle must be a non-empty string' }, { status: 400 })
  }

  const SUPPORTED_PLATFORMS = ['instagram', 'youtube', 'tiktok'] as const
  if (!SUPPORTED_PLATFORMS.includes(platform as (typeof SUPPORTED_PLATFORMS)[number])) {
    return NextResponse.json(
      { error: `platform must be one of: ${SUPPORTED_PLATFORMS.join(', ')}` },
      { status: 400 }
    )
  }

  // 1. Fetch public profile data (mock for now, swap in real API later)
  let profile: Awaited<ReturnType<typeof fetchPublicProfile>>
  try {
    profile = await fetchPublicProfile(handle)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 502 })
  }

  if (!profile) {
    return NextResponse.json(
      { error: `Creator @${handle} not found on ${platform}` },
      { status: 404 }
    )
  }

  // 2. Upsert creator record
  const { data: creatorRow, error: creatorError } = await supabaseAdmin
    .from('creators')
    .upsert(
      {
        handle: handle.toLowerCase(),
        platform,
        name: profile.name,
        bio: profile.bio,
        profile_pic_url: profile.profile_pic_url,
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: 'handle,platform', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (creatorError || !creatorRow) {
    console.error('[sync] creator upsert error', creatorError)
    return NextResponse.json({ error: 'Database error while saving creator' }, { status: 500 })
  }

  const creator = creatorRow as Creator

  // 3. Insert fresh metrics snapshot
  const { data: metricsRow, error: metricsError } = await supabaseAdmin
    .from('creator_metrics')
    .insert({
      creator_id: creator.id,
      recorded_at: new Date().toISOString(),
      follower_count: profile.follower_count,
      following_count: profile.following_count,
      post_count: profile.post_count,
      engagement_rate: profile.engagement_rate,
      avg_reach: profile.avg_reach,
      avg_impressions: Math.round(profile.avg_reach * 1.4), // estimated
    })
    .select()
    .single()

  if (metricsError || !metricsRow) {
    console.error('[sync] metrics insert error', metricsError)
    return NextResponse.json(
      { error: 'Database error while saving metrics' },
      { status: 500 }
    )
  }

  const metrics = metricsRow as CreatorMetrics

  // 4. Create default media kit if none exists yet
  const { data: existingKit } = await supabaseAdmin
    .from('media_kits')
    .select('id')
    .eq('creator_id', creator.id)
    .maybeSingle()

  let mediaKit: MediaKit | null = existingKit as MediaKit | null

  if (!existingKit) {
    const slug = `${handle.toLowerCase()}-${Date.now().toString(36)}`
    const { data: kitRow, error: kitError } = await supabaseAdmin
      .from('media_kits')
      .insert({
        creator_id: creator.id,
        slug,
        is_public: true,
        watermark_enabled: true,
      })
      .select()
      .single()

    if (kitError) {
      // Non-fatal: log but don't fail the sync
      console.error('[sync] media kit insert error', kitError)
    } else {
      mediaKit = kitRow as MediaKit
    }
  }

  return NextResponse.json(
    { creator, metrics, media_kit: mediaKit },
    { status: 200 }
  )
}

/**
 * GET /api/sync
 * Returns the last sync timestamp for a given creator.
 * Query params: ?handle=foo&platform=instagram
 */
export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle')
  const platform = req.nextUrl.searchParams.get('platform') ?? 'instagram'

  if (!handle) {
    return NextResponse.json({ error: 'Missing query param: handle' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('creators')
    .select('id, handle, platform, last_synced_at')
    .eq('handle', handle.toLowerCase())
    .eq('platform', platform)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ lastSyncedAt: null, status: 'never_synced' })
  }

  const creator = data as Pick<Creator, 'id' | 'handle' | 'platform' | 'last_synced_at'>

  return NextResponse.json({
    lastSyncedAt: creator.last_synced_at ?? null,
    status: creator.last_synced_at ? 'synced' : 'never_synced',
  })
}
