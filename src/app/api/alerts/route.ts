import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Alert } from '@/lib/types'

const ALERT_TYPES = ['engagement_drop', 'follower_stall', 'post_spike'] as const
type AlertType = (typeof ALERT_TYPES)[number]

/**
 * GET /api/alerts
 * Query params: ?creator_id=<uuid>
 *
 * Returns all alerts for a creator, ordered by creation time.
 */
export async function GET(req: NextRequest) {
  const creator_id = req.nextUrl.searchParams.get('creator_id')

  if (!creator_id) {
    return NextResponse.json({ error: 'Missing query param: creator_id' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('alerts')
    .select('*')
    .eq('creator_id', creator_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[alerts GET] db error', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ alerts: (data ?? []) as Alert[] })
}

/**
 * POST /api/alerts
 * Body: { creator_id, type, threshold, email, is_active? }
 *
 * Creates or updates an alert configuration.
 * If an alert with the same creator_id + type already exists it is updated;
 * otherwise a new row is inserted.
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

  const { creator_id, type, threshold, email, is_active } = body as Record<
    string,
    unknown
  >

  if (!creator_id || typeof creator_id !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid field: creator_id' }, { status: 400 })
  }

  if (!type || !ALERT_TYPES.includes(type as AlertType)) {
    return NextResponse.json(
      { error: `type must be one of: ${ALERT_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  if (typeof threshold !== 'number' || isNaN(threshold)) {
    return NextResponse.json(
      { error: 'threshold must be a numeric value' },
      { status: 400 }
    )
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'email must be a valid email address' }, { status: 400 })
  }

  // Check if an alert of this type already exists for the creator
  const { data: existing } = await supabaseAdmin
    .from('alerts')
    .select('id')
    .eq('creator_id', creator_id)
    .eq('type', type)
    .maybeSingle()

  let result: Alert

  if (existing) {
    // Update existing alert
    const { data, error } = await supabaseAdmin
      .from('alerts')
      .update({
        threshold,
        email,
        is_active: typeof is_active === 'boolean' ? is_active : true,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error || !data) {
      console.error('[alerts POST] update error', error)
      return NextResponse.json({ error: 'Database error while updating alert' }, { status: 500 })
    }
    result = data as Alert
  } else {
    // Insert new alert
    const { data, error } = await supabaseAdmin
      .from('alerts')
      .insert({
        creator_id,
        type,
        threshold,
        email,
        is_active: typeof is_active === 'boolean' ? is_active : true,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('[alerts POST] insert error', error)
      return NextResponse.json({ error: 'Database error while creating alert' }, { status: 500 })
    }
    result = data as Alert
  }

  return NextResponse.json({ alert: result }, { status: existing ? 200 : 201 })
}

/**
 * DELETE /api/alerts
 * Query params: ?id=<alert-uuid>
 *
 * Deactivates (soft-deletes) an alert by setting is_active = false.
 */
export async function DELETE(req: NextRequest) {
  const alertId = req.nextUrl.searchParams.get('id')

  if (!alertId) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('alerts')
    .update({ is_active: false })
    .eq('id', alertId)
    .select('id, is_active')
    .maybeSingle()

  if (error) {
    console.error('[alerts DELETE] db error', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: `Alert ${alertId} not found` }, { status: 404 })
  }

  return NextResponse.json({ success: true, alert: data })
}
