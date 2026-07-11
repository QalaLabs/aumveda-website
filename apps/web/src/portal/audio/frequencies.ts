export const CHAKRA_FREQUENCIES: Record<string, number> = {
  root: 256,
  sacral: 288,
  solarPlexus: 320,
  heart: 341,
  throat: 384,
  thirdEye: 426,
  crown: 480,
} as const

export const SOLFEGGIO_FREQUENCIES: Record<string, number> = {
  ut: 396,
  re: 417,
  mi: 528,
  fa: 639,
  sol: 741,
  la: 852,
  si: 963,
} as const

export function frequencyToOscillatorConfig(freq: number): {
  type: OscillatorType
  frequency: number
  detune: number
} {
  return {
    type: 'sine',
    frequency: freq,
    detune: 0,
  }
}

/** Solfeggio recordings — served from /public/audio/solfeggio, consistent `{hz}hz.mp3` naming, no spaces. */
export const SOLFEGGIO_AUDIO_FILES: Record<number, string> = {
  396: '/audio/solfeggio/396hz.mp3',
  417: '/audio/solfeggio/417hz.mp3',
  528: '/audio/solfeggio/528hz.mp3',
  639: '/audio/solfeggio/639hz.mp3',
  741: '/audio/solfeggio/741hz.mp3',
  852: '/audio/solfeggio/852hz.mp3',
  963: '/audio/solfeggio/963hz.mp3',
} as const

export const CHAKRA_TO_SOLFEGGIO_FILE: Record<string, string> = {
  root: SOLFEGGIO_AUDIO_FILES[396],
  sacral: SOLFEGGIO_AUDIO_FILES[417],
  solar_plexus: SOLFEGGIO_AUDIO_FILES[528],
  heart: SOLFEGGIO_AUDIO_FILES[639],
  throat: SOLFEGGIO_AUDIO_FILES[741],
  third_eye: SOLFEGGIO_AUDIO_FILES[852],
  crown: SOLFEGGIO_AUDIO_FILES[963],
} as const

export function getSolfeggioFileForFrequency(freq: number): string | null {
  return SOLFEGGIO_AUDIO_FILES[freq] ?? null
}
