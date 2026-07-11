'use client'

import { useState, useCallback } from 'react'

export function usePortalAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true)
    setAnimationKey((k) => k + 1)
  }, [])

  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false)
  }, [])

  return {
    isAnimating,
    animationKey,
    triggerAnimation,
    onAnimationComplete,
  }
}

export function useStagger(delay: number = 0.08) {
  const getDelay = useCallback((index: number) => index * delay, [delay])
  return { getDelay }
}
