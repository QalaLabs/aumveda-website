export interface TarotTheme {
  id: string
  name: string
  description: string
  color: string
}

export const TAROT_THEMES: Record<string, TarotTheme> = {
  transformation: {
    id: 'transformation',
    name: 'Transformation',
    description: 'You are being asked to release what no longer serves you.',
    color: '#EF4444',
  },
  awakening: {
    id: 'awakening',
    name: 'Awakening',
    description: 'A new chapter is calling your name. Trust the unfolding.',
    color: '#F59E0B',
  },
  inner_work: {
    id: 'inner_work',
    name: 'Inner Work',
    description: 'The answers are not outside. Go inward.',
    color: '#8B5CF6',
  },
  power_will: {
    id: 'power_will',
    name: 'Power & Will',
    description: 'You have more power than you think. Take the reins.',
    color: '#3B82F6',
  },
  love_relationships: {
    id: 'love_relationships',
    name: 'Love & Relationships',
    description: 'The heart wants what it needs. Love yourself enough to ask for both.',
    color: '#F43F5E',
  },
  surrender: {
    id: 'surrender',
    name: 'Surrender',
    description: 'Not everything is yours to control. Surrender is the highest form of trust.',
    color: '#14B8A6',
  },
  purpose_path: {
    id: 'purpose_path',
    name: 'Purpose & Path',
    description: 'You are being called to your purpose. Each step reveals the next.',
    color: '#C9A84C',
  },
}

export function getTarotTheme(id: string): TarotTheme {
  return TAROT_THEMES[id] || TAROT_THEMES.inner_work
}
