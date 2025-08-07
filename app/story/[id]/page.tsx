'use client'

import { useEffect, useState } from 'react'
import { StorybookViewer } from '@/components/story/storybook-viewer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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

// Mock story data
const mockStory: Story = {
  id: 'sample-story-id',
  title: "Emma's Magical Garden Adventure",
  childName: "Emma",
  artStyle: "Watercolor",
  colorPalette: "Warm and Bright",
  createdAt: "2024-01-15T10:00:00Z",
  scenes: [
    {
      id: 'scene-1',
      title: 'The Discovery',
      narration: 'Emma was playing in her backyard when she noticed something sparkling behind the old oak tree. As she got closer, she discovered a hidden gate covered in glowing vines. The gate seemed to shimmer with magic, inviting her to explore what lay beyond.',
      imageUrl: '/magical-garden-discovery.png',
      order: 1
    },
    {
      id: 'scene-2',
      title: 'Through the Portal',
      narration: 'With a gentle push, the gate opened, revealing a magnificent garden filled with flowers that sang in harmony and butterflies that left trails of golden dust. Emma stepped through, feeling the warm, magical air embrace her like a gentle hug.',
      imageUrl: '/glowing-vine-portal.png',
      order: 2
    },
    {
      id: 'scene-3',
      title: 'Meeting New Friends',
      narration: 'In the center of the garden, Emma met Luna, a wise talking rabbit with silver fur, and Pip, a cheerful fairy who could make flowers bloom with a wave of her tiny hand. They welcomed Emma with warm smiles and invited her to join their daily garden celebration.',
      imageUrl: '/magical-garden-meeting.png',
      order: 3
    },
    {
      id: 'scene-4',
      title: 'The Problem',
      narration: 'But their joy was interrupted when they discovered that the garden\'s Heart Flower, which kept all the magic alive, was wilting. Without it, the entire magical garden would fade away, and all the wonderful creatures would lose their home.',
      imageUrl: '/sad-magical-gathering.png',
      order: 4
    },
    {
      id: 'scene-5',
      title: 'The Solution',
      narration: 'Emma remembered her grandmother\'s words: "The greatest magic comes from kindness and caring." She gently watered the Heart Flower with water from the garden\'s crystal spring and sang it a lullaby her mother used to sing to her.',
      imageUrl: '/magical-garden-kindness.png',
      order: 5
    },
    {
      id: 'scene-6',
      title: 'The Magic Returns',
      narration: 'As Emma\'s kind words and gentle care reached the Heart Flower, it began to glow brighter than ever before. The entire garden burst into vibrant colors, and all the magical creatures cheered with joy. The garden was saved!',
      imageUrl: '/magical-sunset-garden.png',
      order: 6
    },
    {
      id: 'scene-7',
      title: 'Home Again',
      narration: 'Emma hugged her new friends goodbye, promising to visit again soon. As she stepped back through the magical gate, she carried with her the wonderful memory of her adventure and the important lesson that kindness and caring can work the greatest magic of all.',
      imageUrl: '/girl-grandmother-hug.png',
      order: 7
    }
  ]
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading story data
    const loadStory = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStory(mockStory)
      } catch (err) {
        setError('Failed to load story')
      } finally {
        setIsLoading(false)
      }
    }

    loadStory()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your magical story...</p>
        </div>
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Story Not Found</h1>
          <p className="text-gray-600">The story you're looking for doesn't exist or couldn't be loaded.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return <StorybookViewer story={story} />
}
