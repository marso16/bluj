import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BluJ | Your Local Gas Station',
  description: 'BluJ — local gas stations, convenience stores, and deli across NH and VT.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
