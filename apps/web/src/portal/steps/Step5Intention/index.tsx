'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StepRegistry } from '../../engine/StepRegistry'
import { BackgroundEngine } from '../../background/BackgroundEngine'
import { AudioProvider } from '../../audio'
import { getTheme } from '../../theme/themes'
import { PortalContent, PortalCard, PortalButton, PortalContinueButton } from '../../design-system'
import { staggerContainer, staggerItem } from '../../animation/variants'
import type { StepProps } from '../../engine/types'

const INTENTION_MIN_CHARS = 20
const INTENTION_MAX_CHARS = 1000
const AUTOSAVE_DEBOUNCE_MS = 800

export function registerStep5() {
  StepRegistry.register({
    id: 5,
    title: 'Intention Setting',
    component: Step5Intention,
    validationSchema: undefined,
    enterAnimation: { type: 'fade', duration: 0.5 },
    exitAnimation: { type: 'fade', duration: 0.3 },
  })
}

function Step5Intention({ data, onNext, onDataChange }: StepProps) {
  const [text, setText] = useState(() => (data as { intention?: string }).intention ?? '')
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const charsLeft = INTENTION_MAX_CHARS - text.length
  const canContinue = text.trim().length >= INTENTION_MIN_CHARS

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value.slice(0, INTENTION_MAX_CHARS)
      setText(val)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onDataChange?.({ intention: val } as never)
      }, AUTOSAVE_DEBOUNCE_MS)
    },
    [onDataChange],
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleContinue = useCallback(() => {
    if (!canContinue) return
    onDataChange?.({ intention: text.trim() } as never)
    onNext?.()
  }, [canContinue, text, onDataChange, onNext])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <PortalContent maxWidth="max-w-xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center space-y-2 mb-8"
        >
          <motion.p
            variants={staggerItem}
            className="text-xs text-white/40 uppercase tracking-[0.3em] font-mono"
          >
            Step 5 of 8
          </motion.p>
          <motion.h1
            variants={staggerItem}
            className="text-2xl font-display text-white"
          >
            Take a moment.
          </motion.h1>
          <motion.p
            variants={staggerItem}
            className="text-base text-white/50"
          >
            What intention brings you here today?
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <PortalCard variant="glass" padding="lg">
            <div className="space-y-3">
              <label
                htmlFor="intention-input"
                className="block text-sm text-white/40 font-mono tracking-wider uppercase"
              >
                Your Intention
              </label>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="intention-input"
                  value={text}
                  onChange={handleChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="I am here to..."
                  rows={5}
                  className={`
                    w-full bg-white/[0.03] rounded-xl p-4 text-white text-sm leading-relaxed
                    placeholder:text-white/20 resize-none
                    border transition-all duration-300
                    focus:outline-none focus:ring-2
                    ${focused
                      ? 'border-blue-400/50 ring-blue-400/20'
                      : 'border-white/10'
                    }
                  `}
                  aria-describedby="intention-chars"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/10 transition-colors"
                    aria-label="Voice input (coming soon)"
                    tabIndex={-1}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div
                id="intention-chars"
                className="flex items-center justify-between text-xs"
              >
                <span
                  className={`transition-colors ${
                    text.trim().length >= INTENTION_MIN_CHARS
                      ? 'text-blue-400'
                      : text.trim().length > 0
                        ? 'text-white/40'
                        : 'text-white/20'
                  }`}
                  aria-live="polite"
                >
                  {text.trim().length > 0
                    ? `${text.trim().length} / ${INTENTION_MIN_CHARS} min`
                    : `${INTENTION_MIN_CHARS} characters minimum`}
                </span>
                <span
                  className={`transition-colors ${
                    charsLeft < 50 ? 'text-amber-400' : 'text-white/20'
                  }`}
                >
                  {charsLeft}
                </span>
              </div>
            </div>
          </PortalCard>

          <motion.div variants={staggerItem} className="flex justify-center pt-2">
            <PortalContinueButton
              onClick={handleContinue}
              disabled={!canContinue}
              label="Set My Intention"
            />
          </motion.div>
        </motion.div>
      </PortalContent>
    </div>
  )
}

export default function Step5IntentionWrapper(props: StepProps) {
  return (
    <AudioProvider>
      <BackgroundEngine theme={getTheme('intention')}>
        <Step5Intention {...props} />
      </BackgroundEngine>
    </AudioProvider>
  )
}
