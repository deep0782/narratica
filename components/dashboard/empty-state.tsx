'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  hasStories: boolean
  searchQuery: string
  onClearFilters: () => void
}

export function EmptyState({ hasStories, searchQuery, onClearFilters }: EmptyStateProps) {
  if (!hasStories) {
    // No stories at all - first time user
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-purple-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to Your Story Dashboard!
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't created any stories yet. Let's start your magical storytelling journey by creating your first personalized story!
          </p>
          
          <div className="space-y-4">
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8">
                <Sparkles className="h-5 w-5 mr-2" />
                Create Your First Story
              </Button>
            </Link>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-yellow-400" />
                <span>AI-Powered</span>
              </div>
              <div>•</div>
              <div>Child-Safe Content</div>
              <div>•</div>
              <div>Educational Themes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Has stories but none match current filters
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-blue-500" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          No Stories Found
        </h3>
        
        <p className="text-gray-600 mb-6">
          {searchQuery 
            ? `No stories match your search for "${searchQuery}". Try different keywords or clear your filters.`
            : "No stories match your current filters. Try adjusting your search criteria."
          }
        </p>
        
        <div className="space-y-3">
          <Button onClick={onClearFilters} variant="outline">
            Clear All Filters
          </Button>
          
          <div className="text-sm text-gray-500">
            or
          </div>
          
          <Link href="/create">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Create New Story
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
