import { PORTAL_COLORS, PORTAL_GLOWS } from './tokens'

export interface PortalThemeConfig {
  id: string
  name: string
  background: {
    base: string
    gradient: string
    overlay?: string
  }
  glow: {
    primary: string
    secondary: string
    boxShadow: string
  }
  accent: string
  orb: {
    color: string
    glowColor: string
    size: number
  }
  particles?: {
    count: number
    color: string
    speed: number
    size: number
  }
  stars?: {
    count: number
    twinkle: boolean
    color: string
  }
  text: {
    heading: string
    body: string
    muted: string
    accent: string
  }
}

export const PORTAL_THEMES: Record<string, PortalThemeConfig> = {
  default: {
    id: 'default',
    name: 'Default',
    background: {
      base: PORTAL_COLORS.bg.base,
      gradient: 'bg-gradient-to-b from-[#0B0720] via-[#1A0F3C] to-[#0B0720]',
    },
    glow: { primary: PORTAL_COLORS.gold[500], secondary: PORTAL_COLORS.gold[300], boxShadow: PORTAL_GLOWS.gold.md },
    accent: PORTAL_COLORS.gold[500],
    orb: { color: PORTAL_COLORS.gold[500], glowColor: PORTAL_GLOWS.gold.md, size: 200 },
    stars: { count: 80, twinkle: true, color: '#FFFFFF' },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: PORTAL_COLORS.gold[500] },
  },
  chakra: {
    id: 'chakra',
    name: 'Chakra',
    background: {
      base: '#0F0A2E',
      gradient: 'bg-gradient-to-b from-[#0F0A2E] via-[#1A1040] to-[#0F0A2E]',
    },
    glow: { primary: '#7C3AED', secondary: '#A78BFA', boxShadow: PORTAL_GLOWS.purple.md },
    accent: '#7C3AED',
    orb: { color: '#7C3AED', glowColor: PORTAL_GLOWS.purple.md, size: 200 },
    particles: { count: 30, color: '#A78BFA', speed: 0.5, size: 2 },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: '#A78BFA' },
  },
  archetype: {
    id: 'archetype',
    name: 'Archetype',
    background: {
      base: '#1A0A0A',
      gradient: 'bg-gradient-to-b from-[#1A0A0A] via-[#2A1510] to-[#1A0A0A]',
    },
    glow: { primary: '#F59E0B', secondary: '#FCD34D', boxShadow: PORTAL_GLOWS.gold.md },
    accent: '#F59E0B',
    orb: { color: '#F59E0B', glowColor: PORTAL_GLOWS.gold.md, size: 180 },
    particles: { count: 20, color: '#FCD34D', speed: 0.3, size: 3 },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: '#FCD34D' },
  },
  tarot: {
    id: 'tarot',
    name: 'Tarot',
    background: {
      base: '#0D0A1A',
      gradient: 'bg-gradient-to-b from-[#0D0A1A] via-[#181030] to-[#0D0A1A]',
    },
    glow: { primary: '#8B5CF6', secondary: '#C4B5FD', boxShadow: PORTAL_GLOWS.purple.lg },
    accent: '#8B5CF6',
    orb: { color: '#8B5CF6', glowColor: PORTAL_GLOWS.purple.md, size: 160 },
    stars: { count: 120, twinkle: true, color: '#C4B5FD' },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: '#C4B5FD' },
  },
  intention: {
    id: 'intention',
    name: 'Intention',
    background: {
      base: '#0A1420',
      gradient: 'bg-gradient-to-b from-[#0A1420] via-[#0F1F30] to-[#0A1420]',
    },
    glow: { primary: '#3B82F6', secondary: '#93C5FD', boxShadow: PORTAL_GLOWS.blue.md },
    accent: '#3B82F6',
    orb: { color: '#3B82F6', glowColor: PORTAL_GLOWS.blue.md, size: 180 },
    particles: { count: 15, color: '#93C5FD', speed: 0.4, size: 2 },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: '#93C5FD' },
  },
  constellation: {
    id: 'constellation',
    name: 'Constellation',
    background: {
      base: '#050510',
      gradient: 'bg-gradient-to-b from-[#050510] via-[#0A0A20] to-[#050510]',
    },
    glow: { primary: '#14B8A6', secondary: '#5EEAD4', boxShadow: PORTAL_GLOWS.white.lg },
    accent: '#14B8A6',
    orb: { color: '#14B8A6', glowColor: PORTAL_GLOWS.white.md, size: 200 },
    stars: { count: 200, twinkle: true, color: '#FFFFFF' },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: '#5EEAD4' },
  },
  pattern: {
    id: 'pattern',
    name: 'Pattern',
    background: {
      base: '#0A0A0F',
      gradient: 'bg-gradient-to-b from-[#0A0A0F] via-[#151520] to-[#0A0A0F]',
    },
    glow: { primary: '#F43F5E', secondary: '#FDA4AF', boxShadow: PORTAL_GLOWS.gold.sm },
    accent: '#F43F5E',
    orb: { color: '#F43F5E', glowColor: PORTAL_GLOWS.white.md, size: 160 },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: '#FDA4AF' },
  },
  booking: {
    id: 'booking',
    name: 'Booking',
    background: {
      base: '#0B0720',
      gradient: 'bg-gradient-to-b from-[#0B0720] via-[#1A0F3C] to-[#0B0720]',
    },
    glow: { primary: PORTAL_COLORS.gold[500], secondary: PORTAL_COLORS.gold[300], boxShadow: PORTAL_GLOWS.gold.xl },
    accent: PORTAL_COLORS.gold[500],
    orb: { color: PORTAL_COLORS.gold[500], glowColor: PORTAL_GLOWS.gold.md, size: 180 },
    particles: { count: 40, color: PORTAL_COLORS.gold[300], speed: 0.6, size: 2 },
    stars: { count: 100, twinkle: true, color: '#FFFFFF' },
    text: { heading: '#FFFFFF', body: 'rgba(255,255,255,0.7)', muted: 'rgba(255,255,255,0.4)', accent: PORTAL_COLORS.gold[500] },
  },
}

export function getTheme(id?: string): PortalThemeConfig {
  return id && PORTAL_THEMES[id] ? PORTAL_THEMES[id] : PORTAL_THEMES.default
}
