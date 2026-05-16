import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * GET /api/alerts
 * Returns all alert configs for the authenticated creator.
 * TODO: Implement Supabase query.
 */
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: SELECT * FROM alerts WHERE creator_id = (lookup by userId)
  return NextResponse.json({ alerts: [], message: 'Not yet implemented' })
}

/**
 * POST /api/alerts
 * Creates or updates an alert configuration.
 * Body: { type, threshold, email, is_active }
 * TODO: Implement Supabase upsert.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  // TODO: Validate body (zod), upsert into alerts table
  void body

  return NextResponse.json(
    { message: 'Alert config not yet implemented' },
    { status: 501 }
  )
}

/**
 * DELETE /api/alerts
 * Deletes an alert by id.
 * Query param: ?id=<alert-id>
 * TODO: Implement Supabase delete.
 */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const alertId = req.nextUrl.searchParams.get('id')
  if (!alertId) {
    return NextResponse.json({ error: 'Missing alert id' }, { status: 400 })
  }

  // TODO: DELETE FROM alerts WHERE id = alertId AND creator_id = ...
  return NextResponse.json(
    { message: 'Alert deletion not yet implemented' },
    { status: 501 }
  )
}
