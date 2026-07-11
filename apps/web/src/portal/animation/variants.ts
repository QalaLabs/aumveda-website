import type { Variants, Transition } from 'framer-motion'
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from '../theme/tokens'

const defaultTransition: Transition = {
  duration: ANIMATION_DURATIONS.normal,
  ease: ANIMATION_EASINGS.default,
}

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: defaultTransition },
  exit: { opacity: 0, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.gentle },
  },
  exit: { opacity: 0, y: -10, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.gentle },
  },
  exit: { opacity: 0, y: 10, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: defaultTransition },
  exit: { opacity: 0, scale: 0.95, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: ANIMATION_DURATIONS.entrance, ease: ANIMATION_EASINGS.spring },
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
  exit: { opacity: 0, x: -30, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: defaultTransition },
  exit: { opacity: 0, x: 30, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.gentle },
  },
  exit: { opacity: 0, y: -10, transition: { duration: ANIMATION_DURATIONS.fast } },
}

export const textReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.04,
      duration: ANIMATION_DURATIONS.slow,
      ease: ANIMATION_EASINGS.gentle,
    },
  }),
}

export const cardFlip: Variants = {
  front: { rotateY: 0, transition: { duration: ANIMATION_DURATIONS.slow } },
  back: { rotateY: 180, transition: { duration: ANIMATION_DURATIONS.slow } },
}

export const revealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.gentle },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: { duration: ANIMATION_DURATIONS.fast },
  },
}

export const orbPulseVariants: Variants = {
  idle: { scale: 1, opacity: 0.6 },
  inhale: {
    scale: 1.35,
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.breath, ease: ANIMATION_EASINGS.gentle },
  },
  hold: {
    scale: 1.35,
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.hold, ease: 'linear' },
  },
  exhale: {
    scale: 1,
    opacity: 0.6,
    transition: { duration: ANIMATION_DURATIONS.breath, ease: ANIMATION_EASINGS.gentle },
  },
  complete: {
    scale: 1.1,
    opacity: 1,
    transition: { duration: ANIMATION_DURATIONS.normal, ease: ANIMATION_EASINGS.spring },
  },
}

export const particleMotion: Variants = {
  float: {
    y: [0, -30, 0],
    x: [0, 15, 0],
    opacity: [0.3, 0.8, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  drift: {
    y: [0, -20, 0],
    x: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, scale: 1.02 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: ANIMATION_DURATIONS.entrance, ease: ANIMATION_EASINGS.gentle },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: ANIMATION_DURATIONS.slow, ease: ANIMATION_EASINGS.default },
  },
}
