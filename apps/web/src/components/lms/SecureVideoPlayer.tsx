'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Loader2,
  Lock,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Play,
  Volume2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showSuccess, showError } from '@/utils/toast'

interface ForensicWatermarkData {
  studentHash: string
  maskedEmail: string
  studentName?: string
  timestamp: string
}

interface PlaybackSessionResponse {
  success: boolean
  token?: string
  expiresInSeconds?: number
  videoId?: string
  lessonTitle?: string
  courseTitle?: string
  durationSeconds?: number
  sanitizedParams?: Record<string, any>
  forensicWatermark?: ForensicWatermarkData
  error?: string
  requiresEnrollment?: boolean
  courseId?: string
}

interface SecureVideoPlayerProps {
  lessonId: string
  courseSlug?: string
  onProgressUpdate?: (progressPct: number, isCompleted: boolean) => void
  onAutoComplete?: () => void
  className?: string
}

export default function SecureVideoPlayer({
  lessonId,
  courseSlug,
  onProgressUpdate,
  onAutoComplete,
  className = '',
}: SecureVideoPlayerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [playbackData, setPlaybackData] = useState<PlaybackSessionResponse | null>(null)
  const [currentProgressPct, setCurrentProgressPct] = useState(0)
  const [completed, setCompleted] = useState(false)

  // Floating watermark position state
  const [watermarkPos, setWatermarkPos] = useState({ x: 25, y: 35 })
  const [liveTimestamp, setLiveTimestamp] = useState<string>('')

  const playerRef = useRef<any>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const watermarkTimerRef = useRef<NodeJS.Timeout | null>(null)
  const clockTimerRef = useRef<NodeJS.Timeout | null>(null)
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const containerId = useRef(`secure-yt-player-${Math.random().toString(36).slice(2, 9)}`)
  const completedFlagRef = useRef(false)
  const activeTokenRef = useRef<string | null>(null)
  const savedPlaybackPosRef = useRef<number>(0)

  // 1. Live moving UTC timestamp generator (updates every 1000ms)
  useEffect(() => {
    const updateTime = () => {
      setLiveTimestamp(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC')
    }
    updateTime()
    clockTimerRef.current = setInterval(updateTime, 1000)
    return () => {
      if (clockTimerRef.current) clearInterval(clockTimerRef.current)
    }
  }, [])

  // 2. Dynamic watermark hopping (moves every 5 seconds to prevent automated screen cropping)
  useEffect(() => {
    watermarkTimerRef.current = setInterval(() => {
      // Safe bounds within player: 12% to 78% X, 15% to 75% Y
      const nextX = Math.floor(12 + Math.random() * 66)
      const nextY = Math.floor(15 + Math.random() * 60)
      setWatermarkPos({ x: nextX, y: nextY })
    }, 5000)

    return () => {
      if (watermarkTimerRef.current) clearInterval(watermarkTimerRef.current)
    }
  }, [])

  // 3. Subtle background forensic canvas grid
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !playbackData?.forensicWatermark?.studentHash) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 350
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '11px monospace'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'
    ctx.rotate((-18 * Math.PI) / 180)

    const text = playbackData.forensicWatermark.studentHash
    for (let x = -150; x < 700; x += 110) {
      for (let y = -100; y < 450; y += 45) {
        ctx.fillText(text, x, y)
      }
    }
  }, [playbackData?.forensicWatermark?.studentHash])

  // Clear interval timers
  const stopProgressPolling = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [])

  // Sync watch intervals to server
  const syncProgressToServer = useCallback(
    async (currentTime: number, duration: number) => {
      if (!currentTime || !duration || duration <= 0) return
      savedPlaybackPosRef.current = currentTime

      const pct = Math.min(100, Math.round((currentTime / duration) * 100))
      setCurrentProgressPct(pct)

      // Mark completed when progress >= 85%
      if (pct >= 85 && !completedFlagRef.current) {
        completedFlagRef.current = true
        setCompleted(true)
        showSuccess('Lesson completed! (≥85% sacred threshold reached)')
        onAutoComplete?.()
      }

      onProgressUpdate?.(pct, pct >= 85)

      // Post progress to /api/lms/progress
      try {
        await fetch('/api/lms/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonId,
            token: activeTokenRef.current,
            watchTimeSeconds: Math.round(currentTime),
            durationSeconds: Math.round(duration),
            lastPositionSec: Math.round(currentTime),
          }),
        })
      } catch (err) {
        // Non-blocking sync error
        console.warn('[SecureVideoPlayer Progress Sync Error]:', err)
      }
    },
    [lessonId, onAutoComplete, onProgressUpdate],
  )

  // Start polling playhead position
  const startProgressPolling = useCallback(() => {
    stopProgressPolling()
    progressTimerRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime()
          const duration = playerRef.current.getDuration()
          if (duration > 0) {
            syncProgressToServer(currentTime, duration)
          }
        } catch {
          // Player unmounted or transitioning
        }
      }
    }, 4000)
  }, [stopProgressPolling, syncProgressToServer])

  // Instantiate YouTube IFrame player with origin locking and security flags
  const setupPlayer = useCallback(
    (videoId: string) => {
      const YT = (window as any).YT
      if (!YT || !YT.Player) return

      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById(videoId, savedPlaybackPosRef.current)
          setLoading(false)
          return
        } catch {
          // Re-create player if instance was detached
        }
      }

      try {
        playerRef.current = new YT.Player(containerId.current, {
          height: '100%',
          width: '100%',
          videoId,
          playerVars: {
            autoplay: 1,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            controls: 1,
            disablekb: 1,
            fs: 0, // Prevent default fullscreen to deter bypass of watermark
            iv_load_policy: 3,
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : 'https://aumveda.com',
            start: Math.round(savedPlaybackPosRef.current),
          },
          events: {
            onReady: (event: any) => {
              setLoading(false)
              if (savedPlaybackPosRef.current > 0) {
                try {
                  event.target.seekTo(savedPlaybackPosRef.current, true)
                } catch {}
              }
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING
              if (event.data === 1) {
                startProgressPolling()
              } else {
                stopProgressPolling()
                if (typeof event.target.getCurrentTime === 'function') {
                  const curr = event.target.getCurrentTime()
                  const dur = event.target.getDuration()
                  if (dur > 0) {
                    syncProgressToServer(curr, dur)
                  }
                }
              }
            },
            onError: (err: any) => {
              console.error('[YouTube Player Error]:', err)
              setError('Failed to securely stream video. Video asset may be private or restricted.')
              setLoading(false)
            },
          },
        })
      } catch (err: any) {
        console.error('[Setup Player Error]:', err)
        setError('Could not initialize video player securely.')
        setLoading(false)
      }
    },
    [startProgressPolling, stopProgressPolling, syncProgressToServer],
  )

  // Fetch or refresh playback session token from server
  const fetchPlaybackSession = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSessionExpired(false)

    try {
      // Fetch session from primary route /api/lms/lessons/[lessonId]/playback-session
      let res = await fetch(`/api/lms/lessons/${lessonId}/playback-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      // Fallback to /api/v1/lms route if 404
      if (res.status === 404) {
        res = await fetch(`/api/v1/lms/lessons/${lessonId}/playback-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const data: PlaybackSessionResponse = await res.json()

      if (!res.ok || !data.success) {
        if (data.requiresEnrollment) {
          setError('Course enrollment required to access this sacred lesson.')
        } else {
          setError(data.error || 'Unable to establish secure playback session.')
        }
        setLoading(false)
        return
      }

      setPlaybackData(data)
      activeTokenRef.current = data.token || null

      // Set 15-minute token expiration timer (900 seconds)
      const ttlSec = data.expiresInSeconds || 900
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current)
      expiryTimerRef.current = setTimeout(() => {
        setSessionExpired(true)
        if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo()
        }
      }, ttlSec * 1000)

      // Initialize YouTube API script if not already present
      if (!(window as any).YT || !(window as any).YT.Player) {
        const existingScript = document.getElementById('youtube-iframe-api')
        if (!existingScript) {
          const tag = document.createElement('script')
          tag.id = 'youtube-iframe-api'
          tag.src = 'https://www.youtube.com/iframe_api'
          const firstScriptTag = document.getElementsByTagName('script')[0]
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
        }

        const checkYTReady = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(checkYTReady)
            if (data.videoId) {
              setupPlayer(data.videoId)
            }
          }
        }, 150)

        setTimeout(() => clearInterval(checkYTReady), 10000)
      } else if (data.videoId) {
        setupPlayer(data.videoId)
      }
    } catch (err: any) {
      setError(err.message || 'Network error securing video stream.')
      setLoading(false)
    }
  }, [lessonId, setupPlayer])

  useEffect(() => {
    fetchPlaybackSession()

    return () => {
      stopProgressPolling()
      if (watermarkTimerRef.current) clearInterval(watermarkTimerRef.current)
      if (clockTimerRef.current) clearInterval(clockTimerRef.current)
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current)
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy()
        } catch {}
      }
    }
  }, [fetchPlaybackSession, stopProgressPolling])

  return (
    <div
      className={`relative w-full aspect-video bg-[hsl(var(--av-night,#0c0a14))] rounded-2xl overflow-hidden border border-[hsl(var(--av-gold,#c9a84c)/0.25)] shadow-2xl select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ─── YOUTUBE CONTAINER ─── */}
      <div id={containerId.current} className="w-full h-full object-cover pointer-events-auto" />

      {/* ─── FORENSIC WATERMARK OVERLAY ─── */}
      {playbackData?.forensicWatermark && !loading && !error && !sessionExpired && (
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20"
          aria-hidden="true"
        >
          {/* Subtle canvas micro-grid */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover opacity-50 mix-blend-screen pointer-events-none"
          />

          {/* Dynamic Moving Forensic Badge */}
          <div
            className="absolute transition-all duration-1000 ease-in-out pointer-events-none"
            style={{
              left: `${watermarkPos.x}%`,
              top: `${watermarkPos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="px-3.5 py-2 rounded-lg bg-black/55 backdrop-blur-[3px] border border-white/10 shadow-2xl flex flex-col items-start gap-1 text-[10px] font-mono leading-tight tracking-wider text-white/35">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/70 animate-pulse shadow-sm shadow-emerald-500" />
                <span className="font-bold text-white/50 tracking-wider">
                  {playbackData.forensicWatermark.studentHash}
                </span>
              </div>
              <div className="text-[9px] text-white/30">
                {playbackData.forensicWatermark.maskedEmail}{' '}
                {playbackData.forensicWatermark.studentName
                  ? `• ${playbackData.forensicWatermark.studentName}`
                  : ''}
              </div>
              <div className="text-[8px] text-white/25 tracking-tighter">
                {liveTimestamp || playbackData.forensicWatermark.timestamp}
              </div>
            </div>
          </div>

          {/* Discrete corner security tags */}
          <div className="absolute top-3 left-3 text-[9px] font-mono text-white/15 tracking-widest uppercase">
            AUMVEDA SECURE GATED STREAM • {playbackData.forensicWatermark.studentHash}
          </div>
          <div className="absolute bottom-3 right-3 text-[8px] font-mono text-white/15 tracking-tighter">
            AUTHORIZED ENROLLMENT • IP FORENSIC LOGGED
          </div>
        </div>
      )}

      {/* ─── LOADING OVERLAY ─── */}
      {loading && !error && (
        <div className="absolute inset-0 z-30 bg-[hsl(var(--av-night,#0c0a14))]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-[hsl(var(--av-parchment,#fbf8f1))]">
          <div className="relative mb-4">
            <Loader2 className="w-10 h-10 animate-spin text-[hsl(var(--av-gold,#c9a84c))]" />
            <ShieldCheck className="w-5 h-5 text-[hsl(var(--av-gold,#c9a84c))] absolute inset-0 m-auto opacity-75" />
          </div>
          <h4 className="font-serif text-lg font-medium text-[hsl(var(--av-parchment,#fbf8f1))] mb-1">
            Establishing Secure Playback Session
          </h4>
          <p className="text-xs text-[hsl(var(--av-parchment,#fbf8f1)/0.6)] font-mono max-w-sm">
            Verifying course entitlement, signing 15-minute JWT, and synthesizing anti-piracy forensic watermark...
          </p>
        </div>
      )}

      {/* ─── SESSION EXPIRED OVERLAY ─── */}
      {sessionExpired && (
        <div className="absolute inset-0 z-40 bg-[hsl(var(--av-night,#0c0a14))]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-[hsl(var(--av-parchment,#fbf8f1))] space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="font-serif text-lg font-bold text-[hsl(var(--av-parchment,#fbf8f1))]">
              15-Minute Playback Session Expired
            </h4>
            <p className="text-xs text-[hsl(var(--av-parchment,#fbf8f1)/0.6)] leading-relaxed">
              In accordance with Section 4.7 security gating, your session token has expired to protect course material.
            </p>
          </div>
          <Button
            onClick={fetchPlaybackSession}
            className="bg-[hsl(var(--av-gold,#c9a84c))] hover:bg-[hsl(var(--av-gold,#c9a84c)/0.85)] text-[hsl(var(--av-night,#0c0a14))] font-semibold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Playback Session</span>
          </Button>
        </div>
      )}

      {/* ─── ERROR OR FORBIDDEN OVERLAY ─── */}
      {error && !loading && (
        <div className="absolute inset-0 z-40 bg-[hsl(var(--av-night,#0c0a14))]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-[hsl(var(--av-parchment,#fbf8f1))] space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Lock className="w-6 h-6 text-red-400" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="font-serif text-lg font-bold text-[hsl(var(--av-parchment,#fbf8f1))]">
              Access Restricted
            </h4>
            <p className="text-xs text-[hsl(var(--av-parchment,#fbf8f1)/0.6)] leading-relaxed">
              {error}
            </p>
          </div>
          {courseSlug && (
            <Button
              onClick={() => (window.location.href = `/courses/${courseSlug}`)}
              className="bg-[hsl(var(--av-gold,#c9a84c))] hover:bg-[hsl(var(--av-gold,#c9a84c)/0.85)] text-[hsl(var(--av-night,#0c0a14))] font-semibold text-xs px-6 py-2.5 rounded-full shadow-lg"
            >
              Unlock Full Course Enrollment
            </Button>
          )}
        </div>
      )}

      {/* ─── PROGRESS HUD (LOWER CORNER) ─── */}
      {!loading && !error && !sessionExpired && (
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 pointer-events-none">
          {completed || currentProgressPct >= 85 ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({currentProgressPct}%)</span>
            </span>
          ) : (
            <span>Watch Progress: {currentProgressPct}% (Pass: 85%)</span>
          )}
        </div>
      )}
    </div>
  )
}
