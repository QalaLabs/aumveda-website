import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: '%s | AUMVEDA',
    default: 'AUMVEDA — Your Daily Dose of Healing',
  },
  description:
    'Mother–daughter Neuro-Vedic healing. Ancient Indian wisdom meets nervous-system science — delivered as a daily dose of healing.',
  keywords: [
    'AUMVEDA',
    'daily dose of healing',
    'Neuro-Vedic',
    'somatic healing',
    'Vedic astrology',
    'mother daughter healers',
  ],
  authors: [{ name: 'Archana Jain' }, { name: 'Sejal Jain' }],
  openGraph: {
    type: 'website',
    siteName: 'AUMVEDA',
    title: 'AUMVEDA — Your Daily Dose of Healing',
    description: 'Mother–Daughter Neuro-Vedic Healing. Guided by Archana & Sejal Jain.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUMVEDA',
    description: 'Your Daily Dose of Healing',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable} ${jetbrains.variable}`}>
      <body className="antialiased font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
