import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'BluJ | Your Local Gas Station',
  description: 'BluJ — local gas stations, convenience stores, and deli across NH and VT.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="pt-16 md:pt-32">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
