import { z, type ZodSchema } from 'zod'
import type { ValidationResult, PortalStep, PortalData } from './types'

export class ValidationEngine {
  validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult {
    const result = schema.safeParse(data)
    if (result.success) {
      return { valid: true, errors: {} }
    }

    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const path = issue.path.join('.') || '_root'
      if (!errors[path]) errors[path] = []
      errors[path].push(issue.message)
    }

    return { valid: false, errors }
  }

  validateStepData(
    schema: ZodSchema | undefined,
    data: Partial<PortalData>,
    step: PortalStep,
  ): ValidationResult {
    if (!schema) {
      return { valid: true, errors: {} }
    }
    return this.validate(schema, data)
  }

  validateStepCompletion(
    requiredFields: (keyof PortalData)[],
    data: Partial<PortalData>,
  ): ValidationResult {
    const missing: Record<string, string[]> = {}
    for (const field of requiredFields) {
      const value = data[field]
      if (value === undefined || value === null || value === '') {
        missing[field] = [`${field} is required`]
      }
    }
    return {
      valid: Object.keys(missing).length === 0,
      errors: missing,
    }
  }
}

export const portalSchema = {
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  dob: z.string().min(1, 'Date of birth is required').optional(),
  placeOfBirth: z.string().min(1, 'Place of birth is required').optional(),
  intentionText: z.string().max(500, 'Intention must be under 500 characters').optional(),
  chakraSelected: z.string().min(1, 'Please select a chakra').optional(),
  archetypeSelected: z.string().min(1, 'Please select an archetype').optional(),
  tarotCard: z.string().min(1, 'Please draw a card').optional(),
  tarotTheme: z.string().min(1, 'Tarot theme is required').optional(),
}

export const engine = new ValidationEngine()
