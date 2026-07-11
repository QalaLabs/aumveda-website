'use client'

import { motion } from 'framer-motion'
import { PortalButton } from './PortalButton'

interface PortalContinueButtonProps {
  onClick: () => void
  disabled?: boolean
  isLoading?: boolean
  label?: string
  className?: string
}

export function PortalContinueButton({
  onClick,
  disabled = false,
  isLoading = false,
  label = 'Continue',
  className = '',
}: PortalContinueButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={className}
    >
      <PortalButton
        onClick={onClick}
        disabled={disabled}
        isLoading={isLoading}
        size="lg"
        rightIcon={
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        }
      >
        {label}
      </PortalButton>
    </motion.div>
  )
}
