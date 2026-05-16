import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CreatorPulse — Know your numbers. Know your worth.',
  description:
    'Observability platform for Indian social media creators. Track engagement, benchmark rates, and get alerts — all in one place.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  ),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const html = (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )

  if (process.env.NEXT_PUBLIC_SKIP_AUTH === 'true') return html

  // Production: lazy-load Clerk so the key is never validated in dev
  const { ClerkProvider } = await import('@clerk/nextjs')
  return <ClerkProvider>{html}</ClerkProvider>
}
