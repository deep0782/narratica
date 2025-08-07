'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Volume2, VolumeX, Download, Share2, Maximize, Home, Heart, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { ParentProfile } from '@/lib/supabase'

interface StoryPage {
  id: string
  page_number: number
  scene_title: string
  narration_text: string
  image_url: string
  characters: string[]
}

interface Story {
  id: string
  title: string
  child_name: string
  art_style: string
  educational_theme: string
  pages: StoryPage[]
  created_at: string
}

interface StorybookViewerProps {
  story: Story
  profile: ParentProfile | null
}

export function StorybookViewer({ story, profile }: StorybookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoReading, setIsAutoReading] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  // Auto-reading functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoReading && currentPage < story.pages.length - 1) {
      interval = setInterval(() => {
        setCurrentPage(prev => prev + 1)
      }, 8000) // 8 seconds per page
    } else if (currentPage >= story.pages.length - 1) {
      setIsAutoReading(false)
    }
    return () => clearInterval(interval)
  }, [isAutoReading, currentPage, story.pages.length])

  const handleNextPage = () => {
    if (currentPage < story.pages.length - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handlePageSelect = (pageIndex: number) => {
    setCurrentPage(pageIndex)
  }

  const toggleAutoReading = () => {
    setIsAutoReading(!isAutoReading)
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    // TODO: Implement text-to-speech functionality
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    // TODO: Save to favorites in database
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log('Downloading story...')
  }

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log('Sharing story...')
  }

  const currentStoryPage = story.pages[currentPage]
  const progress = ((currentPage + 1) / story.pages.length) * 100

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{story.title}</h1>
                <p className="text-sm text-gray-600">A story for {story.child_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                className={isFavorited ? 'text-red-500' : 'text-gray-500'}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Page {currentPage + 1} of {story.pages.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Storybook Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Book Pages */}
          <div className="relative">
            <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden border-4 border-amber-200">
              <div className="grid md:grid-cols-2 min-h-[600px]">
                {/* Left Page - Image */}
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 p-8 flex items-center justify-center">
                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 text-amber-400 opacity-30">
                    <Star className="h-6 w-6" />
                  </div>
                  <div className="absolute top-8 right-8 text-pink-400 opacity-30">
                    <div className="w-4 h-4 bg-pink-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-6 left-6 text-purple-400 opacity-30">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  </div>
                  
                  {/* Image Frame */}
                  <div className="relative w-full max-w-md">
                    <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-orange-200 rounded-2xl transform rotate-1"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl transform -rotate-1"></div>
                    <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={currentStoryPage.image_url || "/placeholder.svg"}
                        alt={currentStoryPage.scene_title}
                        width={400}
                        height={300}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    
                    {/* Decorative Corner Elements */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-400 rounded-full border-2 border-white"></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full border-2 border-white"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-orange-400 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-1/4 right-1/4 text-yellow-400 opacity-40 animate-bounce">
                    <Star className="h-4 w-4" />
                  </div>
                  <div className="absolute bottom-1/3 left-1/4 text-pink-400 opacity-40 animate-pulse">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  </div>
                </div>

                {/* Right Page - Text */}
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 p-8">
                  {/* Decorative Border */}
                  <div className="absolute inset-4 border-2 border-amber-200 rounded-lg opacity-30"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Scene Title */}
                    <div className="text-center mb-6">
                      <div className="inline-block">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
                          {currentStoryPage.scene_title}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
                      </div>
                    </div>

                    {/* Narration Text */}
                    <div className="flex-1 flex items-center">
                      <div className="w-full">
                        <p className="text-lg leading-relaxed text-gray-800 font-serif text-justify">
                          {currentStoryPage.narration_text}
                        </p>
                      </div>
                    </div>

                    {/* Page Number */}
                    <div className="text-center mt-6">
                      <span className="text-sm text-gray-500 font-medium">
                        {currentPage + 1}
                      </span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 text-amber-300 opacity-40">
                    <div className="w-8 h-8 border-2 border-amber-300 rounded-full"></div>
                  </div>
                  <div className="absolute bottom-8 left-6 text-orange-300 opacity-40">
                    <div className="w-6 h-6 bg-orange-300 transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-3"
              onClick={handlePreviousPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-3"
              onClick={handleNextPage}
              disabled={currentPage === story.pages.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Story Controls */}
          <div className="mt-8 flex justify-center">
            <Card className="bg-white/80 backdrop-blur-sm border border-amber-200">
              <div className="p-4 flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAutoReading}
                  className={isAutoReading ? 'bg-green-100 text-green-700' : ''}
                >
                  {isAutoReading ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isAutoReading ? 'Pause' : 'Auto Read'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(0)}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAudio}
                  className={isAudioEnabled ? 'bg-blue-100 text-blue-700' : ''}
                >
                  {isAudioEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                  Audio
                </Button>
              </div>
            </Card>
          </div>

          {/* Page Thumbnails */}
          <div className="mt-8">
            <div className="flex justify-center">
              <div className="flex space-x-2 overflow-x-auto pb-4 max-w-full">
                {story.pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageSelect(index)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg border-2 transition-all duration-200 ${
                      index === currentPage
                        ? 'border-amber-400 bg-amber-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="w-full h-full rounded-md bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
