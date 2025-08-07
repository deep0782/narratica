'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { StorybookViewer } from '@/components/story/storybook-viewer'
import { getCurrentUser, getProfile } from '@/lib/supabase'
import type { ParentProfile } from '@/lib/supabase'

interface Story {
  id: string
  title: string
  child_name: string
  art_style: string
  educational_theme: string
  pages: StoryPage[]
  created_at: string
}

interface StoryPage {
  id: string
  page_number: number
  scene_title: string
  narration_text: string
  image_url: string
  characters: string[]
}

// Mock story data for demonstration
const mockStory: Story = {
  id: 'story-1',
  title: 'Emma\'s Magical Garden Adventure',
  child_name: 'Emma',
  art_style: 'Disney Style',
  educational_theme: 'Friendship & Kindness',
  created_at: '2024-01-15T10:00:00Z',
  pages: [
    {
      id: 'page-1',
      page_number: 1,
      scene_title: 'The Discovery',
      narration_text: 'Once upon a time, in a cozy little house with a beautiful garden, lived a curious girl named Emma. She loved exploring every corner of her backyard, always looking for new adventures. One sunny morning, while watering the flowers with her grandmother, Emma noticed something magical sparkling behind the old oak tree.',
      image_url: '/magical-garden-discovery.png',
      characters: ['Emma', 'Grandmother']
    },
    {
      id: 'page-2',
      page_number: 2,
      scene_title: 'The Magical Portal',
      narration_text: 'As Emma approached the oak tree, she discovered a shimmering portal made of intertwined vines and glowing flowers. The portal hummed with gentle magic, and through it, she could see a magnificent garden filled with talking animals and singing flowers. "What a wonderful discovery!" Emma whispered, her eyes wide with wonder.',
      image_url: '/glowing-vine-portal.png',
      characters: ['Emma']
    },
    {
      id: 'page-3',
      page_number: 3,
      scene_title: 'Meeting New Friends',
      narration_text: 'Stepping through the portal, Emma found herself in the most beautiful garden she had ever seen. Colorful butterflies danced around her, and a friendly rabbit named Rosie hopped up to greet her. "Welcome to the Friendship Garden!" said Rosie with a warm smile. "We\'ve been waiting for someone kind like you to help us with a very important mission."',
      image_url: '/magical-garden-meeting.png',
      characters: ['Emma', 'Rosie the Rabbit']
    },
    {
      id: 'page-4',
      page_number: 4,
      scene_title: 'The Mission of Kindness',
      narration_text: 'Rosie explained that the garden\'s magic was fading because the animals had forgotten how to be kind to each other. "We need someone with a big heart to remind us how friendship works," she said sadly. Emma smiled brightly and said, "I would love to help! My grandmother always says that kindness is the most powerful magic of all."',
      image_url: '/sad-magical-gathering.png',
      characters: ['Emma', 'Rosie the Rabbit', 'Garden Animals']
    },
    {
      id: 'page-5',
      page_number: 5,
      scene_title: 'Spreading Kindness',
      narration_text: 'Emma spent the day teaching the garden animals about friendship. She showed them how to share their favorite foods, how to listen when someone was sad, and how to celebrate each other\'s differences. Soon, the garden began to glow brighter as acts of kindness filled the air with magical sparkles.',
      image_url: '/magical-garden-kindness.png',
      characters: ['Emma', 'Various Garden Animals']
    },
    {
      id: 'page-6',
      page_number: 6,
      scene_title: 'The Magic Returns',
      narration_text: 'As the sun began to set, the Friendship Garden was more beautiful than ever. The flowers sang joyful songs, the trees swayed in a gentle dance, and all the animals played together happily. "Thank you, Emma," said Rosie. "You\'ve reminded us that the greatest magic comes from caring for one another."',
      image_url: '/magical-sunset-garden.png',
      characters: ['Emma', 'Rosie the Rabbit', 'All Garden Friends']
    },
    {
      id: 'page-7',
      page_number: 7,
      scene_title: 'Home with New Wisdom',
      narration_text: 'When Emma returned home through the magical portal, she carried the garden\'s lessons in her heart. She hugged her grandmother tightly and shared everything she had learned about friendship and kindness. From that day forward, Emma made sure to spread kindness wherever she went, knowing that even small acts of caring could create the most wonderful magic.',
      image_url: '/girl-grandmother-hug.png',
      characters: ['Emma', 'Grandmother']
    }
  ]
}

export default function StoryPage() {
  const params = useParams()
  const [story, setStory] = useState<Story | null>(null)
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoryData()
  }, [params.id])

  const loadStoryData = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        const userProfile = await getProfile(user.id)
        setProfile(userProfile)
      }

      // In a real app, this would fetch the story from the database
      // For now, we'll use mock data
      setStory(mockStory)
    } catch (error) {
      console.error('Error loading story:', error)
    } finally {
      setIsLoading(false)
    }
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

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600">The story you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <StorybookViewer story={story} profile={profile} />
}
