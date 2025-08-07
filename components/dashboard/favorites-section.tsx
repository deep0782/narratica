'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Story, Child } from '@/lib/supabase'

interface FavoritesSectionProps {
  stories: Story[]
  children: Child[]
}

export function FavoritesSection({ stories, children }: FavoritesSectionProps) {
  const getChildName = (childId: string) => {
    return children.find(c => c.id === childId)?.name || 'Unknown'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Favorite Stories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stories.map((story) => (
          <div key={story.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0">
              {story.metadata?.thumbnail ? (
                <Image
                  src={story.metadata.thumbnail || "/placeholder.svg"}
                  alt={story.auto_generated_title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm truncate">
                {story.auto_generated_title}
              </h4>
              <p className="text-xs text-gray-500">
                {story.featured_children.map(childId => getChildName(childId)).join(', ')} • {' '}
                {story.scene_count} scenes
              </p>
            </div>
            
            <Link href={`/stories/${story.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
