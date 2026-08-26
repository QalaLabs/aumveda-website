'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Eye, EyeOff, Package } from 'lucide-react'
import type { ProductView } from '@/lib/product-types'
import { ProductInventoryBadge } from '@/components/product/product-inventory-badge'

interface ProductTableProps {
  products: ProductView[]
  onToggleActive?: (product: ProductView) => void
  editBasePath?: string
}

export function ProductTable({ products, onToggleActive, editBasePath = '/admin/products' }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No products yet. Create your first product.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest w-[60px]">Image</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Product</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">SKU</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Category</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Price</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Inventory</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} className="hover:bg-slate-50/50">
                <TableCell>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.title} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-900 text-sm">{product.title}</div>
                  <div className="text-xs text-slate-400 truncate max-w-[200px]">{product.slug}</div>
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">{product.sku}</TableCell>
                <TableCell>
                  {product.category && (
                    <Badge variant="secondary" className="text-[10px] font-bold">{product.category}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="text-sm font-bold text-slate-900">₹{product.priceInr.toLocaleString('en-IN')}</div>
                  {product.compareAtPriceInr && (
                    <div className="text-xs text-slate-400 line-through">₹{product.compareAtPriceInr.toLocaleString('en-IN')}</div>
                  )}
                </TableCell>
                <TableCell>
                  <ProductInventoryBadge inventoryCount={product.inventoryCount} />
                </TableCell>
                <TableCell>
                  {product.isActive ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-slate-400 text-[10px] font-bold">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                      <Link href={`${editBasePath}/${product.id}/edit`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                    {onToggleActive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onToggleActive(product)}
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden divide-y divide-slate-100">
        {products.map(product => (
          <div key={product.id} className="p-4 flex items-center gap-4">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-slate-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 text-sm truncate">{product.title}</div>
              <div className="text-xs text-slate-400">₹{product.priceInr.toLocaleString('en-IN')} · {product.sku}</div>
              <div className="flex items-center gap-2 mt-1">
                <ProductInventoryBadge inventoryCount={product.inventoryCount} />
                {product.isActive ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">Active</Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-400 text-[10px] font-bold">Inactive</Badge>
                )}
              </div>
            </div>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Link href={`${editBasePath}/${product.id}/edit`}>
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
