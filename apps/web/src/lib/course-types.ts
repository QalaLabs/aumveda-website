export interface CourseModuleView {
  id: number
  title: string
  durationSec: number | null
  isPreview: boolean
  orderIndex: number
  completed: boolean
  watchedSec: number
}

export interface CourseView {
  id: number
  slug: string
  title: string
  description: string
  thumbnailUrl: string | null
  isPaid: boolean
  priceCents: number | null
  enrolled: boolean
  progress: number
  completedModules: number
  totalModules: number
  continueModuleId: number | null
  continueModuleTitle: string | null
  modules: CourseModuleView[]
}

export interface CourseCatalogResponse {
  success: boolean
  user: { id: string; email: string }
  courses: CourseView[]
}
