'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import ActivityFilters from '@/components/ActivityFilters'
import ActivityItem from '@/components/ActivityItem'
import ActivityDetailModal from '@/components/ActivityDetailModal'
import ActivityStats from '@/components/ActivityStats'
import { History, Loader2, RefreshCw, ArrowDown, ArrowUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { showError } from '@/utils/toast'
import Topbar from '../../_components/Topbar'

export default function ActivityPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeType, setActiveType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const fetchEvents = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true)
    else setLoading(true)
    try {
      const cursorParam = isLoadMore && nextCursor ? `&cursor=${nextCursor}` : ''
      const typeParam = activeType !== 'all' ? `&type=${activeType}` : ''
      const res = await fetch(`/api/events?limit=15${typeParam}${cursorParam}`)
      const data = await res.json()
      if (data.success) {
        if (isLoadMore) setEvents(prev => [...prev, ...data.events])
        else setEvents(data.events)
        setNextCursor(data.nextCursor)
      }
    } catch {
      showError('Failed to load activity timeline')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [activeType, nextCursor])

  useEffect(() => { fetchEvents() }, [activeType])

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredEvents = events.filter(e =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = useMemo(() => {
    const activeDays = new Set(
      events.map(e => (e.timestamp || '').slice(0, 10)).filter(Boolean)
    ).size
    const milestones = events.filter(e => e.isMilestone).length
    const eventTypes = new Set(events.map(e => e.name || e.type).filter(Boolean)).size
    return { total: events.length, activeDays, milestones, eventTypes }
  }, [events])

  return (
    <>
      <Topbar title="Growth Timeline" />
      <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto">

        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em]">
              <Sparkles className="w-4 h-4" /> Your Evolution
            </div>
            <p className="text-slate-500 font-medium max-w-md">
              Every action you take is a seed planted for your future self.
            </p>
          </div>
          <Button onClick={() => fetchEvents()} variant="outline" className="bg-white rounded-2xl border-slate-200 h-12 px-8 font-bold text-xs shadow-sm">
            <RefreshCw className={loading ? 'w-4 h-4 mr-2 animate-spin' : 'w-4 h-4 mr-2'} />
            Refresh Journey
          </Button>
        </div>

        <ActivityStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
          <aside className="lg:col-span-4">
            <div className="sticky top-8">
              <ActivityFilters
                activeType={activeType}
                onTypeChange={setActiveType}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>
          </aside>

          <div className="lg:col-span-8">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-400 animate-pulse">Reconstructing your path...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900">No events found</h3>
                <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or start your journey.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map(event => (
                  <ActivityItem key={event.id} event={event} onInspect={setSelectedEvent} />
                ))}
                {nextCursor && (
                  <div className="pt-8 flex justify-center">
                    <Button onClick={() => fetchEvents(true)} disabled={loadingMore} variant="ghost" className="rounded-2xl h-14 px-12 font-bold text-slate-400 hover:text-primary hover:bg-accent">
                      {loadingMore ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowDown className="w-5 h-5 mr-2" />}
                      Load Older Activity
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {showBackToTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-8 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-slate-900 text-white shadow-2xl z-50"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      <ActivityDetailModal event={selectedEvent} isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  )
}
