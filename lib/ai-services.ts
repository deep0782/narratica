// Mock AI services for story creation
// In production, these would integrate with OpenRouter API

export interface GeneratedTitle {
  title: string
  alternatives: string[]
}

export interface ExtractedCharacter {
  name: string
  description: string
  traits: string[]
  relationships: string[]
}

export interface GeneratedScene {
  title: string
  description: string
  characters: string[]
  order: number
}

// Mock AI service for title generation
export const generateStoryTitle = async (storyDescription: string): Promise<GeneratedTitle> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock title generation based on story content
  const keywords = storyDescription.toLowerCase().split(' ')
  const themes = {
    adventure: ['The Great Adventure', 'Journey to Wonder', 'Quest for Magic'],
    friendship: ['Friends Forever', 'The Friendship Quest', 'Together We Can'],
    magic: ['The Magic Within', 'Enchanted Tales', 'Magical Moments'],
    brave: ['The Brave Little Hero', 'Courage Finds a Way', 'Being Brave'],
    dragon: ['The Friendly Dragon', 'Dragon\'s Secret', 'The Dragon Helper']
  }
  
  let selectedTitles = ['The Amazing Story', 'A Wonderful Tale', 'The Great Adventure']
  
  for (const [theme, titles] of Object.entries(themes)) {
    if (keywords.some(word => word.includes(theme))) {
      selectedTitles = titles
      break
    }
  }
  
  return {
    title: selectedTitles[0],
    alternatives: selectedTitles.slice(1)
  }
}

// Mock AI service for character extraction
export const extractCharacters = async (storyDescription: string): Promise<ExtractedCharacter[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock character extraction
  const text = storyDescription.toLowerCase()
  const characters: ExtractedCharacter[] = []
  
  // Look for common character patterns
  if (text.includes('dragon')) {
    characters.push({
      name: 'Friendly Dragon',
      description: 'A kind and gentle dragon who loves to help others',
      traits: ['kind', 'helpful', 'magical'],
      relationships: ['friend to the main character']
    })
  }
  
  if (text.includes('princess') || text.includes('prince')) {
    characters.push({
      name: 'Princess Luna',
      description: 'A brave princess who loves adventures',
      traits: ['brave', 'adventurous', 'kind'],
      relationships: ['royal friend']
    })
  }
  
  if (text.includes('wizard') || text.includes('magic')) {
    characters.push({
      name: 'Wise Wizard',
      description: 'An old wizard with a long white beard who knows many spells',
      traits: ['wise', 'magical', 'helpful'],
      relationships: ['mentor', 'guide']
    })
  }
  
  // Always include a main character if none found
  if (characters.length === 0) {
    characters.push({
      name: 'Adventure Friend',
      description: 'A loyal companion ready for any adventure',
      traits: ['loyal', 'brave', 'fun'],
      relationships: ['best friend']
    })
  }
  
  return characters
}

// Mock AI service for scene generation
export const generateScenes = async (
  storyDescription: string, 
  characters: ExtractedCharacter[],
  sceneCount: number
): Promise<GeneratedScene[]> => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock scene generation
  const scenes: GeneratedScene[] = []
  const characterNames = characters.map(c => c.name)
  
  // Generate basic story structure
  const sceneTemplates = [
    { title: 'The Beginning', description: 'Our story starts in a magical place where adventure awaits.' },
    { title: 'Meeting New Friends', description: 'The main character meets wonderful new friends who will help on the journey.' },
    { title: 'The Challenge', description: 'A problem appears that needs to be solved with courage and friendship.' },
    { title: 'Working Together', description: 'Everyone works together using their special talents to overcome the challenge.' },
    { title: 'The Solution', description: 'Through teamwork and kindness, they find the perfect solution.' },
    { title: 'Celebration', description: 'Everyone celebrates their success and the new friendships they\'ve made.' },
    { title: 'Lessons Learned', description: 'The characters reflect on what they\'ve learned about friendship and courage.' },
    { title: 'The Happy Ending', description: 'The story ends with everyone happy and ready for their next adventure.' }
  ]
  
  for (let i = 0; i < Math.min(sceneCount, sceneTemplates.length); i++) {
    scenes.push({
      ...sceneTemplates[i],
      characters: characterNames.slice(0, Math.min(2, characterNames.length)),
      order: i + 1
    })
  }
  
  return scenes
}

// Mock content safety filter
export const checkContentSafety = async (content: string): Promise<{ safe: boolean; issues?: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock safety check - in production this would use proper content moderation
  const unsafeWords = ['scary', 'violent', 'dangerous']
  const issues = unsafeWords.filter(word => content.toLowerCase().includes(word))
  
  return {
    safe: issues.length === 0,
    issues: issues.length > 0 ? [`Content contains potentially unsafe words: ${issues.join(', ')}`] : undefined
  }
}
