'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Volume2, VolumeX, Download, Share2, Heart, Maximize, Home } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Scene {
  id: string
  title: string
  content: string
  image_url: string
}

interface Story {
  id: string
  title: string
  child_name: string
  art_style: string
  scenes: Scene[]
}

interface StorybookViewerProps {
  story: Story
}

export function StorybookViewer({ story }: StorybookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoReading, setIsAutoReading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Auto-reading functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAutoReading && currentPage < story.scenes.length - 1) {
      interval = setInterval(() => {
        setCurrentPage(prev => prev + 1)
      }, 8000) // 8 seconds per page
    } else if (currentPage >= story.scenes.length - 1) {
      setIsAutoReading(false)
    }
    return () => clearInterval(interval)
  }, [isAutoReading, currentPage, story.scenes.length])

  const nextPage = () => {
    if (currentPage < story.scenes.length - 1) {
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
  const progress = ((currentPage + 1) / story.scenes.length) * 100

  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                <Home className="w-4 h-4 mr-2" />
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
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-100'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-gray-600 hover:bg-gray-100"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Storybook */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-amber-200 rounded-3xl overflow-hidden">
          {/* Progress Bar */}
          <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-800">
                Page {currentPage + 1} of {story.scenes.length}
              </span>
              <span className="text-sm text-amber-700">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 bg-amber-200" />
          </div>

          {/* Book Pages */}
          <div className="relative">
            <div className="grid md:grid-cols-2 min-h-[600px]">
              {/* Left Page - Image */}
              <div className="relative bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-8 flex items-center justify-center">
                {/* Decorative Border */}
                <div className="absolute inset-4 border-4 border-amber-300 rounded-2xl opacity-30"></div>
                <div className="absolute inset-6 border-2 border-amber-400 rounded-xl opacity-20"></div>
                
                {/* Floating Decorative Elements */}
                <div className="absolute top-8 left-8 w-6 h-6 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute top-16 right-12 w-4 h-4 bg-pink-300 rounded-full opacity-60 animate-pulse delay-1000"></div>
                <div className="absolute bottom-12 left-12 w-5 h-5 bg-purple-300 rounded-full opacity-60 animate-pulse delay-2000"></div>
                <div className="absolute bottom-8 right-8 w-3 h-3 bg-orange-300 rounded-full opacity-60 animate-pulse delay-500"></div>
                
                {/* Floating Stars */}
                <div className="absolute top-20 left-20 text-yellow-400 opacity-70 animate-bounce">✨</div>
                <div className="absolute top-32 right-16 text-pink-400 opacity-70 animate-bounce delay-1000">🌟</div>
                <div className="absolute bottom-20 left-16 text-purple-400 opacity-70 animate-bounce delay-2000">⭐</div>
                
                {/* Main Image */}
                <div className="relative z-10 w-full max-w-md">
                  <div className="relative bg-white p-4 rounded-2xl shadow-xl border-4 border-amber-200">
                    {/* Decorative Corners */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full"></div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-400 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full"></div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-teal-400 rounded-full"></div>
                    
                    <Image
                      src={currentScene.image_url || "/placeholder.svg"}
                      alt={currentScene.title}
                      width={400}
                      height={300}
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Right Page - Text */}
              <div className="relative bg-gradient-to-br from-cream-50 to-amber-50 p-8">
                {/* Decorative Border */}
                <div className="absolute inset-4 border-2 border-amber-200 rounded-2xl opacity-40"></div>
                
                {/* Floating Elements */}
                <div className="absolute top-12 right-12 text-2xl opacity-30 animate-float">🦋</div>
                <div className="absolute top-32 left-8 text-xl opacity-30 animate-float delay-1000">🌸</div>
                <div className="absolute bottom-20 right-16 text-lg opacity-30 animate-float delay-2000">🌿</div>
                
                <div className="relative z-10 h-full flex flex-col">
                  {/* Scene Title */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1"></div>
                      <div className="px-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{currentPage + 1}</span>
                        </div>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-1"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 font-serif">
                      {currentScene.title}
                    </h2>
                  </div>

                  {/* Scene Content */}
                  <div className="flex-1 flex items-center">
                    <div className="w-full">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
                        <p className="text-gray-800 leading-relaxed text-lg font-serif whitespace-pre-line">
                          {currentScene.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Divider */}
                  <div className="mt-6 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="lg"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg border border-amber-200 text-amber-700 disabled:opacity-30"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={nextPage}
              disabled={currentPage === story.scenes.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg border border-amber-200 text-amber-700 disabled:opacity-30"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Controls */}
          <div className="p-6 bg-gradient-to-r from-amber-100 to-orange-100 border-t border-amber-200">
            <div className="flex items-center justify-between">
              {/* Playback Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAutoReading}
                  className="bg-white/80 hover:bg-white shadow-sm border border-amber-200 text-amber-700"
                >
                  {isAutoReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={restartStory}
                  className="bg-white/80 hover:bg-white shadow-sm border border-amber-200 text-amber-700"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-white/80 hover:bg-white shadow-sm border border-amber-200 text-amber-700"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Page Thumbnails */}
              <div className="flex items-center space-x-2 overflow-x-auto max-w-md">
                {story.scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    onClick={() => goToPage(index)}
                    className={`flex-shrink-0 w-12 h-8 rounded border-2 transition-all ${
                      index === currentPage
                        ? 'border-amber-500 bg-amber-200'
                        : 'border-amber-300 bg-white/80 hover:bg-amber-100'
                    }`}
                  >
                    <span className="text-xs font-medium text-amber-800">{index + 1}</span>
                  </button>
                ))}
              </div>

              {/* Status */}
              <div className="text-sm text-amber-700">
                {isAutoReading && (
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Auto-reading</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
