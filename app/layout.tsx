import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/lib/context/language-context'
import { CartProvider } from '@/lib/context/cart-context'
import { AuthProvider } from '@/lib/context/auth-context'
import { SessionProvider } from 'next-auth/react'
import { BottomNav } from '@/components/layout/bottom-nav'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AfricaMarket - Marketplace au Benin',
    template: '%s | AfricaMarket',
  },
  description: 'La marketplace de reference au Benin pour acheter, vendre et proposer vos produits et services locaux.',
  keywords: ['marketplace', 'Benin', 'Cotonou', 'acheter', 'vendre', 'services', 'produits', 'artisanat', 'Afrique'],
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

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        <SessionProvider>
          <AuthProvider>
            <CartProvider>
              <LanguageProvider>
                {children}
                <BottomNav />
              </LanguageProvider>
            </CartProvider>
          </AuthProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
