'use client'

import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, fadeUpVariants } from '../animation/variants'
import { PortalSelectionCard } from '../design-system/PortalSelectionCard'
import { PortalReveal } from '../design-system/PortalReveal'
import { PortalContinueButton } from '../design-system/PortalContinueButton'
import { useSelection } from './SelectionProvider'

interface SelectionEngineProps {
  renderItem?: (item: any, isSelected: boolean) => ReactNode
  revealContent?: ReactNode
  onContinue?: () => void
  accentColor?: string
  columns?: 1 | 2 | 3
  continueLabel?: string
}

export function SelectionEngine({
  renderItem,
  revealContent,
  onContinue,
  accentColor = '#C9A84C',
  columns = 1,
  continueLabel = 'Continue',
}: SelectionEngineProps) {
  const { items, selectedId, phase, locked, select, lock, confirm, isSelected } = useSelection()

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <AnimatePresence mode="wait">
        {phase === 'selecting' && (
          <motion.div
            key="selection"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`grid w-full gap-4 ${gridCols[columns]}`}
          >
            {items.map((item) => (
              <motion.div key={item.id} variants={staggerItem}>
                <PortalSelectionCard
                  selected={isSelected(item.id)}
                  locked={locked}
                  onClick={() => select(item.id)}
                  accentColor={accentColor}
                >
                  {renderItem ? renderItem(item, isSelected(item.id)) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <span className="text-lg font-medium text-white">{item.label}</span>
                      {item.description && (
                        <span className="text-sm text-white/50">{item.description}</span>
                      )}
                    </div>
                  )}
                </PortalSelectionCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === 'locked' && (
          <motion.div
            key="locked"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm uppercase tracking-widest text-white/40">Your Selection</p>
              {renderItem
                ? renderItem(items.find((i) => i.id === selectedId)!, true)
                : (
                  <p className="text-xl font-medium text-white">
                    {items.find((i) => i.id === selectedId)?.label}
                  </p>
                )}
            </div>
            <PortalContinueButton
              onClick={() => { confirm(); setTimeout(onContinue ?? (() => {}), 1200) }}
              label="Reveal"
            />
          </motion.div>
        )}

        {phase === 'revealing' && (
          <motion.div
            key="revealing"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <PortalReveal show={true}>
              {revealContent}
            </PortalReveal>
          </motion.div>
        )}

        {phase === 'confirmed' && onContinue && (
          <motion.div
            key="confirmed"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <PortalContinueButton onClick={onContinue} label={continueLabel} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
