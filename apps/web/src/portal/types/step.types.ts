import type { PortalData } from '../engine/types'

export interface Step1Data {}

export interface Step2Data {
  chakraSelected: string
}

export interface Step3Data {
  archetypeSelected: string
}

export interface Step4Data {
  tarotCard: string
  tarotTheme: string
}

export interface Step5Data {
  intentionText?: string
}

export interface Step6Data {
  dob: string
  email: string
  timeOfBirth?: string
  placeOfBirth: string
  birthLat?: number
  birthLng?: number
}

export interface Step7Data {
  q1Answer: string
  q2Answer: string
  q3Answer: string
  q4Answer: string
  q5Answer: string
  q6Answer: string
  q7Answer: string
  nervousSystemScore?: string
  relationshipScore?: string
  childhoodScore?: string
  financialScore?: string
  profileResult?: string
}

export interface Step8Data {
  portalCompletedAt?: string
}

export type StepDataMap = {
  1: Step1Data
  2: Step2Data
  3: Step3Data
  4: Step4Data
  5: Step5Data
  6: Step6Data
  7: Step7Data
  8: Step8Data
}

export type StepDataFor<N extends keyof StepDataMap> = StepDataMap[N]
