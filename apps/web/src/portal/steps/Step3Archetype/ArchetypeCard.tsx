'use client'

import { PortalSelectionCard } from '../../design-system/PortalSelectionCard'
import type { ArchetypeItem } from './archetype-data'

interface ArchetypeCardProps {
  archetype: ArchetypeItem
  selected: boolean
  locked: boolean
  onClick: () => void
  large?: boolean
}

export function ArchetypeCard({ archetype, selected, locked, onClick, large = false }: ArchetypeCardProps) {
  return (
    <PortalSelectionCard
      selected={selected}
      locked={locked}
      onClick={onClick}
      accentColor={archetype.color}
      className={large ? 'p-8' : ''}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className={`leading-none ${large ? 'text-5xl' : 'text-4xl'}`}
          style={{ filter: selected ? `drop-shadow(0 0 8px ${archetype.color}80)` : undefined }}
          aria-hidden="true"
        >
          {archetype.symbol}
        </span>

        <div className="flex flex-col items-center gap-1">
          <p className={`font-serif font-bold text-white ${large ? 'text-2xl' : 'text-lg'}`}>
            {archetype.name}
          </p>
          {!large && (
            <>
              <p className="flex items-center gap-1.5 text-xs text-white/30">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: archetype.color }}
                />
                {archetype.element}
              </p>
              <p className="mt-1 max-w-[220px] text-sm italic leading-relaxed text-white/50">
                &ldquo;{archetype.description}&rdquo;
              </p>
            </>
          )}
        </div>

        {large && (
          <div className="mt-2 flex flex-col gap-1">
            <p className="text-xs text-white/30">Element: {archetype.element}</p>
            <p className="max-w-sm text-sm italic leading-relaxed text-white/50">
              &ldquo;{archetype.description}&rdquo;
            </p>
          </div>
        )}
      </div>
    </PortalSelectionCard>
  )
}
