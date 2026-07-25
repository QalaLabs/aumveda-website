'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Mail, ShieldCheck } from 'lucide-react'
import { usePortal } from '../engine/PortalContext'
import { PortalCard, PortalButton } from '../design-system'

export function ExitIntentPopup() {
  const { state, updatePortalData, goToStep } = usePortal()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Only bind exit intent listeners if:
    // 1. User is on steps 1-5 (before capturing email on Step 6)
    // 2. Email is not already in portalData
    // 3. Popup has not been dismissed in this session
    if (state.currentStep >= 6 || state.portalData.email) return

    const dismissed = sessionStorage.getItem('aumveda_exit_intent_dismissed') === 'true'
    if (dismissed) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 20) { // mouse moved near the top url bar
        setIsOpen(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [state.currentStep, state.portalData.email])

  const handleDismiss = () => {
    setIsOpen(false)
    sessionStorage.setItem('aumveda_exit_intent_dismissed', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setSubmitting(true)
    try {
      // 1. Update client-side state
      updatePortalData({ email })

      // 2. Persist immediately to database by calling server sync API
      await fetch('/api/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          portalData: { ...state.portalData, email },
        }),
      })

      setSuccess(true)
      sessionStorage.setItem('aumveda_exit_intent_dismissed', 'true')

      // 3. Transition directly to Step 6 (Constellation Chart) or next step
      setTimeout(() => {
        setIsOpen(false)
        goToStep(6)
      }, 1500)
    } catch (err) {
      console.error('Exit intent save failed:', err)
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md relative"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <PortalCard variant="glass" padding="lg" className="border-[#C9A84C]/35 bg-[#120A2E]">
              {success ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-400 flex items-center justify-center mx-auto text-brand-300">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Blueprint Saved!</h3>
                  <p className="text-xs text-white/50">Redirecting to your birth sky constellation...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="font-serif text-lg font-bold text-white">Don&apos;t Lose Your Blueprint</h3>
                    <p className="text-xs text-white/60">
                      Your energy configuration is calculated. Enter your email to save your progress and unlock your birth sky constellation instantly.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER YOUR EMAIL"
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-center text-xs text-white uppercase tracking-widest focus:outline-none focus:border-[#C9A84C]/50"
                    />

                    <PortalButton type="submit" disabled={submitting} className="w-full">
                      {submitting ? 'Saving Progress...' : 'Save & Reveal My Chart'}
                    </PortalButton>
                  </form>

                  <div className="flex items-center justify-center gap-1 text-[10px] text-white/30 border-t border-white/5 pt-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>No spam. Fully DPDP Act compliant. Anonymized data.</span>
                  </div>
                </div>
              )}
            </PortalCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
