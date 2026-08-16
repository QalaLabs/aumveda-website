'use client'

import React, { useState } from 'react'
import { Clock, CheckCircle2, PlayCircle, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CourseSidebar from '@/components/CourseSidebar'
import VideoPlayer from '@/components/VideoPlayer'
import { showSuccess } from '@/utils/toast'
import type { CourseView } from '@/lib/course-types'

interface CoursePlayerProps {
  course: CourseView
  user: { id: string; email: string }
  onModuleComplete: (moduleId: number) => void
}

export default function CoursePlayer({ course, user, onModuleComplete }: CoursePlayerProps) {
  const [activeModuleId, setActiveModuleId] = useState<number>(
    course.continueModuleId ?? course.modules[0]?.id ?? -1,
  )
  const [saving, setSaving] = useState(false)

  const activeModule = course.modules.find((m) => m.id === activeModuleId)
  const completedCount = course.modules.filter((m) => m.completed).length
  const overallProgress = course.totalModules
    ? Math.round((completedCount / course.totalModules) * 100)
    : 0

  const handleMarkComplete = async () => {
    if (!activeModule || saving) return
    setSaving(true)
    try {
      const res = await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          moduleId: activeModule.id,
          status: 'completed',
        }),
      })
      if (!res.ok) throw new Error('Failed to save progress')
      onModuleComplete(activeModule.id)
      const next = course.modules.find((m) => !m.completed && m.id !== activeModule.id)
      if (next) {
        setActiveModuleId(next.id)
      }
      showSuccess('Lesson marked complete')
    } catch {
      showSuccess('Could not save progress. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!activeModule) {
    return (
      <div className="p-10 text-center">
        <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm">No lessons published yet for this course.</p>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Video Area */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        <div className="p-4">
          <VideoPlayer
            courseId={String(course.id)}
            moduleId={String(activeModule.id)}
            userId={user.id}
            userEmail={user.email}
          />
        </div>

        <div className="p-6 md:p-8 bg-slate-900 flex-1 overflow-y-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4" />
              {course.title}
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{activeModule.title}</h2>
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
              {activeModule.durationSec != null && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {Math.floor(activeModule.durationSec / 60)} min
                </span>
              )}
              {activeModule.isPreview && (
                <Badge variant="secondary" className="bg-slate-800 text-slate-400 border-none">
                  Preview
                </Badge>
              )}
              {activeModule.completed && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Completed
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">{course.description}</p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Button
                onClick={handleMarkComplete}
                disabled={saving || activeModule.completed}
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {activeModule.completed ? 'Lesson Completed' : 'Mark Complete & Continue'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 hidden lg:block shrink-0">
        <CourseSidebar
          modules={course.modules.map((m) => ({ ...m }))}
          activeModuleId={activeModuleId}
          onModuleSelect={(id) => setActiveModuleId(Number(id))}
          courseTitle={course.title}
          overallProgress={overallProgress}
        />
      </div>
    </div>
  )
}
