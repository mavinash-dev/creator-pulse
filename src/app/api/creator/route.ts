import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Creator, CreatorMetrics } from '@/lib/types'

/**
 * GET /api/creator
 * Query params: ?handle=foo&platform=instagram
 *
 * Returns the creator record and last 30 days of metrics.
 */
export async function GET(req: NextRequest) {
  const handle = req.nextUrl.searchParams.get('handle')
  const platform = req.nextUrl.searchParams.get('platform') ?? 'instagram'

  if (!handle) {
    return NextResponse.json({ error: 'Missing query param: handle' }, { status: 400 })
  }

  const { data: creator, error: creatorError } = await supabaseAdmin
    .from('creators')
    .select('*')
    .eq('handle', handle.toLowerCase())
    .eq('platform', platform)
    .maybeSingle()

  if (creatorError) {
    console.error('[creator GET] db error', creatorError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!creator) {
    return NextResponse.json(
      { error: `Creator @${handle} not found on ${platform}` },
      { status: 404 }
    )
  }

  // Fetch last 30 days of metrics
  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data: metrics, error: metricsError } = await supabaseAdmin
    .from('creator_metrics')
    .select('*')
    .eq('creator_id', (creator as Creator).id)
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: false })

  if (metricsError) {
    console.error('[creator GET] metrics db error', metricsError)
    return NextResponse.json({ error: 'Database error fetching metrics' }, { status: 500 })
  }

  return NextResponse.json({
    creator: creator as Creator,
    metrics: (metrics ?? []) as CreatorMetrics[],
  })
}

/**
 * POST /api/creator
 * Body: { handle, platform, name?, bio?, niche?, profile_pic_url?, user_id? }
 *
 * Creates or upserts a creator record.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body must be a JSON object' }, { status: 400 })
  }

  const {
    handle,
    platform,
    name,
    bio,
    niche,
    profile_pic_url,
    user_id,
  } = body as Record<string, string | undefined>

  if (!handle || !platform) {
    return NextResponse.json(
      { error: 'Missing required fields: handle, platform' },
      { status: 400 }
    )
  }

  const SUPPORTED_PLATFORMS = ['instagram', 'youtube', 'tiktok'] as const
  type SupportedPlatform = (typeof SUPPORTED_PLATFORMS)[number]
  if (!SUPPORTED_PLATFORMS.includes(platform as SupportedPlatform)) {
    return NextResponse.json(
      { error: `platform must be one of: ${SUPPORTED_PLATFORMS.join(', ')}` },
      { status: 400 }
    )
  }

  const validatedPlatform = platform as SupportedPlatform

  const payload: Partial<Creator> & { handle: string; platform: SupportedPlatform } = {
    handle: handle.toLowerCase(),
    platform: validatedPlatform,
  }

  if (name !== undefined) payload.name = name
  if (bio !== undefined) payload.bio = bio
  if (niche !== undefined) payload.niche = niche
  if (profile_pic_url !== undefined) payload.profile_pic_url = profile_pic_url
  if (user_id !== undefined) payload.user_id = user_id ?? null

  const { data, error } = await supabaseAdmin
    .from('creators')
    .upsert(payload, { onConflict: 'handle,platform', ignoreDuplicates: false })
    .select()
    .single()

  if (error) {
    console.error('[creator POST] db error', error)
    return NextResponse.json({ error: 'Database error while saving creator' }, { status: 500 })
  }

  return NextResponse.json({ creator: data as Creator }, { status: 201 })
}
