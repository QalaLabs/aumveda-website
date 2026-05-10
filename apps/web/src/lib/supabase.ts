import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY

// --------------------------------------------------
// Environment Validation
// --------------------------------------------------

if (!supabaseUrl) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL'
  )
}

if (!supabasePublishableKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
  )
}

if (!supabaseServiceRoleKey) {
  console.warn(
    'Missing SUPABASE_SERVICE_ROLE_KEY'
  )
}

// --------------------------------------------------
// Public Client (Browser Safe)
// --------------------------------------------------

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(
        supabaseUrl,
        supabasePublishableKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        }
      )
    : null

// --------------------------------------------------
// Admin Client (Server Only)
// --------------------------------------------------

export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      )
    : null

// --------------------------------------------------
// Status Flags
// --------------------------------------------------

export const supabaseConfigured = Boolean(
  supabase
)

export const supabaseAdminConfigured =
  Boolean(supabaseAdmin)