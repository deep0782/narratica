import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Narratica',
  description: 'Manage your children\'s stories and create new magical adventures.',
}

export default function DashboardLayout({
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
