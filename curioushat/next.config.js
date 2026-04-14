const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  compress: true,
  headers: async () => [
    {
      // Static assets — immutable, cached forever (hashed filenames)
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      // HTML pages — short browser cache, no Cloudflare edge cache
      // This ensures deploys are instant without needing cache purges
      source: '/:path((?!api|_next).*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        { key: 'CDN-Cache-Control', value: 'no-cache' },
        { key: 'Cloudflare-CDN-Cache-Control', value: 'no-cache' },
      ],
    },
    {
      source: '/icon.svg',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=86400' },
      ],
    },
  ],
}

module.exports = withBundleAnalyzer(nextConfig)
