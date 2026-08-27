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

  return {
    products: products.map(toProductView),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug }, select: SELECT })
  if (!product) return null
  return toProductView(product)
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({ where: { id }, select: SELECT })
  if (!product) return null
  return toProductView(product)
}

export async function getActiveProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: SELECT,
    orderBy: { createdAt: 'desc' },
  })
  return products.map(toProductView)
}

export async function getActiveProductsByChakra(chakra: string, limit = 2) {
  const products = await prisma.product.findMany({
    where: { isActive: true, chakraAssociation: chakra },
    select: SELECT,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return products.map(toProductView)
}

export async function getActiveProductsByCategory(category: string) {
  const products = await prisma.product.findMany({
    where: { isActive: true, category },
    select: SELECT,
    orderBy: { createdAt: 'desc' },
  })
  return products.map(toProductView)
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
