'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showSuccess, showError } from '@/utils/toast'
import { Loader2, Plus, X } from 'lucide-react'
import { createProductSchema, updateProductSchema, PRODUCT_CATEGORIES } from '@/lib/product-schemas'
import type { CreateProductInput, UpdateProductInput } from '@/lib/product-schemas'
import type { ProductView } from '@/lib/product-types'
import { z } from 'zod'

interface ProductFormProps {
  mode: 'create' | 'edit'
  product?: ProductView
  apiBasePath?: string
  redirectPath?: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 128)
}

export function ProductForm({ mode, product, apiBasePath = '/api/admin/products', redirectPath = '/admin/products' }: ProductFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')

  const schema = mode === 'create' ? createProductSchema : updateProductSchema

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema as any),
    defaultValues:
      mode === 'edit' && product
        ? {
            id: product.id,
            sku: product.sku,
            slug: product.slug,
            title: product.title,
            shortDescription: product.shortDescription ?? '',
            description: product.description,
            category: product.category,
            priceCents: product.priceInr * 100,
            compareAtPriceCents: product.compareAtPriceInr ? product.compareAtPriceInr * 100 : null,
            currency: 'INR',
            images: product.images,
            inventoryCount: product.inventoryCount,
            isActive: product.isActive,
            productType: product.productType as 'physical' | 'course' | 'digital',
            tags: product.tags,
          }
        : {
            sku: '',
            slug: '',
            title: '',
            shortDescription: '',
            description: '',
            category: '',
            priceCents: 0,
            compareAtPriceCents: null,
            currency: 'INR',
            images: [],
            inventoryCount: 0,
            isActive: true,
            productType: 'physical' as const,
            tags: [],
          },
  })

  const images = form.watch('images' as any) as string[]
  const tags = form.watch('tags' as any) as string[]
  const title = form.watch('title' as any) as string

  const addImage = () => {
    const url = imageUrlInput.trim()
    if (!url) return
    const current = (form.getValues('images' as any) as string[]) || []
    form.setValue('images' as any, [...current, url] as any)
    setImageUrlInput('')
  }

  const removeImage = (index: number) => {
    const current = (form.getValues('images' as any) as string[]) || []
    form.setValue(
      'images' as any,
      current.filter((_: string, i: number) => i !== index) as any
    )
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag) return
    const current = (form.getValues('tags' as any) as string[]) || []
    if (current.includes(tag)) return
    form.setValue('tags' as any, [...current, tag] as any)
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    const current = (form.getValues('tags' as any) as string[]) || []
    form.setValue(
      'tags' as any,
      current.filter((t: string) => t !== tag) as any
    )
  }

  const onSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      const url =
        mode === 'create' ? apiBasePath : `${apiBasePath}/${product?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const body = await res.json()
      if (!res.ok) {
        throw new Error(body.error ?? 'Failed to save product')
      }

      showSuccess(mode === 'create' ? 'Product created!' : 'Product updated!')
      router.push(redirectPath)
      router.refresh()
    } catch (err: any) {
      showError(err.message ?? 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" {...form.register('title' as any)} placeholder="Product name" />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500">{(form.formState.errors.title as any).message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input id="sku" {...form.register('sku' as any)} placeholder="e.g. BRAC-001" />
              {form.formState.errors.sku && (
                <p className="text-xs text-red-500">{(form.formState.errors.sku as any).message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input id="slug" {...form.register('slug' as any)} placeholder="product-url-slug" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => form.setValue('slug' as any, slugify(title || ''))}
              >
                Auto
              </Button>
            </div>
            {form.formState.errors.slug && (
              <p className="text-xs text-red-500">{(form.formState.errors.slug as any).message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input id="shortDescription" {...form.register('shortDescription' as any)} placeholder="Brief one-liner (optional)" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...form.register('description' as any)} rows={4} placeholder="Full product description" />
            {form.formState.errors.description && (
              <p className="text-xs text-red-500">{(form.formState.errors.description as any).message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (paise) *</Label>
              <Input type="number" {...form.register('priceCents' as any, { valueAsNumber: true })} placeholder="79900" />
              {form.formState.errors.priceCents && (
                <p className="text-xs text-red-500">{(form.formState.errors.priceCents as any).message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Compare at Price (paise)</Label>
              <Input type="number" {...form.register('compareAtPriceCents' as any, { valueAsNumber: true })} placeholder="140000" />
            </div>
            <div className="space-y-2">
              <Label>Inventory *</Label>
              <Input type="number" {...form.register('inventoryCount' as any, { valueAsNumber: true })} placeholder="100" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={(form.watch('category' as any) as string) || ''}
                onValueChange={(val) => form.setValue('category' as any, val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select
                value={(form.watch('productType' as any) as string) || 'physical'}
                onValueChange={(val) => form.setValue('productType' as any, val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Add a tag and press Enter"
              />
              <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={(form.watch('isActive' as any) as boolean) ?? true}
              onCheckedChange={(val) => form.setValue('isActive' as any, val)}
            />
            <Label>Active (visible in shop)</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={imageUrlInput}
              onChange={e => setImageUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
              placeholder="Image URL (R2 key or external URL)"
            />
            <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={addImage}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {images && images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((url: string, i: number) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={submitting} className="px-8">
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {mode === 'create' ? 'Create Product' : 'Save Changes'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
