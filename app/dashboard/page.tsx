'use client'

import { useState, useEffect } from 'react'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { UsageLimits } from '@/components/dashboard/usage-limits'
import { StoryGrid } from '@/components/dashboard/story-grid'
import { SearchAndFilters } from '@/components/dashboard/search-and-filters'
import { CreateStoryButton } from '@/components/dashboard/create-story-button'
import { RecentlyCreated } from '@/components/dashboard/recently-created'
import { FavoritesSection } from '@/components/dashboard/favorites-section'
import { EmptyState } from '@/components/dashboard/empty-state'
import { LoadingState } from '@/components/dashboard/loading-state'
import { getCurrentUser, getProfile, getCurrentUsage, isDatabaseAvailable } from '@/lib/supabase'
import type { ParentProfile, Story, Child } from '@/lib/supabase'

export default function DashboardPage() {
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [stories, setStories] = useState<Story[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [usage, setUsage] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChild, setSelectedChild] = useState<string>('all')
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'child'>('recent')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDatabaseReady, setIsDatabaseReady] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Check if database is available
      const dbAvailable = await isDatabaseAvailable()
      setIsDatabaseReady(dbAvailable)
      
      const user = await getCurrentUser()
      if (!user) return

      // Load user profile (will use mock data if database not available)
      const userProfile = await getProfile(user.id)
      setProfile(userProfile)

      // Load usage data (will use mock data if database not available)
      const currentUsage = await getCurrentUsage(user.id)
      setUsage(currentUsage)

      // Load mock data for stories and children
      // In a real app, these would come from the database
      setStories(mockStories)
      setChildren(mockChildren)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock data for demonstration (replace with real data when database is connected)
  const mockStories: Story[] = [
    {
      id: '1',
      parent_id: 'user-1',
      auto_generated_title: "Emma's Magical Adventure",
      story_description: "A brave little girl discovers a magical forest where she learns about friendship and courage.",
      target_age_group: 'elementary',
      educational_theme: 'friendship',
      art_style: 'disney-style',
      scene_count: 8,
      featured_children: ['child-1'],
      status: 'complete',
      content_safety_approved: true,
      exports: { pdf_url: '/sample-story.pdf', video_url: null, last_exported: '2024-01-15' },
      metadata: { thumbnail: '/story-thumbnails/emma-adventure.png', favorite: true },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      parent_id: 'user-1',
      auto_generated_title: "Alex and the Dragon",
      story_description: "A young boy befriends a friendly dragon and learns about overcoming fears.",
      target_age_group: 'elementary',
      educational_theme: 'courage',
      art_style: 'pixar-style',
      scene_count: 6,
      featured_children: ['child-2'],
      status: 'generating',
      content_safety_approved: true,
      exports: { pdf_url: null, video_url: null, last_exported: null },
      metadata: { thumbnail: '/story-thumbnails/alex-dragon.png', favorite: false },
      created_at: '2024-01-14T15:30:00Z',
      updated_at: '2024-01-14T15:30:00Z'
    }
  ]

  const mockChildren: Child[] = [
    {
      id: 'child-1',
      parent_id: 'user-1',
      name: 'Emma',
      age_group: 'elementary',
      favorite_activities: ['reading', 'drawing', 'playing outside'],
      character_traits: ['brave', 'curious', 'kind'],
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    },
    {
      id: 'child-2',
      parent_id: 'user-1',
      name: 'Alex',
      age_group: 'elementary',
      favorite_activities: ['building blocks', 'adventure games'],
      character_traits: ['adventurous', 'creative', 'helpful'],
      created_at: '2024-01-12T14:00:00Z',
      updated_at: '2024-01-12T14:00:00Z'
    }
  ]

  // Filter and sort stories
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.auto_generated_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.story_description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesChild = selectedChild === 'all' || story.featured_children.includes(selectedChild)
    const matchesTheme = selectedTheme === 'all' || story.educational_theme === selectedTheme
    
    return matchesSearch && matchesChild && matchesTheme
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'title':
        return a.auto_generated_title.localeCompare(b.auto_generated_title)
      case 'child':
        const aChildName = children.find(c => c.id === a.featured_children[0])?.name || ''
        const bChildName = children.find(c => c.id === b.featured_children[0])?.name || ''
        return aChildName.localeCompare(bChildName)
      default:
        return 0
    }
  })

  const recentStories = stories.slice(0, 3)
  const favoriteStories = stories.filter(story => story.metadata?.favorite)

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <>
      <DashboardHeader profile={profile} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Database Status Banner (for development) */}
        {!isDatabaseReady && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> Database not connected. Using sample data for preview.
              </p>
            </div>
          </div>
        )}

        {/* Usage Limits */}
        <UsageLimits 
          profile={profile} 
          usage={usage}
          className="mb-8"
        />

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Story Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedChild={selectedChild}
              onChildChange={setSelectedChild}
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              children={children}
            />

            {/* Create Story Button */}
            <CreateStoryButton />

            {/* Stories Grid/List */}
            {filteredStories.length > 0 ? (
              <StoryGrid 
                stories={filteredStories}
                children={children}
                viewMode={viewMode}
                onStoryUpdate={loadDashboardData}
              />
            ) : (
              <EmptyState 
                hasStories={stories.length > 0}
                searchQuery={searchQuery}
                onClearFilters={() => {
                  setSearchQuery('')
                  setSelectedChild('all')
                  setSelectedTheme('all')
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentlyCreated 
              stories={recentStories}
              children={children}
            />
            
            {favoriteStories.length > 0 && (
              <FavoritesSection 
                stories={favoriteStories}
                children={children}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
