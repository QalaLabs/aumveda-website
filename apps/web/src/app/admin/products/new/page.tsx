'use client'

import { ProductForm } from '@/components/product'

export default function AdminProductCreatePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Create Product</h1>
          <p className="text-sm text-slate-500 mt-1">Add a new product to the catalog</p>
        </div>
        <ProductForm mode="create" />
      </div>
    </div>
  )
}
