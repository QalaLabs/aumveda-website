'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface TopbarProps {
  title?: string
}

export default function Topbar({ title }: TopbarProps) {
  const { data: session } = useSession()
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const first = session?.user?.name?.split(' ')[0] ?? 'friend'

  return (
    <header className="sticky top-0 z-20 bg-[hsl(var(--av-parchment)/0.92)] backdrop-blur-md border-b border-[hsl(var(--av-stone))] px-6 h-14 md:h-16 flex items-center justify-between">
      <div>
        {title ? (
          <h1 className="font-serif text-lg text-[hsl(var(--av-night))]">{title}</h1>
        ) : (
          <p className="font-body text-sm text-[hsl(var(--av-mute))]">
            {greeting},{' '}
            <span className="text-[hsl(var(--av-night))]">{first}</span>
          </p>
        )}
      </div>
      <Link
        href="/dashboard/settings"
        aria-label="Settings"
        className="w-9 h-9 rounded-full bg-[hsl(var(--av-night))] text-[hsl(var(--av-gold-soft))] flex items-center justify-center font-body text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
      >
        {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
      </Link>
    </header>
  )
}
