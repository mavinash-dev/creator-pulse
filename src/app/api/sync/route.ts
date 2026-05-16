import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * POST /api/sync
 * Triggers a data sync for the authenticated creator's account.
 * TODO: Implement actual Instagram API call + Supabase upsert.
 */
export async function POST(req: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: Look up the creator's Instagram access token from Supabase
  // TODO: Call getInstagramProfile() and getMediaInsights() from lib/instagram.ts
  // TODO: Upsert results into creator_metrics table
  void req

  return NextResponse.json({
    success: true,
    message: 'Sync triggered (stub — not yet implemented)',
    userId,
  })
}

/**
 * GET /api/sync
 * Returns the last sync status for the authenticated creator.
 * TODO: Implement.
 */
export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    lastSyncedAt: null,
    status: 'never_synced',
  })
}
