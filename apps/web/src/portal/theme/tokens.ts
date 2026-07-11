export const PORTAL_COLORS = {
  bg: {
    base: '#0B0720',
    surface: '#1A0F3C',
    elevated: '#221550',
    overlay: 'rgba(11, 7, 32, 0.85)',
  },
  gold: {
    50: '#FFF8E7',
    100: '#FEF0C8',
    200: '#FDE49E',
    300: '#FCD46E',
    400: '#FBC43E',
    500: '#C9A84C',
    600: '#A88A3A',
    700: '#876C2A',
    800: '#664F1C',
    900: '#453410',
  },
  accent: {
    purple: '#7C3AED',
    blue: '#3B82F6',
    teal: '#14B8A6',
    rose: '#F43F5E',
    amber: '#F59E0B',
    emerald: '#10B981',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.4)',
    muted: 'rgba(255, 255, 255, 0.2)',
    accent: '#C9A84C',
    inverse: '#0B0720',
  },
  border: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    accent: 'rgba(201, 168, 76, 0.3)',
  },
  state: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const

export const PORTAL_GLOWS = {
  gold: {
    sm: '0 0 20px rgba(201, 168, 76, 0.15)',
    md: '0 0 40px rgba(201, 168, 76, 0.25)',
    lg: '0 0 80px rgba(201, 168, 76, 0.35)',
    xl: '0 0 120px rgba(201, 168, 76, 0.45)',
  },
  purple: {
    sm: '0 0 20px rgba(124, 58, 237, 0.15)',
    md: '0 0 40px rgba(124, 58, 237, 0.25)',
    lg: '0 0 80px rgba(124, 58, 237, 0.35)',
  },
  blue: {
    sm: '0 0 20px rgba(59, 130, 246, 0.15)',
    md: '0 0 40px rgba(59, 130, 246, 0.25)',
    lg: '0 0 80px rgba(59, 130, 246, 0.35)',
  },
  white: {
    sm: '0 0 20px rgba(255, 255, 255, 0.05)',
    md: '0 0 40px rgba(255, 255, 255, 0.1)',
    lg: '0 0 80px rgba(255, 255, 255, 0.15)',
  },
} as const

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const

export const RADII = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const

export const BLUR = {
  sm: '4px',
  md: '12px',
  lg: '24px',
  xl: '48px',
} as const

export const ANIMATION_DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  entrance: 0.8,
  breath: 4,
  hold: 2,
} as const

export const ANIMATION_EASINGS = {
  default: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  gentle: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
  spring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.27, 1.55] as [number, number, number, number],
} as const

export const typography = {
  fontFamily: {
    serif: ['Playfair Display', 'Georgia', 'serif'],
    sans: ['Montserrat', 'sans-serif'],
    body: ['Lato', 'sans-serif'],
    mono: ['ui-monospace', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  tracking: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.2em',
  },
} as const
