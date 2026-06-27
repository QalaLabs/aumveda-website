import type { ProfileResult } from '@aumveda/types'
import { SCORING_RULES } from './constants'

export function calculateProfile(answers: Record<string, string>): {
  nervousSystem: string
  relationship: string
  childhood: string
  financial: string
  profile: ProfileResult
} {
  const nsAnswers = [answers.q1, answers.q2, answers.q3].filter(Boolean)
  const relAnswer = answers.q4
  const finAnswer = answers.q5
  const childAnswers = [answers.q6, answers.q7].filter(Boolean)

  const qIds = ['q1', 'q2', 'q3']
  const nsCounts: Record<string, number> = {}
  nsAnswers.forEach((a, i) => {
    const rule = SCORING_RULES.find(r => r.questionId === qIds[i] && r.answer === a && r.dimension === 'nervous_system')
    if (rule) nsCounts[rule.value] = (nsCounts[rule.value] || 0) + 1
  })
  const nervousSystem = Object.entries(nsCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'REGULATED'

  const relRule = SCORING_RULES.find(r => r.questionId === 'q4' && r.answer === relAnswer)
  const relationship = relRule?.value || 'SECURE'

  const finRule = SCORING_RULES.find(r => r.questionId === 'q5' && r.answer === finAnswer)
  const financial = finRule?.value || 'SECURE'

  const childQIds = ['q6', 'q7']
  const childCounts: Record<string, number> = {}
  childAnswers.forEach((a, i) => {
    const rule = SCORING_RULES.find(r => r.questionId === childQIds[i] && r.answer === a && r.dimension === 'childhood')
    if (rule) childCounts[rule.value] = (childCounts[rule.value] || 0) + 1
  })
  const childhood = Object.entries(childCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'SECURE_ATTACHMENT'

  const profile = matchProfile(nervousSystem, relationship, childhood)

  return { nervousSystem, relationship, childhood, financial, profile }
}

function matchProfile(ns: string, rel: string, childhood: string): ProfileResult {
  if ((ns === 'ANXIOUS' || ns === 'HYPERACTIVE') && rel === 'PEOPLE_PLEASING' && (childhood === 'PARENTIFIED' || childhood === 'EMOTIONAL_NEGLECT')) return 'anxious_achiever'
  if (ns === 'SHUTDOWN' && rel === 'AVOIDANT' && (childhood === 'ABSENT_ATTACHMENT' || childhood === 'LONELY_ABANDONED')) return 'frozen_heart'
  if (ns === 'FIGHT' && rel === 'REPEATING_PATTERNS' && (childhood === 'WOUNDED_ATTACHMENT' || childhood === 'WOUNDED_ATTACHMENT')) return 'wounded_warrior'
  if (ns === 'ANXIOUS' && rel === 'AVOIDANT' && childhood === 'EMOTIONAL_NEGLECT') return 'silent_sufferer'
  if (ns === 'SHUTDOWN' && rel === 'PEOPLE_PLEASING' && childhood === 'LONELY_ABANDONED') return 'lost_soul'
  return 'awakening_one'
}
