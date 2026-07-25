/**
 * Aumveda Feature Flag & A/B Testing Manager
 *
 * Supports local configuration, cookie/query-parameter overrides,
 * and deterministic variant assignments for A/B split testing.
 */

export interface FeatureFlags {
  shortPortal: boolean
  breathAnimationVariant: 'A' | 'B' // A = Animated Orb, B = Static Text Guidance
  exitIntentEnabled: boolean
  whatsappReengagement: boolean
}

const DEFAULT_FLAGS: FeatureFlags = {
  shortPortal: false,
  breathAnimationVariant: 'A',
  exitIntentEnabled: true,
  whatsappReengagement: true,
}

export function getFeatureFlags(searchParams?: URLSearchParams): FeatureFlags {
  const flags = { ...DEFAULT_FLAGS }

  // 1. Check environment variables
  if (process.env.NEXT_PUBLIC_FLAG_SHORT_PORTAL === 'true') {
    flags.shortPortal = true
  }
  if (process.env.NEXT_PUBLIC_FLAG_BREATH_VARIANT === 'B') {
    flags.breathAnimationVariant = 'B'
  }
  if (process.env.NEXT_PUBLIC_FLAG_EXIT_INTENT === 'false') {
    flags.exitIntentEnabled = false
  }

  // 2. Check query overrides (useful for development & local testing)
  if (searchParams) {
    if (searchParams.get('flag_short_portal') === 'true') {
      flags.shortPortal = true
    } else if (searchParams.get('flag_short_portal') === 'false') {
      flags.shortPortal = false
    }

    const breathVar = searchParams.get('flag_breath_variant')
    if (breathVar === 'A' || breathVar === 'B') {
      flags.breathAnimationVariant = breathVar
    }

    if (searchParams.get('flag_exit_intent') === 'true') {
      flags.exitIntentEnabled = true
    } else if (searchParams.get('flag_exit_intent') === 'false') {
      flags.exitIntentEnabled = false
    }
  }

  return flags
}

/**
 * Deterministically assigns a variant ('A' or 'B') to a user based on their session/user ID.
 * Ensures sticky A/B experiences across refreshes without database lookups.
 */
export function getABVariant(userIdOrSessionId: string, testName: string): 'A' | 'B' {
  if (!userIdOrSessionId) return 'A'
  
  // Hash the session/user ID and test name to assign a variant
  const seed = `${userIdOrSessionId}_${testName}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B'
}
