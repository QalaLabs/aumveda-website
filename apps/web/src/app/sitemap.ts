import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.aumveda.com'

const PUBLIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap['0']['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/programs', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/events', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/shop', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/insights', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/tools', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/tools/numerology', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/tools/tarot', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/tools/mbti', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/tools/kundli', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/tools/answer-book', changeFrequency: 'monthly', priority: 0.5 },
]

const PUBLIC_STEP_ROUTES = Array.from({ length: 8 }, (_, i) => ({
  path: `/step-${i + 1}`,
  changeFrequency: 'monthly' as const,
  priority: 0.6,
}))

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PUBLIC_ROUTES, ...PUBLIC_STEP_ROUTES].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
