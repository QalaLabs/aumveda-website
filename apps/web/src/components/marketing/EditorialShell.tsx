import Link from "next/link";
import type { ReactNode } from "react";

/** Shared editorial chrome for parchment trust pages (Phase 2). */
export function EditorialPage({ children }: { children: ReactNode }) {
  return (
    <div data-surface="parchment" className="min-h-screen bg-parchment texture-paper text-ink-text">
      {children}
    </div>
  );
}

export function EditorialHero({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
}) {
  return (
    <section className="border-b border-stone">
      <div className="av-content av-gutter pt-28 pb-16 md:pt-36 md:pb-24">
        <p className="av-eyebrow-ink mb-6 text-gold">{eyebrow}</p>
        <h1 className="av-display max-w-[18ch] text-night">{title}</h1>
        <p className="av-lede mt-8 max-w-[55ch] text-mute">{lede}</p>
      </div>
    </section>
  );
}

export function EditorialSection({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`border-b border-stone ${className}`}>
      <div className="av-content av-gutter av-section-y">
        {(eyebrow || title) && (
          <div className="mb-12 max-w-2xl md:mb-16">
            {eyebrow && <p className="av-eyebrow-ink mb-4 text-gold">{eyebrow}</p>}
            {title && <h2 className="av-title text-night">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function BeginCtaBand({
  title = "Begin where trust begins.",
  body = "The portal is quiet. Eight steps. Your map before any prescription.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section data-surface="night" className="surface-night">
      <div className="av-content av-gutter av-section-y text-center">
        <h2 className="av-title text-parchment">{title}</h2>
        <p className="av-lede mx-auto mt-6 max-w-xl text-[hsl(var(--av-parchment)/0.65)]">{body}</p>
        <Link href="/step-1" className="av-cta mt-12 border-[hsl(var(--av-gold)/0.5)]">
          Begin Your Journey
        </Link>
      </div>
    </section>
  );
}
