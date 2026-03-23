import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TheEquinox.ai — Royal Luxe Auto Trading Platform',
  description: 'India\'s most sophisticated auto-trading platform. Set rules, automate trades, grow wealth.',
  keywords: 'auto trading india, SIP automation, stock trading platform, portfolio analytics, NSE BSE',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
