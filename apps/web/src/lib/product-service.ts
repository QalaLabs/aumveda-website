import 'server-only'

import { prisma } from '@aumveda/db'
import { r2PublicUrl } from '@/lib/r2'
import type { CreateProductInput, UpdateProductInput, ProductListQuery } from '@/lib/product-schemas'
import type { ProductView } from '@/lib/product-types'

export type { ProductView, BundleInfo } from '@/lib/product-types'
export { getBundleInfo } from '@/lib/product-types'

function toProductView(p: {
  id: number
  sku: string
  slug: string
  title: string
  shortDescription: string | null
  description: string
  category: string
  priceCents: number
  compareAtPriceCents: number | null
  images: string[]
  inventoryCount: number
  isActive: boolean
  productType: string
  tags: string[]
  chakraAssociation: string | null
  metadata: unknown
  createdAt: Date
  updatedAt: Date
}): ProductView {
  const priceInr = p.priceCents / 100
  const compareAtPriceInr = p.compareAtPriceCents ? p.compareAtPriceCents / 100 : null
  const discountPercent =
    compareAtPriceInr && compareAtPriceInr > priceInr
      ? Math.round((1 - priceInr / compareAtPriceInr) * 100)
      : null
  return {
    ...p,
    priceInr,
    compareAtPriceInr,
    discountPercent,
    imageUrl: p.images[0] ? r2PublicUrl(p.images[0]) : null,
  }
}

const SELECT = {
  id: true,
  sku: true,
  slug: true,
  title: true,
  shortDescription: true,
  description: true,
  category: true,
  priceCents: true,
  compareAtPriceCents: true,
  images: true,
  inventoryCount: true,
  isActive: true,
  productType: true,
  tags: true,
  chakraAssociation: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
} as const

export const DEMO_PRODUCTS: ProductView[] = [
  {
    id: 1,
    sku: 'CRY-RQ-001',
    slug: 'rose-quartz-heart-crystal',
    title: 'Rose Quartz Heart Charged Crystal',
    shortDescription: 'Chakra-attuned crystal for heart opening and deep emotional softness.',
    description: 'Natural Madagascan Rose Quartz consecrated with ancient Vedic mantras to balance the Anahata chakra.',
    category: 'Crystals',
    priceCents: 249900,
    compareAtPriceCents: 299900,
    priceInr: 2499,
    compareAtPriceInr: 2999,
    discountPercent: 17,
    images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=800'],
    imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=800',
    inventoryCount: 25,
    isActive: true,
    productType: 'physical',
    tags: ['crystals', 'heart', 'healing'],
    chakraAssociation: 'heart',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    sku: 'ARO-SAN-002',
    slug: 'vedic-sandalwood-lotus-resin',
    title: 'Vedic Sandalwood & Lotus Sacred Resin',
    shortDescription: 'Wildcrafted botanical incense to soothe the nervous system.',
    description: 'Handcrafted natural temple incense from Mysore sandalwood and blue lotus petals.',
    category: 'Aromatherapy',
    priceCents: 129900,
    compareAtPriceCents: null,
    priceInr: 1299,
    compareAtPriceInr: null,
    discountPercent: null,
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'],
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    inventoryCount: 40,
    isActive: true,
    productType: 'physical',
    tags: ['aromatherapy', 'incense', 'calm'],
    chakraAssociation: 'crown',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    sku: 'CRY-AME-003',
    slug: 'amethyst-intuition-cluster',
    title: 'Raw Amethyst Intuition Cluster',
    shortDescription: 'Third-eye stimulant for quiet clarity, sleep, and lucid dreams.',
    description: 'High-vibration Uruguayan raw amethyst cluster for bedroom or meditation sanctuary altar.',
    category: 'Crystals',
    priceCents: 319900,
    compareAtPriceCents: 389900,
    priceInr: 3199,
    compareAtPriceInr: 3899,
    discountPercent: 18,
    images: ['https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=800'],
    imageUrl: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&q=80&w=800',
    inventoryCount: 18,
    isActive: true,
    productType: 'physical',
    tags: ['crystals', 'third_eye', 'clarity'],
    chakraAssociation: 'third_eye',
    metadata: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function listProducts(query: ProductListQuery) {
  const { search, category, productType, isActive, page, limit, sortBy, sortOrder } = query
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }
  if (category) where.category = category
  if (productType) where.productType = productType
  if (isActive !== undefined) where.isActive = isActive

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: SELECT,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    if (products.length > 0) {
      return {
        products: products.map(toProductView),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    }
  } catch (e) {
    console.warn('Prisma product query skipped/failed, serving demo products:', e)
  }

  let filtered = DEMO_PRODUCTS
  if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase())
  if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return {
    products: filtered,
    total: filtered.length,
    page: 1,
    limit,
    totalPages: 1,
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({ where: { slug }, select: SELECT })
    if (product) return toProductView(product)
  } catch (e) {
    console.warn('Prisma getProductBySlug skipped/failed:', e)
  }
  return DEMO_PRODUCTS.find(p => p.slug === slug) ?? null
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({ where: { id }, select: SELECT })
    if (product) return toProductView(product)
  } catch (e) {
    console.warn('Prisma getProductById skipped/failed:', e)
  }
  return DEMO_PRODUCTS.find(p => p.id === id) ?? null
}

export async function getActiveProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: SELECT,
      orderBy: { createdAt: 'desc' },
    })
    if (products.length > 0) return products.map(toProductView)
  } catch (e) {
    console.warn('Prisma getActiveProducts skipped/failed:', e)
  }
  return DEMO_PRODUCTS
}

export async function getActiveProductsByChakra(chakra: string, limit = 2) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, chakraAssociation: chakra },
      select: SELECT,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    if (products.length > 0) return products.map(toProductView)
  } catch (e) {
    console.warn('Prisma getActiveProductsByChakra skipped/failed:', e)
  }
  return DEMO_PRODUCTS.filter(p => p.chakraAssociation === chakra).slice(0, limit)
}

export async function getActiveProductsByCategory(category: string) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, category },
      select: SELECT,
      orderBy: { createdAt: 'desc' },
    })
    if (products.length > 0) return products.map(toProductView)
  } catch (e) {
    console.warn('Prisma getActiveProductsByCategory skipped/failed:', e)
  }
  return DEMO_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase())
}

export async function createProduct(input: CreateProductInput) {
  const product = await prisma.product.create({
    data: {
      sku: input.sku,
      slug: input.slug,
      title: input.title,
      shortDescription: input.shortDescription ?? null,
      description: input.description,
      category: input.category,
      priceCents: input.priceCents,
      compareAtPriceCents: input.compareAtPriceCents ?? null,
      currency: input.currency ?? 'INR',
      images: input.images ?? [],
      inventoryCount: input.inventoryCount ?? 0,
      isActive: input.isActive ?? true,
      productType: input.productType ?? 'physical',
      referenceId: input.referenceId ?? null,
      tags: input.tags ?? [],
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
      chakraAssociation: input.chakraAssociation ?? null,
      healingProperties: input.healingProperties
        ? JSON.parse(JSON.stringify(input.healingProperties))
        : undefined,
    },
    select: SELECT,
  })
  return toProductView(product)
}

export async function updateProduct(input: UpdateProductInput) {
  const { id, ...data } = input
  const updateData: Record<string, unknown> = {}
  if (data.sku !== undefined) updateData.sku = data.sku
  if (data.slug !== undefined) updateData.slug = data.slug
  if (data.title !== undefined) updateData.title = data.title
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
  if (data.description !== undefined) updateData.description = data.description
  if (data.category !== undefined) updateData.category = data.category
  if (data.priceCents !== undefined) updateData.priceCents = data.priceCents
  if (data.compareAtPriceCents !== undefined) updateData.compareAtPriceCents = data.compareAtPriceCents
  if (data.images !== undefined) updateData.images = data.images
  if (data.inventoryCount !== undefined) updateData.inventoryCount = data.inventoryCount
  if (data.isActive !== undefined) updateData.isActive = data.isActive
  if (data.productType !== undefined) updateData.productType = data.productType
  if (data.referenceId !== undefined) updateData.referenceId = data.referenceId
  if (data.tags !== undefined) updateData.tags = data.tags
  if (data.metadata !== undefined) updateData.metadata = data.metadata
  if (data.chakraAssociation !== undefined) updateData.chakraAssociation = data.chakraAssociation
  if (data.healingProperties !== undefined) updateData.healingProperties = data.healingProperties

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    select: SELECT,
  })
  return toProductView(product)
}

export async function deleteProduct(id: number) {
  await prisma.product.delete({ where: { id } })
}

export async function adjustInventory(productId: number, delta: number) {
  const product = await prisma.product.update({
    where: { id: productId },
    data: { inventoryCount: { increment: delta } },
    select: { id: true, inventoryCount: true, title: true },
  })
  return product
}
