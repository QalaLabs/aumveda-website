'use client'

import type { ReactNode, ComponentPropsWithoutRef } from 'react'
import { motion } from 'framer-motion'
import { RADII } from '../theme/tokens'

type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>
interface PortalButtonProps extends Omit<MotionButtonProps, 'whileHover' | 'whileTap'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
}

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-[#C9A84C] to-[#A88A3A] text-[#0B0720] font-semibold hover:from-[#D4B85C] hover:to-[#B89A4A] shadow-lg shadow-[#C9A84C]/20',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 border border-white/10',
  ghost:
    'text-white/60 hover:text-white hover:bg-white/5',
  outline:
    'border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10',
}

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function PortalButton(props: PortalButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    isLoading,
    disabled,
    className = '',
    ...rest
  } = props
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-medium tracking-wide
        transition-all duration-300
        disabled:cursor-not-allowed disabled:opacity-40
        focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:ring-offset-2 focus:ring-offset-transparent
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      style={{ borderRadius: RADII.xl }}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  )
}
