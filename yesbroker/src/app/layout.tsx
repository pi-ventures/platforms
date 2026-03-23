import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YesBroker — India\'s #1 Real Estate Platform for Brokers',
  description: 'The ultimate real estate platform combining property listings, lead management, CRM, 3D planning, and 40+ advertising platform integrations.',
  keywords: 'real estate broker india, property listing platform, lead management, CRM brokers, 99acres magicbricks integration',
  openGraph: {
    title: 'YesBroker',
    description: 'India\'s BigDaddy of Real Estate Platforms',
    type: 'website',
  },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
