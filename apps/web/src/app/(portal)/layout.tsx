import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { PortalClientShell } from './PortalClientShell'

// Portal is a private lead funnel — must not surface in search results, and
// browser previews of the URL should carry the branded copy, not the generic
// site metadata.
export const metadata: Metadata = {
  title: 'Begin Your Journey — Aumveda',
  description: 'Decode your birth chart and your patterns in 8 steps.',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalClientShell>{children}</PortalClientShell>
}
