'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, BookOpen, Volume2, VolumeX, RotateCcw, Maximize2 } from 'lucide-react'

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
  childName: string
  scenes: Scene[]
  artStyle: string
  createdAt: string
}

interface StorybookViewerProps {
  story: Story
}

export function StorybookViewer({ story }: StorybookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentPage(prev => {
        if (prev >= story.scenes.length - 1) {
          setIsAutoPlay(false)
          return prev
        }
        return prev + 1
      })
    }, 8000) // 8 seconds per page

    return () => clearInterval(timer)
  }, [isAutoPlay, story.scenes.length])

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
    setIsAutoPlay(false)
  }

  const handleNext = () => {
    setCurrentPage(prev => Math.min(story.scenes.length - 1, prev + 1))
    setIsAutoPlay(false)
  }

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    setIsAutoPlay(false)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    // In production, this would start/stop text-to-speech
  }

  const resetToBeginning = () => {
    setCurrentPage(0)
    setIsAutoPlay(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const currentScene = story.scenes[currentPage]

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-pink-50' : ''}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Story Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className={isAutoPlay ? 'bg-green-100 text-green-700' : ''}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isAutoPlay ? 'Pause Reading' : 'Auto Read'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAudio}
              className={audioEnabled ? 'bg-blue-100 text-blue-700' : ''}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToBeginning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {story.scenes.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Storybook Layout */}
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-2xl bg-white border-4 border-amber-200">
            {/* Decorative Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">{story.title}</h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-8 h-1 bg-white rounded"></div>
                <span className="text-white text-sm">✨ A Magical Story ✨</span>
                <div className="w-8 h-1 bg-white rounded"></div>
              </div>
            </div>

            {/* Book Pages */}
            <div className="relative min-h-[600px] bg-gradient-to-br from-amber-50 to-orange-50">
              {/* Decorative Border */}
              <div className="absolute inset-4 border-4 border-amber-300 rounded-lg opacity-30"></div>
              <div className="absolute inset-6 border-2 border-amber-400 rounded-lg opacity-20"></div>

              <div className="grid lg:grid-cols-2 min-h-[600px]">
                {/* Left Page - Image */}
                <div className="relative p-8 flex items-center justify-center">
                  <div className="relative w-full max-w-md">
                    {/* Image Frame */}
                    <div className="relative bg-white p-4 rounded-lg shadow-lg border-4 border-amber-200">
                      <img
                        src={currentScene.imageUrl || "/placeholder.svg"}
                        alt={currentScene.title}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                      {/* Decorative corners */}
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-400 rounded-full"></div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full"></div>
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full"></div>
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute -top-4 left-1/4 text-2xl animate-bounce">⭐</div>
                    <div className="absolute -right-4 top-1/3 text-2xl animate-pulse">🌟</div>
                    <div className="absolute -bottom-4 right-1/4 text-2xl animate-bounce delay-300">✨</div>
                  </div>
                </div>

                {/* Right Page - Text */}
                <div className="relative p-8 flex flex-col justify-center">
                  <div className="space-y-6">
                    {/* Scene Title */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-purple-900 mb-2">
                        {currentScene.title}
                      </h2>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                        <span className="text-purple-600">📖</span>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400"></div>
                      </div>
                    </div>

                    {/* Narration Text */}
                    <div className="bg-white bg-opacity-70 p-6 rounded-lg border-2 border-amber-200 shadow-inner">
                      <p className="text-lg leading-relaxed text-gray-800 font-serif">
                        {currentScene.narration}
                      </p>
                    </div>

                    {/* Page Number */}
                    <div className="text-center">
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        Page {currentPage + 1}
                      </span>
                    </div>
                  </div>

                  {/* Decorative elements for text page */}
                  <div className="absolute top-4 right-4 text-xl opacity-50">🦋</div>
                  <div className="absolute bottom-4 left-4 text-xl opacity-50">🌸</div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <Button
                variant="ghost"
                size="lg"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg rounded-full w-12 h-12 p-0"
                onClick={handlePrevious}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg rounded-full w-12 h-12 p-0"
                onClick={handleNext}
                disabled={currentPage === story.scenes.length - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Page Thumbnails */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4">
              <div className="flex justify-center space-x-2 overflow-x-auto">
                {story.scenes.map((scene, index) => (
                  <button
                    key={scene.id}
                    onClick={() => handlePageClick(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all ${
                      currentPage === index
                        ? 'border-purple-500 shadow-lg scale-110'
                        : 'border-amber-300 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={scene.imageUrl || "/placeholder.svg"}
                      alt={`Page ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-full p-1 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentPage + 1) / story.scenes.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">
              Story Progress: {Math.round(((currentPage + 1) / story.scenes.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
