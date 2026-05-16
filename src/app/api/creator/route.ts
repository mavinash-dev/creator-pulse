import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * GET /api/creator
 * Returns the creator profile for the authenticated user.
 * TODO: Implement Supabase query.
 */
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: SELECT * FROM creators WHERE clerk_user_id = userId
  return NextResponse.json({ creator: null, message: 'Not yet implemented' })
}

/**
 * POST /api/creator
 * Creates a new creator profile.
 * TODO: Implement Supabase insert.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  // TODO: Validate body with zod, INSERT INTO creators ...
  void body

  return NextResponse.json(
    { message: 'Creator creation not yet implemented' },
    { status: 501 }
  )
}

/**
 * PATCH /api/creator
 * Updates the creator profile.
 * TODO: Implement Supabase update.
 */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  // TODO: Validate + UPDATE creators SET ... WHERE clerk_user_id = userId
  void body

  return NextResponse.json(
    { message: 'Creator update not yet implemented' },
    { status: 501 }
  )
}
