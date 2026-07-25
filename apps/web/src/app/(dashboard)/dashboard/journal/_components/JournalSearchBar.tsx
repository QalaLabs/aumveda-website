'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Loader2 } from 'lucide-react'

export default function JournalSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [isPending, startTransition] = useTransition()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      if (query.trim()) {
        router.push(`/dashboard/journal?search=${encodeURIComponent(query.trim())}`)
      } else {
        router.push('/dashboard/journal')
      }
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative flex-1 max-w-sm" role="search">
      <label htmlFor="journal-search" className="sr-only">
        Search journal entries
      </label>
      <input
        id="journal-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title, body, or #tag…"
        className="w-full h-11 min-h-[44px] font-body text-sm text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-2xl pl-10 pr-4 bg-[hsl(40_40%_97%)] placeholder:text-[hsl(var(--av-mute))] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] transition-[box-shadow,border-color] duration-[var(--duration-ui)]"
      />
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[hsl(var(--av-mute))] pointer-events-none" aria-hidden>
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" strokeWidth={1.5} />
        )}
      </div>
    </form>
  )
}
