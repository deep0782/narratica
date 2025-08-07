'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Volume2, VolumeX, Download, Share2, Heart, Maximize, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Scene {
  id: string
  title: string
  narration: string
  imageUrl: string
  order: number
}

interface Story {
  id: string
  title: string
  scenes: Scene[]
  artStyle: string
  colorPalette: string
  createdAt: string
  childName: string
}

interface StorybookViewerProps {
  story: Story
}

export function StorybookViewer({ story }: StorybookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoReading, setIsAutoReading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalPages = story.scenes.length
  const progress = ((currentPage + 1) / totalPages) * 100

  // Auto-reading functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoReading && currentPage < totalPages - 1) {
      interval = setInterval(() => {
        setCurrentPage(prev => prev + 1)
      }, 8000) // 8 seconds per page
    } else if (currentPage >= totalPages - 1) {
      setIsAutoReading(false)
    }
    return () => clearInterval(interval)
  }, [isAutoReading, currentPage, totalPages])

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex)
  }

  const toggleAutoReading = () => {
    setIsAutoReading(!isAutoReading)
  }

  const restartStory = () => {
    setCurrentPage(0)
    setIsAutoReading(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const currentScene = story.scenes[currentPage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{story.title}</h1>
                <p className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Progress value={progress} className="mt-2 h-2" />
        </div>
      </div>

      {/* Main Storybook */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Book Pages */}
          <div className="relative">
            <Card className="overflow-hidden shadow-2xl bg-white border-4 border-amber-200">
              <div className="grid md:grid-cols-2 min-h-[600px]">
                {/* Left Page - Image */}
                <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 p-8 flex items-center justify-center">
                  {/* Decorative Frame */}
                  <div className="absolute inset-4 border-4 border-amber-300 rounded-lg opacity-50"></div>
                  <div className="absolute top-6 left-6 w-8 h-8 border-4 border-pink-400 rounded-full"></div>
                  <div className="absolute top-6 right-6 w-8 h-8 border-4 border-purple-400 rounded-full"></div>
                  <div className="absolute bottom-6 left-6 w-8 h-8 border-4 border-yellow-400 rounded-full"></div>
                  <div className="absolute bottom-6 right-6 w-8 h-8 border-4 border-green-400 rounded-full"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-12 left-12 text-2xl animate-bounce">⭐</div>
                  <div className="absolute top-20 right-16 text-xl animate-pulse">✨</div>
                  <div className="absolute bottom-16 left-16 text-lg animate-bounce delay-300">🦋</div>
                  <div className="absolute bottom-12 right-12 text-xl animate-pulse delay-500">🌸</div>
                  
                  {/* Main Image */}
                  <div className="relative z-10 w-full max-w-md">
                    <div className="aspect-square relative rounded-xl overflow-hidden shadow-lg border-4 border-white">
                      <Image
                        src={currentScene.imageUrl || "/placeholder.svg"}
                        alt={currentScene.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Page - Text */}
                <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 p-8 flex flex-col justify-center">
                  {/* Decorative Border */}
                  <div className="absolute inset-4 border-2 border-dashed border-amber-300 rounded-lg opacity-30"></div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-8 right-8 text-xl animate-pulse">📖</div>
                  <div className="absolute bottom-8 left-8 text-lg animate-bounce">🌟</div>
                  
                  <div className="relative z-10 space-y-6">
                    {/* Scene Title */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">
                        {currentScene.title}
                      </h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
                    </div>
                    
                    {/* Narration */}
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed font-serif text-lg">
                        {currentScene.narration}
                      </p>
                    </div>
                    
                    {/* Decorative Divider */}
                    <div className="flex justify-center items-center space-x-2 py-4">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={restartStory}
                className="rounded-full"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant={isAutoReading ? "default" : "outline"}
                size="sm"
                onClick={toggleAutoReading}
                className="rounded-full"
              >
                {isAutoReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="rounded-full"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Page Thumbnails */}
          <div className="mt-8">
            <div className="flex justify-center">
              <div className="flex gap-2 p-4 bg-white/50 rounded-full backdrop-blur-sm">
                {story.scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    onClick={() => goToPage(index)}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentPage
                        ? 'border-purple-500 scale-110 shadow-lg'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <Image
                      src={scene.imageUrl || "/placeholder.svg"}
                      alt={`Page ${index + 1}`}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
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
