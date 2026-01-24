import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MineAI IDE Pro - Professional Minecraft AI Development Environment',
  description: 'Professional Minecraft AI IDE combining MCreator, Cursor, and WayaCreate vision with advanced AI automation',
  keywords: ['minecraft', 'ai', 'ide', 'mcreator', 'cursor', 'wayacreate', 'modding', 'development'],
  authors: [{ name: 'WayaCreate' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
