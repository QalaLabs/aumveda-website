import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Prevent Next.js from bundling Prisma — let Node.js require it at runtime
    serverComponentsExternalPackages: ['@prisma/client', '@aumveda/db'],
    // Limit worker processes — prevents EAGAIN on shared hosting
    workerThreads: false,
    cpus: 1,
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'assets.aumveda.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'astrotalk.store' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Google Places, Calendly widget, GTM/GA — needed by Portal Steps 6 & 8.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googletagmanager.com *.google-analytics.com maps.googleapis.com *.gstatic.com assets.calendly.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com assets.calendly.com",
              "font-src 'self' fonts.gstatic.com assets.calendly.com",
              "img-src 'self' data: blob: *.r2.cloudflarestorage.com assets.aumveda.com lh3.googleusercontent.com images.unsplash.com *.unsplash.com *.googleusercontent.com maps.gstatic.com *.gstatic.com",
              "media-src 'self' *.r2.cloudflarestorage.com assets.aumveda.com",
              // Calendly booking embed lives in an iframe from calendly.com.
              "frame-src 'self' *.youtube.com *.youtube-nocookie.com calendly.com *.calendly.com",
              // Places autocomplete uses fetch to maps.googleapis.com; Calendly widget posts to calendly.com.
              "connect-src 'self' *.aumveda.com *.google-analytics.com *.supabase.co wss://*.supabase.co maps.googleapis.com *.googleapis.com calendly.com *.calendly.com",
            ].join('; '),
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.aumveda.com' }],
        destination: 'https://app.aumveda.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
