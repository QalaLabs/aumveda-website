import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// One-time warning in dev only; production must silently degrade (Supabase is
// currently used only by the auth-adjacent flows — the Portal itself no longer
// touches Supabase directly; see SessionPersistence.ts).
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  const w = window as unknown as { __aumvedaSupabaseWarned?: boolean }
  if (!w.__aumvedaSupabaseWarned) {
    if (!supabaseUrl) console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL not configured — client disabled')
    if (!supabasePublishableKey) console.warn('[supabase] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not configured — client disabled')
    if (!supabaseServiceRoleKey) console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY not configured — admin client disabled')
    w.__aumvedaSupabaseWarned = true
  }
}

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null

export const supabaseConfigured = Boolean(supabase)
export const supabaseAdminConfigured = Boolean(supabaseAdmin)
