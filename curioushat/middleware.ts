import { NextRequest, NextResponse } from 'next/server'

/**
 * Subdomain-based multi-tenancy middleware.
 *
 * jiva.curioushat.ai → resolves "jiva" slug, sets x-school-slug header
 * curioushat.ai → main marketing site (no slug)
 *
 * The slug is passed via headers to server components and API routes.
 * School data lookup happens in layout.tsx / API routes, not here.
 */

const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'curioushat.ai'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const hostname = host.split(':')[0] // strip port for local dev

  // Extract subdomain: "jiva.curioushat.ai" → "jiva"
  // Skip: "curioushat.ai", "www.curioushat.ai", "localhost"
  let slug: string | null = null

  if (hostname !== ROOT_DOMAIN &&
      hostname !== `www.${ROOT_DOMAIN}` &&
      hostname !== 'localhost' &&
      !hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    // hostname is "jiva.curioushat.ai" or "jiva.localhost"
    const parts = hostname.replace(`.${ROOT_DOMAIN}`, '').replace('.localhost', '').split('.')
    if (parts.length === 1 && parts[0] !== 'www') {
      slug = parts[0]
    }
  }

  if (!slug) {
    // Main site — no tenant context
    return NextResponse.next()
  }

  // Set school slug in headers for downstream use
  const res = NextResponse.rewrite(req.nextUrl)
  res.headers.set('x-school-slug', slug)

  return res
}

export const config = {
  // Run on all routes except static assets and API health
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)'],
}
