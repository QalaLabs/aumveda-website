export type AudioTrackType = 'ambient' | 'hover' | 'transition' | 'chakra' | 'complete'

export interface AudioTrack {
  id: string
  src: string
  type: AudioTrackType
  volume?: number
  loop?: boolean
}

export class AudioManager {
  private static instance: AudioManager
  private audioContext: AudioContext | null = null
  private buffers: Map<string, AudioBuffer> = new Map()
  private activeSources: Map<string, AudioBufferSourceNode> = new Map()
  private gainNodes: Map<string, GainNode> = new Map()
  private _muted: boolean = false
  private masterGain: GainNode | null = null
  private loaded: Set<string> = new Set()
  private loading: Map<string, Promise<void>> = new Map()
  private currentSources: Set<string> = new Set()

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  private getContext(): AudioContext {
    if (!this.audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.audioContext = ctx
      this.masterGain = ctx.createGain()
      this.masterGain.connect(ctx.destination)
      this.masterGain.gain.value = this._muted ? 0 : 0.5
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
    return this.audioContext
  }

  async loadTrack(id: string, src: string): Promise<void> {
    if (this.loaded.has(id) || this.loading.has(id)) {
      return this.loading.get(id) || Promise.resolve()
    }

    const loadPromise = (async () => {
      try {
        const ctx = this.getContext()
        const response = await fetch(src)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
        this.buffers.set(id, audioBuffer)
        this.loaded.add(id)
      } catch (error) {
        console.error(`[AudioManager] Failed to load ${src}:`, error)
        throw error
      }
    })()

    this.loading.set(id, loadPromise)
    return loadPromise
  }

  play(id: string, options?: { loop?: boolean; volume?: number }): void {
    if (this._muted) return

    const buffer = this.buffers.get(id)
    if (!buffer) {
      console.warn(`[AudioManager] Track ${id} not loaded`)
      return
    }

    this.stop(id)

    const ctx = this.getContext()
    const source = ctx.createBufferSource()
    const gain = ctx.createGain()

    source.buffer = buffer
    source.loop = options?.loop ?? false
    gain.gain.value = options?.volume ?? 0.3

    source.connect(gain)
    gain.connect(this.masterGain!)
    source.start(0)

    this.activeSources.set(id, source)
    this.gainNodes.set(id, gain)
    this.currentSources.add(id)
  }

  stop(id: string): void {
    const source = this.activeSources.get(id)
    if (source) {
      try { source.stop() } catch {}
      source.disconnect()
      this.activeSources.delete(id)
    }
    const gain = this.gainNodes.get(id)
    if (gain) {
      gain.disconnect()
      this.gainNodes.delete(id)
    }
    this.currentSources.delete(id)
  }

  stopAll(): void {
    for (const id of this.currentSources) {
      this.stop(id)
    }
  }

  fadeIn(id: string, duration: number = 1000): void {
    const gain = this.gainNodes.get(id)
    if (!gain) return
    gain.gain.setValueAtTime(0, this.audioContext!.currentTime)
    gain.gain.linearRampToValueAtTime(gain.gain.value, this.audioContext!.currentTime + duration / 1000)
  }

  fadeOut(id: string, duration: number = 1000): void {
    const gain = this.gainNodes.get(id)
    if (!gain) return
    const currentTime = this.audioContext!.currentTime
    gain.gain.setValueAtTime(gain.gain.value, currentTime)
    gain.gain.linearRampToValueAtTime(0, currentTime + duration / 1000)
    setTimeout(() => this.stop(id), duration)
  }

  setVolume(id: string, volume: number): void {
    const gain = this.gainNodes.get(id)
    if (gain) {
      gain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  setMuted(muted: boolean): void {
    this._muted = muted
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.5
    }
    try {
      localStorage.setItem('portal-audio-muted', String(muted))
    } catch {}
  }

  toggleMute(): boolean {
    this.setMuted(!this._muted)
    return this._muted
  }

  get muted(): boolean {
    return this._muted
  }

  isPlaying(id: string): boolean {
    return this.currentSources.has(id)
  }

  destroy(): void {
    this.stopAll()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.buffers.clear()
    this.loaded.clear()
    this.loading.clear()
    this.masterGain = null
  }
}
