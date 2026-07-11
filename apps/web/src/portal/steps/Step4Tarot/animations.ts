import type { Variants } from 'framer-motion'

export const deckShuffleVariants: Variants = {
  shuffling: {
    x: [0, 2, -2, 1, -1, 0],
    rotate: [0, 1, -1, 0.5, -0.5, 0],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  ready: {
    x: 0,
    rotate: 0,
    transition: { duration: 0.3 },
  },
}

export const deckCardStackVariants: Variants = {
  initial: (i: number) => ({
    y: i * -1.5,
    rotate: (i - 2) * 0.8,
    x: (i - 2) * 0.5,
    scale: 1,
  }),
  shuffle: (i: number) => ({
    y: [i * -1.5, i * -1.5 + Math.sin(Date.now() * 0.001 + i) * 1, i * -1.5],
    rotate: [(i - 2) * 0.8, (i - 2) * 0.8 + Math.cos(Date.now() * 0.001 + i * 2) * 0.5, (i - 2) * 0.8],
    scale: 1,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: i * 0.05,
    },
  }),
  drawStart: {
    y: -40,
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeIn' },
  },
}

export const cardFlyVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
    rotateY: 180,
  },
  visible: {
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
}

export const cardFlipVariants: Variants = {
  back: {
    rotateY: 0,
    transition: { duration: 0.4 },
  },
  front: {
    rotateY: 180,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
}

export const cardDrawContainerVariants: Variants = {
  initial: { scale: 1 },
  drawing: {
    scale: 0.9,
    transition: { duration: 0.3 },
  },
}

export const cardGlowVariants: Variants = {
  idle: {
    boxShadow: '0 0 20px rgba(201, 168, 76, 0.1)',
  },
  hover: {
    boxShadow: '0 0 40px rgba(201, 168, 76, 0.3), 0 0 80px rgba(201, 168, 76, 0.1)',
    scale: 1.03,
    transition: { duration: 0.3 },
  },
}
