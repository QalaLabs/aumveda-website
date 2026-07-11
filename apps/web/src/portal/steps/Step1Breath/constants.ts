export const BREATH_CONFIG = {
  cycles: 3,
  inhaleMs: 4000,
  holdMs: 2000,
  exhaleMs: 4000,
  entranceDelayMs: 1200,
} as const

export const PHASE_LABELS: Record<string, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
  complete: '',
  idle: '',
}

export const PHASE_INSTRUCTIONS: Record<string, string> = {
  inhale: 'Breathe in slowly through your nose',
  hold: 'Gently hold',
  exhale: 'Release slowly through your mouth',
  complete: '',
  idle: '',
}

export const STAR_COUNT = 80

export const ORB_COLORS = {
  glow: 'rgba(201, 168, 76, 0.15)',
  mid: 'rgba(201, 168, 76, 0.4)',
  core: 'rgba(201, 168, 76, 0.8)',
  highlight: 'rgba(255, 215, 120, 0.6)',
}

export const COMPLETION_TEXT = "Good. You're here. Fully."
export const CTA_TEXT = 'Begin Your Journey →'

export const AUDIO = {
  ambientSrc: '/audio/portal-ambient.mp3',
  localStorageKey: 'aumveda_portal_muted',
  fadeInMs: 2000,
  fadeOutMs: 1000,
}
