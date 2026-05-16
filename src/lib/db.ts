/**
 * Database helper functions wrapping Supabase queries.
 * All functions use the admin client (service role) and are safe to call
 * only from server-side code (API routes, server actions).
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { Creator, CreatorMetrics, Alert, MediaKit } from '@/lib/types'

// ---------------------------------------------------------------------------
// Creators
// ---------------------------------------------------------------------------

export async function getCreatorByHandle(
  handle: string,
  platform: string
): Promise<Creator | null> {
  const { data, error } = await supabaseAdmin
    .from('creators')
    .select('*')
    .eq('handle', handle.toLowerCase())
    .eq('platform', platform)
    .maybeSingle()

  if (error) throw error
  return data as Creator | null
}

export async function upsertCreator(
  data: Omit<Creator, 'id' | 'created_at' | 'last_synced_at'> & {
    last_synced_at?: string
  }
): Promise<Creator> {
  const { data: row, error } = await supabaseAdmin
    .from('creators')
    .upsert(
      { ...data, handle: data.handle.toLowerCase(), last_synced_at: new Date().toISOString() },
      { onConflict: 'handle,platform', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) throw error
  return row as Creator
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export async function getCreatorMetrics(
  creatorId: string,
  days: 7 | 30 | 90
): Promise<CreatorMetrics[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabaseAdmin
    .from('creator_metrics')
    .select('*')
    .eq('creator_id', creatorId)
    .gte('recorded_at', since.toISOString())
    .order('recorded_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as CreatorMetrics[]
}

export async function getLatestMetrics(creatorId: string): Promise<CreatorMetrics | null> {
  const { data, error } = await supabaseAdmin
    .from('creator_metrics')
    .select('*')
    .eq('creator_id', creatorId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as CreatorMetrics | null
}

export async function insertMetrics(
  data: Omit<CreatorMetrics, 'id' | 'recorded_at'>
): Promise<CreatorMetrics> {
  const { data: row, error } = await supabaseAdmin
    .from('creator_metrics')
    .insert({ ...data, recorded_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return row as CreatorMetrics
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export async function getAlerts(creatorId: string): Promise<Alert[]> {
  const { data, error } = await supabaseAdmin
    .from('alerts')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Alert[]
}

// ---------------------------------------------------------------------------
// Media Kits
// ---------------------------------------------------------------------------

export async function getMediaKit(slug: string): Promise<MediaKit | null> {
  const { data, error } = await supabaseAdmin
    .from('media_kits')
    .select('*')
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle()

  if (error) throw error
  return data as MediaKit | null
}
