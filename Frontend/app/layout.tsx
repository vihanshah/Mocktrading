import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] })

export const metadata: Metadata = {
  title: 'TradeClub — Indian Stock Market Mock Trading Platform',
  description: 'Professional mock trading platform for Indian equities. Compete with live leaderboards, track portfolios, and trade NSE & BSE stocks in real-time simulation.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-screen w-full bg-background">
      <body className="h-full w-full font-sans antialiased grain overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
