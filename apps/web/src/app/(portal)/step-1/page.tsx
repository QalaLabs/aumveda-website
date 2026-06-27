'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalStore } from '@/lib/portal/store'

export default function Step1Breath() {
  const [phase, setPhase] = useState<'inhale' | 'exhale' | 'done'>('inhale')
  const [cycle, setCycle] = useState(0)
  const setStep = usePortalStore(s => s.setStep)
  const router = useRouter()

  useEffect(() => {
    if (phase === 'done') return
    const timer = setTimeout(() => {
      if (phase === 'inhale') {
        setPhase('exhale')
      } else {
        if (cycle >= 2) {
          setPhase('done')
        } else {
          setPhase('inhale')
          setCycle(c => c + 1)
        }
      }
    }, phase === 'inhale' ? 4000 : 4000)
    return () => clearTimeout(timer)
  }, [phase, cycle])

  const handleContinue = () => {
    setStep(2)
    router.push('/step-2')
  }

  return (
    <div className="text-center max-w-md">
      {phase !== 'done' ? (
        <>
          <div className="relative w-48 h-48 mx-auto mb-12">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-[4000ms] ease-in-out ${
                phase === 'inhale' ? 'scale-100 opacity-30' : 'scale-50 opacity-10'
              } bg-[#C9A84C]`}
            />
            <div
              className={`absolute inset-4 rounded-full transition-all duration-[4000ms] ease-in-out ${
                phase === 'inhale' ? 'scale-100 opacity-50' : 'scale-50 opacity-20'
              } bg-[#C9A84C]`}
            />
            <div
              className={`absolute inset-12 rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                phase === 'inhale' ? 'scale-100 opacity-80' : 'scale-50 opacity-40'
              } bg-[#C9A84C]`}
            >
              <span className="text-[#1A0F3C] text-lg font-semibold">
                {phase === 'inhale' ? 'INHALE' : 'EXHALE'}
              </span>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            {phase === 'inhale' ? 'Inhale through your nose' : 'Exhale through your mouth'}
          </p>
          <p className="text-white/30 text-xs mt-2">Cycle {cycle + 1} of 3</p>
        </>
      ) : (
        <div className="animate-fade-in">
          <p className="text-2xl font-serif text-[#C9A84C] mb-8">Good. You&apos;re here. Fully.</p>
          <button
            onClick={handleContinue}
            className="bg-[#C9A84C] text-[#1A0F3C] px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d4b85a] transition-all hover:scale-105"
          >
            Begin Your Journey →
          </button>
        </div>
      )}
    </div>
  )
}
