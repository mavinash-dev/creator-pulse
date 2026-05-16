import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client-side Supabase client — uses the public anon key.
 * Safe to use in browser and server components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Server-side admin client — uses the service role key.
 * NEVER expose this to the browser. Use only in API routes and server actions.
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
