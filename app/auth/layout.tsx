import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Narratica',
  description: 'Sign in to your Narratica account to create magical stories for your children.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      {children}
    </div>
  )
}
