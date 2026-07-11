export interface QuestionOption {
  id: string
  label: string
  value: number | string
  description?: string
}

export interface Question {
  id: string
  text: string
  subtitle?: string
  options: QuestionOption[]
  category?: string
}

export interface QuestionResult {
  questionId: string
  optionId: string
  value: number | string
}

export interface ScoreProfile {
  categories: Record<string, number>
  total: number
  maxPossible: number
  percentage: number
}

export type QuestionPhase = 'answering' | 'locked' | 'next'

export interface QuestionContextValue {
  questions: Question[]
  currentIndex: number
  results: Record<string, QuestionResult>
  phase: QuestionPhase
  currentQuestion: Question | null
  progress: number
  totalQuestions: number
  selectAnswer: (optionId: string) => void
  next: () => void
  previous: () => void
  isFirst: boolean
  isLast: boolean
  canProceed: boolean
  getScore: (category?: string) => number
  getAllResults: () => QuestionResult[]
}
