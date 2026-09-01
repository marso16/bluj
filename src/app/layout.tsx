import type { Metadata } from 'next'
import { Big_Shoulders_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const bigShoulders = Big_Shoulders_Display({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BluJ | Your Local Gas Station',
  description: 'BluJ — local gas stations, convenience stores, and deli across NH and VT.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bigShoulders.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
