'use client'

import { useState } from 'react'
import Image from 'next/image'

const FAQ = [
  {
    q: 'Is this confidential?',
    a: 'Yes. What you share stays between you and your practitioner. Session notes are stored in India under DPDP-aligned practices and are never sold.',
  },
  {
    q: 'What if I need to reschedule?',
    a: 'Reschedule or cancel up to 24 hours before your session with no charge — reply to your confirmation email or use Sessions in your sanctuary. Within 24 hours, give as much notice as you can.',
  },
  {
    q: 'Do I need to prepare anything?',
    a: 'Find a quiet private space, stable internet, and headphones if you can. Your portal profile already informs the session — you do not need to retell everything.',
  },
  {
    q: 'Is the Discovery Call really free?',
    a: 'Yes. It is a 15-minute alignment call to review your blueprint and recommend a path. There is no obligation to purchase.',
  },
]

/** Founder + expectations + privacy — answers "Am I ready?" / "Am I safe?" */
export function TrustInvite({
  therapistName,
  therapistRole,
  therapistBio,
  onContinue,
  onBack,
}: {
  therapistName: string
  therapistRole: string
  therapistBio: string
  onContinue: () => void
  onBack: () => void
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))]">
          Discovery Call
        </p>
        <h2 className="font-serif text-3xl text-[hsl(var(--av-parchment))] text-balance">
          A private consultation
        </h2>
        <p className="font-body text-base text-[hsl(var(--av-parchment)/0.6)] leading-relaxed max-w-[48ch] mx-auto">
          Fifteen quiet minutes with a real practitioner — not a sales call, not a form.
        </p>
      </div>

      <div className="rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] overflow-hidden">
        <div className="relative aspect-[21/9] bg-[hsl(var(--av-night))]">
          <Image
            src="/marketing/founders.jpg"
            alt="Archana Jain and Sejal Jain"
            fill
            className="object-cover object-center opacity-90"
            sizes="(max-width: 640px) 100vw, 560px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-night))] via-transparent to-transparent"
            aria-hidden
          />
        </div>
        <div className="p-6 md:p-8 space-y-4 -mt-8 relative">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full bg-[hsl(var(--av-gold)/0.15)] border border-[hsl(var(--av-gold)/0.4)] flex items-center justify-center font-serif text-xl text-[hsl(var(--av-gold-soft))]"
              aria-hidden
            >
              {therapistName.charAt(0)}
            </div>
            <div>
              <h3 className="font-serif text-xl text-[hsl(var(--av-parchment))]">{therapistName}</h3>
              <p className="font-body text-sm text-[hsl(var(--av-gold))]">{therapistRole}</p>
            </div>
          </div>
          <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.7)] leading-relaxed">
            {therapistBio}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-serif text-xl text-[hsl(var(--av-parchment))] text-center">
          What happens next
        </h3>
        <ol className="space-y-6 max-w-md mx-auto">
          {[
            {
              t: 'Before',
              d: 'We review your portal profile so you do not start from zero. A confirmation email and calendar invite arrive immediately.',
            },
            {
              t: 'During',
              d: '15 quiet minutes: your blueprint, what feels urgent, and whether a Discovery path or deeper work fits.',
            },
            {
              t: 'After',
              d: 'Clear next step — Daily Dose, a programme, or simply space. No pressure. You decide.',
            },
          ].map((step) => (
            <li key={step.t} className="space-y-1">
              <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-gold))]">
                {step.t}
              </p>
              <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.7)] leading-relaxed">
                {step.d}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3 text-center max-w-[42ch] mx-auto">
        <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.5)] leading-relaxed">
          Confidential. India-hosted. Your story stays with the people guiding you.
        </p>
        <p className="font-body text-xs text-[hsl(var(--av-parchment)/0.4)] leading-relaxed">
          Cancel or reschedule free of charge until 24 hours before. After that, reply to your
          confirmation so we can offer the slot to someone waiting.
        </p>
      </div>

      <div className="border-t border-[hsl(var(--av-parchment)/0.1)] pt-8 space-y-2 max-w-lg mx-auto">
        <p className="font-body text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--av-parchment)/0.4)] text-center mb-4">
          Common questions
        </p>
        {FAQ.map((item, i) => (
          <div key={item.q} className="border-b border-[hsl(var(--av-parchment)/0.08)]">
            <button
              type="button"
              aria-expanded={openFaq === i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full min-h-[48px] flex items-center justify-between gap-4 py-3 text-left font-body text-sm text-[hsl(var(--av-parchment))]"
            >
              {item.q}
              <span className="text-[hsl(var(--av-gold))]" aria-hidden>
                {openFaq === i ? '−' : '+'}
              </span>
            </button>
            {openFaq === i && (
              <p className="pb-4 font-body text-sm text-[hsl(var(--av-parchment)/0.55)] leading-relaxed">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="min-h-[52px] px-10 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] font-body font-medium transition-opacity duration-300 hover:opacity-90"
        >
          Choose a time
        </button>
        <button
          type="button"
          onClick={onBack}
          className="font-body text-sm text-[hsl(var(--av-parchment)/0.4)]"
        >
          Back to blueprint
        </button>
      </div>
    </div>
  )
}
