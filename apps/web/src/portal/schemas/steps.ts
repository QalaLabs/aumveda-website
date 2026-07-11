import { z } from 'zod'

export const step1Schema = z.object({})

export const step2Schema = z.object({
  chakraSelected: z.string().min(1, 'Please select a chakra'),
})

export const step3Schema = z.object({
  archetypeSelected: z.string().min(1, 'Please select an archetype'),
  archetypeGift: z.string().optional(),
  archetypeShadow: z.string().optional(),
  archetypeElement: z.string().optional(),
})

export const step4Schema = z.object({
  tarotCard: z.string().min(1, 'Please draw a card'),
  tarotTheme: z.string().optional(),
  tarotSeed: z.number().optional(),
  tarotTimestamp: z.number().optional(),
})

export const step5Schema = z.object({
  intention: z.string().min(20, 'Please write at least 20 characters').max(1000, 'Intention must be under 1,000 characters'),
})

export const step6Schema = z.object({
  dob: z.string().min(1, 'Date of birth is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  email: z.string().email('Please enter a valid email'),
})

export const step7Schema = z.object({
  q1Answer: z.string().min(1, 'Please answer all questions'),
  q2Answer: z.string().min(1, 'Please answer all questions'),
  q3Answer: z.string().min(1, 'Please answer all questions'),
  q4Answer: z.string().min(1, 'Please answer all questions'),
  q5Answer: z.string().min(1, 'Please answer all questions'),
  q6Answer: z.string().min(1, 'Please answer all questions'),
  q7Answer: z.string().min(1, 'Please answer all questions'),
})

export const step8Schema = z.object({})

export const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
  8: step8Schema,
} as const
