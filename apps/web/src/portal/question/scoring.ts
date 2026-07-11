import type { QuestionResult } from './types'

export interface ScoreProfile {
  categories: Record<string, number>
  total: number
  maxPossible: number
  percentage: number
}

export function calculateProfile(
  results: QuestionResult[],
  categoryWeights?: Record<string, number>,
): ScoreProfile {
  const categories: Record<string, number> = {}
  let total = 0

  for (const r of results) {
    const value = typeof r.value === 'number' ? r.value : 0
    total += value
    const cat = r.questionId.split('-')[0] || 'general'
    categories[cat] = (categories[cat] || 0) + value
  }

  if (categoryWeights) {
    for (const [cat, weight] of Object.entries(categoryWeights)) {
      if (categories[cat]) {
        categories[cat] *= weight
      }
    }
  }

  const maxPossible = results.length * 5
  const percentage = maxPossible > 0 ? (total / maxPossible) * 100 : 0

  return { categories, total, maxPossible, percentage }
}

export function classifyProfile(percentage: number): { label: string; tier: number } {
  if (percentage >= 80) return { label: 'Harmonized', tier: 5 }
  if (percentage >= 60) return { label: 'Balanced', tier: 4 }
  if (percentage >= 40) return { label: 'Developing', tier: 3 }
  if (percentage >= 20) return { label: 'Emerging', tier: 2 }
  return { label: 'Seedling', tier: 1 }
}
