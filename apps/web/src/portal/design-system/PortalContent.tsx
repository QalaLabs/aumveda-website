'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUpVariants } from '../animation/variants'

interface PortalContentProps {
  children: ReactNode
  className?: string
  maxWidth?: string
}

export function PortalContent({ children, className = '', maxWidth = 'max-w-2xl' }: PortalContentProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`mx-auto w-full ${maxWidth} ${className}`}
    >
      {children}
    </motion.div>
  )
}
