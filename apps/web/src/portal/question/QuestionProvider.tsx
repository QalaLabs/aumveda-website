'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Question, QuestionResult, QuestionPhase, QuestionContextValue } from './types'

interface QuestionProviderProps {
  children: ReactNode
  questions: Question[]
  onComplete?: (results: QuestionResult[]) => void
}

const QuestionCtx = createContext<QuestionContextValue | null>(null)

export function QuestionProvider({ children, questions, onComplete }: QuestionProviderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<Record<string, QuestionResult>>({})
  const [phase, setPhase] = useState<QuestionPhase>('answering')

  const currentQuestion = useMemo(
    () => questions[currentIndex] ?? null,
    [questions, currentIndex],
  )

  const progress = useMemo(
    () => questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0,
    [currentIndex, questions.length],
  )

  const selectAnswer = useCallback((optionId: string) => {
    if (!currentQuestion) return
    const option = currentQuestion.options.find((o) => o.id === optionId)
    if (!option) return

    setResults((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        optionId,
        value: option.value,
      },
    }))
    setPhase('locked')
  }, [currentQuestion])

  const next = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setPhase('answering')
    } else {
      onComplete?.(Object.values(results))
    }
  }, [currentIndex, questions.length, onComplete, results])

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setPhase('answering')
    }
  }, [currentIndex])

  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1
  const canProceed = phase === 'locked'

  const getScore = useCallback((category?: string): number => {
    const all = Object.values(results)
    const filtered = category
      ? all.filter((r) => {
          const q = questions.find((q) => q.id === r.questionId)
          return q?.category === category
        })
      : all
    return filtered.reduce((sum, r) => sum + (typeof r.value === 'number' ? r.value : 0), 0)
  }, [results, questions])

  const getAllResults = useCallback(() => Object.values(results), [results])

  return (
    <QuestionCtx.Provider value={{
      questions,
      currentIndex,
      results,
      phase,
      currentQuestion,
      progress,
      totalQuestions: questions.length,
      selectAnswer,
      next,
      previous,
      isFirst,
      isLast,
      canProceed,
      getScore,
      getAllResults,
    }}>
      {children}
    </QuestionCtx.Provider>
  )
}

export function useQuestion(): QuestionContextValue {
  const ctx = useContext(QuestionCtx)
  if (!ctx) throw new Error('useQuestion must be used within a QuestionProvider')
  return ctx
}
