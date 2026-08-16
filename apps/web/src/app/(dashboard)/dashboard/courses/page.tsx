'use client'

import { useCallback, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  PlayCircle,
  BookOpen,
  ChevronRight,
  Lock,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import CoursePlayer from '@/components/CoursePlayer'
import { showSuccess, showError } from '@/utils/toast'
import Topbar from '../../_components/Topbar'
import type { CourseCatalogResponse, CourseView } from '@/lib/course-types'

export default function CoursesPage() {
  const [data, setData] = useState<CourseCatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [enrollingId, setEnrollingId] = useState<number | null>(null)

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

  const handleEnroll = async (course: CourseView) => {
    setEnrollingId(course.id)
    try {
      const res = await fetch(`/api/courses/${course.id}/enroll`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Enrolment failed')
      }
      showSuccess(`Enrolled in ${course.title}!`)
      await load()
    } catch (err: any) {
      showError(err.message ?? 'Enrolment failed')
    } finally {
      setEnrollingId(null)
    }
  }

  const handleModuleComplete = async () => {
    await load()
  }

  if (loading) {
    return (
      <>
        <Topbar title="My Courses" />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Topbar title="My Courses" />
        <div className="px-4 lg:px-8 py-16 max-w-md mx-auto text-center">
          <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-4" />
          <h2 className="font-bold text-slate-900 mb-2">Could not load your courses</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <Button onClick={load} className="rounded-xl">
            Retry
          </Button>
        </div>
      </>
    )
  }

  const courses = data?.courses ?? []
  const user = data?.user ?? { id: '', email: '' }
  const enrolledCount = courses.filter((c) => c.enrolled).length
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null

  if (selectedCourse && selectedCourse.enrolled && selectedCourse.modules.length > 0) {
    return (
      <>
        <Topbar title={selectedCourse.title} />
        <CoursePlayer
          course={selectedCourse}
          user={user}
          onModuleComplete={handleModuleComplete}
        />
        <div className="px-4 lg:px-8 py-4 max-w-6xl mx-auto">
          <Button variant="outline" size="sm" onClick={() => setSelectedCourseId(null)} className="rounded-lg">
            Back to Courses
          </Button>
        </div>
      </>
    )
  }

  if (courses.length === 0) {
    return (
      <>
        <Topbar title="My Courses" />
        <div className="px-4 lg:px-8 py-20 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-2xl text-slate-900 mb-2">No courses yet</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Courses will appear here as soon as they are published. Check back soon.
          </p>
        </div>
      </>
    )
  }

  const inProgress = courses.filter((c) => c.enrolled && c.progress > 0)

  return (
    <>
      <Topbar title="My Courses" />
      <div className="px-4 lg:px-8 py-6 max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 font-medium">Your Ayurvedic learning journey, curated for your Prakriti.</p>
          <Badge className="bg-primary/10 text-primary border-none font-bold">
            {enrolledCount} enrolled
          </Badge>
        </div>

        {inProgress.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary" />
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgress.map((course) => (
                <Card
                  key={course.id}
                  className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-emerald-400/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-xs font-bold">{course.progress}% complete</span>
                        <span className="text-white/70 text-xs">{course.totalModules} lessons</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-slate-900 mb-1">{course.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                    <Button
                      onClick={() => setSelectedCourseId(course.id)}
                      className="w-full bg-slate-900 hover:bg-black rounded-xl h-10"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {course.continueModuleTitle
                        ? `Resume: ${course.continueModuleTitle}`
                        : 'Continue Course'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            All Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="border-none shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-emerald-400/60" />
                    </div>
                  )}
                  {!course.enrolled && !course.isPaid && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white/60" />
                    </div>
                  )}
                  {course.enrolled && (
                    <Badge className="absolute top-3 right-3 bg-emerald-500 text-white border-none text-[10px] font-bold">
                      Enrolled
                    </Badge>
                  )}
                  {course.isPaid && !course.enrolled && (
                    <Badge className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white border-none text-[10px] font-bold uppercase tracking-widest">
                      Paid
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-500 mb-3 flex-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-4">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      {course.totalModules} lessons
                    </span>
                    {course.isPaid && course.priceCents != null && (
                      <span>₹{(course.priceCents / 100).toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  {course.enrolled ? (
                    <Button
                      size="sm"
                      onClick={() => setSelectedCourseId(course.id)}
                      className="w-full bg-slate-900 hover:bg-black rounded-lg h-9"
                    >
                      <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                      {course.progress > 0 ? 'Continue' : 'Start'}
                    </Button>
                  ) : course.isPaid ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="w-full rounded-lg h-9 border-slate-200 text-slate-400"
                    >
                      <Lock className="w-3.5 h-3.5 mr-1.5" />
                      Checkout Coming
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleEnroll(course)}
                      disabled={enrollingId === course.id}
                      variant="outline"
                      className="w-full rounded-lg h-9 border-slate-200 hover:bg-slate-50"
                    >
                      {enrollingId === course.id ? (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      Enroll Free
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
