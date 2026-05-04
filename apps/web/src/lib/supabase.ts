import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

// Client-side client (browser-safe, uses publishable key)
export const supabase = createClient(supabaseUrl, supabasePublishableKey)

// Server-side client (uses service role key for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export const supabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)
export const supabaseAdminConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey)
