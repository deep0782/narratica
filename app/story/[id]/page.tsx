import { StorybookViewer } from '@/components/story/storybook-viewer'

// Sample story data - in a real app, this would come from your database
const sampleStory = {
  id: 'sample-story-id',
  title: "Emma's Magical Garden Adventure",
  scenes: [
    {
      id: '1',
      title: 'The Discovery',
      narration: 'Emma was playing in her grandmother\'s backyard when she noticed something unusual behind the old oak tree. A soft, golden glow was coming from what looked like ordinary garden vines.',
      imageUrl: '/magical-garden-discovery.png',
      order: 1
    },
    {
      id: '2', 
      title: 'Through the Portal',
      narration: 'As Emma pushed aside the glowing vines, she discovered they formed a magical doorway. With a deep breath and a heart full of curiosity, she stepped through into a world of wonder.',
      imageUrl: '/glowing-vine-portal.png',
      order: 2
    },
    {
      id: '3',
      title: 'Meeting New Friends',
      narration: 'In the magical garden, Emma met Luna the wise owl, Pip the playful rabbit, and Sage the gentle deer. They welcomed her with warm smiles and twinkling eyes.',
      imageUrl: '/magical-garden-meeting.png',
      order: 3
    },
    {
      id: '4',
      title: 'A Problem to Solve',
      narration: 'The magical creatures looked sad. "Our garden is losing its magic," Luna explained. "The Kindness Flowers that keep our world bright are wilting because we\'ve forgotten how to care for each other."',
      imageUrl: '/sad-magical-gathering.png',
      order: 4
    },
    {
      id: '5',
      title: 'Emma\'s Idea',
      narration: 'Emma had an idea. "What if we work together to help each other?" she suggested. "My grandmother always says that kindness makes everything grow better." The creatures\' eyes lit up with hope.',
      imageUrl: '/magical-garden-kindness.png',
      order: 5
    },
    {
      id: '6',
      title: 'Magic Returns',
      narration: 'As they helped each other - sharing food, offering comfort, and working together - the Kindness Flowers began to bloom again. The garden sparkled with renewed magic, more beautiful than ever.',
      imageUrl: '/magical-sunset-garden.png',
      order: 6
    },
    {
      id: '7',
      title: 'Home Again',
      narration: 'When Emma returned home, she hugged her grandmother tight and told her about the magical garden. "The real magic," her grandmother smiled, "is the kindness you carry in your heart."',
      imageUrl: '/girl-grandmother-hug.png',
      order: 7
    }
  ],
  artStyle: 'Watercolor',
  colorPalette: 'Warm and Bright',
  createdAt: new Date().toISOString(),
  childName: 'Emma'
}

interface StoryPageProps {
  params: {
    id: string
  }
}

export default function StoryPage({ params }: StoryPageProps) {
  // In a real app, you would fetch the story data based on params.id
  // For now, we'll use the sample story
  
  return (
    <div className="min-h-screen">
      <StorybookViewer story={sampleStory} />
    </div>
  )
}
