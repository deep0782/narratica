'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { StorybookViewer } from '@/components/story/storybook-viewer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Share2, Heart } from 'lucide-react'

// Mock story data - in production this would come from the database
const mockStory = {
  id: 'story-1',
  title: 'Emma\'s Magical Forest Adventure',
  childName: 'Emma',
  scenes: [
    {
      id: 'scene-1',
      title: 'The Enchanted Beginning',
      narration: 'Once upon a time, in a magical forest where the trees whispered secrets and flowers danced in the breeze, lived a brave little girl named Emma. She had sparkling eyes full of curiosity and a heart as big as the moon.',
      imageUrl: '/magical-storybook-scene.png',
      order: 1
    },
    {
      id: 'scene-2',
      title: 'Meeting the Friendly Dragon',
      narration: 'As Emma wandered deeper into the forest, she heard a gentle rumbling sound. Behind a cluster of rainbow flowers, she discovered a friendly dragon with shimmering purple scales. "Hello there!" said the dragon with a warm smile. "I\'ve been waiting for a brave friend like you!"',
      imageUrl: '/magical-storybook-scene.png',
      order: 2
    },
    {
      id: 'scene-3',
      title: 'The Magic Crystal Quest',
      narration: 'The dragon told Emma about a magical crystal that had lost its glow, making all the forest animals sad. "Will you help me find the Crystal of Kindness?" asked the dragon. Emma\'s eyes lit up with excitement. "Of course! Let\'s help our forest friends!"',
      imageUrl: '/magical-storybook-scene.png',
      order: 3
    },
    {
      id: 'scene-4',
      title: 'Working Together',
      narration: 'Emma and her dragon friend worked together, using Emma\'s cleverness and the dragon\'s gentle magic. They helped a lost bunny find its family, shared their lunch with hungry squirrels, and sang songs to cheer up a lonely owl.',
      imageUrl: '/magical-storybook-scene.png',
      order: 4
    },
    {
      id: 'scene-5',
      title: 'The Crystal\'s Glow Returns',
      narration: 'With each act of kindness, the Crystal of Kindness began to glow brighter and brighter. Emma realized that the crystal\'s magic came from the kindness in her heart. The forest filled with warm, golden light, and all the animals cheered with joy.',
      imageUrl: '/magical-storybook-scene.png',
      order: 5
    },
    {
      id: 'scene-6',
      title: 'A Celebration of Friendship',
      narration: 'The forest animals threw a wonderful celebration for Emma and her dragon friend. They danced under the starlight, shared delicious forest treats, and promised to always be kind to one another. Emma had learned that the greatest magic of all is kindness.',
      imageUrl: '/magical-storybook-scene.png',
      order: 6
    },
    {
      id: 'scene-7',
      title: 'The Journey Home',
      narration: 'As the moon rose high in the sky, it was time for Emma to return home. The dragon gave her a special friendship bracelet that would always remind her of their magical adventure. "Remember," said the dragon, "kindness is the most powerful magic in the world."',
      imageUrl: '/magical-storybook-scene.png',
      order: 7
    },
    {
      id: 'scene-8',
      title: 'Sweet Dreams and New Adventures',
      narration: 'Emma returned home with a heart full of joy and wonderful memories. As she drifted off to sleep, she dreamed of all the new adventures waiting for her in the magical forest. And she knew that wherever she went, she would always carry the magic of kindness with her.',
      imageUrl: '/magical-storybook-scene.png',
      order: 8
    }
  ],
  artStyle: 'disney-style',
  createdAt: '2024-01-15T10:00:00Z'
}

export default function StoryPage() {
  const params = useParams()
  const router = useRouter()
  const [story, setStory] = useState(mockStory)
  const [isLoading, setIsLoading] = useState(false)

  const handleBack = () => {
    router.push('/dashboard')
  }

  const handleDownload = () => {
    // In production, this would generate and download a PDF
    console.log('Downloading story...')
  }

  const handleShare = () => {
    // In production, this would open a share dialog
    console.log('Sharing story...')
  }

  const handleFavorite = () => {
    // In production, this would toggle favorite status
    console.log('Adding to favorites...')
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{story.title}</h1>
                <p className="text-sm text-gray-600">A magical story for {story.childName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorite}
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>Favorite</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Storybook Viewer */}
      <StorybookViewer story={story} />
    </div>
  )
}
