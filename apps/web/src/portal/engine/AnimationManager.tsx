'use client'

import { AnimatePresence, motion, type TargetAndTransition, type VariantLabels } from 'framer-motion'
import type { ReactNode } from 'react'
import type { AnimationDefinition, AnimationType, PortalStep } from './types'
import { StepRegistry } from './StepRegistry'

type AnimationTarget = TargetAndTransition | VariantLabels

interface VariantDef {
  enter: AnimationTarget
  exit: AnimationTarget
}

const VARIANT_MAP: Record<AnimationType, VariantDef> = {
  fade: {
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    enter: { x: 0, opacity: 1 },
    exit: { x: -60, opacity: 0 },
  },
  slideRight: {
    enter: { x: 0, opacity: 1 },
    exit: { x: 60, opacity: 0 },
  },
  scaleIn: {
    enter: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  slideUp: {
    enter: { y: 0, opacity: 1 },
    exit: { y: 40, opacity: 0 },
  },
  custom: {
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  },
}

interface AnimationManagerProps {
  step: PortalStep
  direction: 'forward' | 'backward' | null
  children: ReactNode
}

function getVariantsForStep(step: PortalStep, direction: 'forward' | 'backward' | null): VariantDef {
  const config = StepRegistry.get(step)
  if (!config) return VARIANT_MAP.fade

  if (direction === 'backward') {
    return VARIANT_MAP[config.exitAnimation.type] || VARIANT_MAP.fade
  }
  return VARIANT_MAP[config.enterAnimation.type] || VARIANT_MAP.fade
}

export function AnimationManager({ step, direction, children }: AnimationManagerProps) {
  const variants = getVariantsForStep(step, direction)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={variants.exit}
        animate={variants.enter}
        exit={variants.exit}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function getAnimationVariants(animation: AnimationDefinition): VariantDef {
  return VARIANT_MAP[animation.type] || VARIANT_MAP.fade
}
