'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { BookOpen, Settings, User, LogOut, Bell, Crown, Home, ArrowLeft } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { ParentProfile } from '@/lib/supabase'

interface DashboardHeaderProps {
  profile: ParentProfile | null
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return (
          <div className="inline-flex items-center bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </div>
        )
      case 'pro':
        return (
          <div className="inline-flex items-center bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
            <Crown className="h-3 w-3 mr-1" />
            Pro
          </div>
        )
      default:
        return (
          <div className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
            Free
          </div>
        )
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back to Home */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Narratica
                </span>
                <div className="text-xs text-gray-500">Story Dashboard</div>
              </div>
            </Link>
            
            {/* Back to Home Link */}
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              My Stories
            </Link>
            <Link 
              href="/dashboard/children" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              My Children
            </Link>
            <Link 
              href="/create" 
              className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
            >
              Create Story
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-purple-50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {profile?.full_name || 'User'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 capitalize">
                        {profile?.guardian_type || 'Parent'}
                      </span>
                      {profile && getSubscriptionBadge(profile.subscription_tier)}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{profile?.full_name}</p>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                </div>
                
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/children" className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Children
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscription" className="flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
