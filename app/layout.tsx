import type { Metadata } from 'next'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'

const mono = Roboto_Mono({ subsets: ['latin'], weight: ["400", "700"]})

export const metadata: Metadata = {
  title: 'Typi',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mono.className}>{children}</body>
    </html>
  )
}
