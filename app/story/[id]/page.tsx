'use client'

import { useState, useEffect } from 'react'
import { StorybookViewer } from '@/components/story/storybook-viewer'

// Mock story data - in a real app, this would come from your database
const mockStory = {
  id: 'generated-story-id',
  title: "Emma's Magical Garden Adventure",
  child_name: 'Emma',
  art_style: 'Watercolor Fantasy',
  scenes: [
    {
      id: '1',
      title: 'The Secret Garden Discovery',
      content: `Emma was playing in her grandmother's backyard when she noticed something peculiar behind the old oak tree. A soft, golden light was peeking through the leaves, and she could hear the faint sound of tinkling bells.

"What could that be?" Emma wondered aloud, her curiosity getting the better of her.

She pushed aside the hanging branches and gasped in amazement. There, hidden behind the tree, was the most beautiful garden she had ever seen. Flowers of every color imaginable swayed gently in a breeze that seemed to carry whispers of magic.`,
      image_url: '/magical-garden-discovery.png'
    },
    {
      id: '2',
      title: 'Meeting the Garden Guardian',
      content: `As Emma stepped into the magical garden, the flowers seemed to turn toward her, as if greeting an old friend. Suddenly, a shimmering vine grew up from the ground, forming a gentle archway covered in glowing purple flowers.

"Welcome, young Emma," came a melodious voice from nowhere and everywhere at once. "I am Luna, the guardian of this enchanted place. I have been waiting for someone with a kind heart like yours."

Emma's eyes widened with wonder. She had always believed in magic, and now here it was, right in front of her!`,
      image_url: '/glowing-vine-portal.png'
    },
    {
      id: '3',
      title: 'The Talking Animals',
      content: `Luna led Emma deeper into the garden, where she met the most extraordinary friends. There was Oliver the wise owl, who wore tiny spectacles and loved to tell stories. Bella the butterfly had wings that changed colors with her emotions, and Max the rabbit could hop so high he could touch the clouds.

"We've been hoping for a new friend," chirped Bella, her wings turning a happy shade of pink. "Would you like to help us with something very important?"

Emma nodded eagerly, ready for whatever adventure awaited her in this magical place.`,
      image_url: '/magical-garden-meeting.png'
    },
    {
      id: '4',
      title: 'The Wilting Flowers',
      content: `As they walked through the garden, Emma noticed that some of the beautiful flowers were beginning to droop and lose their vibrant colors. Their petals looked sad, and some were even starting to fall to the ground.

"Oh no!" exclaimed Emma. "What's happening to them?"

Oliver the owl adjusted his tiny spectacles and explained, "These flowers bloom with kindness and joy. But lately, there hasn't been enough happiness in the garden. They need someone with a pure heart to help them remember how to shine again."

Emma felt a warm feeling in her chest. She knew exactly what she needed to do.`,
      image_url: '/sad-magical-gathering.png'
    },
    {
      id: '5',
      title: 'The Power of Kindness',
      content: `Emma knelt down beside the wilting flowers and gently touched their petals. "You're all so beautiful," she whispered softly. "I can see how special you are, even when you're feeling sad."

As she spoke kind words to each flower, something magical began to happen. The petals started to lift, and their colors became brighter and more vibrant than ever before. The flowers seemed to dance with joy!

"Your kindness is like sunshine to them," Luna explained with a warm smile. "When we show love and care to others, we help them bloom and grow."`,
      image_url: '/magical-garden-kindness.png'
    },
    {
      id: '6',
      title: 'A Garden Forever Changed',
      content: `Thanks to Emma's kindness, the entire garden was now more beautiful than ever. The flowers glowed with inner light, the trees swayed with happiness, and even the grass seemed greener and softer.

"You have a very special gift, Emma," said Luna. "You've shown us that kindness is the most powerful magic of all. This garden will always remember what you've taught us today."

As the sun began to set, painting the sky in shades of pink and gold, Emma knew she would treasure this magical day forever.`,
      image_url: '/magical-sunset-garden.png'
    },
    {
      id: '7',
      title: 'Home with a Heart Full of Magic',
      content: `When Emma finally returned to her grandmother's backyard, she found her grandmother waiting with a warm smile and a cup of hot cocoa.

"Did you have a good adventure, dear?" her grandmother asked with a knowing twinkle in her eye.

Emma hugged her grandmother tightly. "The best adventure ever, Grandma. And I learned that being kind to others is like having real magic powers!"

Her grandmother chuckled softly. "That's the most important magic there is, my dear Emma. And the wonderful thing about kindness is that you can use it every single day."`,
      image_url: '/girl-grandmother-hug.png'
    }
  ]
}

interface StoryPageProps {
  params: {
    id: string
  }
}

export default function StoryPage({ params }: StoryPageProps) {
  const [story, setStory] = useState(mockStory)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the story from your database using the ID
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg text-gray-600">Loading your magical story...</p>
        </div>
      </div>
    )
  }

  return <StorybookViewer story={story} />
}
