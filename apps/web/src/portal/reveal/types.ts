export type RevealPhase = 'hidden' | 'entering' | 'visible' | 'exiting'

export interface RevealConfig {
  delay?: number
  duration?: number
  type?: 'fade' | 'scale' | 'slide' | 'flip'
}

export interface RevealContextValue {
  phase: RevealPhase
  show: () => void
  hide: () => void
}
