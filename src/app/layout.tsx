import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/layout/BackToTop'

export const metadata: Metadata = {
  title: { default: 'BluJ', template: '%s | BluJ' },
  description: 'BluJ: local gas stations, convenience stores, and deli across New Hampshire and Vermont.',
  openGraph: {
    siteName: 'BluJ',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <Header />
        <main className="pt-16 md:pt-32">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
