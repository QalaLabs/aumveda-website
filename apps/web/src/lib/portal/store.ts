'use client'

import { create } from 'zustand'
import type { PortalState, PortalStep, ChakraType, ArchetypeType, TarotThemeType, ProfileResult } from '@aumveda/types'

interface PortalStore extends PortalState {
  setStep: (step: PortalStep) => void
  setChakra: (chakra: ChakraType) => void
  setArchetype: (archetype: ArchetypeType) => void
  setTarot: (card: string, theme: TarotThemeType) => void
  setIntention: (text: string) => void
  setBirthDetails: (details: { dob: string; timeOfBirth?: string; placeOfBirth: string; lat: number; lng: number }) => void
  setEmail: (email: string) => void
  setAnswers: (qNum: number, answer: string) => void
  setScores: (scores: { nervousSystem: string; relationship: string; childhood: string; financial: string; profile: ProfileResult }) => void
  setAstrology: (astro: { sunSign: string; moonSign: string; risingSign: string }) => void
  reset: () => void
}

const initialState: PortalState = {
  step: 1,
  chakraSelected: null,
  archetypeSelected: null,
  tarotCard: null,
  tarotTheme: null,
  intentionText: null,
  dob: null,
  timeOfBirth: null,
  placeOfBirth: null,
  birthLat: null,
  birthLng: null,
  email: null,
  q1Answer: null, q2Answer: null, q3Answer: null, q4Answer: null,
  q5Answer: null, q6Answer: null, q7Answer: null,
  nervousSystemScore: null,
  relationshipScore: null,
  childhoodScore: null,
  financialScore: null,
  profileResult: null,
  sunSign: null,
  moonSign: null,
  risingSign: null,
}

export const usePortalStore = create<PortalStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setChakra: (chakra) => set({ chakraSelected: chakra }),
  setArchetype: (archetype) => set({ archetypeSelected: archetype }),
  setTarot: (card, theme) => set({ tarotCard: card, tarotTheme: theme }),
  setIntention: (text) => set({ intentionText: text }),
  setBirthDetails: (details) => set({
    dob: details.dob,
    timeOfBirth: details.timeOfBirth || null,
    placeOfBirth: details.placeOfBirth,
    birthLat: details.lat,
    birthLng: details.lng,
  }),
  setEmail: (email) => set({ email }),
  setAnswers: (qNum, answer) => set({ [`q${qNum}Answer`]: answer } as Partial<PortalStore>),
  setScores: (scores) => set({
    nervousSystemScore: scores.nervousSystem,
    relationshipScore: scores.relationship,
    childhoodScore: scores.childhood,
    financialScore: scores.financial,
    profileResult: scores.profile,
  }),
  setAstrology: (astro) => set({
    sunSign: astro.sunSign,
    moonSign: astro.moonSign,
    risingSign: astro.risingSign,
  }),
  reset: () => set(initialState),
}))
