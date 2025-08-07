import type { Metadata } from 'next'
import { Roboto, Comic_Neue } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto'
})

const comicNeue = Comic_Neue({ 
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-comic'
})

export const metadata: Metadata = {
  title: 'Narratica - AI Children\'s Story Creator',
  description: 'Create magical, personalized children\'s stories with AI. Transform your child\'s photo into cartoon characters and generate educational storybooks.',
  keywords: 'children stories, AI storytelling, personalized books, cartoon characters, educational content',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${comicNeue.variable}`}>
      <body className="font-sans antialiased" style={{ fontFamily: 'var(--font-roboto)' }}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
