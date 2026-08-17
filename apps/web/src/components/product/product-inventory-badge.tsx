'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProductInventoryBadgeProps {
  inventoryCount: number
  className?: string
}

export function ProductInventoryBadge({ inventoryCount, className }: ProductInventoryBadgeProps) {
  if (inventoryCount === 0) {
    return (
      <Badge variant="outline" className={cn('border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-bold', className)}>
        Out of Stock
      </Badge>
    )
  }
  if (inventoryCount <= 5) {
    return (
      <Badge variant="outline" className={cn('border-amber-200 bg-amber-50 text-amber-700 text-[10px] font-bold', className)}>
        Low: {inventoryCount}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className={cn('border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold', className)}>
      {inventoryCount} in stock
    </Badge>
  )
}
