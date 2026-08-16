'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, BookOpen, PlayCircle, CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react'
import CoursePlayer from '@/components/CoursePlayer'
import Topbar from '../../_components/Topbar'
import type { CourseCatalogResponse, CourseView } from '@/lib/course-types'

export default function LearnPage() {
  const [data, setData] = useState<CourseCatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/courses')
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Failed to load courses')
      }
      setData(await res.json())
      setError(null)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <>
        <Topbar title="Learn" />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Topbar title="Learn" />
        <div className="px-4 lg:px-8 py-16 max-w-md mx-auto text-center">
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
          <h2 className="font-bold text-slate-900 mb-2">Could not load your lessons</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <Button onClick={load} className="rounded-xl">
            Retry
          </Button>
        </div>
      </>
    )
  }

  const enrolled = (data?.courses ?? []).filter(
    (c) => c.enrolled && c.totalModules > 0,
  )
  const user = data?.user ?? { id: '', email: '' }
  const selectedCourse =
    enrolled.find((c) => c.id === selectedCourseId) ?? enrolled[0] ?? null

  if (!selectedCourse) {
    return (
      <>
        <Topbar title="Learn" />
        <div className="px-4 lg:px-8 py-20 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-slate-900 mb-2">Nothing enrolled yet</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Enrol in a free course from My Courses to begin your learning journey.
          </p>
          <Link href="/dashboard/courses">
            <Button className="rounded-xl">
              Browse Courses
            </Button>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar title="Learn" />
      <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-6">
        {/* Course selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {enrolled.map((course: CourseView) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                selectedCourse.id === course.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-serif text-xl text-slate-900">{selectedCourse.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              {selectedCourse.completedModules} of {selectedCourse.totalModules} lessons complete ·{' '}
              {selectedCourse.progress}%
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedCourse.progress === 100 && (
              <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
            {selectedCourse.continueModuleTitle && selectedCourse.progress < 100 && (
              <span className="hidden md:flex items-center gap-1 text-xs text-slate-500">
                <PlayCircle className="w-3.5 h-3.5 text-primary" />
                Resume: {selectedCourse.continueModuleTitle}
              </span>
            )}
          </div>
        </div>
      </div>

      <CoursePlayer
        course={selectedCourse}
        user={user}
        onModuleComplete={load}
      />

      <div className="px-4 lg:px-8 py-4 max-w-6xl mx-auto">
        <Link href="/dashboard/courses">
          <Button variant="outline" size="sm" className="rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to My Courses
          </Button>
        </Link>
      </div>
    </>
  )
}
