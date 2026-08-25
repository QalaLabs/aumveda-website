import { z } from 'zod'

export const PRODUCT_CATEGORIES = [
  'Bracelets',
  'Vastu',
  'Crystals',
  'Combos',
  'Healing',
  'Courses',
  'Digital',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(64),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(128)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200),
  shortDescription: z.string().max(500).optional().nullable(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priceCents: z.number().int().min(1, 'Price must be at least ₹1'),
  compareAtPriceCents: z.number().int().min(0).optional().nullable(),
  currency: z.string().default('INR'),
  images: z.array(z.string()).default([]),
  inventoryCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  productType: z.enum(['physical', 'course', 'digital']).default('physical'),
  referenceId: z.number().int().positive().optional().nullable(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional().nullable(),
  chakraAssociation: z.string().max(32).optional().nullable(),
  healingProperties: z.record(z.unknown()).optional().nullable(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.number().int().positive(),
})

export const productListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  productType: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'title', 'priceCents', 'inventoryCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductListQuery = z.infer<typeof productListQuerySchema>
