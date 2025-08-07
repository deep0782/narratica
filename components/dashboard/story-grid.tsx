'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Edit, Copy, Download, Share2, Trash2, Heart, HeartOff, Play, FileText, Clock, User, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Story, Child } from '@/lib/supabase'

interface StoryGridProps {
  stories: Story[]
  children: Child[]
  viewMode: 'grid' | 'list'
  onStoryUpdate: () => void
}

export function StoryGrid({ stories, children, viewMode, onStoryUpdate }: StoryGridProps) {
  const [favoriteLoading, setFavoriteLoading] = useState<string | null>(null)

  const getChildName = (childId: string) => {
    return children.find(c => c.id === childId)?.name || 'Unknown'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-700">Complete</Badge>
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-700">Generating</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-700">Error</Badge>
      default:
        return null
    }
  }

  const handleToggleFavorite = async (storyId: string) => {
    setFavoriteLoading(storyId)
    // TODO: Implement favorite toggle with database
    setTimeout(() => {
      setFavoriteLoading(null)
      onStoryUpdate()
    }, 500)
  }

  const handleDeleteStory = async (storyId: string) => {
    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      // TODO: Implement story deletion
      onStoryUpdate()
    }
  }

  const handleDuplicateStory = async (storyId: string) => {
    // TODO: Implement story duplication
    onStoryUpdate()
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {stories.map((story) => (
          <Card key={story.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                {/* Thumbnail */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex-shrink-0">
                  {story.metadata?.thumbnail ? (
                    <Image
                      src={story.metadata.thumbnail || "/placeholder.svg"}
                      alt={story.auto_generated_title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-purple-400" />
                    </div>
                  )}
                  {story.status === 'generating' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {story.auto_generated_title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {story.story_description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {story.featured_children.map(childId => getChildName(childId)).join(', ')}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(story.created_at).toLocaleDateString()}
                        </div>
                        <div>{story.scene_count} scenes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusBadge(story.status)}
                      
                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/stories/${story.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Story
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateStory(story.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {story.exports.pdf_url && (
                            <DropdownMenuItem asChild>
                              <a href={story.exports.pdf_url} download>
                                <FileText className="h-4 w-4 mr-2" />
                                Download PDF
                              </a>
                            </DropdownMenuItem>
                          )}
                          {story.exports.video_url && (
                            <DropdownMenuItem asChild>
                              <a href={story.exports.video_url} target="_blank">
                                <Play className="h-4 w-4 mr-2" />
                                Watch Video
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Story
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleToggleFavorite(story.id)}
                            disabled={favoriteLoading === story.id}
                          >
                            {story.metadata?.favorite ? (
                              <HeartOff className="h-4 w-4 mr-2" />
                            ) : (
                              <Heart className="h-4 w-4 mr-2" />
                            )}
                            {story.metadata?.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStory(story.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Story
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Card key={story.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-0">
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              {story.metadata?.thumbnail ? (
                <Image
                  src={story.metadata.thumbnail || "/placeholder.svg"}
                  alt={story.auto_generated_title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-purple-400" />
                </div>
              )}
              
              {/* Status Overlay */}
              {story.status === 'generating' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
                    <p className="text-sm">Generating...</p>
                  </div>
                </div>
              )}
              
              {/* Favorite Button */}
              <button
                onClick={() => handleToggleFavorite(story.id)}
                disabled={favoriteLoading === story.id}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200"
              >
                <Heart 
                  className={`h-4 w-4 ${story.metadata?.favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </button>
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {getStatusBadge(story.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {story.auto_generated_title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {story.story_description}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {story.featured_children.map(childId => getChildName(childId)).join(', ')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {story.exports.pdf_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={story.exports.pdf_url} download>
                        <FileText className="h-3 w-3 mr-1" />
                        PDF
                      </a>
                    </Button>
                  )}
                  {story.exports.video_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={story.exports.video_url} target="_blank">
                        <Play className="h-3 w-3 mr-1" />
                        Video
                      </a>
                    </Button>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/stories/${story.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Story
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateStory(story.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Story
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDeleteStory(story.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Story
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
